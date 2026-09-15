/**
 * **La burbuja de color que identifica cada caja en su lista.**
 *
 * Nace de un problema concreto que el equipo vio en la reunión: cuando alguien
 * tiene dos escrituras del mismo tipo —dos compraventas de inmueble— o dos
 * causas del mismo acreedor, las filas se leen como un dato repetido por error.
 * Lo único que las distingue es la etapa, y eso hay que leerlo; la burbuja las
 * separa antes de leer.
 *
 * La clave es **de qué se reconoce la caja**: el acreedor en una causa, el tipo
 * de escritura en una gestión de protección patrimonial. Dos causas del mismo
 * banco comparten burbuja a propósito —son del mismo acreedor, y eso es
 * información, no un choque—; ahí lo que las separa es el rol, que va escrito.
 *
 * El color sale de la clave y no del orden en la lista, así que **no cambia**
 * entre una visita y otra ni cuando se abre una causa nueva. Una lista que se
 * recolorea sola obliga a volver a aprenderla cada vez.
 *
 * Los cuatro tonos **evitan a propósito el verde, el ámbar y el rojo**, que en
 * esta pantalla ya significan algo: son los del nivel de urgencia. Si una
 * burbuja saliera roja, la fila diría dos cosas con el mismo color y una de las
 * dos sería mentira.
 *
 * Son cuatro y no cinco porque **cuatro matices bien separados distinguen mejor
 * que cinco parecidos**. La primera versión tenía cinco tintes al 5 % y dos de
 * ellos —un índigo y un gris azulado— se veían iguales en una burbuja de 32
 * píxeles, que es justo el tamaño en que tienen que funcionar. Con el reparto
 * que evita repetir el tono de la fila de arriba, cuatro alcanzan: lo que hay
 * que distinguir es una fila de su vecina, no todas entre sí.
 */
const TONOS = [
  { fondo: "#cfcbf6", texto: "#322d94" }, // índigo
  { fondo: "#bfdef5", texto: "#0d5077" }, // celeste
  { fondo: "#f7c3dd", texto: "#8f1a57" }, // magenta
  { fondo: "#d2dae3", texto: "#33414f" }, // pizarra
] as const;

/**
 * Palabras que no aportan a las iniciales. «Compraventa de Inmueble» tiene que
 * dar CI y no CD: el «de» no distingue nada, y si entrara, casi todas las
 * escrituras empezarían igual.
 */
const SIN_VALOR = new Set(["de", "del", "la", "las", "los", "el", "y", "e", "en"]);

/** Dos letras con que se reconoce la caja: «Banco Estado» → BE, «Mandato» → MA. */
export const inicialesDe = (clave: string): string => {
  const palabras = clave
    .split(/\s+/)
    .filter((palabra) => palabra.length > 0 && !SIN_VALOR.has(palabra.toLowerCase()));

  if (palabras.length === 0) return clave.slice(0, 2).toUpperCase();
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
};

export type TonoDeCaja = (typeof TONOS)[number];

/**
 * Misma clave, mismo tono, siempre. Es una suma de códigos de carácter y no un
 * hash de verdad porque no hace falta: reparte cuatro tonos entre un puñado de
 * acreedores, no protege nada.
 */
const indiceDe = (clave: string): number => {
  let suma = 0;
  for (let i = 0; i < clave.length; i += 1) suma += clave.charCodeAt(i);
  return suma % TONOS.length;
};

export const tonoDe = (clave: string): TonoDeCaja => TONOS[indiceDe(clave)];

/**
 * Los tonos de una lista entera, con **una corrección que hace falta**: con
 * cinco tonos y un puñado de filas, dos seguidas caen del mismo color cada
 * tanto. Cuando eso pasa entre dos cajas distintas, la burbuja deja de hacer su
 * trabajo justo donde más se nota, que es entre vecinas.
 *
 * Así que la lista se recorre en orden y, si una fila sale del mismo tono que la
 * de arriba, se corre al siguiente. Con una excepción que es todo el asunto:
 * **si comparten clave, comparten tono**. Dos causas del mismo banco tienen que
 * salir iguales —eso es lo que dice que son del mismo acreedor— y ahí lo que las
 * separa es el rol, que va escrito.
 *
 * El precio es que agregar una escritura puede correrle el color a la de abajo.
 * Se acepta: el color de una escritura no significa nada por sí solo —sirve para
 * separarla de su vecina— así que moverlo no le quita información a nadie. En
 * las causas no ocurre, porque ahí el tono sale del acreedor y dos acreedores
 * distintos rara vez quedan pegados por azar; si quedan, se corre el de abajo y
 * el acreedor sigue escrito en la fila.
 */
export const tonosDeLaLista = (claves: (string | undefined)[]): TonoDeCaja[] => {
  const indices: number[] = [];

  claves.forEach((clave, fila) => {
    if (clave === undefined) {
      indices.push(0);
      return;
    }

    const anterior = fila > 0 ? claves[fila - 1] : undefined;
    if (anterior !== undefined && anterior === clave) {
      indices.push(indices[fila - 1]);
      return;
    }

    let indice = indiceDe(clave);
    if (fila > 0 && indice === indices[fila - 1]) indice = (indice + 1) % TONOS.length;
    indices.push(indice);
  });

  return indices.map((indice) => TONOS[indice]);
};
