import type { ComposicionDelInicio } from "./composicion";

/** Si el cliente debe actuar ya, revisar algo, o simplemente esperar tranquilo. */
export type NivelUrgencia = "tranquilidad" | "atencion" | "urgente";

export type RolContacto = "ejecutiva" | "abogado";

export type Cliente = {
  id: string;
  nombre: string;
  servicioId: string;
  etapaActualId: string;
};

/**
 * Los cuatro servicios que puede tener contratados una persona. El portal se
 * arma distinto según cuál sea el principal, así que el tipo es un dato, no algo
 * que se deduzca del nombre ni del identificador.
 */
export type TipoServicio =
  | "renegociacion"
  | "liquidacion"
  | "defensaEnJuicio"
  | "proteccionPatrimonial";

export type Servicio = {
  id: string;
  tipo: TipoServicio;
  nombre: string;
  resumen: string;
  queEs: string;
};

/**
 * Qué papel juega la caja dentro de su embudo. Dos de los tres valores son cajas
 * que **existen pero no se listan**, cada una por su razón:
 *
 * - `monitoreo` — la vigilancia por defecto del embudo de juicio ejecutivo. Toda
 *   persona de Lexy queda con una, la contrate o no, y **no representa un juicio
 *   real**: por eso no entra en la lista de causas y no cuenta al resolver el
 *   servicio principal, salvo cuando es lo único que la persona tiene.
 * - `madre` — la caja paraguas del embudo de escrituras públicas: la que dice
 *   que contrató protección patrimonial. **No es una gestión**, así que no se
 *   lista; las gestiones son las cajas obreras que cuelgan de ella. Sí cuenta
 *   para saber que el servicio está contratado.
 * - `activa` — la caja que sí es un asunto que informar: una causa, una gestión
 *   de escritura, la renegociación o la liquidación.
 */
export type EstadoCaja = "monitoreo" | "madre" | "activa";

/**
 * Una **caja** es cada caso que la persona tiene abierto con Lexy —lo que en
 * Streak es una tarjeta—. Una persona puede tener varias a la vez: su servicio
 * principal, más juicios y más escrituras de protección patrimonial.
 *
 * El `tipo` dice en qué embudo de Streak vive: renegociación, liquidación,
 * juicio ejecutivo (`defensaEnJuicio`) o escrituras públicas
 * (`proteccionPatrimonial`). Con el conjunto de cajas de la persona se resuelve
 * su servicio principal — ver `determinarServicioPrincipal`.
 *
 * Cada caja va por su propia etapa: dos juicios de la misma persona pueden estar
 * en momentos distintos.
 */
export type Caja = {
  id: string;
  clienteId: string;
  tipo: TipoServicio;
  estado: EstadoCaja;
  /**
   * Cómo reconoce la persona esta caja entre varias: el ROL de la causa
   * («C-1234-2026») en juicio ejecutivo, el tipo de escritura en escrituras
   * públicas. Vacío cuando es la única.
   */
  identificador: string;
  /**
   * Quién demandó, solo en las causas: «Banco Estado», «Coopeuch». Va junto al
   * ROL y no en su lugar — el rol identifica el expediente, el acreedor es el
   * que la persona reconoce.
   */
  acreedor?: string;
  etapaId: string;
};

/**
 * Cómo se rotula una caja en su lista. En una causa el ROL solo no le dice nada
 * a nadie: lo que la persona reconoce es a quién le debe, así que van los dos
 * juntos —«Rol N.° C-4821-2026 · Banco Estado»—. En una escritura basta el tipo,
 * que ya se lee en castellano.
 *
 * Es el rótulo de la fila, no su titular: lo que manda arriba es la etapa.
 */
export const rotuloDeLaCaja = (caja: Caja): string | undefined => {
  if (caja.tipo !== "defensaEnJuicio") return caja.identificador || undefined;

  const partes = [caja.identificador ? `Rol N.° ${caja.identificador}` : "", caja.acreedor ?? ""];
  return partes.filter(Boolean).join(" · ") || undefined;
};

export type ResultadoServicio = {
  id: string;
  servicioId: string;
  orden: number;
  /** Titular corto de la tarjeta: el resultado en dos o tres palabras. */
  titulo: string;
  texto: string;
  /** Clave del icono, no el icono: la traduce `iconoPorClave`. */
  icono: string;
};

/** Los 7 campos que el capitán completa por etapa, más su orden en el proceso. */
export type Etapa = {
  id: string;
  servicioId: string;
  orden: number;
  visibleParaCliente: boolean;
  nombreParaCliente: string;
  mensajePrincipal: string;
  queHaceLexy: string;
  queNecesitamosDelCliente: string;
  quePuedePasarDespues: string;
  plazoEsperado: string;
  nivelUrgencia: NivelUrgencia;
};

export type Contacto = {
  id: string;
  clienteId: string;
  nombre: string;
  rol: RolContacto;
  telefonoWhatsapp: string;
};

export type ConfiguracionPortal = {
  id: string;
  correoSoporte: string;
  urlFormularioReclamos: string;
  /** Ficha de Google de Lexy Deudor, abierta en el formulario de reseña. */
  urlResenasGoogle: string;
  urlPagoEnLinea: string;
  titularCuenta: string;
  banco: string;
  numeroCuenta: string;
  rutTitular: string;
};

export type Cuota = {
  id: string;
  clienteId: string;
  numero: number;
  /** ISO `aaaa-mm-dd`. Se formatea al mostrar, no se parsea como fecha. */
  fechaVencimiento: string;
  /** Pesos chilenos, entero. */
  monto: number;
  estado: "pendiente" | "pagada";
  /** Cuándo se pagó, ISO `aaaa-mm-dd`. Solo en las pagadas. */
  fechaPago?: string;
};

/** Una caja con la etapa en que va, que es lo que la lista muestra de ella. */
export type CajaConEtapa = {
  caja: Caja;
  etapa: Etapa | null;
};

/** Cada pantalla carga solo lo suyo: el inicio no baja el detalle de la etapa. */
export type DatosInicio = {
  cliente: Cliente;
  /**
   * El servicio principal ya resuelto. Es una lista porque «defensa en juicio
   * con protección patrimonial» son dos servicios al mismo nivel.
   */
  serviciosPrincipales: Servicio[];
  etapa: Etapa | null;
  configuracion: ConfiguracionPortal;
  /** Qué bloques toca mostrar, ya resuelto por `componerInicio`. */
  composicion: ComposicionDelInicio;
  juicios: CajaConEtapa[];
  escrituras: CajaConEtapa[];
  /** A quién escribirle desde el botón flotante. */
  contactos: Contacto[];
};

export type DatosMiCaso = {
  etapa: Etapa | null;
};

export type DatosMiEquipo = {
  cliente: Cliente;
  contactos: Contacto[];
  configuracion: ConfiguracionPortal;
};

/** Un servicio con lo que se puede lograr con él: lo que muestra «Mi servicio». */
export type ServicioConResultados = {
  servicio: Servicio;
  resultados: ResultadoServicio[];
};

export type DatosMiServicio = {
  /**
   * El servicio principal ya resuelto: uno, o los dos de «defensa en juicio con
   * protección patrimonial», que se explican los dos porque los dos se
   * contrataron.
   */
  servicios: ServicioConResultados[];
  /** El nombre que titula la pantalla, compuesto cuando son dos. */
  nombre: string;
};

export type DatosMisPagos = {
  cliente: Cliente;
  proximaCuota: Cuota | null;
  /** Las cuotas ya pagadas, de la más reciente a la más antigua. */
  historial: Cuota[];
  configuracion: ConfiguracionPortal;
};

/** Una etapa está lista para publicarse solo si sus seis textos están escritos. */
export const etapaEstaCompleta = (etapa: Etapa): boolean =>
  [
    etapa.nombreParaCliente,
    etapa.mensajePrincipal,
    etapa.queHaceLexy,
    etapa.queNecesitamosDelCliente,
    etapa.quePuedePasarDespues,
    etapa.plazoEsperado,
  ].every((texto) => texto.trim().length > 0);
