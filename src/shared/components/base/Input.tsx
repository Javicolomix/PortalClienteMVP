import * as React from "react";

import { cn } from "@/shared/lib/utils/cn";

/**
 * **En el teléfono el texto va a 16 px, no a 14.** iOS hace zoom sobre cualquier
 * campo con letra menor a 16 px al enfocarlo, y ese zoom **no se deshace al
 * navegar**: la persona entraba al portal con la pantalla ampliada y todo
 * descolocado. Desde `md` vuelve a los 14 px del sistema, donde no hay teclado
 * que dispare el zoom.
 *
 * La otra salida —`maximum-scale=1` en el viewport— apaga el pellizco para
 * ampliar en toda la aplicación, y eso deja afuera a quien necesita ampliar para
 * leer. No es una opción en un portal que abre gente de cualquier edad.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "type-supporting text-base md:text-sm",
          "flex h-10 w-full rounded-control border border-input bg-background px-3 py-2 text-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none",
          "placeholder:text-muted-foreground",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "hover:border-muted-foreground/40",
          "focus-visible:border-primary",
          "aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:border-destructive",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
