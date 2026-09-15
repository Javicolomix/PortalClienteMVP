import type { ComposicionDelInicio } from "./composicion";

/** Si el cliente debe actuar ya, revisar algo, o simplemente esperar tranquilo. */
export type NivelUrgencia = "tranquilidad" | "atencion" | "urgente";

export type RolContacto = "ejecutiva" | "abogado";

export type Cliente = {
  id: string;
  /** Nombre de pila. Es con lo que se saluda: «Hola, Valentina». */
  nombre: string;
  /**
   * Apellido. El portal no lo muestra en ninguna pantalla —saludar por nombre y
   * apellido suena a carta del banco—, pero **sí va en los mensajes que salen
   * hacia el equipo**: WhatsApp y el correo del comprobante. Del otro lado hay
   * alguien que atiende a muchas personas y «soy Valentina» no ubica a nadie.
   */
  apellido: string;
  servicioId: string;
  etapaActualId: string;
};

/**
 * Cómo se presenta la persona cuando el mensaje sale del portal hacia el
 * equipo. Nunca se usa para hablarle a ella.
 */
export const nombreCompleto = (cliente: Pick<Cliente, "nombre" | "apellido">): string =>
  [cliente.nombre, cliente.apellido].filter(Boolean).join(" ");

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
 * Con qué se reconoce una caja entre varias, en dos piezas de peso distinto.
 *
 * **`principal` va primero y con tinta**, `secundario` detrás y en gris. En una
 * causa el principal es el **acreedor**, no el rol: la persona no recuerda el
 * número de un expediente, recuerda a quién le debe. El orden estaba al revés
 * —«Rol N.° C-4821-2026 · Banco Estado»— y litigios lo corrigió: el rol quedó,
 * porque es lo único que distingue dos causas del mismo banco, pero pasa atrás.
 *
 * En una escritura el principal es el tipo, que ya se lee en castellano, y no
 * hay secundario: en Streak no existe con qué distinguir dos del mismo tipo.
 * Ahí lo que las separa es la burbuja de color y la etapa de cada una.
 *
 * Es el rótulo de la fila, no su titular: lo que manda en la línea de abajo
 * sigue siendo la etapa.
 */
export type IdentidadDeCaja = {
  principal: string;
  secundario?: string;
  /**
   * De qué depende el color de la burbuja, que **no siempre es el texto que se
   * lee**. Los dos embudos necesitan cosas distintas:
   *
   * - En una **causa** la clave es el acreedor, así que dos causas del mismo
   *   banco salen del mismo color a propósito: son del mismo acreedor y eso es
   *   información. Lo que las separa es el rol, que va escrito al lado.
   * - En una **escritura** la clave es la caja. Dos compraventas de inmueble
   *   tienen el mismo texto, el mismo tipo y nada que las distinga —en Streak no
   *   existe ese dato—, así que una burbuja sacada del tipo les daría el mismo
   *   color y volvería a dejarlas como un dato repetido por error, que es
   *   exactamente lo que el color venía a resolver. Sacándola de la caja, las dos
   *   filas se separan aunque digan lo mismo.
   *
   * El color no significa nada por sí solo en ninguno de los dos casos: sirve
   * para distinguir y para agrupar, no para decir qué pasa. Lo que pasa lo dice
   * la pastilla de urgencia, y esa sí tiene significado fijo.
   */
  claveDeColor: string;
};

export const identidadDeLaCaja = (caja: Caja): IdentidadDeCaja | undefined => {
  if (caja.tipo !== "defensaEnJuicio") {
    return caja.identificador
      ? { principal: caja.identificador, claveDeColor: caja.id }
      : undefined;
  }

  const rol = caja.identificador ? `Rol N.° ${caja.identificador}` : undefined;
  if (caja.acreedor) {
    return { principal: caja.acreedor, secundario: rol, claveDeColor: caja.acreedor };
  }
  return rol ? { principal: rol, claveDeColor: caja.id } : undefined;
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
  /**
   * Quién ve los cobros en Lexy y por dónde se le escribe. Es **la misma persona
   * para todos los clientes**, a diferencia de la ejecutiva y el abogado, que
   * van por caso: por eso vive en la configuración y no en `contacto`.
   */
  nombreCobranza: string;
  telefonoCobranza: string;
};

export type Cuota = {
  id: string;
  clienteId: string;
  numero: number;
  /** ISO `aaaa-mm-dd`. Se formatea al mostrar, no se parsea como fecha. */
  fechaVencimiento: string;
  /** Pesos chilenos, entero. */
  monto: number;
  /**
   * `morosa` es una cuota que venció y no se pagó. Se separa de `pendiente`
   * porque el portal las trata distinto: la pendiente es la que toca pagar y va
   * destacada arriba; la morosa ya pasó y va en el historial, en rojo, para que
   * la persona vea por qué su saldo no cuadra.
   */
  estado: "pendiente" | "pagada" | "morosa";
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
  /**
   * Las cuotas cerradas —pagadas y morosas—, de la más reciente a la más
   * antigua, que es el orden en que se busca un pago.
   */
  historial: Cuota[];
  /** Todas las cuotas del plan. Es con lo que se cuenta cuánto falta. */
  cuotas: Cuota[];
  configuracion: ConfiguracionPortal;
};

/**
 * El avance del plan de pago: cuántas cuotas van, cuántas faltan y cuánta plata
 * es cada cosa. Sale de las cuotas, no de un campo aparte, porque un total que
 * se guarda por separado es un total que algún día no va a cuadrar con sus
 * partes.
 */
export type AvanceDelPlan = {
  total: number;
  pagadas: number;
  morosas: number;
  montoPagado: number;
  montoPorPagar: number;
  montoTotal: number;
};

export const avanceDelPlan = (cuotas: Cuota[]): AvanceDelPlan => {
  const pagadas = cuotas.filter((cuota) => cuota.estado === "pagada");
  const morosas = cuotas.filter((cuota) => cuota.estado === "morosa");
  const montoPagado = pagadas.reduce((suma, cuota) => suma + cuota.monto, 0);
  const montoTotal = cuotas.reduce((suma, cuota) => suma + cuota.monto, 0);

  return {
    total: cuotas.length,
    pagadas: pagadas.length,
    morosas: morosas.length,
    montoPagado,
    montoPorPagar: montoTotal - montoPagado,
    montoTotal,
  };
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
