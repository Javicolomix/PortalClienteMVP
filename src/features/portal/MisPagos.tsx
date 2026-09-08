import { CalendarDays, Check, Copy, ExternalLink } from "lucide-react";
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
import { useCarga } from "@/shared/hooks/useCarga";

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

const datosParaTransferir = (configuracion: ConfiguracionPortal): DatoBancario[] => [
  { etiqueta: "Titular", valor: configuracion.titularCuenta },
  { etiqueta: "Banco", valor: configuracion.banco },
  { etiqueta: "Cuenta corriente", valor: configuracion.numeroCuenta },
  { etiqueta: "RUT", valor: configuracion.rutTitular },
];

/**
 * Una fila del bloque. El botón de copiar quedó reducido a su icono: el botón
 * grande de abajo es el que resuelve el caso normal —llevarse los cuatro datos
 * de una vez— y cuatro botones con la palabra «Copiar» repetida competían con
 * él y con los datos mismos.
 */
function FilaDeDato({ dato }: { dato: DatoBancario }) {
  const { copiado, copiar } = useCopiar();

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="min-w-0">
        <span className="block type-meta text-muted-foreground">{dato.etiqueta}</span>
        <span className="block type-data break-words text-foreground">{dato.valor}</span>
      </span>

      <Button
        variant="ghost"
        size="sm"
        className="shrink-0"
        onClick={() => copiar(dato.valor)}
        aria-label={`Copiar ${dato.etiqueta.toLowerCase()}`}
      >
        {copiado ? <Check aria-hidden /> : <Copy aria-hidden />}
      </Button>
    </div>
  );
}

/**
 * Los cuatro datos y **un solo botón que se los lleva todos**, con salto de línea
 * y su etiqueta delante, listos para pegar. Es lo que hace la persona en la
 * práctica: abre el banco y necesita los cuatro, no uno.
 */
function DatosParaTransferir({ configuracion }: { configuracion: ConfiguracionPortal }) {
  const datos = datosParaTransferir(configuracion);
  const { copiado, copiar } = useCopiar();

  const copiarTodo = () => copiar(datos.map((d) => `${d.etiqueta}: ${d.valor}`).join("\n"));

  return (
    <div className="mt-3 rounded-lg bg-surface-subtle p-4">
      <div className="divide-y divide-border-subtle">
        {datos.map((dato) => (
          <FilaDeDato key={dato.etiqueta} dato={dato} />
        ))}
      </div>

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

function ContenidoDePagos({ datos }: { datos: DatosMisPagos }) {
  if (!datos.proximaCuota) {
    return (
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
    );
  }

  return (
    <>
      <ProximaCuota cuota={datos.proximaCuota} />
      <ComoPagar configuracion={datos.configuracion} nombreCliente={datos.cliente.nombre} />
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
