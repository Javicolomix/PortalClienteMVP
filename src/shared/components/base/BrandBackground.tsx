import * as React from "react";

import { cn } from "@/shared/lib/utils/cn";

import fondoGrainient from "./assets/backgrounds/lexy-fondo-1.webp";
import fondoCubosNavy from "./assets/backgrounds/lexy-fondo-2.webp";
import fondoCubosIndigoOscuro from "./assets/backgrounds/lexy-fondo-3.webp";
import fondoCubosIndigo from "./assets/backgrounds/lexy-fondo-4.webp";
import fondoCubosLavanda from "./assets/backgrounds/lexy-fondo-5.webp";
import fondoCubosBlanco from "./assets/backgrounds/lexy-fondo-6.webp";
import fondoCubosMagenta from "./assets/backgrounds/lexy-fondo-7.webp";
import fondoCubosTeal from "./assets/backgrounds/lexy-fondo-8.webp";
import fondoAspasNavy from "./assets/backgrounds/lexy-fondo-9.webp";
import fondoAspasIndigoOscuro from "./assets/backgrounds/lexy-fondo-10.webp";
import fondoAspasIndigo from "./assets/backgrounds/lexy-fondo-11.webp";
import fondoAspasLavanda from "./assets/backgrounds/lexy-fondo-12.webp";
import fondoAspasBlanco from "./assets/backgrounds/lexy-fondo-13.webp";
import fondoAspasMagenta from "./assets/backgrounds/lexy-fondo-14.webp";
import fondoAspasTeal from "./assets/backgrounds/lexy-fondo-15.webp";
import fondoAspaEsquina from "./assets/backgrounds/lexy-fondo-16.webp";

/**
 * Motivo del fondo (manual de marca, sección 05. Fondos):
 *  - `cubos`: trama isométrica de cubos pequeños — la más sobria, para
 *    superficies con texto encima.
 *  - `aspas`: trama de aspas (isotipo) grandes — más expresiva.
 *  - `grainient`: gradiente lavanda/índigo con grano — solo en lavanda.
 *  - `aspa-esquina`: aspa gigante en la esquina inferior derecha — solo en
 *    lavanda, para portadas.
 */
export type BrandBackgroundMotif = "cubos" | "aspas" | "grainient" | "aspa-esquina";

/** Tono de la trama; aplica a `cubos` y `aspas`. */
export type BrandBackgroundTone =
  "navy" | "indigo-oscuro" | "indigo" | "lavanda" | "blanco" | "magenta" | "teal";

const tonedMap: Record<"cubos" | "aspas", Record<BrandBackgroundTone, string>> = {
  cubos: {
    navy: fondoCubosNavy,
    "indigo-oscuro": fondoCubosIndigoOscuro,
    indigo: fondoCubosIndigo,
    lavanda: fondoCubosLavanda,
    blanco: fondoCubosBlanco,
    magenta: fondoCubosMagenta,
    teal: fondoCubosTeal,
  },
  aspas: {
    navy: fondoAspasNavy,
    "indigo-oscuro": fondoAspasIndigoOscuro,
    indigo: fondoAspasIndigo,
    lavanda: fondoAspasLavanda,
    blanco: fondoAspasBlanco,
    magenta: fondoAspasMagenta,
    teal: fondoAspasTeal,
  },
};

export interface BrandBackgroundProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> {
  motif?: BrandBackgroundMotif;
  /** Solo `cubos` y `aspas`; `grainient` y `aspa-esquina` son lavanda. */
  tone?: BrandBackgroundTone;
  /**
   * Atenuación 0–1: funde la trama hacia el color de fondo del contenedor
   * (que debe llevar el tono correspondiente, p. ej. `bg-brand-navy`).
   * 0 = imagen plena; 0.9 = trama apenas insinuada, para texto encima.
   */
  dim?: number;
}

/**
 * Fondo de marca decorativo (imagen del manual). Llena a su contenedor con
 * `object-cover`; lo usual es montarlo absoluto detrás del contenido:
 *
 *   <section className="relative isolate overflow-hidden">
 *     <BrandBackground className="absolute inset-0" />
 *     <div className="relative">…</div>
 *   </section>
 */
const BrandBackground = React.forwardRef<HTMLImageElement, BrandBackgroundProps>(
  ({ motif = "cubos", tone = "navy", dim = 0, className, style, ...props }, ref) => {
    const src =
      motif === "grainient"
        ? fondoGrainient
        : motif === "aspa-esquina"
          ? fondoAspaEsquina
          : tonedMap[motif][tone];
    const clampedDim = Math.min(Math.max(dim, 0), 1);
    return (
      <img
        ref={ref}
        src={src}
        alt=""
        aria-hidden="true"
        className={cn("h-full w-full object-cover", className)}
        style={clampedDim > 0 ? { opacity: 1 - clampedDim, ...style } : style}
        {...props}
      />
    );
  },
);
BrandBackground.displayName = "BrandBackground";

export { BrandBackground };
