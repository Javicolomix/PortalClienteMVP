/** Si el cliente debe actuar ya, revisar algo, o simplemente esperar tranquilo. */
export type NivelUrgencia = "tranquilidad" | "atencion" | "urgente";

export type RolContacto = "ejecutiva" | "abogado";

export type Cliente = {
  id: string;
  nombre: string;
  servicioId: string;
  etapaActualId: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  resumen: string;
  queEs: string;
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
};

/** Cada pantalla carga solo lo suyo: el inicio no baja el detalle de la etapa. */
export type DatosInicio = {
  cliente: Cliente;
  servicio: Servicio;
  /** Etapa del embudo único. En Litigios llega igual, como respaldo. */
  etapa: Etapa | null;
  /** Causas activas del cliente. Vacío en los servicios de embudo único. */
  causas: CausaConEtapa[];
  /** Protección Patrimonial, solo si el cliente la tiene y el servicio la admite. */
  proteccion: Etapa | null;
  configuracion: ConfiguracionPortal;
};

/** «Mis escrituras»: la lista completa de causas, cuando hay más de una. */
export type DatosMisEscrituras = {
  causas: CausaConEtapa[];
};

export type DatosMiCaso = {
  etapa: Etapa | null;
};

export type DatosMiEquipo = {
  cliente: Cliente;
  contactos: Contacto[];
  configuracion: ConfiguracionPortal;
};

export type DatosMiServicio = {
  servicio: Servicio;
  resultados: ResultadoServicio[];
};

export type DatosMisPagos = {
  cliente: Cliente;
  proximaCuota: Cuota | null;
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

/**
 * Una de las causas que el equipo lleva por un cliente de Litigios: una por
 * escritura o rol. En el sistema interno son las «cajas».
 */
export type Causa = {
  id: string;
  clienteId: string;
  /** Rol o número de escritura. La caja madre no tiene: no es un frente con avance propio. */
  rol: string | null;
  esCajaMadre: boolean;
  activa: boolean;
  etapaId: string;
};

/** Gestión de Protección Patrimonial, cuando el cliente la tiene contratada. */
export type GestionPatrimonial = {
  id: string;
  clienteId: string;
  activa: boolean;
  etapaId: string;
};

/** Una causa junto con la etapa en que va: es lo que el portal muestra de ella. */
export type CausaConEtapa = { causa: Causa; etapa: Etapa };
