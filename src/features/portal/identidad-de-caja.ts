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
 * Son **tres, y las tres se ven como un color**. Hubo una cuarta, un gris
 * azulado, y con el martillo igual en todas las causas la tinta pasó a ser lo
 * único que varía en la marca: un martillo gris parecía sin pintar al lado de
 * uno índigo, como si a esa fila le faltara algo. Tres matices que se distinguen
 * alcanzan, porque lo que hay que separar es una fila de su vecina, no todas
 * entre sí — y de eso se encarga el reparto de abajo.
 */
const TINTAS = [
  "#322d94", // índigo
  "#8f1a57", // magenta
  "#0d5077", // celeste
] as const;

// El orden no es decorativo: cuando dos filas seguidas chocan, la de abajo se
// corre a la siguiente de esta lista. Por eso van alternadas —un azul, un
// magenta, un azul, un gris— y no agrupadas por familia: corriéndose una
// posición hay que caer en algo que se vea distinto, no en el primo del que ya
// estaba. Importa sobre todo en las escrituras, donde dos del mismo tipo llevan
// el mismo dibujo y el color es lo único que las separa.

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
 * Las tintas de una lista entera, repartidas mirando la lista completa y no fila
 * por fila. Con tres tintas y cuatro filas, dejarlo al azar daba tres martillos
 * del mismo color en la misma pantalla, y ahí la tinta deja de decir nada.
 *
 * Las reglas, en este orden:
 *
 * 1. **Misma clave, misma tinta, esté donde esté en la lista.** Dos causas del
 *    mismo banco tienen que salir iguales: eso es lo que dice que son del mismo
 *    acreedor, y ahí lo que las separa es el rol, que va escrito.
 * 2. **Una clave nueva prefiere una tinta que nadie haya usado**, y nunca la de
 *    la fila de arriba. Con tres acreedores distintos salen tres colores
 *    distintos, que es lo que la tinta viene a decir.
 * 3. **Si ya no quedan libres**, la que toque por reparto, corrida si choca con
 *    la de arriba: dos vecinas iguales es lo único que no puede pasar.
 *
 * El precio es que abrir una causa nueva puede correrle la tinta a otra. Se
 * acepta: desde que las causas llevan todas el mismo martillo, **lo que
 * identifica una fila es el nombre del acreedor**, que va en grande arriba. La
 * tinta acompaña, no nombra.
 */
export const tintasDeLaLista = (
  identidades: ({ principal: string; claveDeColor: string } | undefined)[],
): TintaDeCaja[] => {
  const porClave = new Map<string, number>();
  const usadas = new Set<number>();
  const indices: number[] = [];

  identidades.forEach((identidad, fila) => {
    if (!identidad) {
      indices.push(0);
      return;
    }

    const yaAsignada = porClave.get(identidad.claveDeColor);
    if (yaAsignada !== undefined) {
      indices.push(yaAsignada);
      return;
    }

    const previa = fila > 0 ? indices[fila - 1] : undefined;
    let indice = indiceDe(identidad.claveDeColor);

    // Primero una libre que no repita la de arriba; si no hay ninguna libre,
    // basta con que no repita la de arriba.
    for (let vuelta = 0; vuelta < TINTAS.length; vuelta += 1) {
      if (!usadas.has(indice) && indice !== previa) break;
      indice = (indice + 1) % TINTAS.length;
    }
    if (indice === previa) indice = (indice + 1) % TINTAS.length;

    porClave.set(identidad.claveDeColor, indice);
    usadas.add(indice);
    indices.push(indice);
  });

  return indices.map((indice) => TINTAS[indice]);
};

