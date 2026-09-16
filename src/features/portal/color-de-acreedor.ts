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
 * Un acreedor que no esté en la lista **no queda sin color**: el reparto de más
 * abajo le da uno libre, separado de todos los demás de la lista. Es el
 * comportamiento correcto para una lista que no podemos cerrar —en Chile demanda cualquiera: bancos, cajas, retail,
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
 * más que otras. 45 % de saturación y 68 % de luz es donde el acento de marca se
 * apoya sobre blanco sin pesar, y ahí entran todas.
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
  if (max === r) return (((g - b) / rango + 6) % 6) / 6;
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

/** Un matiz, vestido con la saturación y la luz del sistema. */
const armonizar = (h: number): string => {
  const q = LUMINOSIDAD + SATURACION * Math.min(LUMINOSIDAD, 1 - LUMINOSIDAD);
  const p = 2 * LUMINOSIDAD - q;
  const rgb = [h + 1 / 3, h, h - 1 / 3].map((t) => Math.round(canal(p, q, t) * 255));

  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/**
 * **El reparto de colores de una lista.** Devuelve un color por fila, mirando la
 * lista completa y no fila por fila, porque la regla que importa solo se puede
 * cumplir mirándolas juntas:
 *
 * 1. **Dos acreedores distintos nunca comparten color.** Ese es el trabajo del
 *    color acá. Los acreedores chilenos se agolpan en dos familias —los azules y
 *    los rojos— y con la saturación bajada para que todo combine, Santander y
 *    Coopeuch salían del mismo rojo y BancoEstado del mismo azul que Caja Los
 *    Andes. El matiz de marca es la **preferencia**, no la última palabra: si
 *    cae demasiado cerca de uno ya repartido, se corre hasta separarse.
 * 2. **El mismo acreedor sí comparte color**, esté donde esté en la lista. Eso
 *    es lo que dice que dos causas son del mismo banco, y ahí lo que las separa
 *    es el rol, que va escrito.
 * 3. **Sin acreedor —las escrituras— el matiz sale de la caja.** No hay marca
 *    que respetar, así que la regla 1 reparte libre: dos escrituras del mismo
 *    tipo, que llevan el mismo dibujo y dicen lo mismo, quedan separadas.
 *
 * Correrse cuesta poco: lo que la persona reconoce es que su causa del banco rojo
 * es una y la del banco azul es otra, no el Pantone exacto de cada logo.
 */
const SEPARACION_MINIMA = 0.11;
const PASO = 0.037;

/** Distancia entre dos matices sobre el círculo, de 0 a 0,5. */
const distancia = (a: number, b: number): number => {
  const bruta = Math.abs(a - b);
  return Math.min(bruta, 1 - bruta);
};

const separar = (preferido: number, repartidos: number[]): number => {
  const libre = (matiz: number) =>
    repartidos.every((otro) => distancia(matiz, otro) >= SEPARACION_MINIMA);

  if (libre(preferido)) return preferido;

  for (let vuelta = 1; vuelta * PASO < 1; vuelta += 1) {
    for (const lado of [1, -1]) {
      const candidato = (preferido + lado * vuelta * PASO + 1) % 1;
      if (libre(candidato)) return candidato;
    }
  }

  // Con más acreedores que lugares en el círculo ya no hay cómo separarlos.
  // Pasa sobre las nueve causas de acreedores distintos, que no es un caso real.
  return preferido;
};

/** Misma clave, mismo matiz. No es un hash de verdad: reparte un círculo. */
const matizDeLaClave = (clave: string): number => {
  let suma = 0;
  for (let i = 0; i < clave.length; i += 1) suma += clave.charCodeAt(i) * (i + 1);
  return (suma % 360) / 360;
};

export type ItemConColor = { claveDeColor: string; acreedor?: string };

export const coloresDeLaLista = (items: (ItemConColor | undefined)[]): string[] => {
  const porClave = new Map<string, number>();
  const repartidos: number[] = [];

  return items.map((item) => {
    if (!item) return armonizar(0);

    const asignado = porClave.get(item.claveDeColor);
    if (asignado !== undefined) return armonizar(asignado);

    const marca = COLORES.find(([patron]) => item.acreedor && patron.test(item.acreedor));
    const preferido = marca ? matizDe(marca[1]) : matizDeLaClave(item.claveDeColor);
    const matiz = separar(preferido, repartidos);

    porClave.set(item.claveDeColor, matiz);
    repartidos.push(matiz);
    return armonizar(matiz);
  });
};

/** Un color suelto, para las filas que no viven en una lista. */
export const colorDe = (item: ItemConColor): string => coloresDeLaLista([item])[0];
