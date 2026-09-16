import { useCarga } from "@/shared/hooks/useCarga";

import { TarjetaDeSeccion } from "./BloquesDelPortal";
import { iconoPorClave,ICONOS } from "./iconos";
import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import type { DatosMiServicio, ServicioConResultados } from "./portal.types";
import { cargarMiServicio } from "./portal-service";

/**
 * **El servicio explicado, siempre como uno solo.**
 *
 * «Defensa en juicio con Protección Patrimonial» es **un** servicio con nombre
 * propio, no dos contratados por separado, y así lo nombra el bloque de arriba
 * del inicio. Esta pantalla lo mostraba partido en dos —dos subtítulos, dos
 * objetivos, dos listas de beneficios— y contradecía lo que la persona acababa
 * de leer: entraba desde un bloque que decía una cosa y llegaba a una pantalla
 * que decía dos.
 *
 * Así que los dos objetivos se leen de corrido, uno debajo del otro, bajo un
 * solo rótulo, y los beneficios se juntan en una sola lista. Da igual de cuál de
 * los dos venga cada uno: lo que la persona pregunta acá es qué puede conseguir
 * con lo que contrató, no a qué mitad del nombre corresponde cada cosa.
 *
 * Con un servicio simple no cambia nada: la misma pantalla con una sola
 * explicación, que es lo que ya mostraba.
 */
function ExplicacionDelServicio({ servicios }: { servicios: ServicioConResultados[] }) {
  // Los objetivos van separados por una línea en blanco y no pegados con una
  // conjunción: son dos párrafos que se sostienen solos, y cosidos en uno
  // quedaría una frase larguísima que nadie escribió.
  const objetivo = servicios.map((item) => item.servicio.queEs).join("\n\n");
  const resultados = servicios.flatMap((item) => item.resultados);

  return (
    <div className="space-y-4">
      <TarjetaDeSeccion Icono={ICONOS.objetivo} titulo="Objetivo del servicio">
        <p className="type-supporting leading-relaxed whitespace-pre-line text-muted-foreground">
          {objetivo}
        </p>
      </TarjetaDeSeccion>

      {/* Los beneficios van **dentro de un solo recuadro**, separados por
          hairlines, y no en una tarjeta cada uno. Son cuatro respuestas a la
          misma pregunta —qué consigo con esto—, así que son las partes de una
          lista y no cuatro objetos sueltos: cuatro tarjetas flotando pesaban
          como cuatro secciones distintas. */}
      <TarjetaDeSeccion Icono={ICONOS.beneficios} titulo="Beneficios que puedes obtener">
        <ul className="divide-y divide-border-subtle">
          {resultados.map((resultado) => {
            const Icono = iconoPorClave(resultado.icono);

            return (
              <li key={resultado.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                <Icono
                  className="mt-0.5 size-[18px] shrink-0 text-brand-navy"
                  strokeWidth={1.75}
                  aria-hidden
                />

                <div className="min-w-0">
                  <h3 className="type-supporting font-medium text-foreground">
                    {resultado.titulo}
                  </h3>
                  <p className="mt-1 type-supporting leading-relaxed text-muted-foreground">
                    {resultado.texto}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </TarjetaDeSeccion>
    </div>
  );
}

/**
 * La advertencia va al cierre y una sola vez: es la misma para todo lo que hace
 * Lexy, y repetida se lee como letra chica.
 */
function DetalleDelServicio({ datos }: { datos: DatosMiServicio }) {
  return (
    <div className="space-y-8">
      <ExplicacionDelServicio servicios={datos.servicios} />

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
      conTramaDeMarca
    >
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" && datos ? <DetalleDelServicio datos={datos} /> : null}
    </PaginaDelPortal>
  );
}
