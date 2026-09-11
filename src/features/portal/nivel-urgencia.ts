import { AlertCircle, Bell, CheckCircle2 } from "lucide-react";

import type { NivelUrgencia } from "./portal.types";

/**
 * El nivel de urgencia es lo único de la actualización que le dice al cliente
 * **qué hacer con lo que acaba de leer**. El título describe qué pasa
 * —«Esperando el atraso en tus deudas»— y el nivel dice si tiene que actuar o
 * puede quedarse tranquilo.
 *
 * La **`frase`** es lo que se ve con la fila cerrada, entera y con su icono. Se
 * probó en dos tiempos —una etiqueta de una palabra arriba y la frase guardada
 * para el desplegable— y se volvió atrás: la persona tenía que abrir la fila
 * para saber qué le tocaba hacer, que es justo lo que vino a averiguar.
 *
 * La **`etiqueta`** es esa misma palabra, y hoy solo la usa el panel del capitán
 * para nombrar cada nivel al elegirlo.
 *
 * Las tres frases y las tres etiquetas son **estándar y cerradas**: no las
 * escribe el equipo caso a caso, se eligen. Un nivel redactado libremente deja
 * de ser una señal comparable —dos etapas «urgentes» dirían cosas distintas— y
 * esto solo funciona si en toda la aplicación significa siempre lo mismo.
 *
 * Los colores son tokens del sistema y van en la rampa que se lee sola: **verde
 * → ámbar → rojo**. Cada nivel lleva dos: `tono` es el del punto, que va en el
 * color pleno porque es un relleno; `color` es el del texto, que va en la
 * variante `-strong` de verde y ámbar, porque el pleno sobre blanco no llega al
 * contraste que necesita una letra.
 *
 * El color nunca es la única señal: la pastilla dice la palabra y el refuerzo la
 * frase, las dos se entienden leídas.
 */
export const NIVELES = {
  tranquilidad: {
    etiqueta: "Tranquilo",
    frase: "No necesitas hacer nada por ahora.",
    Icono: CheckCircle2,
    color: "text-success-strong",
    tono: "success",
  },
  atencion: {
    etiqueta: "Atento",
    frase: "Puede que necesitemos alguna gestión de tu parte.",
    Icono: Bell,
    color: "text-warning-strong",
    tono: "warning",
  },
  urgente: {
    etiqueta: "Urgente",
    frase: "Necesitamos tu máxima atención y colaboración.",
    Icono: AlertCircle,
    color: "text-destructive",
    tono: "danger",
  },
} as const satisfies Record<
  NivelUrgencia,
  {
    etiqueta: string;
    frase: string;
    Icono: typeof Bell;
    color: string;
    /** El tono del punto de `StatusDot`, con los colores de estado del sistema. */
    tono: "success" | "warning" | "danger";
  }
>;
