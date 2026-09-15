import { CalendarDays, Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/shared/components/base/Button";
import { Card, CardContent, CardHeader } from "@/shared/components/base/Card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/base/Empty";
import { Table } from "@/shared/components/base/Table";
import { Tag } from "@/shared/components/base/Tag";
import { useCarga } from "@/shared/hooks/useCarga";
import { cn } from "@/shared/lib/utils/cn";

import { formatearFechaCorta } from "./fechas";
import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import type { ConfiguracionPortal, Cuota, DatosMisPagos } from "./portal.types";
import { cargarMisPagos } from "./portal-service";

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

function ProximaCuota({ cuota }: { cuota: Cuota }) {
  return (
    <Card className="bg-accent">
      <CardHeader>
        <p className="type-supporting text-muted-foreground">Tu próxima cuota</p>
        <p className="mt-1 type-page-title text-foreground">{FORMATO_PESOS.format(cuota.monto)}</p>
      </CardHeader>
      <CardContent>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 type-body text-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            Vence el {formatearFechaCorta(cuota.fechaVencimiento)}
          </span>
          <span className="type-supporting text-muted-foreground">Cuota N°{cuota.numero}</span>
        </p>
      </CardContent>
    </Card>
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
 * Las cuotas ya pagadas, **cerradas por defecto**. Es información de respaldo:
 * sirve para comprobar que un pago quedó registrado, no para decidir nada hoy.
 * Abierta ocuparía más pantalla que la cuota que sí hay que pagar, que es lo
 * único que esta pantalla vino a resolver.
 *
 * Va como lista y no como tabla. Una tabla de cuatro columnas obliga a
 * desplazar de lado en un teléfono, y acá cada fila tiene solo dos cosas que
 * decir: qué cuota fue y cuándo se pagó. El monto va con el número porque se
 * leen juntos.
 */
function HistorialDePagos({ cuotas }: { cuotas: Cuota[] }) {
  const [abierto, setAbierto] = useState(false);

  if (cuotas.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="overflow-hidden rounded-lg bg-card ring-1 ring-border-subtle">
        <h2>
          <button
            type="button"
            onClick={() => setAbierto((estaba) => !estaba)}
            aria-expanded={abierto}
            aria-controls="historial-de-pagos"
            className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-surface-subtle active:bg-surface-muted focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="min-w-0 flex-1">
              <span className="type-item-title block text-foreground">
                Historial de pagos{" "}
                <span className="font-normal text-muted-foreground">({cuotas.length})</span>
              </span>
              <span className="type-supporting mt-0.5 block text-muted-foreground">
                Las cuotas que ya pagaste
              </span>
            </span>

            <ChevronDown
              className={cn(
                "size-5 shrink-0 text-foreground-faint transition-transform duration-200 motion-reduce:transition-none",
                abierto && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </h2>

        {abierto ? (
          <div id="historial-de-pagos" className="border-t border-border-subtle">
            {/* Dos presentaciones del mismo dato. Desde `md` la tabla del
                sistema, con sus encabezados: cuatro columnas se comparan mejor
                que cuatro filas, y es lo que la persona espera de un historial.
                En el teléfono no caben —obligarían a desplazar de lado— así que
                cada cuota se apila: número y monto arriba, fecha abajo, estado a
                la derecha. */}
            <div className="hidden md:block">
              <Table columns="1fr 1.2fr 1.4fr auto" className="rounded-none border-none">
                <Table.Header>
                  <Table.Cell>N° de cuota</Table.Cell>
                  <Table.Cell>Valor cuota</Table.Cell>
                  <Table.Cell>Fecha de pago</Table.Cell>
                  <Table.Cell>Estado</Table.Cell>
                </Table.Header>
                <Table.Content>
                  {cuotas.map((cuota) => (
                    <Table.Row key={cuota.id}>
                      <Table.Cell>{cuota.numero}</Table.Cell>
                      <Table.Cell>{FORMATO_PESOS.format(cuota.monto)}</Table.Cell>
                      <Table.Cell>
                        {formatearFechaCorta(cuota.fechaPago ?? cuota.fechaVencimiento)}
                      </Table.Cell>
                      <Table.Cell>
                        <Tag tone="success" size="xs" shape="rounded">
                          Pagada
                        </Tag>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Content>
              </Table>
            </div>

            <ul className="md:hidden">
              {cuotas.map((cuota, fila) => (
                <li
                  key={cuota.id}
                  className={cn(
                    "flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5",
                    fila > 0 && "border-t border-border-subtle",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="type-data block text-foreground">
                      Cuota N°{cuota.numero} · {FORMATO_PESOS.format(cuota.monto)}
                    </span>
                    <span className="type-meta mt-0.5 block text-muted-foreground">
                      Pagada el {formatearFechaCorta(cuota.fechaPago ?? cuota.fechaVencimiento)}
                    </span>
                  </span>

                  <Tag tone="success" size="xs" shape="rounded" className="shrink-0">
                    Pagada
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
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

        <HistorialDePagos cuotas={datos.historial} />
      </>
    );
  }

  return (
    <>
      <ProximaCuota cuota={datos.proximaCuota} />
      <ComoPagar configuracion={datos.configuracion} nombreCliente={datos.cliente.nombre} />
      <HistorialDePagos cuotas={datos.historial} />
    </>
  );
}

export function MisPagos() {
  const { fase, datos, recargar } = useCarga("mis-pagos", cargarMisPagos);

  return (
    <PaginaDelPortal titulo="Mis pagos">
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" && datos ? <ContenidoDePagos datos={datos} /> : null}
    </PaginaDelPortal>
  );
}
