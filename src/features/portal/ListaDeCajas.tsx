import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils/cn";

import { DetalleDeEtapa } from "./BloquesDelPortal";
import type { ICONOS } from "./iconos";
import { NIVELES } from "./nivel-urgencia";
import { type CajaConEtapa, type Etapa, rotuloDeLaCaja } from "./portal.types";

type Icono = (typeof ICONOS)[keyof typeof ICONOS];

/**
 * El título de un bloque desplegable del inicio: «Estado de mi caso», «Mis
 * juicios», «Mis escrituras».
 *
 * Cada uno lleva su icono al lado, **sobrio, chico y en navy**: un hito para el
 * caso, un tribunal para los juicios y un documento para las escrituras. Dejan
 * reconocer de qué es cada sección al pasar la vista, sin leer. En navy porque
 * el único color con significado en esta pantalla es el del nivel de urgencia.
 *
 * Va por debajo de la altura de la letra (15 px contra 16-18 del título). Del
 * mismo porte que el texto o más se leía invasivo: un icono que acompaña a un
 * título tiene que pesar menos que el título, o deja de acompañarlo.
 *
 * **Son contenidos, no protagonistas**: 16 px en el teléfono y 18 en el
 * computador, con el contador todavía más chico y en gris. Lo más grande de la
 * página es el nombre del servicio, y estos títulos solo tienen que decir de qué
 * es cada sección — no competir con él.
 *
 * Se probaron dos veces más grandes, hasta igualar a «¿Qué necesitas hacer hoy?»,
 * y el resultado fue el contrario del buscado: el título, el nombre de la etapa
 * dentro de la fila y el nombre del servicio medían casi lo mismo, y con tres
 * cosas del mismo porte no hay jerarquía que leer.
 *
 * El contador va en gris y solo si hay algo que contar: «(0)» al lado de un
 * bloque que ya explica que no hay nada es decir dos veces lo mismo, y la
 * segunda con un número.
 */
export function TituloDeBloque({
  Icono,
  contador,
  children,
}: {
  Icono: Icono;
  contador?: number;
  children: ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 type-section-title text-foreground md:text-lg">
      <Icono className="size-[15px] shrink-0 text-brand-navy" strokeWidth={1.75} aria-hidden />
      {children}
      {contador ? (
        <span className="type-supporting font-normal text-muted-foreground">({contador})</span>
      ) : null}
    </h2>
  );
}

/**
 * **Cada fila lleva su propio nivel de urgencia, como pastilla.** La etapa se muestra igual
 * sea el caso, un juicio o una escritura, así que si el capitán marca urgente la
 * etapa de una escritura, la persona tiene que verlo ahí — no solo en el estado
 * del caso. Es además lo que hace útil una lista de tres causas: la pregunta que
 * trae la persona es «cuál de todas me pide algo», y esa línea la responde sin
 * abrir ninguna.
 *
 * Reemplaza a la regla anterior de un solo signo de urgencia por pantalla, que
 * funcionaba cuando había un caso y se caía con varios: callar la urgencia de
 * dos juicios para no repetir un color es esconder justo lo que hay que decir.
 *
 * **Lo que manda en la fila es la etapa, no el identificador.** El ROL de una
 * causa o el tipo de una escritura sirven para saber de cuál de todas se trata,
 * pero nadie entra al portal a leer un rol: entra a saber en qué va. Por eso el
 * identificador quedó arriba y en chico, como el rótulo de la fila, y el nombre
 * de la etapa ocupa la línea principal.
 *
 * La fila desplegable, que es **la misma pieza en los tres bloques**: el estado
 * del caso, cada juicio y cada escritura. Antes el estado del caso era una
 * tarjeta aparte, parecida a las de la lista pero no igual, y esa mitad de
 * diferencia se leía como un error de armado. O son lo mismo o son cosas
 * distintas; siendo lo mismo —contenido del capitán que se abre en el lugar—,
 * ahora se ven iguales.
 *
 * Se despliega en el inicio en vez de llevar a otra pantalla. Con dos o tres
 * causas abiertas, la pregunta que trae la persona no es «cómo va esta» sino
 * «cuál de todas me pide algo», y eso se responde comparando, no navegando.
 */
export function FilaDesplegable({
  id,
  sobretitulo,
  titulo,
  etapa,
  completo,
}: {
  id: string;
  /**
   * Cómo se reconoce esta caja entre varias —«Rol N.° C-4821-2026 · Banco
   * Estado», «Declaración de bien familiar»—, arriba y en chico. Sirve para
   * saber de cuál de todas se trata, pero no es lo que la persona vino a leer.
   */
  sobretitulo?: string;
  /** La línea que manda: la etapa en que va. */
  titulo: string;
  etapa: Etapa | null;
  /**
   * Solo el estado del caso. En las listas el detalle va breve: la bajada de la
   * etapa y «qué puede pasar después» no ayudan a comparar una causa con otra.
   */
  completo?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const nivel = etapa ? NIVELES[etapa.nivelUrgencia] : null;
  const panelId = `detalle-${id}`;

  return (
    <div className="overflow-hidden rounded-lg bg-card ring-1 ring-border-subtle">
      <h3>
        <button
          type="button"
          onClick={() => setAbierto((estaba) => !estaba)}
          aria-expanded={abierto}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors md:px-5 [-webkit-tap-highlight-color:transparent] hover:bg-surface-subtle active:bg-surface-muted focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="min-w-0 flex-1">
            {sobretitulo ? (
              <span className="type-meta mb-0.5 block text-muted-foreground">{sobretitulo}</span>
            ) : null}
            <span className="type-item-title block text-balance text-foreground">{titulo}</span>

            {/* La instrucción completa, en la propia fila y con su icono. Se
                probó como etiqueta de una palabra —con la frase guardada para el
                desplegable— y se volvió atrás: la persona tenía que abrir para
                saber qué le tocaba hacer, que es justo lo que vino a averiguar.
                Acá lo lee sin tocar nada. */}
            {nivel ? (
              <span
                className={cn(
                  "mt-1.5 flex items-center gap-2 type-supporting font-medium",
                  nivel.color,
                )}
              >
                <nivel.Icono className="size-4 shrink-0" aria-hidden />
                {nivel.frase}
              </span>
            ) : null}
          </span>



          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-foreground-faint transition-transform duration-200 motion-reduce:transition-none",
              abierto && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </h3>

      {abierto ? (
        <div id={panelId} className="border-t border-border-subtle bg-surface-subtle p-3">
          <DetalleDeEtapa etapa={etapa} completo={completo} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * La lista de juicios o de escrituras. En los juicios el identificador es el ROL
 * de la causa; en las escrituras, el tipo de escritura. Cada caja distinta es un
 * asunto distinto que hay que informar por separado, y cada una avanza por su
 * cuenta: un único «estado de mi caso» no podría contarlo sin mentir.
 */
export function ListaDeCajas({
  titulo,
  Icono,
  items,
  vacio,
}: {
  titulo: string;
  Icono: Icono;
  items: CajaConEtapa[];
  /**
   * Qué decir cuando la lista es el servicio principal y todavía no tiene nada
   * que listar —protección patrimonial recién contratada, sin ninguna escritura
   * en marcha—. Sin este texto la sección no aparece, que es lo correcto cuando
   * la lista es un aditivo: una sección vacía al pie de una renegociación es
   * ruido, pero la pantalla en blanco de quien contrató escrituras es un error.
   */
  vacio?: string;
}) {
  if (items.length === 0 && !vacio) return null;

  return (
    <section className="mt-10 md:mt-12">
      <TituloDeBloque Icono={Icono} contador={items.length}>
        {titulo}
      </TituloDeBloque>

      {items.length === 0 ? (
        <p className="mt-3 rounded-lg bg-card p-4 type-supporting leading-relaxed text-muted-foreground ring-1 ring-border-subtle">
          {vacio}
        </p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {items.map((item) => {
            const etapa = item.etapa?.visibleParaCliente ? item.etapa : null;

            return (
              <li key={item.caja.id}>
                <FilaDesplegable
                  id={item.caja.id}
                  sobretitulo={rotuloDeLaCaja(item.caja)}
                  titulo={etapa ? etapa.nombreParaCliente : "Tu caso está avanzando"}
                  etapa={etapa}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
