/**
 * **El color del martillo, sacado de la marca del acreedor.**
 *
 * La persona no reconoce su causa por el rol: reconoce a quién le debe, y el
 * color de esa marca lo tiene visto de la tarjeta, del cajero y de la sucursal.
 * Un martillo rojo Santander y uno celeste Caja Los Andes se separan antes de
 * leerse, que es lo que hace útil una lista de cuatro causas.
 *
 * Se resuelve **por palabra clave y no por el nombre exacto**, porque el nombre
 * llega escrito a mano en Streak: «Banco Estado», «BancoEstado», «Bco. Estado»
 * y «BANCOESTADO» tienen que dar todos el mismo azul. Y por eso mismo **el
 * orden importa**: «Cencosud Scotiabank» es un producto de Scotiabank y tiene
 * que resolverse antes que «Cencosud» a secas.
 *
 * Un acreedor que no esté en la lista **no queda sin color**: cae en el reparto
 * de tintas neutras de `identidad-de-caja`, que garantiza que dos filas vecinas
 * nunca salgan iguales. Es el comportamiento correcto para una lista que no
 * podemos cerrar —en Chile demanda cualquiera: bancos, cajas, retail,
 * cooperativas, factoring— y significa que agregar un acreedor nuevo acá es una
 * mejora, nunca un arreglo de algo roto.
 *
 * **De dónde salen los valores.** Tres están tomados de fuente: el rojo de
 * Santander (#EC0000, manual de marca), el azul de BancoEstado (#0257A0) y el
 * azul de Banco de Chile. El resto están sacados a ojo del logo que cada uno
 * publica, así que son una aproximación y no el valor del manual de marca de
 * cada empresa. Se pueden corregir uno por uno sin tocar nada más: esta tabla es
 * todo lo que hay.
 */
const COLORES: [RegExp, string][] = [
  // Bancos
  [/scotiabank/i, "#EC111A"],
  [/falabella|cmr/i, "#009640"],
  [/banco\s*estado|bancoestado/i, "#0257A0"],
  [/banco\s*de\s*chile|bancochile|edwards/i, "#003DA5"],
  [/santander/i, "#EC0000"],
  [/\bbci\b|cr[ée]dito e inversiones/i, "#002F6C"],
  [/ita[úu]/i, "#EC7000"],
  [/security/i, "#12294B"],
  [/\bbice\b/i, "#0B5EA8"],
  [/ripley/i, "#7D2A8C"],
  [/consorcio/i, "#003057"],
  [/internacional/i, "#0B4EA2"],

  // Cooperativas y cajas de compensación
  [/coopeuch/i, "#C8102E"],
  [/los\s*andes/i, "#00A0DF"],
  [/h[ée]roes/i, "#E4572E"],
  [/araucana/i, "#00843D"],
  [/18\s*de\s*septiembre/i, "#0057A8"],

  // Retail y financieras
  [/tricot/i, "#E4002B"],
  [/abc\s*din|abcdin/i, "#E2001A"],
  [/la\s*polar/i, "#E4007C"],
  [/hites/i, "#E30613"],
  [/tanner/i, "#E30613"],
  [/forum/i, "#003865"],
  [/cencosud|paris|jumbo/i, "#005BAA"],
];

/** El color de marca del acreedor, o nada si no lo tenemos. */
export const colorDeAcreedor = (acreedor?: string): string | undefined => {
  if (!acreedor) return undefined;
  return COLORES.find(([patron]) => patron.test(acreedor))?.[1];
};

/**
 * **El mismo color, muy aclarado.** El dibujo va en una versión pálida de la
 * marca —la mitad de camino hacia el blanco— y no en el color pleno.
 *
 * El pleno era demasiado: cuatro martillos saturados en fila competían con el
 * nombre del acreedor, que es lo que de verdad identifica la causa, y en una
 * pantalla sobre deudas un rojo Santander a plena intensidad se lee como una
 * alarma. Aclarado sigue diciendo de qué banco es —el matiz es lo que se
 * reconoce, no la intensidad— sin gritar.
 *
 * Se mezcla con blanco en vez de bajarle la opacidad porque el resultado no
 * depende de lo que haya detrás: la misma tinta sobre la tarjeta blanca y sobre
 * el lienzo gris.
 */
export const aclarar = (hex: string, haciaElBlanco = 0.5): string => {
  const canal = (desde: number) =>
    Math.round(parseInt(hex.slice(desde, desde + 2), 16) * (1 - haciaElBlanco) + 255 * haciaElBlanco);

  const [r, g, b] = [1, 3, 5].map(canal);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
