import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils/cn";

import { ICONOS } from "./iconos";
import { NIVELES } from "./nivel-urgencia";
import type { Etapa } from "./portal.types";

type Icono = (typeof ICONOS)[keyof typeof ICONOS];

/**
 * Las dos piezas con las que se arman las pantallas de detalle del portal, y la
 * jerarquía que forman: **un solo bloque con color por pantalla**, y debajo
 * tarjetas neutras todas iguales entre sí.
 *
 * La regla que sostiene esto: el color señala dónde estás parado, no qué es más
 * importante de leer. Si dos cosas tienen color, ninguna de las dos lo dice.
 */

/**
 * Rampa morada del bloque destacado. La entregó diseño y el tema no la cubre:
 * solo tiene el índigo de acción (`primary`) y el navy del wordmark, ninguno
 * pensado para texto sobre lila. Vive acá, en un solo lugar; si el sistema
 * incorpora la rampa, se reemplaza por tokens y no hay que tocar las pantallas.
 */
const MORADO = {
  // El rótulo va en el tono más oscuro de la rampa, el mismo del título, y no en
  // el claro con que llegó: a 12 px y en versalitas el morado claro se leía
  // desvaído sobre el lila, y bajarlo un escalón no alcanzaba a notarse. Lo que
  // lo distingue del cuerpo es la caja alta y el interletrado, no el color —que
  // a ese porte rinde menos que a cualquier otro.
  rotulo: "text-[#26215c]",
  titulo: "text-[#26215c]",
  texto: "text-[#3c3489]",
} as const;

/**
 * El bloque que abre una pantalla de detalle: dice dónde estás parado. Es el
 * único acento de color de la página, y por eso funciona — en cuanto algo más
 * se tiñe, deja de señalar nada.
 *
 * El fondo es `accent`, la superficie de marca de baja intensidad que ya define
 * el tema.
 */
export function BloqueDestacado({
  rotulo,
  titulo,
  children,
}: {
  rotulo: string;
  titulo?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-accent p-5">
      <p className={`type-meta font-medium uppercase tracking-[0.04em] ${MORADO.rotulo}`}>
        {rotulo}
      </p>

      {titulo ? (
        <h2 className={`mt-1.5 text-balance type-subsection-title font-medium ${MORADO.titulo}`}>
          {titulo}
        </h2>
      ) : null}

      <p className={`mt-2 type-supporting leading-relaxed whitespace-pre-line ${MORADO.texto}`}>
        {children}
      </p>
    </section>
  );
}

/**
 * **El trazo ámbar bajo una palabra del título.** Es el único naranja del portal
 * y marca siempre lo mismo: **de qué se trata esta pantalla en particular**. En
 * el inicio va bajo el nombre de la persona, que es lo único suyo que hay ahí;
 * en «Mi servicio», bajo el nombre del servicio, que es lo único que cambia de
 * un cliente a otro en esa página.
 *
 * Uno por pantalla, y siempre bajo la parte variable del título. Repartido en
 * más lugares dejaría de señalar algo y pasaría a ser decoración.
 */
export function Subrayado({ children }: { children: ReactNode }) {
  return (
    // Subrayado de texto y no una barra puesta debajo. La barra era un bloque
    // absoluto y funcionaba mientras lo subrayado cupiera en una línea: con «la
    // defensa en juicio con protección patrimonial», que ocupa tres, la barra se
    // dibujaba una sola vez y del ancho del bloque entero, cruzando por debajo
    // de las tres. El subrayado sigue cada línea, que es lo que hace.
    // `skip-ink:none` para que el trazo no se corte bajo la jota de «juicio» ni
    // la pe de «protección». Con un subrayado fino los huecos pasan
    // desapercibidos; con uno de cuatro píxeles se ven como cortes.
    <span className="underline decoration-[var(--color-warning)] decoration-4 underline-offset-[7px] [text-decoration-skip-ink:none]">
      {children}
    </span>
  );
}

/**
 * **Un recuadro completo, con su dibujo y su título adentro.** Es la pieza con
 * que se arma «Mi servicio»: uno para el objetivo y otro para los beneficios.
 *
 * Reemplaza al bloque lila que titulaba el objetivo. El lila es el color con que
 * el portal marca lo que escribió el capitán —la etapa en que va tu caso— y
 * usarlo también para la explicación del servicio le quitaba ese significado:
 * dos cosas distintas pintadas igual dejan de decir algo con el color. Acá los
 * dos recuadros pesan lo mismo, que es lo correcto: son dos partes de la misma
 * explicación, no una más importante que la otra.
 */
export function TarjetaDeSeccion({
  Icono,
  titulo,
  antes,
  children,
}: {
  Icono: Icono;
  titulo: string;
  /**
   * Lo que va **antes del título**, dentro del recuadro. Es para lo único que
   * puede ir ahí: algo que hay que leer incluso antes de saber de qué habla el
   * recuadro. Hoy solo lo usa la línea de urgencia.
   */
  antes?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-card p-5 shadow-card ring-1 ring-border-subtle md:p-6">
      {antes}
      {/* Título en navy y dibujo en índigo. Es el único color que entra a esta
          pantalla, y entra donde corresponde: en lo que la ordena. El navy es la
          tinta de la marca —más azul que el negro del cuerpo, lo justo para que
          el título se despegue del párrafo sin gritar— y el índigo es el color
          de acción del sistema, que acá marca dónde empieza cada parte. */}
      <h2 className="flex items-center gap-2.5 type-item-title font-semibold text-brand-navy">
        <Icono className="size-[19px] shrink-0 text-primary" strokeWidth={1.9} aria-hidden />
        {titulo}
      </h2>

      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * Cada tarjeta responde una pregunta distinta, y todas pesan lo mismo: misma
 * superficie, mismo borde, mismo icono en navy. Ninguna se destaca sobre las
 * otras — ni con color, ni con etiqueta, ni con borde de acento.
 *
 * Que «qué necesitamos de ti» se viera distinta parecería una ayuda, pero la
 * pantalla es para alguien asustado: subrayar la fila que le pide algo es
 * exactamente lo que no hay que hacer. Si algo es urgente, lo dice el cierre de
 * la pantalla, una sola vez.
 */
export function TarjetaInformativa({
  Icono,
  titulo,
  children,
}: {
  Icono: Icono;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="flex h-full gap-3 rounded-lg bg-card p-4 shadow-card ring-1 ring-border-subtle">
      <Icono className="mt-0.5 size-[18px] shrink-0 text-brand-navy" aria-hidden />

      <div className="min-w-0">
        <h3 className="type-supporting font-medium text-foreground">{titulo}</h3>
        <p className="mt-1.5 type-supporting leading-relaxed whitespace-pre-line text-muted-foreground">
          {children}
        </p>
      </div>
    </section>
  );
}

/**
 * El detalle que aparece al **desplegar** el estado de un caso, de un juicio o
 * de una escritura. Los tres bloques desplegables del inicio muestran esto
 * mismo, así que vive en un solo lugar: es el contenido que escribió el capitán,
 * y no hay razón para que se vea distinto según de qué caja cuelgue.
 *
 * **Cierra con la instrucción completa.** En la fila solo se ve la palabra del
 * nivel —«Atento»—, que es lo que deja comparar varias causas de un vistazo; acá
 * va la frase entera, después de que la persona leyó qué está pasando.
 *
 * **Abre con la explicación de la etapa**, en el bloque lila: sin ese ancla el
 * panel empezaba directamente por «qué está haciendo tu equipo», que responde
 * otra pregunta. El nombre de la etapa no se repite acá —lo dice el título de la
 * fila, justo arriba—: solo va el rótulo «Etapa actual» y debajo la explicación.
 *
 * **Una sola versión para las tres filas.** Estuvo en dos —la del estado del
 * caso con «qué viene después» y la de las listas sin él— y se unificó: si esa
 * respuesta vale para el caso único, vale igual para cada causa, y dos versiones
 * del mismo panel obligan a aprender dos veces dónde está cada cosa. Con dos o
 * tres causas abiertas la pregunta es «cuál de todas me pide algo», y eso se
 * responde comparando lo que cada una necesita, no leyendo el futuro de cada
 * una.
 *
 * La versión completa existe porque este bloque es hoy el único lugar donde se
 * lee la etapa entera, y no puede quedar contenido del capitán sin ninguna
 * pantalla que lo muestre.
 *
 * Cuando la etapa es de trabajo interno no hay nada que mostrar, y decirlo es
 * mejor que un panel vacío.
 */
export function DetalleDeEtapa({ etapa }: { etapa: Etapa | null }) {
  if (!etapa) {
    return (
      <p className="type-supporting px-1 py-1 leading-relaxed text-muted-foreground">
        Ahora mismo esto está en una etapa de trabajo interno de nuestro equipo, así que no hay
        novedades que mostrarte todavía. Apenas las haya, las vas a ver acá.
      </p>
    );
  }

  const detalles = [
    {
      clave: "tarea",
      Icono: ICONOS.tarea,
      titulo: "Qué necesitamos de ti",
      texto: etapa.queNecesitamosDelCliente,
    },
    { clave: "plazo", Icono: ICONOS.reloj, titulo: "Plazo esperado", texto: etapa.plazoEsperado },
    {
      clave: "camino",
      // La flecha y no el poste indicador: el poste lo lleva el título del
      // recuadro de arriba, y dos señales iguales en el mismo panel se leen como
      // la misma cosa dicha dos veces.
      Icono: ICONOS.siguiente,
      titulo: "Qué viene después",
      texto: etapa.quePuedePasarDespues,
    },
  ];

  return (
    <div className="space-y-3">
      {/* **Primero el estado y su explicación; después, los detalles.** Lo de
          arriba es una sola cosa —qué está pasando— dicha en dos párrafos: el
          mensaje del capitán y lo que el equipo está haciendo. Iban separados, en
          dos recuadros del mismo porte, y ahí la persona tenía que armar sola
          que eran la misma respuesta.

          La piel es la de «Mi servicio»: dibujo índigo, título navy y el
          contenido adentro. Se abría con un bloque lila y cuatro tarjetas
          sueltas, un lenguaje que no existía en ninguna otra parte del portal, y
          al desplegar se perdía el hilo con el resto de la pantalla.

          Sin el nombre de la etapa: ya está en el título de la fila, a diez
          píxeles. Repetido y en cuerpo más grande, la persona lee dos veces lo
          mismo y la segunda parece otra cosa. */}
      <TarjetaDeSeccion
        Icono={ICONOS.etapa}
        titulo="Estado de mi caso"
        antes={<RefuerzoDeUrgencia etapa={etapa} />}
      >
        <p className="type-supporting leading-relaxed whitespace-pre-line text-muted-foreground">
          {etapa.mensajePrincipal}
        </p>
        <p className="type-supporting mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">
          {etapa.queHaceLexy}
        </p>
      </TarjetaDeSeccion>

      {/* Los tres detalles, **apilados y sin título de sección**. Apilados
          porque se leen en orden —qué me toca, para cuándo, qué sigue— y no son
          tres cosas entre las que elegir; sin título porque ya son la letra
          chica de lo de arriba, y ponerles encabezado los subiría al mismo nivel
          que la explicación, que es justo lo que había que deshacer. */}
      <div className="rounded-xl bg-card p-5 shadow-card ring-1 ring-border-subtle md:p-6">
        <ul className="divide-y divide-border-subtle">
          {detalles.map((detalle) => (
            <li key={detalle.clave} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
              <detalle.Icono
                className="mt-0.5 size-[18px] shrink-0 text-primary"
                strokeWidth={1.9}
                aria-hidden
              />

              <div className="min-w-0">
                <h3 className="type-supporting font-semibold text-brand-navy">{detalle.titulo}</h3>
                <p className="type-supporting mt-1 leading-relaxed whitespace-pre-line text-muted-foreground">
                  {detalle.texto}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

/**
 * **Qué te toca hacer, arriba de todo y dentro del recuadro.**
 *
 * Estaba al pie del panel y suelto, fuera de las dos tarjetas, y ahí quedaba
 * como un pie de página: lo último que se lee y lo primero que se salta. Es lo
 * contrario de lo que dice —si el caso no avanza sin ti, eso es lo que hay que
 * leer antes que nada— así que sube a lo más alto del primer recuadro, **incluso
 * por encima de su título**: qué te toca hacer se lee antes que el rótulo que
 * anuncia de qué habla el recuadro.
 *
 * Adentro del recuadro y no flotando: suelto sobre el fondo del panel se leía
 * como un mensaje del sistema, de esos que se cierran, y no como parte de lo que
 * el equipo escribió sobre este caso.
 *
 * Los tres niveles hablan acá, incluido el tranquilo. En la fila cerrada solo
 * avisan los dos que piden algo —el silencio es la buena noticia—, pero quien
 * abrió la fila vino a preguntar, y «no necesitas hacer nada por ahora» es una
 * respuesta, no un ruido.
 */
function RefuerzoDeUrgencia({ etapa }: { etapa: Etapa }) {
  const { frase, Icono, color } = NIVELES[etapa.nivelUrgencia];

  return (
    <p
      className={cn(
        "mb-3 flex items-start gap-2 border-b border-border-subtle pb-3 type-supporting font-semibold",
        color,
      )}
    >
      <Icono className="mt-0.5 size-4 shrink-0" aria-hidden />
      {frase}
    </p>
  );
}
