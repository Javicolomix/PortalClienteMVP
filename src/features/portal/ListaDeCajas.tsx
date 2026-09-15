import { ChevronDown, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/base/Popover";
import { Tag } from "@/shared/components/base/Tag";
import { cn } from "@/shared/lib/utils/cn";

import { DetalleDeEtapa } from "./BloquesDelPortal";
import type { ICONOS } from "./iconos";
import { inicialesDe, tonoDe, type TonoDeCaja, tonosDeLaLista } from "./identidad-de-caja";
import { NIVELES, NIVELES_EN_ORDEN } from "./nivel-urgencia";
import {
  type CajaConEtapa,
  type Etapa,
  type IdentidadDeCaja,
  identidadDeLaCaja,
} from "./portal.types";

type Icono = (typeof ICONOS)[keyof typeof ICONOS];

/**
 * **Qué significa cada estado**, en una burbuja que se abre desde el título del
 * bloque.
 *
 * Tres palabras sueltas no se explican solas: en la reunión del equipo quedó
 * claro que a primera vista nadie sabe qué le pide «Atención» que no le pida
 * «Urgente». La frase entera aparece al desplegar una fila, pero para eso hay
 * que abrirla, y la persona quiere entender la lista antes de decidir cuál
 * abrir.
 *
 * Va **una por bloque y no una por fila**: la duda es sobre el sistema de tres
 * niveles, no sobre esta causa en particular, así que repetirla en cada fila
 * sería contestar tres veces la misma pregunta. Además obligaría a meter un
 * botón dentro del botón que despliega la fila, que ni el navegador ni el
 * lector de pantalla saben interpretar.
 */
function LeyendaDeNiveles() {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Qué significa cada estado"
        className="-mr-1 flex shrink-0 items-center gap-1 rounded-button px-1 py-1 type-meta text-muted-foreground transition-colors [-webkit-tap-highlight-color:transparent] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <HelpCircle className="size-[15px] shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="hidden sm:inline">¿Qué significan?</span>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border-border-subtle p-4"
      >
        <p className="type-supporting font-medium text-foreground">Qué significa cada estado</p>

        <dl className="mt-3 space-y-3">
          {NIVELES_EN_ORDEN.map((clave) => {
            const nivel = NIVELES[clave];

            return (
              <div key={clave}>
                <dt>
                  <Tag tone={nivel.tono} size="xs" shape="rounded">
                    <span className={cn("size-1.5 rounded-full", nivel.punto)} aria-hidden />
                    {nivel.etiqueta}
                  </Tag>
                </dt>
                <dd className="mt-1 type-meta leading-relaxed text-muted-foreground">
                  {nivel.queSignifica}
                </dd>
              </div>
            );
          })}
        </dl>
      </PopoverContent>
    </Popover>
  );
}

/**
 * El título de un bloque desplegable del inicio: «Estado de mi caso», «Mis
 * juicios», «Mis escrituras».
 *
 * Cada uno lleva su icono al lado, **sobrio, chico y en navy**: un hito para el
 * caso, un tribunal para los juicios y un documento para las escrituras. Dejan
 * reconocer de qué es cada sección al pasar la vista, sin leer.
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
 *
 * A la derecha, la leyenda de los tres estados. Va en la cabecera del bloque
 * porque explica la columna de pastillas que viene abajo, y ese es el sitio
 * donde se mira antes de empezar a leer las filas.
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
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex min-w-0 items-center gap-2 type-section-title text-foreground md:text-lg">
        <Icono className="size-[15px] shrink-0 text-brand-navy" strokeWidth={1.75} aria-hidden />
        {children}
        {contador ? (
          <span className="type-supporting font-normal text-muted-foreground">({contador})</span>
        ) : null}
      </h2>

      <LeyendaDeNiveles />
    </div>
  );
}

/**
 * La burbuja de color con que se distingue una caja de otra en su lista. Las
 * iniciales salen siempre del texto que se lee al lado; el color, de la clave
 * que decide `identidadDeLaCaja` —el acreedor en una causa, la caja en una
 * escritura—, que no es lo mismo y está explicado allá.
 *
 * Va `aria-hidden`: las iniciales no dicen nada que el texto de la fila no diga
 * ya entero, y anunciar «B E» antes de «Banco Estado» solo alarga la escucha.
 */
function BurbujaDeCaja({ identidad, tono }: { identidad: IdentidadDeCaja; tono: TonoDeCaja }) {
  const { fondo, texto } = tono;

  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full type-meta font-semibold tracking-tight md:size-9"
      style={{ backgroundColor: fondo, color: texto }}
    >
      {inicialesDe(identidad.principal)}
    </span>
  );
}

/**
 * **Cada fila lleva su propio nivel de urgencia, como pastilla.** La etapa se
 * muestra igual sea el caso, un juicio o una escritura, así que si el capitán
 * marca urgente la etapa de una escritura, la persona tiene que verlo ahí — no
 * solo en el estado del caso. Es además lo que hace útil una lista de tres
 * causas: la pregunta que trae la persona es «cuál de todas me pide algo», y esa
 * línea la responde sin abrir ninguna.
 *
 * **Lo que manda en la fila es la etapa, no el identificador.** El acreedor de
 * una causa o el tipo de una escritura sirven para saber de cuál de todas se
 * trata, pero nadie entra al portal a leer un rol: entra a saber en qué va. Por
 * eso la identidad queda arriba y en chico, como rótulo, y el nombre de la etapa
 * ocupa la línea principal.
 *
 * Dentro de ese rótulo, sin embargo, **no todo pesa igual**: el acreedor va con
 * tinta y el rol en gris detrás. Es el orden en que la persona reconoce su
 * causa, y el que el equipo de litigios pidió corregir.
 *
 * La fila desplegable es **la misma pieza en los tres bloques**: el estado del
 * caso, cada juicio y cada escritura. Antes el estado del caso era una tarjeta
 * aparte, parecida a las de la lista pero no igual, y esa mitad de diferencia se
 * leía como un error de armado.
 *
 * Se despliega en el inicio en vez de llevar a otra pantalla. Con dos o tres
 * causas abiertas, la pregunta que trae la persona no es «cómo va esta» sino
 * «cuál de todas me pide algo», y eso se responde comparando, no navegando.
 */
export function FilaDesplegable({
  id,
  identidad,
  tono,
  titulo,
  etapa,
  completo,
}: {
  id: string;
  /**
   * Cómo se reconoce esta caja entre varias. El estado del caso no lleva —es
   * una sola y no hay de qué distinguirla—, así que va sin burbuja ni rótulo.
   */
  identidad?: IdentidadDeCaja;
  /**
   * El color de la burbuja. Lo decide la lista y no la fila, porque para que dos
   * vecinas no salgan iguales hay que mirarlas juntas. Sin lista —el estado del
   * caso, que es una sola— sale de la clave.
   */
  tono?: TonoDeCaja;
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
          className="flex w-full items-center gap-2.5 px-4 py-4 text-left transition-colors md:gap-3 md:px-5 [-webkit-tap-highlight-color:transparent] hover:bg-surface-subtle active:bg-surface-muted focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
        >
          {identidad ? (
            <BurbujaDeCaja identidad={identidad} tono={tono ?? tonoDe(identidad.claveDeColor)} />
          ) : null}

          <span className="min-w-0 flex-1">
            {identidad ? (
              /* El rótulo es **una fila que envuelve por piezas enteras**, no un
                 párrafo. Si fuera texto corrido, el navegador parte donde le
                 cabe y en un teléfono angosto deja «Banco / Estado» arriba y el
                 rol abajo: el acreedor, que es justo lo que la persona busca
                 primero, queda cortado por la mitad. Envolviendo por piezas, el
                 acreedor se mantiene entero y lo que baja de línea es el rol. */
              <span className="type-meta mb-0.5 flex flex-wrap items-baseline gap-x-1.5 text-muted-foreground">
                <span className="font-semibold text-foreground">{identidad.principal}</span>
                {/* El rol va **sin punto de separación y entero**. Sin punto
                    porque cuando cae en la línea de abajo el punto quedaría
                    colgando al final de la primera —«Banco Estado ·»— como si
                    faltara algo; la diferencia de peso y de color ya los separa
                    cuando entran juntos. Entero porque partido —«Rol N.° C-»
                    arriba y «1184-2026» abajo— no se reconoce ningún número. */}
                {identidad.secundario ? (
                  <span className="whitespace-nowrap">{identidad.secundario}</span>
                ) : null}
              </span>
            ) : null}
            <span className="type-item-title block text-balance text-foreground">{titulo}</span>
          </span>

          {/* El nivel, con la fila cerrada: **el punto del semáforo y una
              palabra**, en su pastilla. Con dos o tres causas abiertas la
              pregunta es «cuál de todas me pide algo», y eso se compara de un
              vistazo; una frase en cada fila obliga a leerlas todas para
              comparar. El punto pleno es lo que deja comparar la columna sin
              leerla —el relleno de la pastilla es un tinte, y de lejos los tres
              tintes se parecen—; la palabra queda para quien no distingue los
              colores. La instrucción completa aparece al desplegar. */}
          {nivel ? (
            <Tag tone={nivel.tono} size="xs" shape="rounded" className="shrink-0">
              <span className={cn("size-1.5 rounded-full", nivel.punto)} aria-hidden />
              {nivel.etiqueta}
            </Tag>
          ) : null}

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
 * La lista de juicios o de escrituras. En los juicios la identidad es el
 * acreedor con su rol detrás; en las escrituras, el tipo de escritura. Cada caja
 * distinta es un asunto distinto que hay que informar por separado, y cada una
 * avanza por su cuenta: un único «estado de mi caso» no podría contarlo sin
 * mentir.
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
  const identidades = items.map((item) => identidadDeLaCaja(item.caja));
  const tonos = tonosDeLaLista(identidades.map((identidad) => identidad?.claveDeColor));

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
          {items.map((item, fila) => {
            const etapa = item.etapa?.visibleParaCliente ? item.etapa : null;

            return (
              <li key={item.caja.id}>
                <FilaDesplegable
                  id={item.caja.id}
                  identidad={identidades[fila]}
                  tono={tonos[fila]}
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
