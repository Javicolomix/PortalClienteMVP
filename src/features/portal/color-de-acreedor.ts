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
 * **El color de la marca, traído al sistema.**
 *
 * Los colores corporativos vienen de veinticuatro manuales distintos y no se
 * hablan entre sí: el rojo de Santander es mucho más saturado que el azul de
 * BancoEstado, que es más oscuro que el celeste de Caja Los Andes. Puestos
 * crudos en una lista, cada fila pesa distinto y el conjunto se ve como un
 * mosaico de logos pegados encima de la pantalla, no como una pantalla.
 *
 * Así que de cada marca **se conserva el matiz y se descartan la saturación y la
 * luminosidad**, que pasan a ser las mismas para todas. El matiz es lo que la
 * persona reconoce —el rojo Santander sigue siendo rojo y el celeste de Los
 * Andes sigue siendo celeste—; la intensidad es lo que hacía que unas gritaran
 * más que otras.
 *
 * Los dos valores salen de la paleta de Lexy: 45 % de saturación y 68 % de luz es donde el
 * acento de marca se apoya sobre blanco sin pesar, y ahí entran todas. El resultado es que veinticuatro marcas ajenas se
 * ven como una familia, y esa familia se ve del sistema.
 */
const SATURACION = 0.45;
const LUMINOSIDAD = 0.68;

/** El matiz de un hex, en vueltas de 0 a 1. Lo único que se conserva. */
const matizDe = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((d) => parseInt(hex.slice(d, d + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const rango = max - min;

  if (rango === 0) return 0;
  if (max === r) return (((g - b) / rango) % 6) / 6;
  if (max === g) return ((b - r) / rango + 2) / 6;
  return ((r - g) / rango + 4) / 6;
};

const canal = (p: number, q: number, t: number): number => {
  const v = (t + 1) % 1;
  if (v < 1 / 6) return p + (q - p) * 6 * v;
  if (v < 1 / 2) return q;
  if (v < 2 / 3) return p + (q - p) * (2 / 3 - v) * 6;
  return p;
};

export const armonizar = (hex: string): string => {
  const h = matizDe(hex);
  const q = LUMINOSIDAD + SATURACION * Math.min(LUMINOSIDAD, 1 - LUMINOSIDAD);
  const p = 2 * LUMINOSIDAD - q;
  const rgb = [h + 1 / 3, h, h - 1 / 3].map((t) => Math.round(canal(p, q, t) * 255));

  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
