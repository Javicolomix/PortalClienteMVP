import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import type { NivelUrgencia } from "./portal.types";

/**
 * El nivel de urgencia es lo que le dice al cliente si tiene que actuar o puede
 * quedarse tranquilo. Un solo tono por etapa: `mensaje` para cuando hay espacio
 * de sobra, `resumen` para la tarjeta del inicio.
 *
 * El color (`tinte`, `color`) lo usa solo el inicio, donde la fila del caso es
 * la única con color propio y ahí el verde significa algo. En «Estado de mi
 * caso» el mensaje va en gris: esa pantalla tiene un solo acento y es el bloque
 * de la etapa.
 */
export const NIVELES = {
  tranquilidad: {
    mensaje: "Tu caso está avanzando. Por ahora no hay nada urgente.",
    resumen: "No necesitas hacer nada",
    Icono: CheckCircle2,
    tinte: "bg-success/10",
    color: "text-success-strong",
  },
  atencion: {
    mensaje: "Hay algo que tenemos que revisar contigo.",
    resumen: "Hay algo que revisar",
    Icono: Info,
    tinte: "bg-info/10",
    color: "text-info",
  },
  urgente: {
    mensaje: "Necesitamos algo tuyo pronto.",
    resumen: "Necesitamos algo tuyo",
    Icono: AlertCircle,
    tinte: "bg-warning/10",
    color: "text-warning-strong",
  },
} as const satisfies Record<
  NivelUrgencia,
  {
    mensaje: string;
    resumen: string;
    Icono: typeof Info;
    tinte: string;
    color: string;
  }
>;
