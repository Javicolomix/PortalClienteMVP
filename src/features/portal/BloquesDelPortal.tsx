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
  children,
}: {
  Icono: Icono;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-card p-5 shadow-card ring-1 ring-border-subtle md:p-6">
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
 * Después va en dos versiones. La **completa** —la del estado del caso— trae
 * todo lo que escribió el capitán, «qué puede pasar después» incluida. La
 * **breve** —la de cada juicio y cada escritura— deja fuera el futuro: con dos o
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
export function DetalleDeEtapa({ etapa, completo }: { etapa: Etapa | null; completo?: boolean }) {
  if (!etapa) {
    return (
      <p className="type-supporting px-1 py-1 leading-relaxed text-muted-foreground">
        Ahora mismo esto está en una etapa de trabajo interno de nuestro equipo, así que no hay
        novedades que mostrarte todavía. Apenas las haya, las vas a ver acá.
      </p>
    );
  }

  const tarjetas = [
    {
      clave: "equipo",
      Icono: ICONOS.equipo,
      titulo: "Qué está haciendo tu equipo",
      texto: etapa.queHaceLexy,
    },
    {
      clave: "tarea",
      Icono: ICONOS.tarea,
      titulo: "Qué necesitamos de ti",
      texto: etapa.queNecesitamosDelCliente,
    },
    { clave: "plazo", Icono: ICONOS.reloj, titulo: "Plazo esperado", texto: etapa.plazoEsperado },
    ...(completo
      ? [
          {
            clave: "camino",
            Icono: ICONOS.camino,
            titulo: "Qué puede pasar después",
            texto: etapa.quePuedePasarDespues,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* **La misma piel que «Mi servicio».** Se abría con un bloque lila y
          cuatro tarjetas sueltas, y el equipo lo dijo mirándolo: al desplegar,
          la información se despega del resto del portal y cuesta seguir el hilo.
          Ahora son dos recuadros con la misma estructura que esa pantalla —un
          dibujo índigo, un título navy y el contenido adentro—, así abrir una
          fila no se siente como entrar a otro producto.

          Sin el nombre de la etapa: ya está en el título de la fila, a diez
          píxeles de distancia. Repetido y en cuerpo más grande, la persona lee
          dos veces lo mismo y la segunda parece otra cosa. */}
      <TarjetaDeSeccion Icono={ICONOS.etapa} titulo="En qué va">
        <p className="type-supporting leading-relaxed whitespace-pre-line text-muted-foreground">
          {etapa.mensajePrincipal}
        </p>
      </TarjetaDeSeccion>

      {/* Las respuestas van **de a dos y en cajitas**, igual que los beneficios
          del servicio. No son alternativas entre las que se elige una: son las
          partes de una misma explicación, y en dos columnas se ven todas de una
          mirada en vez de tener que bajar leyéndolas. */}
      <TarjetaDeSeccion Icono={ICONOS.tarea} titulo="Qué está pasando">
        <ul className="grid grid-cols-2 gap-2.5">
          {tarjetas.map((tarjeta, indice) => (
            <li
              key={tarjeta.clave}
              className={cn(
                "rounded-lg bg-surface-subtle p-3.5 ring-1 ring-border-subtle",
                // Con tres respuestas —las de una causa o una escritura, que no
                // llevan «qué puede pasar después»— la última se lleva las dos
                // columnas. Sola en su fila dejaba media reja vacía al lado, que
                // se lee como una tarjeta que falta.
                indice === tarjetas.length - 1 && tarjetas.length % 2 === 1 && "col-span-2",
              )}
            >
              <tarjeta.Icono
                className="size-[18px] shrink-0 text-primary"
                strokeWidth={1.9}
                aria-hidden
              />

              <h3 className="type-supporting mt-2 font-semibold text-brand-navy">
                {tarjeta.titulo}
              </h3>
              <p className="type-meta mt-1 leading-relaxed whitespace-pre-line text-muted-foreground">
                {tarjeta.texto}
              </p>
            </li>
          ))}
        </ul>
      </TarjetaDeSeccion>

      <RefuerzoDeUrgencia etapa={etapa} />
    </div>
  );
}

/**
 * El refuerzo verbal del nivel, al pie del detalle. Sin caja —una más acá abajo
 * se leería como una tarjeta más— pero en el color de su nivel, el mismo de la
 * pastilla que la persona vio arriba en la fila.
 */
function RefuerzoDeUrgencia({ etapa }: { etapa: Etapa }) {
  const { frase, Icono, color } = NIVELES[etapa.nivelUrgencia];

  return (
    <p
      className={`flex items-start gap-2 border-t border-border-subtle px-1 pt-4 type-supporting font-medium ${color}`}
    >
      <Icono className="mt-0.5 size-4 shrink-0" aria-hidden />
      {frase}
    </p>
  );
}
