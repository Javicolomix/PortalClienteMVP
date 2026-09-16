/**
 * **La rampa: de índigo profundo a lavanda clara.**
 *
 * Las filas de una lista no se pintan de cinco colores sueltos sino de un
 * degradé: la primera arranca en el índigo más profundo de la marca y la última
 * llega a la lavanda más clara, con las del medio repartidas parejo. Con tres
 * causas salen tres pasos; con seis, seis.
 *
 * **Un degradé solo existe dentro de una familia.** Es la razón por la que la
 * rampa va en la línea índigo de Lexy y no en los tonos tierra: cinco matices
 * distintos no degradan, se turnan. Lo que se gana es que la lista se lee como
 * una sola pieza —y como una pieza de Lexy— en vez de como cuatro elementos que
 * comparten sitio.
 *
 * **Lo que se pierde hay que decirlo.** El color deja de significar quién
 * —Santander ya no es rojo— y deja de significar qué —una compraventa de
 * inmueble ya no es verde—. Pasa a significar **dónde**: en qué lugar de la
 * lista va esta fila. Eso lo hace bien: una lista de seis se recorre de arriba
 * abajo y el degradé acompaña esa lectura.
 */
const RAMPA = { desde: "#2e2a8f", hasta: "#b9aefd" } as const;

const canales = (hex: string) => [1, 3, 5].map((d) => parseInt(hex.slice(d, d + 2), 16));

const DESDE = canales(RAMPA.desde);
const HASTA = canales(RAMPA.hasta);

/**
 * El paso `indice` de una rampa de `total` pasos. Con una sola fila se usa el
 * medio: una lista de uno no es un degradé, y arrancarla en el extremo oscuro la
 * dejaba más pesada que una de tres.
 */
const pasoDeLaRampa = (indice: number, total: number): string => {
  const t = total <= 1 ? 0.5 : indice / (total - 1);
  const mezcla = DESDE.map((desde, canal) => Math.round(desde + (HASTA[canal] - desde) * t));

  return `#${mezcla.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

export type ItemConColor = { claveDeColor: string; acreedor?: string };

/**
 * El degradé de una lista entera. Mira la lista completa porque un degradé no se
 * puede calcular fila por fila: cada paso depende de cuántas filas hay.
 */
export const coloresDeLaLista = (items: (ItemConColor | undefined)[]): string[] =>
  items.map((_, fila) => pasoDeLaRampa(fila, items.length));

/** Un color suelto, para las filas que no viven en una lista. */
export const colorDe = (): string => pasoDeLaRampa(0, 1);
