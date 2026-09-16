import { ChevronDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils/cn";

import { DetalleDeEtapa } from "./BloquesDelPortal";
import { colorDeAcreedor } from "./color-de-acreedor";
import { iconoDeLaCaja, tintaDe, tintasDeLaLista } from "./identidad-de-caja";
import {
  type CajaConEtapa,
  type Etapa,
  type IdentidadDeCaja,
  identidadDeLaCaja,
} from "./portal.types";

/** Cualquier icono de lucide: los de las secciones y los de los tipos de escritura. */
type Icono = LucideIcon;

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
    </div>
  );
}

/**
 * **La marca de la fila**: el círculo de la izquierda con que se reconoce de un
 * vistazo de qué es cada caja. Un martillo en las causas, el dibujo del tipo en
 * las escrituras —una casa, un auto, una sociedad—.
 *
 * Va **sin fondo**: el dibujo solo, con su color. El círculo gris que tenía
 * detrás lo hacía parecer el avatar de una aplicación de mensajería, y encerraba
 * una figura que no necesita encerrarse para leerse.
 *
 * En las causas el color sale de **la marca del acreedor** —rojo Santander,
 * celeste Caja Los Andes—, que es lo que la persona tiene visto de la tarjeta y
 * del cajero. En las escrituras, y en cualquier acreedor que no tengamos
 * fichado, sale del reparto de tintas neutras.
 *
 * Va `aria-hidden`: el dibujo no dice nada que el texto de la fila no diga ya
 * entero.
 */
function MarcaDeLaCaja({ Icono, tinta }: { Icono: Icono; tinta: string }) {
  return (
    <span
      aria-hidden
      className="flex size-6 shrink-0 items-center justify-center"
      style={{ color: tinta }}
    >
      <Icono className="size-[22px]" strokeWidth={1.75} />
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
   * El color de la marca: el de la marca del acreedor cuando lo tenemos, o el
   * que le toque del reparto. Lo decide la lista y no la fila, porque para que
   * dos vecinas no salgan iguales hay que mirarlas juntas. Sin lista —el estado
   * del caso, que es una sola— sale de la clave.
   */
  tinta?: string;
  /** El dibujo de la marca: el martillo de las causas, el tipo de la escritura. */
  Icono?: Icono;
  etapa: Etapa | null;
  /**
   * Solo el estado del caso. En las listas el detalle va breve: la bajada de la
   * etapa y «qué puede pasar después» no ayudan a comparar una causa con otra.
   */
  completo?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
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
          {Icono && identidad ? (
            <MarcaDeLaCaja Icono={Icono} tinta={tinta ?? tintaDe(identidad.claveDeColor)} />
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

            <span className="mt-0.5 flex items-center gap-2">
              {/* La etapa va en **gris de texto y no en gris de metadato**, y
                  con medio peso de más. Es la segunda línea de la fila, así que
                  no compite con el nombre de la gestión, pero es lo que la
                  persona vino a leer: con el gris claro de un subtítulo se
                  hundía debajo del titular y había que buscarla. */}
              <span className="type-supporting min-w-0 flex-1 font-medium text-foreground-secondary">
                {etapa ? etapa.nombreParaCliente : "Tu caso está avanzando"}
              </span>

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

  // El reparto de tintas neutras corre para toda la lista, pero solo se usa
  // donde no hay color de marca: una causa de un acreedor fichado lleva el suyo
  // —rojo Santander, celeste Caja Los Andes—, y las escrituras y los acreedores
  // que no tenemos, el que les toque sin repetir el de la fila de arriba.
  const respaldo = tintasDeLaLista(identidades);

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
                  tinta={colorDeAcreedor(item.caja.acreedor) ?? respaldo[fila]}
                  Icono={iconoDeLaCaja(item.caja)}
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
