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
 * **Las cinco tintas de las marcas: tonos tierra.**
 *
 * Azul polvo, salvia, arcilla, ciruela y terracota. Cumplen el mismo rol que la
 * serie de datos del sistema —distinguir categorías que no tienen orden entre
 * sí, que es el problema de cuatro martillos en una lista— pero apagadas: el
 * diseñador las eligió sobre la serie de Lexy y sobre otras cuatro candidatas
 * después de verlas todas con el banco entero encima.
 *
 * La razón es el equilibrio que la pantalla necesita. Siguen siendo cinco
 * colores que se distinguen a 22 píxeles, que es el tamaño real del dibujo en la
 * fila, y ninguno levanta la voz: en una pantalla sobre deudas, un naranja pleno
 * se lee como una alarma y una paleta pastel se lee como un juguete. Estos se
 * alejan de lo infantil sin volverse fríos, y sobre todo **no le quitan
 * protagonismo al nombre del acreedor**, que es lo que de verdad identifica la
 * causa.
 *
 * **No son tokens del sistema.** Van escritos a mano acá porque el tema de Lexy
 * no tiene una familia para esto: su serie de datos es más vívida, pensada para
 * gráficos y no para un dibujo al costado de un texto. Si el sistema incorpora
 * una escala apagada, estos cinco se reemplazan en este archivo y cambia todo el
 * portal de una vez.
 *
 * Van **enteros, sin aclarar**. Los de la serie había que bajarlos porque
 * gritaban; estos ya nacen bajos, y aclararlos los dejaba sin color.
 */
const TINTAS = [
  "#5b7c99", // azul polvo
  "#7a9471", // salvia
  "#c08552", // arcilla
  "#8a6a8f", // ciruela
  "#a8705f", // terracota
] as const;

/** El matiz de un hex, en vueltas de 0 a 1. */
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

const MATICES_DE_LAS_TINTAS = TINTAS.map(matizDe);

/** Distancia entre dos matices sobre el círculo, de 0 a 0,5. */
const distancia = (a: number, b: number): number => {
  const bruta = Math.abs(a - b);
  return Math.min(bruta, 1 - bruta);
};

/**
 * **De qué tinta se acerca más la marca.** Santander es rojo y cae en la
 * terracota; BancoEstado es azul y cae en el azul polvo. No es el Pantone del
 * logo —no puede serlo, son cinco tintas— pero conserva lo único que la persona
 * reconoce de lejos: de qué lado del círculo está.
 */
const masCercanoDeLasTintas = (matiz: number): number => {
  let elegido = 0;
  MATICES_DE_LAS_TINTAS.forEach((otro, indice) => {
    if (distancia(matiz, otro) < distancia(matiz, MATICES_DE_LAS_TINTAS[elegido])) elegido = indice;
  });
  return elegido;
};

/**
 * **El reparto de colores de una lista.** Devuelve un color por fila, mirando la
 * lista completa y no fila por fila, porque la regla que importa solo se puede
 * cumplir mirándolas juntas:
 *
 * 1. **Dos acreedores distintos nunca comparten color.** Ese es el trabajo del
 *    color acá. Los acreedores chilenos se agolpan en dos familias —los azules y
 *    los rojos— así que la marca solo dice **por cuál de los cinco empezar**: si
 *    ese ya está tomado, se corre al siguiente libre.
 * 2. **El mismo acreedor sí comparte color**, esté donde esté en la lista. Eso
 *    es lo que dice que dos causas son del mismo banco, y ahí lo que las separa
 *    es el rol, que va escrito.
 * 3. **Sin acreedor —las escrituras— la casilla sale de la caja.** No hay marca
 *    que respetar, así que la regla 1 reparte libre: dos escrituras del mismo
 *    tipo, que llevan el mismo dibujo y dicen lo mismo, quedan separadas.
 *
 * Con más de cinco cajas distintas en una lista los colores se repiten; para que
 * la repetición no caiga en vecinas, el reparto arranca de la casilla siguiente
 * a la última usada.
 */
const casillaDeLaClave = (clave: string): number => {
  let suma = 0;
  for (let i = 0; i < clave.length; i += 1) suma += clave.charCodeAt(i) * (i + 1);
  return suma % TINTAS.length;
};

/**
 * **La casilla de un tipo de escritura sale de lo que la escritura es**, no del
 * azar: una compraventa de inmueble es verde porque una casa es verde, y lo va a
 * ser en todas las cuentas y todos los meses. Un tipo que no esté acá cae en el
 * reparto y queda con un color estable igual, solo que sin significado.
 *
 * Los índices son los de `TINTAS`: 0 azul polvo, 1 salvia, 2 arcilla, 3 ciruela,
 * 4 terracota.
 */
const CASILLA_POR_TIPO: [RegExp, number][] = [
  [/inmueble|propiedad|departamento|casa|hipoteca/i, 1],
  [/veh[íi]culo|autom[óo]vil/i, 0],
  [/sociedad|empresa|acciones/i, 3],
  [/mandato|poder/i, 2],
  [/hereditari|herencia|conyugal|matrimonial|gananciales/i, 4],
];

export type ItemConColor = { claveDeColor: string; acreedor?: string };

export const coloresDeLaLista = (items: (ItemConColor | undefined)[]): string[] => {
  const porClave = new Map<string, number>();
  const usadas = new Set<number>();

  return items.map((item, fila) => {
    if (!item) return TINTAS[0];

    const asignada = porClave.get(item.claveDeColor);
    if (asignada !== undefined) return TINTAS[asignada];

    const marca = COLORES.find(([patron]) => item.acreedor && patron.test(item.acreedor));
    const porTipo = item.acreedor
      ? undefined
      : CASILLA_POR_TIPO.find(([patron]) => patron.test(item.claveDeColor));

    let casilla = marca
      ? masCercanoDeLasTintas(matizDe(marca[1]))
      : (porTipo?.[1] ?? casillaDeLaClave(item.claveDeColor));

    const anterior = fila > 0 ? porClave.get(items[fila - 1]?.claveDeColor ?? "") : undefined;
    for (let intento = 0; intento < TINTAS.length; intento += 1) {
      if (!usadas.has(casilla) && casilla !== anterior) break;
      casilla = (casilla + 1) % TINTAS.length;
    }

    porClave.set(item.claveDeColor, casilla);
    usadas.add(casilla);
    return TINTAS[casilla];
  });
};

/** Un color suelto, para las filas que no viven en una lista. */
export const colorDe = (item: ItemConColor): string => coloresDeLaLista([item])[0];
