import { useState } from "react";
import { Link } from "react-router";

import { type Etapa, etapaEstaCompleta } from "@/features/portal";
import { Button } from "@/shared/components/base/Button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/base/Empty";
import { HeaderBar } from "@/shared/components/base/HeaderBar";
import { Label } from "@/shared/components/base/Label";
import { Logo } from "@/shared/components/base/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/base/Select";
import { Skeleton } from "@/shared/components/base/Skeleton";
import { StatusDot } from "@/shared/components/base/StatusDot";
import { toast } from "@/shared/components/base/Toaster";
import { useCarga } from "@/shared/hooks/useCarga";
import { cn } from "@/shared/lib/utils/cn";

import { cargarEtapasDelServicio, cargarServicios, guardarEtapa } from "./admin-service";
import { EtapaEditor } from "./EtapaEditor";

function ListaDeEtapas({
  etapas,
  seleccionadaId,
  onSeleccionar,
}: {
  etapas: Etapa[];
  seleccionadaId: string | null;
  onSeleccionar: (id: string) => void;
}) {
  return (
    <ol className="space-y-1">
      {etapas.map((etapa) => {
        const activa = etapa.id === seleccionadaId;

        return (
          <li key={etapa.id}>
            <button
              type="button"
              onClick={() => onSeleccionar(etapa.id)}
              aria-current={activa ? "true" : undefined}
              className={cn(
                "w-full rounded-nav-item px-3 py-2 text-left",
                activa ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
              )}
            >
              <span className="block type-body font-medium text-foreground">
                {etapa.orden}. {etapa.nombreParaCliente || "Etapa sin nombre"}
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                {etapa.visibleParaCliente ? (
                  <StatusDot tone="success">Visible</StatusDot>
                ) : (
                  <StatusDot tone="gray">Solo interno</StatusDot>
                )}
                {etapaEstaCompleta(etapa) ? null : (
                  <StatusDot tone="warning">Falta contenido</StatusDot>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function PanelEtapas() {
  const cargaServicios = useCarga("servicios", cargarServicios);
  const servicios = cargaServicios.datos ?? [];

  const [servicioElegido, setServicioElegido] = useState<string | null>(null);
  const servicioId = servicioElegido ?? servicios[0]?.id ?? null;

  const cargaEtapas = useCarga(servicioId ?? "", async () =>
    servicioId ? cargarEtapasDelServicio(servicioId) : [],
  );

  // Lo guardado en esta sesión se superpone a lo cargado: así la lista se
  // actualiza al instante sin recargar toda la pantalla.
  const [guardadas, setGuardadas] = useState<Record<string, Etapa>>({});
  const etapas = (cargaEtapas.datos ?? []).map((etapa) => guardadas[etapa.id] ?? etapa);

  const [etapaElegida, setEtapaElegida] = useState<string | null>(null);
  const seleccionada = etapas.find((etapa) => etapa.id === etapaElegida) ?? etapas[0] ?? null;

  const guardar = async (etapa: Etapa) => {
    try {
      await guardarEtapa(etapa);
      setGuardadas((previas) => ({ ...previas, [etapa.id]: etapa }));
      toast.success("Cambios guardados", {
        description: etapa.visibleParaCliente
          ? "El cliente ya ve esta etapa con el contenido nuevo."
          : "La etapa quedó guardada como interna: el cliente no la ve.",
      });
    } catch (error) {
      toast.error("No pudimos guardar. Intenta de nuevo.");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar
        brand={<Logo layout="horizontal" />}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/">Ver el portal del cliente</Link>
          </Button>
        }
      />

      <main className="w-full p-4">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="type-subsection-title text-foreground">Etapas del cliente</h1>
            <p className="type-supporting text-muted-foreground">
              Lo que escribas acá es exactamente lo que la persona lee en su portal.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="servicio">Servicio</Label>
            <Select
              value={servicioId ?? undefined}
              onValueChange={(valor) => {
                setServicioElegido(valor);
                setEtapaElegida(null);
              }}
              disabled={servicios.length === 0}
            >
              <SelectTrigger id="servicio" className="w-64">
                <SelectValue placeholder="Elige un servicio" />
              </SelectTrigger>
              <SelectContent>
                {servicios.map((servicio) => (
                  <SelectItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {cargaEtapas.fase === "cargando" ? (
          <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]" aria-busy="true">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : null}

        {cargaEtapas.fase === "error" ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No pudimos cargar las etapas</EmptyTitle>
              <EmptyDescription>Revisa tu conexión e inténtalo de nuevo.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" variant="outline" onClick={cargaEtapas.recargar}>
                Reintentar
              </Button>
            </EmptyContent>
          </Empty>
        ) : null}

        {cargaEtapas.fase === "listo" ? (
          etapas.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Este servicio todavía no tiene etapas</EmptyTitle>
                <EmptyDescription>
                  Cuando se creen las etapas de este servicio, vas a poder escribir su contenido
                  desde acá.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              <nav aria-label="Etapas del servicio">
                <ListaDeEtapas
                  etapas={etapas}
                  seleccionadaId={seleccionada?.id ?? null}
                  onSeleccionar={setEtapaElegida}
                />
              </nav>

              <section aria-label="Contenido de la etapa" className="min-w-0">
                {seleccionada ? (
                  <EtapaEditor key={seleccionada.id} etapa={seleccionada} onGuardar={guardar} />
                ) : null}
              </section>
            </div>
          )
        ) : null}
      </main>
    </div>
  );
}
