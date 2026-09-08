import { useCarga } from "@/shared/hooks/useCarga";
import { cn } from "@/shared/lib/utils/cn";

import { causaQueManda } from "./estado-del-caso";
import { ICONOS } from "./iconos";
import { NIVELES } from "./nivel-urgencia";
import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import type { CausaConEtapa, DatosMisEscrituras } from "./portal.types";
import { cargarMisEscrituras } from "./portal-service";

/**
 * La lista completa de causas del cliente, para cuando lleva más de una a la vez.
 *
 * El inicio muestra solo la que manda, porque una persona asustada necesita una
 * respuesta y no un inventario. Acá está el inventario, para quien quiera verlo:
 * cada causa con su rol y en qué va.
 */
function ListaDeCausas({ datos }: { datos: DatosMisEscrituras }) {
  // La que manda arriba va primero acá también: si algo pide acción, es lo
  // primero que tiene que leer, no algo que encuentre bajando.
  const manda = causaQueManda(datos.causas);
  const ordenadas = manda
    ? [manda, ...datos.causas.filter((c) => c.causa.id !== manda.causa.id)]
    : datos.causas;

  return (
    <>
      <ul className="space-y-2.5">
        {ordenadas.map(({ causa, etapa }) => (
          <li key={causa.id}>
            <FilaDeCausa causa={causa} etapa={etapa} />
          </li>
        ))}
      </ul>

      <p className="mt-6 type-supporting text-muted-foreground">
        Cada causa avanza por su cuenta y con los tiempos que fija el tribunal, así que es normal
        que una vaya más adelantada que otra.
      </p>
    </>
  );
}

function FilaDeCausa({ causa, etapa }: CausaConEtapa) {
  const nivel = NIVELES[etapa.nivelUrgencia];
  const Icono = ICONOS.documento;

  return (
    <section className="flex gap-3 rounded-lg bg-card p-4 ring-1 ring-border-subtle">
      <Icono className="mt-0.5 size-[18px] shrink-0 text-brand-navy" aria-hidden />

      <div className="min-w-0">
        {/* El rol es cómo el cliente distingue una causa de otra. La caja madre
            no tiene, porque no es un frente con avance propio. */}
        {causa.rol ? (
          <p className="type-meta font-medium tracking-widest text-muted-foreground uppercase">
            {causa.rol}
          </p>
        ) : null}

        <h2 className="mt-1 type-supporting font-medium text-foreground">
          {etapa.nombreParaCliente}
        </h2>

        <p className={cn("mt-1.5 flex items-center gap-1.5 type-supporting", nivel.color)}>
          <nivel.Icono className="size-4 shrink-0" aria-hidden />
          {nivel.resumen}
        </p>
      </div>
    </section>
  );
}

export function MisEscrituras() {
  const { fase, datos, recargar } = useCarga("mis-escrituras", cargarMisEscrituras);

  return (
    <PaginaDelPortal
      titulo="Mis escrituras"
      descripcion="Estas son las causas que estamos llevando por ti."
    >
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" && datos ? <ListaDeCausas datos={datos} /> : null}
    </PaginaDelPortal>
  );
}
