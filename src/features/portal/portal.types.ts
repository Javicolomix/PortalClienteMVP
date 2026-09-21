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
  /** Como se titula solo: «Renegociación de deudas». */
  nombre: string;
  /**
   * Cómo se titula la pantalla del servicio: «La Renegociación». Lleva su
   * artículo y su mayúscula, porque es un titular y no un fragmento de frase.
   *
   * Es otro campo y no una transformación del nombre porque no hay regla que
   * lleve de uno al otro: «Renegociación de deudas» se titula «La
   * Renegociación», que es media frase menos, y «Defensa en juicio» se titula
   * «La Defensa en Juicio», que sube una mayúscula. Cualquier intento de
   * derivarlo termina escribiendo «La Renegociación de deudas».
   */
  nombreEnFrase: string;
  resumen: string;
  queEs: string;
};

/**
 * El titular de «Mi servicio»: «La Defensa en Juicio con Protección
 * Patrimonial». Al segundo servicio se le cae el artículo —«con Protección
 * Patrimonial», no «con La Protección Patrimonial»—, que es lo único que hay que
 * hacer para unirlos.
 */
const SIN_ARTICULO = /^(la|el|los|las)\s+/i;

export const servicioEnFrase = (servicios: Servicio[]): string => {
  const [primero, ...resto] = servicios.map((servicio) => servicio.nombreEnFrase);
  if (!primero) return "tu servicio";

  const cola = resto.map((nombre) => nombre.replace(SIN_ARTICULO, ""));
  return [primero, ...cola].join(" con ");
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
   * **Qué distingue esta caja de otra del mismo tipo.** Sale de la columna
   * «identificador» de Streak: en juicio ejecutivo es el ROL de la causa
   * («C-1234-2026»); en escrituras públicas, lo que identifica el bien o la
   * gestión —la patente del auto, el rol de avalúo del inmueble, el nombre de
   * la sociedad—. Vacío cuando la caja es la única y no hay de qué
   * distinguirla.
   *
   * No dice **qué es** la caja: eso lo dice `tipoDeEscritura` en las escrituras
   * y el acreedor en las causas. Antes este campo cargaba las dos cosas —el rol
   * en un embudo y el tipo de escritura en el otro— y por eso dos compraventas
   * de vehículo se veían idénticas: lo único escrito era lo que tenían en
   * común.
   */
  identificador: string;
  /**
   * De qué es la escritura: «Compraventa de Vehículo», «Constitución de
   * Sociedades». Solo en el embudo de escrituras públicas, y es lo que elige el
   * dibujo de la fila.
   */
  tipoDeEscritura?: string;
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
 * En una escritura el principal es el tipo, que ya se lee en castellano, y el
 * secundario es el identificador del bien: la patente del auto, el rol del
 * inmueble, el nombre de la sociedad. Es el mismo reparto que en una causa —qué
 * es arriba, cuál de todas debajo— y resuelve lo que antes no tenía respuesta:
 * dos compraventas de vehículo se veían idénticas, con el tipo repetido y nada
 * que dijera de cuál auto era cada una.
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
   * - En una **escritura** la clave es el tipo, así que dos compraventas de
   *   inmueble salen del mismo verde. Se probó al revés —una tinta por caja, para
   *   separarlas— y el diseñador lo corrigió: el color de una escritura tiene que
   *   decir de qué es, no cuál de dos es. Lo que separa dos del mismo tipo es la
   *   etapa, que es la línea que manda en la fila.
   *
   * El color no significa nada por sí solo en ninguno de los dos casos: sirve
   * para distinguir y para agrupar, no para decir qué pasa. Lo que pasa lo dice
   * la pastilla de urgencia, y esa sí tiene significado fijo.
   */
  claveDeColor: string;
};

export const identidadDeLaCaja = (caja: Caja): IdentidadDeCaja | undefined => {
  if (caja.tipo !== "defensaEnJuicio") {
    // El identificador va **sin rótulo**, tal como viene de Streak. En esa
    // columna cabe una patente, un rol de avalúo o el nombre de una sociedad, y
    // cualquier palabra que le pusiéramos delante —«Patente», «Rol»— sería la
    // correcta para un tipo de escritura y falsa para los otros.
    if (caja.tipoDeEscritura) {
      return {
        principal: caja.tipoDeEscritura,
        secundario: caja.identificador || undefined,
        claveDeColor: caja.tipoDeEscritura,
      };
    }

    return caja.identificador
      ? { principal: caja.identificador, claveDeColor: caja.identificador }
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
  /**
   * **Quién atiende durante esta etapa**, de los dos roles que tiene un caso.
   * No es lo mismo en todo el proceso: mientras se juntan papeles atiende la
   * ejecutiva y cuando el asunto está en el tribunal atiende el abogado, así
   * que el capitán lo fija por etapa y puede cambiar dentro del mismo caso.
   */
  contactoPrincipal: RolContacto;
  /**
   * **La liquidación está detenida a la espera de algo.** Cubre las dos etapas
   * que Lexy llama «Mediata» y «En espera»: el caso es viable pero todavía no
   * parte, y mientras tanto lo único que se mueve del lado de la persona es el
   * juicio o la escritura que tenga abiertos.
   *
   * Solo tiene sentido en el embudo de liquidación; en los demás va en `false`.
   * De esto depende que el panel de WhatsApp ofrezca **un contacto o dos** —ver
   * `contactos-visibles.ts`—, así que no es un dato de adorno: mal marcado deja
   * a alguien con un juicio andando sin a quién escribirle por el juicio.
   */
  liquidacionEnEspera: boolean;
  nivelUrgencia: NivelUrgencia;
};

export type Contacto = {
  id: string;
  clienteId: string;
  nombre: string;
  rol: RolContacto;
  /**
   * **De qué servicio es esta persona.** Una misma persona puede tener abogado
   * de liquidación y abogada de defensa en juicio al mismo tiempo, y cuando el
   * panel ofrece los dos hay que poder distinguirlos: sin esto, dos filas con
   * «Tu abogado» obligan a adivinar cuál atiende qué.
   */
  servicioTipo: TipoServicio;
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
   * El WhatsApp de finanzas: por dónde se reclama un cobro. Es **el mismo para
   * todos los clientes**, a diferencia de la ejecutiva y el abogado, que van por
   * caso, y por eso vive en la configuración y no en `contacto`.
   *
   * Va el número y no el nombre de quien atiende. El portal nombra el **cargo**
   * —«nuestra ejecutiva de finanzas»— y no a la persona: el cargo es lo que no
   * cambia, así que el texto sigue siendo cierto el día que finanzas la lleve
   * otra persona.
   */
  telefonoFinanzas: string;
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
  /** El nombre del servicio, compuesto cuando son dos. */
  nombre: string;
  /** «la liquidación»: la mitad variable del título de la pantalla. */
  enFrase: string;
};

export type DatosMisPagos = {
  cliente: Cliente;
  proximaCuota: Cuota | null;
  /**
   * Todas las cuotas del plan, en el orden del plan. Es con lo que se cuenta
   * cuánto falta y lo que muestra el historial.
   */
  cuotas: Cuota[];
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
