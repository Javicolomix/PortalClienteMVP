import { CalendarDays, Check, Copy, ExternalLink, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/shared/components/base/Button";
import { Card, CardContent, CardHeader } from "@/shared/components/base/Card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/base/Dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/base/Empty";
import { Table } from "@/shared/components/base/Table";
import { useCarga } from "@/shared/hooks/useCarga";
import { cn } from "@/shared/lib/utils/cn";

import { formatearFechaBreve, formatearFechaCorta } from "./fechas";
import { MarcaWhatsapp } from "./MarcaWhatsapp";
import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import {
  type ConfiguracionPortal,
  type Cuota,
  type DatosMisPagos,
  nombreCompleto,
} from "./portal.types";
import { cargarMisPagos } from "./portal-service";
import { enlaceWhatsapp } from "./whatsapp";

const FORMATO_PESOS = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/**
 * Deja el botón en «copiado» un par de segundos y vuelve solo. Si el navegador
 * no permite escribir en el portapapeles no pasa nada: los datos están a la
 * vista para escribirlos a mano, que es el caso que hay que cubrir igual.
 */
function useCopiar() {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const temporizador = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(temporizador);
  }, [copiado]);

  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
    } catch {
      // Sin portapapeles, el dato igual está a la vista.
    }
  };

  return { copiado, copiar };
}

type DatoBancario = { etiqueta: string; valor: string };

/**
 * El correo va con los otros cuatro y no solo en la frase de abajo: el
 * formulario del banco lo pide para avisar la transferencia, así que en la
 * práctica es un dato de la cuenta más.
 */
const datosParaTransferir = (configuracion: ConfiguracionPortal): DatoBancario[] => [
  { etiqueta: "Titular", valor: configuracion.titularCuenta },
  { etiqueta: "Banco", valor: configuracion.banco },
  { etiqueta: "Cuenta corriente", valor: configuracion.numeroCuenta },
  { etiqueta: "RUT", valor: configuracion.rutTitular },
  { etiqueta: "Correo electrónico", valor: configuracion.correoSoporte },
];

/**
 * Los datos y **un solo botón que se los lleva todos**, con salto de línea y su
 * etiqueta delante, listos para pegar. Es lo que hace la persona en la práctica:
 * abre el banco y necesita todos, no uno.
 *
 * Cada fila tenía además su propio icono de copiar, y se fueron. Servían para
 * pegar un dato suelto en el campo del banco, pero eran cinco controles casi
 * invisibles al costado de los datos, compitiendo con el botón que sí resuelve
 * el caso normal. Con uno solo abajo no hay que elegir cuál apretar.
 */
function DatosParaTransferir({ configuracion }: { configuracion: ConfiguracionPortal }) {
  const datos = datosParaTransferir(configuracion);
  const { copiado, copiar } = useCopiar();

  const copiarTodo = () => copiar(datos.map((d) => `${d.etiqueta}: ${d.valor}`).join("\n"));

  return (
    <div className="mt-3 rounded-lg bg-surface-subtle p-4">
      <dl className="divide-y divide-border-subtle">
        {datos.map((dato) => (
          <div key={dato.etiqueta} className="py-3">
            <dt className="type-meta text-muted-foreground">{dato.etiqueta}</dt>
            <dd className="type-data break-words text-foreground">{dato.valor}</dd>
          </div>
        ))}
      </dl>

      <Button variant="outline" className="mt-3 w-full" onClick={copiarTodo}>
        {copiado ? (
          <>
            <Check aria-hidden />
            Datos copiados
          </>
        ) : (
          <>
            <Copy aria-hidden />
            Copiar los datos
          </>
        )}
      </Button>

      <p aria-live="polite" className="sr-only">
        {copiado ? "Los datos de transferencia se copiaron." : ""}
      </p>
    </div>
  );
}

function PasoDePago({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <span className="flex items-center gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary type-meta font-semibold text-primary-foreground">
            {numero}
          </span>
          <h3 className="type-section-title text-foreground">{titulo}</h3>
        </span>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/**
 * **Lo único que esta pantalla vino a decir**: cuánto y cuándo. Va en navy y no
 * en el lila del sistema.
 *
 * El lila es un tinte de baja intensidad, pensado para acompañar; sobre el
 * lienzo gris claro y con la trama detrás, el bloque más importante de la
 * pantalla era el que menos se veía. El navy es la tinta de la marca y acá es
 * además lo que ordena la página: lo primero que se mira, y todo lo demás
 * —cómo pagar, el historial, finanzas— cuelga de eso.
 *
 * Es el mismo navy de la franja del saludo, así que la persona ya lo tiene visto
 * como «lo que Lexy te está diciendo».
 */
function ProximaCuota({ cuota }: { cuota: Cuota }) {
  return (
    <section className="rounded-xl bg-brand-navy p-5 text-white shadow-card md:p-6">
      <p className="type-supporting text-white/70">Tu próxima cuota</p>
      <p className="mt-1 type-page-title">{FORMATO_PESOS.format(cuota.monto)}</p>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 type-body text-white/85">
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-white/60" aria-hidden />
          Vence el {formatearFechaCorta(cuota.fechaVencimiento)}
        </span>
        <span className="type-supporting text-white/60">Cuota N°{cuota.numero}</span>
      </p>
    </section>
  );
}

function ComoPagar({
  configuracion,
  nombreCliente,
}: {
  configuracion: ConfiguracionPortal;
  nombreCliente: string;
}) {
  const correoComprobante = `mailto:${configuracion.correoSoporte}?subject=${encodeURIComponent(
    `Comprobante de pago — ${nombreCliente}`,
  )}&body=${encodeURIComponent(
    `Hola, soy ${nombreCliente}. Adjunto el comprobante de mi transferencia.`,
  )}`;

  return (
    <section className="mt-10">
      <h2 className="type-subsection-title text-foreground">Cómo pagar</h2>
      <p className="mt-2 type-body text-muted-foreground">Elige la forma que te acomode.</p>

      <div className="mt-4 space-y-3">
        <PasoDePago numero={1} titulo="Pagar en línea">
          <p className="type-body text-muted-foreground">
            Entra con el correo asociado a tu cuenta y paga con tarjeta. El pago queda registrado
            automáticamente, sin que tengas que avisarnos.
          </p>
          <Button asChild size="lg" className="mt-4">
            <a href={configuracion.urlPagoEnLinea} target="_blank" rel="noreferrer">
              Ir a pagar en línea
              <ExternalLink aria-hidden />
            </a>
          </Button>
        </PasoDePago>

        <PasoDePago numero={2} titulo="Transferencia bancaria">
          <p className="type-body text-muted-foreground">
            Cópialos de una vez y transfiere desde tu banco.
          </p>

          <DatosParaTransferir configuracion={configuracion} />

          <p className="mt-4 type-body text-muted-foreground">
            ¿Pagaste por transferencia? Envíanos el comprobante a{" "}
            <a
              href={correoComprobante}
              className="font-medium text-primary underline underline-offset-4"
            >
              {configuracion.correoSoporte}
            </a>{" "}
            con tu nombre para registrar tu pago.
          </p>
        </PasoDePago>
      </div>
    </section>
  );
}

/**
 * Cómo se muestra una cuota en el historial. Un solo lugar para los tres
 * estados, para que no se puedan contradecir.
 *
 * **La columna de fecha dice dos cosas según el estado**: en una pagada, cuándo
 * se pagó; en las otras dos, cuándo vence o venció. Por eso se llama «Fecha» y
 * no «Fecha de pago», que era el rótulo del boceto: ahí la tabla mostraba solo
 * cuotas pagadas y no había ambigüedad. Con las doce a la vista, una columna
 * llamada «fecha de pago» con la fecha de vencimiento de una cuota que nadie
 * pagó dice algo falso. El encabezado corto y la explicación de arriba lo
 * dejan claro sin gastar los ochenta píxeles que costaría escribir «Vence el»
 * en cada fila, que es justo lo que dejaba la columna del estado fuera de la
 * pantalla en un teléfono.
 */
const presentacionDeCuota = (cuota: Cuota) => {
  if (cuota.estado === "morosa") {
    return {
      etiqueta: "Morosa",
      color: "text-destructive",
      fecha: formatearFechaCorta(cuota.fechaVencimiento),
      fechaBreve: formatearFechaBreve(cuota.fechaVencimiento),
    };
  }

  if (cuota.estado === "pendiente") {
    return {
      etiqueta: "Pendiente",
      color: "text-muted-foreground",
      fecha: formatearFechaCorta(cuota.fechaVencimiento),
      fechaBreve: formatearFechaBreve(cuota.fechaVencimiento),
    };
  }

  return {
    etiqueta: "Pagada",
    color: "text-success-strong",
    fecha: formatearFechaCorta(cuota.fechaPago ?? cuota.fechaVencimiento),
    fechaBreve: formatearFechaBreve(cuota.fechaPago ?? cuota.fechaVencimiento),
  };
};

/**
 * **El historial completo, en un modal.**
 *
 * Es una tabla de doce filas en una pantalla que ya mide varias pantallas de
 * alto: abierta en la página empujaba todo lo demás hacia abajo y ganaba un
 * espacio que no le corresponde. Es información de respaldo —se entra a
 * comprobar que un pago se registró, no a decidir algo hoy— y el modal es
 * exactamente eso: aparece cuando se pide y se va cuando se cierra, sin dejarle
 * la página larga a quien solo venía a transferir.
 *
 * Están **todas las cuotas, no solo las pagadas**, porque la pregunta que se
 * contesta acá es cómo va el plan entero. Van en el orden del plan y no al
 * revés: es un plan de pagos, se lee de la uno a la última.
 *
 * La bajada dice **una sola cosa: que aquí está todo**. Llegó a contar el
 * desglose —«4 pagadas, 2 morosas y 4 pendientes»— y a explicar de qué es la
 * fecha de cada fila, y eran tres frases de letra chica encima de una tabla que
 * dice lo mismo, fila por fila y sin que nadie tenga que leerlas. Lo único que
 * la bajada tiene que hacer es confirmar que no falta nada: quien abre esto
 * viene a buscar una cuota, no a que le resuman las otras.
 *
 * La tabla **se desplaza de lado si no cabe** en vez de apilarse en el teléfono.
 * Cuatro columnas en 358 píxeles quedan justas, pero convertirlas en fichas
 * apiladas era dejar de ser una tabla, y lo que se viene a hacer acá —seguir la
 * columna del estado hacia abajo hasta encontrar la que falló— solo lo permite
 * una tabla.
 */
function HistorialDeCuotas({
  cuotas,
  urlPagoEnLinea,
}: {
  cuotas: Cuota[];
  urlPagoEnLinea: string;
}) {
  if (cuotas.length === 0) return null;

  return (
    <section className="mt-3 flex justify-end">
      <Dialog>
        <DialogTrigger asChild>
          {/* Alineado a la derecha y sin ocupar el ancho: es una consulta de
              respaldo, no un paso del flujo. A lo ancho pesaba como un botón
              más de «cómo pagar», que son los que sí hay que apretar. */}
          <Button variant="outline">
            <Receipt aria-hidden />
            Ver el historial de mis cuotas
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle scale="compact">Historial de tus cuotas</DialogTitle>
            <DialogDescription>
              Aquí encontrarás el estado de tu cobro completo.
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-1 max-h-[55vh] overflow-auto px-1">
            <Table
              columns="0.55fr 1fr 1fr 1.15fr"
              className="min-w-[18rem] text-[13px] sm:text-sm"
            >
              {/* Los encabezados y las fechas van cortos en el teléfono y
                  enteros desde `sm`. Con «N° de cuota» y un año de cuatro
                  cifras, las cuatro columnas no caben en 390 px y el navegador
                  corta la última con puntos suspensivos: la del estado, que es
                  la que se viene a mirar. */}
              <Table.Header>
                <Table.Cell>
                  <span className="sm:hidden">N°</span>
                  <span className="hidden sm:inline">N° de cuota</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="sm:hidden">Valor</span>
                  <span className="hidden sm:inline">Valor cuota</span>
                </Table.Cell>
                <Table.Cell>Fecha</Table.Cell>
                <Table.Cell>Estado</Table.Cell>
              </Table.Header>
              <Table.Content>
                {cuotas.map((cuota) => {
                  const { etiqueta, color, fecha, fechaBreve } = presentacionDeCuota(cuota);

                  return (
                    <Table.Row key={cuota.id}>
                      <Table.Cell>{cuota.numero}</Table.Cell>
                      <Table.Cell>{FORMATO_PESOS.format(cuota.monto)}</Table.Cell>
                      <Table.Cell>
                        <span className="sm:hidden">{fechaBreve}</span>
                        <span className="hidden sm:inline">{fecha}</span>
                      </Table.Cell>
                      <Table.Cell>
                        {/* Sin `type-data`: ese rol fija 14 px y se comía la
                            reducción a 13 de la tabla en el teléfono, que es lo
                            que hacía caber las cuatro columnas. Hereda el
                            tamaño de la tabla y solo agrega el peso. */}
                        <span className={cn("font-semibold", color)}>{etiqueta}</span>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Content>
            </Table>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cerrar</Button>
            </DialogClose>
            <Button asChild>
              <a href={urlPagoEnLinea} target="_blank" rel="noreferrer">
                Ir a pagar en línea
                <ExternalLink aria-hidden />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/**
 * **La salida cuando el número no cuadra.**
 *
 * Todo lo demás de esta pantalla asume que el cobro está bien y solo hay que
 * pagarlo. Cuando no —la cuota subió, aparece una morosa que la persona jura
 * haber pagado, no entiende por qué son veinticuatro y no dieciocho— el portal
 * la dejaba sin nadie a quien preguntarle: el botón flotante del inicio lleva a
 * la ejecutiva y al abogado, que ven el caso pero no los cobros.
 *
 * **Nombra el cargo y no a la persona.** Se probó con el nombre propio —«Hablar
 * con Scarlet»— y se volvió atrás: el nombre hace más cálido el botón pero
 * caduca, y un portal que le presenta al cliente a alguien que ya no trabaja acá
 * es peor que uno que nombra un cargo. El cargo, además, dice a qué equipo llega
 * el reclamo, que es lo que la persona necesita saber.
 *
 * Es **el mismo número para todos los clientes**, así que vive en la
 * configuración del portal y no en los contactos del caso.
 *
 * Cierra la página a propósito: se llega acá después de haber visto cuánto
 * debes, cómo pagar y qué pagaste. Arriba habría interrumpido a quien solo venía
 * a transferir.
 */
function DudasDelCobro({
  configuracion,
  nombreDelCliente,
}: {
  configuracion: ConfiguracionPortal;
  nombreDelCliente: string;
}) {
  const enlace = enlaceWhatsapp(
    configuracion.telefonoFinanzas,
    nombreDelCliente,
    "Tengo una duda sobre el cobro de mis honorarios.",
  );

  return (
    <section className="mt-10 rounded-lg bg-card p-5 shadow-card ring-1 ring-border-subtle">
      <h2 className="type-item-title text-foreground">¿Tienes dudas de tu cobro?</h2>
      <p className="mt-2 type-body text-muted-foreground">
        Si algo no te cuadra, puedes escribirle a nuestra{" "}
        <span className="font-medium text-foreground">ejecutiva de finanzas</span>, quien revisará
        tu situación y te ayudará con las dudas sobre tus pagos.
      </p>

      <Button asChild variant="outline" className="mt-4 w-full sm:w-auto">
        <a href={enlace} target="_blank" rel="noreferrer">
          <MarcaWhatsapp className="size-4 text-[#25d366]" />
          Contactar a finanzas
        </a>
      </Button>
    </section>
  );
}

function ContenidoDePagos({ datos }: { datos: DatosMisPagos }) {
  if (!datos.proximaCuota) {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No tienes cuotas pendientes</EmptyTitle>
            <EmptyDescription>
              Estás al día con tus honorarios. Cuando venga la próxima cuota, la vas a ver acá.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link to="/mi-equipo">Preguntarle a mi equipo</Link>
            </Button>
          </EmptyContent>
        </Empty>

        <HistorialDeCuotas
          cuotas={datos.cuotas}
          urlPagoEnLinea={datos.configuracion.urlPagoEnLinea}
        />
        <DudasDelCobro
          configuracion={datos.configuracion}
          nombreDelCliente={nombreCompleto(datos.cliente)}
        />
      </>
    );
  }

  return (
    <>
      <ProximaCuota cuota={datos.proximaCuota} />

      {/* Pegado al recuadro de la cuota y a la derecha. Es la pregunta que
          sigue inmediatamente después de leer cuánto toca este mes —«¿y las
          anteriores?»— así que va ahí y no al final de la página, donde había
          que recorrer los dos modos de pago para encontrarla. A la derecha
          porque no es un paso del flujo: los pasos son los de abajo. */}
      <HistorialDeCuotas
        cuotas={datos.cuotas}
        urlPagoEnLinea={datos.configuracion.urlPagoEnLinea}
      />

      <ComoPagar
        configuracion={datos.configuracion}
        nombreCliente={nombreCompleto(datos.cliente)}
      />
      <DudasDelCobro
        configuracion={datos.configuracion}
        nombreDelCliente={nombreCompleto(datos.cliente)}
      />
    </>
  );
}

export function MisPagos() {
  const { fase, datos, recargar } = useCarga("mis-pagos", cargarMisPagos);

  return (
    // Sobre el lienzo gris y con la trama, como «Mi servicio». Estuvo sobre
    // blanco para que el bloque navy de la cuota fuera lo único que pesara, pero
    // la trama es blanca: sobre un fondo blanco no se ve, así que las dos cosas
    // no podían convivir. La jerarquía se sostiene igual —el navy sigue siendo
    // lo más oscuro de la pantalla— y a cambio las dos pantallas de detalle se
    // ven como la misma familia en vez de como dos plantillas distintas.
    <PaginaDelPortal titulo="Mis pagos" conTramaDeMarca>
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" && datos ? <ContenidoDePagos datos={datos} /> : null}
    </PaginaDelPortal>
  );
}
