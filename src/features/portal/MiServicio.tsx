import { useCarga } from "@/shared/hooks/useCarga";

import { BloqueDestacado, TarjetaInformativa } from "./BloquesDelPortal";
import { iconoPorClave } from "./iconos";
import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import type { DatosMiServicio } from "./portal.types";
import { cargarMiServicio } from "./portal-service";

/**
 * Misma piel que «Estado de mi caso»: un bloque lila que dice de qué se trata y,
 * debajo, tarjetas neutras todas iguales. Pasar de una pantalla a la otra no se
 * siente como cambiar de producto.
 */
function DetalleDelServicio({ datos }: { datos: DatosMiServicio }) {
  return (
    <div className="space-y-6">
      <BloqueDestacado rotulo="En qué consiste">{datos.servicio.queEs}</BloqueDestacado>

      {/* Cada resultado es una tarjeta con su icono: son cosas distintas que se
          pueden lograr, no los puntos de una misma enumeración. El icono deja
          reconocer cada uno de un vistazo, sin leer la frase entera. */}
      <section>
        <h2 className="type-section-title text-foreground">Qué se puede lograr</h2>

        <ul className="mt-3 space-y-2.5">
          {datos.resultados.map((resultado) => {
            const Icono = iconoPorClave(resultado.icono);

            return (
              <li key={resultado.id}>
                <TarjetaInformativa Icono={Icono} titulo={resultado.titulo}>
                  {resultado.texto}
                </TarjetaInformativa>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 type-meta text-muted-foreground">
          Cada caso es distinto: el resultado depende de tu situación y de lo que se acuerde durante
          el proceso.
        </p>
      </section>
    </div>
  );
}

export function MiServicio() {
  const { fase, datos, recargar } = useCarga("mi-servicio", cargarMiServicio);

  return (
    <PaginaDelPortal
      titulo={fase === "listo" && datos ? datos.servicio.nombre : "Mi servicio"}
      descripcion="Esto es lo que contrataste con nosotros."
    >
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" && datos ? <DetalleDelServicio datos={datos} /> : null}
    </PaginaDelPortal>
  );
}
