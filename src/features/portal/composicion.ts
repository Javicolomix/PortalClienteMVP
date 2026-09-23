import type { Caja, ClaseDeEtapa, Etapa, Servicio, TipoServicio } from "./portal.types";

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
  /** La caja cuyo estado cuenta el bloque del caso, cuando ese bloque existe. */
  cajaDelCaso: Caja | null;
  /** Las causas que se muestran: ni monitoreo ni concursal. */
  juicios: Caja[];
  /** Las escrituras que se muestran: ni cajas madre ni gestiones abortadas. */
  escrituras: Caja[];
};

const EMBUDO = {
  renegociacion: (caja: Caja) => caja.tipo === "renegociacion",
  liquidacion: (caja: Caja) => caja.tipo === "liquidacion",
  juicio: (caja: Caja) => caja.tipo === "defensaEnJuicio",
  escrituras: (caja: Caja) => caja.tipo === "proteccionPatrimonial",
} as const;

/**
 * Cómo se lee la clase de la etapa de una caja. Si la etapa no está cargada, la
 * caja se trata como corriente: dejar de mostrar algo por un dato que falta es
 * peor que mostrarlo de más, porque la persona no tiene cómo enterarse.
 */
const claseDeLaCaja = (caja: Caja, etapas: Etapa[]): ClaseDeEtapa =>
  etapas.find((etapa) => etapa.id === caja.etapaId)?.clase ?? "corriente";

/**
 * **Cómo queda repartido el conjunto de cajas de una persona**, aplicadas todas
 * las exclusiones antes de decidir nada. Se separa de la decisión a propósito:
 * las reglas de qué servicio gana y de qué bloques salen leen de acá, así que
 * una caja excluida lo está en todas partes a la vez y no hay forma de que una
 * regla la cuente y otra no.
 */
function repartir(cajas: Caja[], etapas: Etapa[]) {
  const clase = (caja: Caja) => claseDeLaCaja(caja, etapas);

  const renegociacion = cajas.filter(EMBUDO.renegociacion);
  const liquidacion = cajas.filter(EMBUDO.liquidacion);

  // **Ni monitoreo ni concursal cuentan como juicio.** El monitoreo es la
  // vigilancia por defecto que Lexy le abre a todo el mundo, y la concursal es
  // una causa que el procedimiento concursal ya absorbió: ninguna de las dos es
  // algo que la persona tenga que seguir.
  const causas = cajas.filter(
    (caja) =>
      EMBUDO.juicio(caja) && clase(caja) !== "monitoreo" && clase(caja) !== "concursal",
  );
  const monitoreo = cajas.filter((caja) => EMBUDO.juicio(caja) && clase(caja) === "monitoreo");

  // **Dos exclusiones, las dos incondicionales.**
  //
  // Las **cajas madre** son el paraguas del servicio, no una gestión: debajo
  // cuelga la caja obrera donde está el trabajo real, y esa sí se lista. Se
  // reconocen por la etapa o por el rol, porque una caja madre puede avanzar de
  // etapa sin dejar de serlo.
  //
  // Las **gestiones abortadas** no se muestran nunca, tenga la persona una
  // escritura o cinco. Una gestión que no se hizo no es algo que seguir, y en
  // una lista de escrituras en marcha se lee como una que se quedó atrás. Que
  // la única caja de PP sea una abortada deja de ser un caso aparte: la lista
  // queda vacía y el servicio se descarta solo, que es exactamente lo que pide
  // la regla de «Solo monitoreo».
  const escrituras = cajas.filter(
    (caja) =>
      EMBUDO.escrituras(caja) &&
      clase(caja) !== "cajaMadre" &&
      clase(caja) !== "gestionAbortada" &&
      !caja.esCajaMadre,
  );

  return { clase, renegociacion, liquidacion, causas, monitoreo, escrituras };
}

type Reparto = ReturnType<typeof repartir>;

/** Renegociación queda descartada si su única caja está cerrada o derivada. */
const renegociacionCuenta = ({ renegociacion, clase }: Reparto): boolean => {
  if (renegociacion.length === 0) return false;
  if (renegociacion.length > 1) return true;
  const unica = clase(renegociacion[0]);
  return unica !== "archivada" && unica !== "aLiquidacion";
};

/**
 * **Paso 0: cuál es el servicio principal.** De acá salen tanto el nombre que
 * lleva el bloque A como qué bloque ocupa el lugar del estado del caso.
 *
 * El orden lo fijó operaciones y se recorre de arriba abajo, quedándose con el
 * primero que se cumple. Un servicio descartado por sus propias reglas no
 * bloquea a los que siguen: se salta y se sigue bajando.
 *
 * 1. **Renegociación**, salvo que su única caja esté archivada o derivada a
 *    liquidación.
 * 2. **Liquidación.**
 * 3. **Defensa en juicio con protección patrimonial**: causas reales y
 *    escrituras a la vez. Las dos pesan igual, ninguna es secundaria.
 * 4. **Defensa en juicio** con causas reales y sin escrituras.
 * 5. **Protección patrimonial**, si le queda alguna escritura después de sacar
 *    las cajas madre y las gestiones abortadas. Si no le queda ninguna, este
 *    paso no se cumple y la decisión sigue bajando —que es de dónde sale, sin
 *    ninguna regla aparte, el caso de quien tiene una sola caja de PP abortada
 *    y termina en «Solo monitoreo»—.
 * 6. **Defensa en juicio, solo monitoreo.** Es la única vez que la caja de
 *    monitoreo se mira: cuando no hay nada más que contar, lo que la persona
 *    tiene contratado es efectivamente la vigilancia.
 *
 * El `respaldo` es para quien todavía no tiene ninguna caja abierta: se usa lo
 * que figura contratado, que es lo único que se sabe de ella.
 */
function resolverServicioPrincipal(reparto: Reparto, respaldo: TipoServicio): TipoServicio[] {
  const { liquidacion, causas, monitoreo } = reparto;

  if (renegociacionCuenta(reparto)) return ["renegociacion"];
  if (liquidacion.length > 0) return ["liquidacion"];

  const hayEscrituras = reparto.escrituras.length > 0;
  if (causas.length > 0) {
    return hayEscrituras ? ["defensaEnJuicio", "proteccionPatrimonial"] : ["defensaEnJuicio"];
  }
  if (hayEscrituras) return ["proteccionPatrimonial"];
  if (monitoreo.length > 0) return ["defensaEnJuicio"];

  return [respaldo];
}

/**
 * Se mantiene para quien solo necesita el nombre del servicio y no la
 * composición entera —«Mi servicio», por ejemplo—.
 */
export function determinarServicioPrincipal(
  cajas: Caja[],
  etapas: Etapa[],
  respaldo: TipoServicio,
): TipoServicio[] {
  return resolverServicioPrincipal(repartir(cajas, etapas), respaldo);
}

/**
 * **De qué caja sale la etapa que cuenta el estado del caso.**
 *
 * Nunca se muestran dos etapas del mismo servicio concursal: el bloque del caso
 * cuenta una sola cosa, que es en qué va el procedimiento.
 *
 * En renegociación puede haber dos cajas, y ahí manda la que **no** está en
 * «Demandado»: esa segunda caja no es otra gestión, es un duplicado que Streak
 * crea cuando demandan a la persona. Mostrar su etapa sería contarle que su
 * renegociación está en «Demandado» cuando lo que está pasando es que le
 * llegó un juicio —y ese juicio ya se lo cuenta «Mis juicios», que es donde
 * corresponde—.
 */
const cajaQueCuentaElCaso = (candidatas: Caja[], clase: Reparto["clase"]): Caja | null =>
  candidatas.find((caja) => clase(caja) !== "demandado") ?? candidatas[0] ?? null;

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
 * 3. **Las listas solo aparecen si tienen algo que listar.** Una sección vacía
 *    al pie de una renegociación es ruido.
 */
export function componerInicio(
  cajas: Caja[],
  etapas: Etapa[],
  servicioContratado: TipoServicio,
): ComposicionDelInicio {
  const reparto = repartir(cajas, etapas);
  const servicioPrincipal = resolverServicioPrincipal(reparto, servicioContratado);
  const principal = servicioPrincipal[0];

  const juicios = ordenadas(reparto.causas);

  const escrituras = ordenadas(reparto.escrituras);

  // El estado del caso existe en los servicios que **son** un procedimiento
  // —renegociación y liquidación—, y en la Situación 1 de defensa en juicio, que
  // es la de quien solo tiene monitoreo. En protección patrimonial no existe: su
  // bloque propio es la lista de escrituras.
  const cajaDelCaso = (() => {
    if (principal === "renegociacion") {
      return cajaQueCuentaElCaso(reparto.renegociacion, reparto.clase);
    }
    if (principal === "liquidacion") return reparto.liquidacion[0] ?? null;
    if (principal === "defensaEnJuicio" && juicios.length === 0) {
      return reparto.monitoreo[0] ?? null;
    }
    return null;
  })();

  const bloques: BloqueDelInicio[] = ["servicio"];
  if (cajaDelCaso) bloques.push("caso");
  if (juicios.length > 0) bloques.push("juicios");
  if (escrituras.length > 0) bloques.push("escrituras");

  return { servicioPrincipal, bloques, cajaDelCaso, juicios, escrituras };
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
