import { ChevronDown, HelpCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/base/Popover";
import { Tag } from "@/shared/components/base/Tag";
import { cn } from "@/shared/lib/utils/cn";

import { DetalleDeEtapa } from "./BloquesDelPortal";
import {
  iconoDeEscritura,
  inicialesDe,
  tintaDe,
  type TintaDeCaja,
  tintasDeLaLista,
} from "./identidad-de-caja";
import { NIVELES, NIVELES_EN_ORDEN } from "./nivel-urgencia";
import {
  type CajaConEtapa,
  type Etapa,
  type IdentidadDeCaja,
  identidadDeLaCaja,
} from "./portal.types";

/** Cualquier icono de lucide: los de las secciones y los de los tipos de escritura. */
type Icono = LucideIcon;

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
 * **La marca de la fila**: el círculo de la izquierda con que se reconoce una
 * caja entre varias.
 *
 * Lleva un **dibujo** cuando el tipo de gestión es una cosa del mundo —una casa
 * para una compraventa de inmueble, un auto para una de vehículo— y las
 * **iniciales del acreedor** cuando no lo es, que es el caso de las causas: no
 * hay dibujo de «Banco Estado», y lo que la persona reconoce ahí es el nombre.
 *
 * El color va **en el dibujo y no en el círculo**, que queda gris para todas.
 * Cuatro discos de colores en fila pesan como cuatro semáforos, y en esta
 * pantalla el semáforo ya existe: es la pastilla de urgencia. Teñir solo la
 * marca alcanza para distinguir dos filas sin disputarle la atención a lo que sí
 * hay que mirar.
 *
 * Va `aria-hidden`: ni el dibujo ni las iniciales dicen nada que el texto de la
 * fila no diga ya entero, y anunciar «B E» antes de «Banco Estado» solo alarga
 * la escucha.
 */
function MarcaDeLaCaja({
  identidad,
  tinta,
  Icono,
}: {
  identidad: IdentidadDeCaja;
  tinta: TintaDeCaja;
  Icono?: Icono;
}) {
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted"
      style={{ color: tinta }}
    >
      {Icono ? (
        <Icono className="size-[18px]" strokeWidth={1.75} />
      ) : (
        <span className="type-meta font-semibold tracking-tight">
          {inicialesDe(identidad.principal)}
        </span>
      )}
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
 * **Arriba el nombre de la gestión, abajo la etapa.** Estuvo al revés —la etapa
 * como titular y el identificador como rótulo chico— y con listas de una o dos
 * filas funcionaba: la única pregunta era «en qué va». Con cuatro escrituras
 * dejó de funcionar, y el equipo de PP lo dijo mirándolas: la primera pregunta
 * pasó a ser **cuál de todas es esta**, y eso lo contesta el tipo de gestión, no
 * la etapa. La etapa quedó debajo y subió a 14 px, porque bajar de jerarquía no
 * es volverse letra chica: sigue siendo lo que hay que poder leer de corrido.
 *
 * Dentro del titular, **no todo pesa igual**: el acreedor va con tinta y el rol
 * en gris detrás. Es el orden en que la persona reconoce su causa, y el que el
 * equipo de litigios pidió corregir.
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
  tinta,
  Icono,
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
   * El color de la marca. Lo decide la lista y no la fila, porque para que dos
   * vecinas no salgan iguales hay que mirarlas juntas. Sin lista —el estado del
   * caso, que es una sola— sale de la clave.
   */
  tinta?: TintaDeCaja;
  /** El dibujo de la marca. Sin él, van las iniciales. */
  Icono?: Icono;
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
            <MarcaDeLaCaja
              identidad={identidad}
              tinta={tinta ?? tintaDe(identidad.claveDeColor)}
              Icono={Icono}
            />
          ) : null}

          <span className="min-w-0 flex-1">
            {/* **Arriba el tipo de gestión, abajo la etapa.** Es la vuelta que
                pidió el equipo de PP después de ver la lista larga: con cuatro
                escrituras, la primera pregunta no es «en qué va esto» sino «cuál
                de todas es esta», y eso lo contesta el tipo. La etapa queda
                debajo, en 14 px, que es un punto más de lo que tenía: tiene que
                leerse de corrido, no buscarse.

                El rótulo es una fila que **envuelve por piezas enteras**, no un
                párrafo. Si fuera texto corrido el navegador parte donde le cabe
                y en un teléfono angosto deja «Banco / Estado» arriba y el rol
                abajo: el acreedor, que es lo que la persona busca primero, queda
                cortado por la mitad. */}
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="type-item-title font-semibold text-foreground">
                {identidad?.principal}
              </span>

              {/* El rol va **sin punto de separación, entero, y en el teléfono
                  siempre en su propia línea**.

                  Sin punto porque al caer abajo quedaría colgando al final de la
                  primera —«Banco Estado ·»— como si faltara algo; la diferencia
                  de tamaño y de color ya los separa cuando entran juntos.

                  Entero porque partido —«Rol N.° C-» arriba y «1184-2026»
                  abajo— no se reconoce ningún número.

                  Y en su propia línea porque «Banco Estado Rol N.° C-1184-2026»
                  queda justo en el límite del ancho de un teléfono: entraba en
                  una fila y en la siguiente no, y cuatro causas del mismo largo
                  se veían desparejas sin ninguna razón que la persona pudiera
                  adivinar. Desde `md` sobra el espacio y vuelve a la línea del
                  acreedor, que es donde mejor se lee. */}
              {identidad?.secundario ? (
                <span className="type-meta basis-full whitespace-nowrap text-muted-foreground md:basis-auto">
                  {identidad.secundario}
                </span>
              ) : null}
            </span>

            {/* **La etapa y la pastilla, en la misma línea.** La pastilla
                estaba a la derecha de la fila entera, y ahí le quitaba
                ochenta píxeles al titular: «Constitución de Sociedades» no
                entraba en una línea de teléfono y la fila terminaba midiendo
                cuatro. Acá abajo cabe todo y queda al lado de lo que califica,
                que es la etapa —no la gestión—. Sigue alineada a la derecha en
                todas las filas, así que la columna se compara igual. */}
            <span className="mt-0.5 flex items-center gap-2">
              <span className="type-supporting min-w-0 flex-1 text-muted-foreground">
                {etapa ? etapa.nombreParaCliente : "Tu caso está avanzando"}
              </span>

              {/* El nivel, con la fila cerrada: **el punto del semáforo y una
                  palabra**. Con dos o tres causas abiertas la pregunta es «cuál
                  de todas me pide algo», y eso se compara de un vistazo; una
                  frase en cada fila obliga a leerlas todas para comparar. El
                  punto pleno es lo que deja comparar la columna sin leerla —el
                  relleno de la pastilla es un tinte, y de lejos los tres tintes
                  se parecen—; la palabra queda para quien no distingue los
                  colores. La instrucción completa aparece al desplegar. */}
              {nivel ? (
                <Tag tone={nivel.tono} size="xs" shape="rounded" className="shrink-0">
                  <span className={cn("size-1.5 rounded-full", nivel.punto)} aria-hidden />
                  {nivel.etiqueta}
                </Tag>
              ) : null}
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
  const tintas = tintasDeLaLista(identidades);

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
                  tinta={tintas[fila]}
                  // El dibujo es cosa de las escrituras: sus tipos son cosas del
                  // mundo. Una causa no tiene dibujo —no existe el de «Banco
                  // Estado»— y va con las iniciales del acreedor.
                  Icono={
                    item.caja.tipo === "proteccionPatrimonial"
                      ? iconoDeEscritura(item.caja.identificador)
                      : undefined
                  }
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
