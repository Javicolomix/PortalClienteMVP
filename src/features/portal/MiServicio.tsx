import { useCarga } from "@/shared/hooks/useCarga";

import { BloqueDestacado, TarjetaInformativa } from "./BloquesDelPortal";
import { iconoPorClave } from "./iconos";
import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import type { DatosMiServicio, ServicioConResultados } from "./portal.types";
import { cargarMiServicio } from "./portal-service";

/**
 * Un servicio explicado: misma piel que «Estado de mi caso» —un bloque lila que
 * dice de qué se trata y, debajo, tarjetas neutras todas iguales—, así pasar de
 * una pantalla a la otra no se siente como cambiar de producto.
 *
 * El nombre del servicio solo aparece cuando hay más de uno que explicar: con
 * uno solo ya lo dice el título de la pantalla, y repetirlo sería un rótulo de
 * relleno. Con dos, en cambio, es lo que separa una explicación de la otra.
 */
function ExplicacionDelServicio({
  item,
  conNombre,
}: {
  item: ServicioConResultados;
  conNombre: boolean;
}) {
  return (
    <section className="space-y-6">
      {conNombre ? (
        <h2 className="type-subsection-title text-foreground">{item.servicio.nombre}</h2>
      ) : null}

      <BloqueDestacado rotulo="Objetivo del servicio">{item.servicio.queEs}</BloqueDestacado>

      {/* Cada resultado es una tarjeta con su icono: son cosas distintas que se
          pueden lograr, no los puntos de una misma enumeración. El icono deja
          reconocer cada uno de un vistazo, sin leer la frase entera. */}
      <section>
        {conNombre ? (
          <h3 className="type-section-title text-foreground">Beneficios que puedes obtener</h3>
        ) : (
          <h2 className="type-section-title text-foreground">Beneficios que puedes obtener</h2>
        )}

        <ul className="mt-3 space-y-2.5">
          {item.resultados.map((resultado) => {
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
      </section>
    </section>
  );
}

/**
 * La advertencia va una sola vez al cierre, no por servicio: es la misma para
 * todo lo que hace Lexy, y repetida se lee como letra chica.
 */
function DetalleDelServicio({ datos }: { datos: DatosMiServicio }) {
  const varios = datos.servicios.length > 1;

  return (
    <div className="space-y-8">
      {datos.servicios.map((item) => (
        <ExplicacionDelServicio key={item.servicio.id} item={item} conNombre={varios} />
      ))}

      <p className="type-meta text-muted-foreground">
        Cada caso es distinto: el resultado depende de tu situación y de lo que se acuerde durante
        el proceso.
      </p>
    </div>
  );
}

export function MiServicio() {
  const { fase, datos, recargar } = useCarga("mi-servicio", cargarMiServicio);

  return (
    <PaginaDelPortal
      titulo={fase === "listo" && datos ? datos.nombre : "Mi servicio"}
      descripcion="Esto es lo que contrataste con nosotros."
    >
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" && datos ? <DetalleDelServicio datos={datos} /> : null}
    </PaginaDelPortal>
  );
}
