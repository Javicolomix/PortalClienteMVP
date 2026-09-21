import type { Caja, Servicio, TipoServicio } from "./portal.types";

/**
 * Los cuatro bloques con que se arma el inicio. No hay una pantalla por
 * servicio: hay bloques que aparecen o no según lo que la persona tenga
 * contratado, y el inicio los compone.
 *
 * - `servicio`   — A. Qué contrató. Está siempre y no es interactivo.
 * - `caso`       — B. El estado de un único caso, desplegable en el lugar.
 * - `juicios`    — C. La lista de causas, cada una con su etapa.
 * - `escrituras` — D. La lista de escrituras, cada una con su etapa.
 */
export type BloqueDelInicio = "servicio" | "caso" | "juicios" | "escrituras";

export type ComposicionDelInicio = {
  /**
   * Uno, o los dos de «defensa en juicio con protección patrimonial», que es el
   * único servicio principal compuesto. Van en el orden en que se nombran.
   */
  servicioPrincipal: TipoServicio[];
  bloques: BloqueDelInicio[];
  /** Las causas que se muestran: las del embudo de juicio, sin las de monitoreo. */
  juicios: Caja[];
  /** Las escrituras que se muestran: todas las del embudo de escrituras. */
  escrituras: Caja[];
};

const esDelEmbudoDeJuicio = (caja: Caja) => caja.tipo === "defensaEnJuicio";
const esMonitoreo = (caja: Caja) => esDelEmbudoDeJuicio(caja) && caja.estado === "monitoreo";
const esDelEmbudoDeEscrituras = (caja: Caja) => caja.tipo === "proteccionPatrimonial";
const esCajaMadre = (caja: Caja) => esDelEmbudoDeEscrituras(caja) && caja.estado === "madre";
const esConcursal = (caja: Caja) =>
  caja.tipo === "renegociacion" || caja.tipo === "liquidacion";

/**
 * **Paso 0: cuál es el servicio principal.** Antes de decidir qué bloques se
 * muestran hay que resolver esto, porque de acá sale tanto el nombre que lleva
 * el bloque A como qué bloque ocupa el lugar del estado del caso.
 *
 * La regla que ordena todo lo demás: **una caja de monitoreo no cuenta**. En
 * Lexy toda persona queda con una caja de monitoreo en el embudo de juicio
 * ejecutivo, la contrate o no —es una vigilancia por defecto, no un juicio—, así
 * que tomarla como una caja real le cambiaría el servicio principal a casi
 * todo el mundo. La única vez que se mira es cuando es lo único que hay.
 *
 * El orden de la decisión:
 *
 * 1. **Renegociación o liquidación gana siempre.** Si la persona contrató una de
 *    las dos, ese es su servicio principal aunque además tenga juicios o
 *    escrituras: esos se suman abajo, no lo reemplazan.
 * 2. **Con causas reales, defensa en juicio** —y si además hay escrituras, el
 *    nombre compuesto: las dos cosas pesan igual, ninguna es secundaria de la otra.
 * 3. **Solo escrituras, protección patrimonial.**
 * 4. **Solo monitoreo, defensa en juicio.** Es el único caso en que la caja de
 *    monitoreo se evalúa: no hay nada más que contar, y lo que la persona tiene
 *    contratado es efectivamente la vigilancia.
 *
 * El `respaldo` es para la persona que todavía no tiene ninguna caja abierta: se
 * usa lo que figura contratado, que es lo único que se sabe de ella.
 */
export function determinarServicioPrincipal(
  cajas: Caja[],
  respaldo: TipoServicio,
): TipoServicio[] {
  const concursal = cajas.find(esConcursal);
  if (concursal) return [concursal.tipo];

  const hayCausas = cajas.some((caja) => esDelEmbudoDeJuicio(caja) && !esMonitoreo(caja));
  const hayEscrituras = cajas.some(esDelEmbudoDeEscrituras);

  if (hayCausas) {
    return hayEscrituras ? ["defensaEnJuicio", "proteccionPatrimonial"] : ["defensaEnJuicio"];
  }
  if (hayEscrituras) return ["proteccionPatrimonial"];
  if (cajas.some(esMonitoreo)) return ["defensaEnJuicio"];

  return [respaldo];
}

/**
 * Las listas van ordenadas por **lo que se lee arriba en la fila**, y no por el
 * orden en que vengan las cajas, por dos razones.
 *
 * La primera es que **dos escrituras del mismo tipo quedan juntas**. Así se leen
 * como lo que son —dos gestiones del mismo tipo, cada una con su bien y su
 * etapa— en vez de parecer un dato repetido por error cuando una tercera las
 * separa. Por eso la clave de una escritura es el tipo y no el identificador:
 * ordenar por patente las desparramaría justo cuando se busca compararlas.
 *
 * La segunda es que el orden no cambie entre una visita y otra. Una lista que se
 * reordena sola obliga a volver a leerla entera cada vez, y esta la abre alguien
 * que solo quiere ver si algo le pide algo.
 *
 * El identificador desempata: entre dos compraventas de vehículo manda la
 * patente, que es lo único distinto que hay escrito.
 */
const claveDeOrden = (caja: Caja) => `${caja.tipoDeEscritura ?? ""}\u0000${caja.identificador}`;

const ordenadas = (cajas: Caja[]): Caja[] =>
  [...cajas].sort((a, b) => claveDeOrden(a).localeCompare(claveDeOrden(b), "es-CL"));

/**
 * Decide qué bloques se muestran. Es una función pura: mismos datos, misma
 * composición. Vive separada de las pantallas para poder razonarla —y
 * corregirla— sin abrir un solo componente.
 *
 * Resuelto el servicio principal, los bloques salen solos:
 *
 * 1. **El bloque del servicio principal reemplaza al estado del caso.** Si la
 *    persona contrató defensa en juicio, su lista de causas ocupa el lugar del
 *    «estado de mi caso»; lo mismo la lista de escrituras en protección
 *    patrimonial. No conviven: sería el mismo dato contado dos veces.
 * 2. **Un servicio secundario nunca reemplaza nada, se suma abajo.** Quien tiene
 *    renegociación y además un juicio ve las dos cosas.
 * 3. **Monitoreo no entra en las listas.** Es una vigilancia por defecto, no una
 *    causa; en las listas solo agregaría un juicio que la persona no tiene.
 *    Cuando es lo único que hay, lo cuenta el estado del caso.
 * 4. **La caja madre de escrituras tampoco.** Es el paraguas del servicio, no una
 *    gestión: lo que la persona sigue son las cajas obreras que cuelgan de ella.
 *    Listarla sería anunciarle una escritura de más que no existe.
 */
export function componerInicio(
  cajas: Caja[],
  servicioContratado: TipoServicio,
): ComposicionDelInicio {
  const servicioPrincipal = determinarServicioPrincipal(cajas, servicioContratado);

  const juicios = ordenadas(cajas.filter((caja) => esDelEmbudoDeJuicio(caja) && !esMonitoreo(caja)));
  const escrituras = ordenadas(
    cajas.filter((caja) => esDelEmbudoDeEscrituras(caja) && !esCajaMadre(caja)),
  );

  // Que el estado del caso esté o no cuelga del **servicio principal**, no de si
  // las listas quedaron vacías. Se probó lo segundo y dejaba a quien contrató
  // escrituras y todavía no arranca ninguna con un «estado de mi caso» genérico
  // que no le correspondía: en protección patrimonial ese bloque no existe, ni
  // siquiera vacío.
  const muestraCaso = (() => {
    // Renegociación y liquidación son un solo caso, y ese bloque es lo que
    // cuenta en qué va. Los juicios y las escrituras se le suman abajo.
    if (servicioPrincipal[0] === "renegociacion" || servicioPrincipal[0] === "liquidacion") {
      return true;
    }
    // Protección patrimonial, sola o dentro del nombre compuesto: su bloque
    // propio es la lista de escrituras y nunca convive con el estado del caso.
    if (servicioPrincipal.includes("proteccionPatrimonial")) return false;
    // Defensa en juicio: el estado del caso queda solo en la Situación 1, la de
    // quien tiene únicamente monitoreo. Con causas reales manda la lista.
    return juicios.length === 0;
  })();

  // En protección patrimonial el bloque de escrituras es el servicio: está
  // aunque todavía no cuelgue ninguna gestión de la caja madre, y ahí dice que
  // no hay nada en marcha. Como bloque aditivo, en cambio, aparece solo si hay
  // algo que listar: una sección vacía al pie de una renegociación es ruido.
  const muestraEscrituras =
    escrituras.length > 0 || servicioPrincipal.includes("proteccionPatrimonial");

  const bloques: BloqueDelInicio[] = ["servicio"];
  if (muestraCaso) bloques.push("caso");
  if (juicios.length > 0) bloques.push("juicios");
  if (muestraEscrituras) bloques.push("escrituras");

  return { servicioPrincipal, bloques, juicios, escrituras };
}

/**
 * El nombre que lleva el bloque A. Con un solo servicio es su nombre tal cual;
 * con los dos, el nombre compuesto —«Defensa en juicio con Protección
 * Patrimonial»—, que es como Lexy nombra esa combinación.
 */
export const nombreDelServicioPrincipal = (servicios: Servicio[]): string =>
  servicios.map((servicio) => servicio.nombre).join(" con ");

/** Si un bloque entró en la composición. */
export const muestraBloque = (
  composicion: ComposicionDelInicio,
  bloque: BloqueDelInicio,
): boolean => composicion.bloques.includes(bloque);
