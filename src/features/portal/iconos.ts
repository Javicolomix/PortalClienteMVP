import {
  Briefcase,
  CircleCheck,
  ClipboardCheck,
  Clock,
  CreditCard,
  Eraser,
  FileText,
  Flag,
  Handshake,
  House,
  Landmark,
  ListChecks,
  MessageCircle,
  Milestone,
  PhoneOff,
  Scale,
  Search,
  ShieldCheck,
  Signpost,
  Stamp,
  Star,
  Target,
  TrendingDown,
} from "lucide-react";

/**
 * Punto único donde el portal traduce una clave de icono a un dibujo.
 *
 * Los datos guardan la clave (`"escudo"`), nunca el componente: así el contenido
 * no depende de la librería de iconos. Cuando llegue el set propio de Lexy en
 * SVG, se reemplazan los valores de este mapa y cambia todo el portal de una vez
 * — ninguna pantalla importa un icono directamente para esto.
 *
 * Hoy los valores son de lucide, que es lineal y del mismo peso visual que el
 * set de Lexy, pero no es el set de Lexy.
 */
export const ICONOS = {
  // Resultados de un servicio
  acuerdo: Handshake,
  escudo: ShieldCheck,
  baja: TrendingDown,
  listo: CircleCheck,
  borron: Eraser,
  casa: House,
  balanza: Scale,
  reloj: Clock,
  lupa: Search,
  documento: FileText,
  silencio: PhoneOff,
  sello: Stamp,

  // Secciones del portal
  objetivo: Target,
  beneficios: ListChecks,
  equipo: Briefcase,
  tarea: ClipboardCheck,
  camino: Signpost,
  etapa: Milestone,
  mensaje: MessageCircle,
  pago: CreditCard,
  tribunal: Landmark,
  felicitacion: Star,
  reclamo: Flag,
} as const;

export type ClaveIcono = keyof typeof ICONOS;

/** Si el dato trae una clave que no conocemos, el portal no se cae: dibuja un documento. */
export function iconoPorClave(clave: string) {
  return ICONOS[clave as ClaveIcono] ?? ICONOS.documento;
}
