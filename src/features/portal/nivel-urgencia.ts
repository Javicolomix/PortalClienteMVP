import { AlertCircle, Bell, CheckCircle2 } from "lucide-react";

import type { NivelUrgencia } from "./portal.types";

/**
 * El nivel de urgencia es lo único de la actualización que le dice al cliente
 * **qué hacer con lo que acaba de leer**. El título describe qué pasa
 * —«Esperando el atraso en tus deudas»— y el nivel dice si le toca actuar o no.
 *
 * La **`etiqueta`** es la palabra que va en la pastilla de cada fila, y nombra
 * **cuánta acción se le pide a la persona**, no cómo debería sentirse. Antes
 * decían «Tranquilo», «Atento» y «Urgente», y litigios lo objetó con razón: dos
 * de las tres le indicaban un estado de ánimo a alguien que está siendo
 * demandado. Que nadie le pida nada hoy no lo deja tranquilo, y el portal no
 * está en posición de decirle que lo esté. «Sin acción» dice lo mismo que
 * «Tranquilo» pretendía decir —no tienes que hacer nada— sin opinar sobre la
 * persona.
 *
 * La **`frase`** es el refuerzo al pie del detalle, cuando la fila se abre.
 *
 * El **`queSignifica`** es la explicación de la leyenda: tres palabras sueltas
 * no se entienden a primera vista, y el equipo lo vio en la reunión. La leyenda
 * vive junto al título de cada bloque y explica los tres niveles de una vez.
 *
 * Los tres niveles son **estándar y cerrados**: no los escribe el equipo caso a
 * caso, se eligen. Un nivel redactado libremente deja de ser una señal
 * comparable —dos etapas «urgentes» dirían cosas distintas— y esto solo
 * funciona si en toda la aplicación significa siempre lo mismo.
 *
 * Los colores van en la rampa que se lee sola: **verde → ámbar → rojo**. Cada
 * nivel lleva tres: `tono` es el de la pastilla, `punto` el del semáforo que va
 * dentro de ella —relleno pleno, que es lo que hace que se lea de lejos— y
 * `color` el del texto, en la variante `-strong` de verde y ámbar porque el
 * pleno sobre blanco no llega al contraste que necesita una letra.
 *
 * El color nunca es la única señal: la pastilla dice la palabra y el refuerzo la
 * frase, las dos se entienden leídas.
 */
export const NIVELES = {
  tranquilidad: {
    etiqueta: "Sin acción",
    frase: "No necesitas hacer nada por ahora.",
    queSignifica: "Avanzamos nosotros. No hay nada pendiente de tu parte.",
    Icono: CheckCircle2,
    color: "text-success-strong",
    tono: "success",
    punto: "bg-success-strong",
    hablado: "Sin acción de tu parte",
    avisa: false,
  },
  atencion: {
    etiqueta: "Atención",
    frase: "Puede que necesitemos alguna gestión de tu parte.",
    queSignifica: "Es probable que te pidamos un documento o un dato en los próximos días.",
    Icono: Bell,
    color: "text-warning-strong",
    tono: "warning",
    punto: "bg-warning-strong",
    hablado: "Requiere tu atención",
    avisa: true,
  },
  urgente: {
    etiqueta: "Urgente",
    frase: "Necesitamos tu máxima atención y colaboración.",
    queSignifica: "Hay algo que solo puedes hacer tú, y tu caso no avanza hasta que lo hagas.",
    Icono: AlertCircle,
    color: "text-destructive",
    tono: "danger",
    punto: "bg-destructive",
    hablado: "Urgente",
    avisa: true,
  },
} as const satisfies Record<
  NivelUrgencia,
  {
    etiqueta: string;
    frase: string;
    queSignifica: string;
    Icono: typeof Bell;
    color: string;
    /** El tono de la pastilla, con los colores de estado del sistema. */
    tono: "success" | "warning" | "danger";
    /** El relleno del punto del semáforo que va dentro de la pastilla. */
    punto: string;
    /**
     * Lo que oye quien no ve la franja. El color no puede ser la única señal, y
     * acá es la única que hay en la fila cerrada: la frase entera solo aparece al
     * desplegar.
     */
    hablado: string;
    /**
     * Si la fila cerrada lleva aviso. **Solo avisan los dos niveles que piden
     * algo.** Marcar también el tranquilo convertía la lista en un semáforo: con
     * los tres pintados había que interpretar el color para descubrir que no
     * pasaba nada, y una cartera entera en orden se veía tan cargada como una
     * que arde. Sin marca, el silencio es la buena noticia.
     */
    avisa: boolean;
  }
>;

/** Los tres, en el orden del semáforo. Lo usa la leyenda. */
export const NIVELES_EN_ORDEN = ["tranquilidad", "atencion", "urgente"] as const;
