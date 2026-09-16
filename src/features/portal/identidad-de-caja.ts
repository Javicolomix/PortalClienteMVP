import {
  Building2,
  Car,
  FileSignature,
  FileText,
  House,
  KeyRound,
  type LucideIcon,
  ScrollText,
  ShieldCheck,
  Split,
} from "lucide-react";

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
 * El color va **en la marca y no en el círculo**. El círculo queda gris para
 * todas: cuatro discos de colores en fila pesan como cuatro semáforos y esta
 * pantalla ya tiene uno, que es el de urgencia. Teñir solo el dibujo alcanza
 * para distinguir y no le disputa la atención a la pastilla.
 *
 * Las cuatro tintas **evitan a propósito el verde, el ámbar y el rojo**, que en
 * esta pantalla ya significan algo. Si una marca saliera roja, la fila diría dos
 * cosas con el mismo color y una de las dos sería mentira.
 *
 * Son cuatro y no cinco porque **cuatro matices bien separados distinguen mejor
 * que cinco parecidos**. Con el reparto que evita repetir el de la fila de
 * arriba, alcanzan: lo que hay que distinguir es una fila de su vecina, no todas
 * entre sí.
 */
const TINTAS = [
  "#322d94", // índigo
  "#8f1a57", // magenta
  "#0d5077", // celeste
  "#33414f", // pizarra
] as const;

// El orden no es decorativo: cuando dos filas seguidas chocan, la de abajo se
// corre a la siguiente de esta lista. Por eso van alternadas —un azul, un
// magenta, un azul, un gris— y no agrupadas por familia: corriéndose una
// posición hay que caer en algo que se vea distinto, no en el primo del que ya
// estaba. Importa sobre todo en las escrituras, donde dos del mismo tipo llevan
// el mismo dibujo y el color es lo único que las separa.

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

export type TintaDeCaja = (typeof TINTAS)[number];

/**
 * Misma clave, misma tinta, siempre. Es una suma de códigos de carácter y no un
 * hash de verdad porque no hace falta: reparte cuatro tintas entre un puñado de
 * acreedores, no protege nada.
 */
const indiceDe = (clave: string): number => {
  let suma = 0;
  for (let i = 0; i < clave.length; i += 1) suma += clave.charCodeAt(i);
  return suma % TINTAS.length;
};

export const tintaDe = (clave: string): TintaDeCaja => TINTAS[indiceDe(clave)];

/**
 * Las tintas de una lista entera, con **una corrección que hace falta**: con
 * cinco tonos y un puñado de filas, dos seguidas caen de la misma tinta cada
 * tanto. Cuando eso pasa entre dos cajas distintas, la burbuja deja de hacer su
 * trabajo justo donde más se nota, que es entre vecinas.
 *
 * Así que la lista se recorre en orden con tres reglas, en este orden:
 *
 * 1. **Misma clave que la de arriba, misma tinta.** Dos causas del mismo banco
 *    tienen que salir iguales: eso es lo que dice que son del mismo acreedor, y
 *    ahí lo que las separa es el rol, que va escrito.
 * 2. **Mismo nombre que la de arriba, la tinta de al lado.** Dos compraventas de
 *    inmueble seguidas llevan el mismo dibujo y dicen lo mismo: la tinta es lo
 *    único que las separa, así que no se deja al azar.
 * 3. **Si no, la del reparto** —y si choca con la de arriba, la siguiente.
 *
 * El precio es que agregar una escritura puede correrle el color a la de abajo.
 * Se acepta: el color de una escritura no significa nada por sí solo —sirve para
 * separarla de su vecina— así que moverlo no le quita información a nadie. En
 * las causas no ocurre, porque ahí la tinta sale del acreedor y dos acreedores
 * distintos rara vez quedan pegados por azar; si quedan, se corre el de abajo y
 * el acreedor sigue escrito en la fila.
 */
export const tintasDeLaLista = (
  identidades: ({ principal: string; claveDeColor: string } | undefined)[],
): TintaDeCaja[] => {
  const indices: number[] = [];

  identidades.forEach((identidad, fila) => {
    if (!identidad) {
      indices.push(0);
      return;
    }

    const anterior = fila > 0 ? identidades[fila - 1] : undefined;
    const previo = fila > 0 ? indices[fila - 1] : undefined;

    // Misma clave que la de arriba: misma tinta, a propósito. Dos causas del
    // mismo banco tienen que salir iguales —eso es lo que dice que son del mismo
    // acreedor— y ahí lo que las separa es el rol, que va escrito.
    if (anterior && anterior.claveDeColor === identidad.claveDeColor && previo !== undefined) {
      indices.push(previo);
      return;
    }

    // Mismo nombre que la de arriba: la tinta de al lado, sin consultar el
    // reparto. Es el caso que trajo PP —dos compraventas de inmueble seguidas—,
    // y es el único donde la tinta hace todo el trabajo: llevan el mismo dibujo
    // y dicen lo mismo. Dejarlo al azar podía darles dos azules parecidos, que
    // es lo que pasó la primera vez.
    if (anterior && anterior.principal === identidad.principal && previo !== undefined) {
      indices.push((previo + 1) % TINTAS.length);
      return;
    }

    let indice = indiceDe(identidad.claveDeColor);
    if (previo !== undefined && indice === previo) indice = (indice + 1) % TINTAS.length;
    indices.push(indice);
  });

  return indices.map((indice) => TINTAS[indice]);
};

/**
 * **El dibujo de cada tipo de escritura.** Una casa para una compraventa de
 * inmueble, un auto para una de vehículo. Es lo que pidió el equipo de PP y es
 * mejor que las iniciales para este embudo: los tipos son cosas del mundo —una
 * casa, un auto, una sociedad— y se reconocen antes de leerse.
 *
 * Se resuelve **por palabra clave y no por el nombre exacto**, porque los tipos
 * los mantiene Streak y la lista va a crecer sin avisarnos. Un tipo nuevo que no
 * calce con ninguna cae en el documento genérico, que es un resultado correcto:
 * la fila sigue diciendo su nombre entero al lado.
 *
 * El orden importa. «Liquidación de Sociedad Conyugal» tiene que resolverse
 * antes que «sociedad» a secas, o una separación de bienes saldría con el icono
 * de una empresa.
 */
const ICONOS_DE_ESCRITURA: [RegExp, LucideIcon][] = [
  [/veh[íi]culo|autom[óo]vil/i, Car],
  [/inmueble|propiedad|departamento|casa/i, House],
  [/sociedad conyugal|separaci[óo]n de bienes/i, Split],
  [/sociedad|empresa|constituci[óo]n/i, Building2],
  [/hereditari|herencia|posesi[óo]n efectiva/i, ScrollText],
  [/bien familiar/i, ShieldCheck],
  [/usufructo/i, KeyRound],
  [/mandato|poder/i, FileSignature],
];

export const iconoDeEscritura = (tipo: string): LucideIcon => {
  const encontrado = ICONOS_DE_ESCRITURA.find(([patron]) => patron.test(tipo));
  return encontrado ? encontrado[1] : FileText;
};
