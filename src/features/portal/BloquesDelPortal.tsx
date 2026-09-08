import type { ReactNode } from "react";

import type { ICONOS } from "./iconos";

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
  rotulo: "text-[#534ab7]",
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
    <section className="flex gap-3 rounded-lg bg-card p-4 ring-1 ring-border-subtle">
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
