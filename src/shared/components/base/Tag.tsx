import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils/cn";

const tagVariants = cva("inline-flex select-none items-center gap-1 border font-medium", {
  variants: {
    tone: {
      gray: "border-border bg-secondary text-secondary-foreground",
      brand: "border-primary/20 bg-primary/10 text-primary",
      // Los tres tonos de estado van con el relleno al doble de densidad que el
      // tinte de kit por defecto, y el borde en la variante oscura del propio
      // color en vez del color pleno. Con el tinte al 10 % y el borde claro, una
      // etiqueta de estado se lee como un pastel genérico y no como una señal;
      // el texto ya iba en la variante `-strong`, así que el relleno flojo era
      // lo único que la dejaba blanda.
      success: "border-success-strong/25 bg-success/20 text-success-strong",
      warning: "border-warning-strong/25 bg-warning/25 text-warning-strong",
      danger: "border-destructive/35 bg-destructive/15 text-destructive",
    },
    shape: {
      square: "rounded",
      rounded: "rounded-full",
    },
    size: {
      // `xs` lo agregó el Portal Cliente: la etiqueta de nivel de urgencia va
      // dentro de una fila, al lado de un título de 16 px, y a `sm` (24 px de
      // alto) pesaba más que el texto al que acompaña. Una etiqueta que no es lo
      // principal de su fila necesita quedar por debajo de la altura de la letra.
      //
      // Lo que se achica es la caja —18 px de alto, no 20—, no la letra: a 11 px
      // ya está en el mínimo con que se puede leer una etiqueta de estado, y esta
      // pantalla la lee alguien preocupado con el teléfono en la mano.
      xs: "h-[18px] px-2 type-meta text-[11px]",
      sm: "h-6 px-2 type-meta",
      md: "h-7 px-2.5 type-supporting",
      lg: "h-8 px-3 type-body",
    },
  },
  defaultVariants: { tone: "gray", shape: "square", size: "sm" },
});

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">, VariantProps<typeof tagVariants> {
  removable?: boolean;
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone, shape, size, removable, onRemove, children, className, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(tagVariants({ tone, shape, size }), className)} {...props}>
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Quitar"
          className="-mr-0.5 inline-flex cursor-pointer items-center justify-center rounded-button opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
});
Tag.displayName = "Tag";

export { Tag, tagVariants };
