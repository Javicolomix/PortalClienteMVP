import { sesion } from "@/features/auth";
import { read } from "@/prototype/ports";

import { admiteProteccionPatrimonial } from "./estado-del-caso";
import type {
  Causa,
  CausaConEtapa,
  Cliente,
  ConfiguracionPortal,
  Contacto,
  Cuota,
  DatosInicio,
  DatosMiCaso,
  DatosMiEquipo,
  DatosMiServicio,
  DatosMisEscrituras,
  DatosMisPagos,
  Etapa,
  GestionPatrimonial,
  ResultadoServicio,
  Servicio,
} from "./portal.types";

async function cargarClienteEnSesion(): Promise<Cliente> {
  const clienteId = sesion.getSnapshot();
  if (!clienteId) throw new Error("No hay sesión iniciada.");

  const [cliente] = await read.load<Cliente[]>(
    "clienteEnSesion",
    { id: clienteId },
    {
      description: "Persona que abre el portal, con su servicio y la etapa en que va su caso",
      trigger: "Al abrir cualquier pantalla del portal",
      reads: {
        entities: ["cliente"],
        fields: ["cliente.nombre", "cliente.servicioId", "cliente.etapaActualId"],
      },
    },
  );

  if (!cliente) throw new Error("No encontramos el caso de la persona en sesión.");
  return cliente;
}

async function cargarConfiguracion(): Promise<ConfiguracionPortal> {
  const [configuracion] = await read.load<ConfiguracionPortal[]>(
    "configuracionDelPortal",
    undefined,
    {
      description: "Datos del portal iguales para todos: soporte, reclamos y medios de pago",
      trigger: "Al abrir el portal",
      reads: {
        entities: ["configuracionPortal"],
        fields: [
          "configuracionPortal.correoSoporte",
          "configuracionPortal.urlFormularioReclamos",
          "configuracionPortal.urlPagoEnLinea",
          "configuracionPortal.titularCuenta",
          "configuracionPortal.banco",
          "configuracionPortal.numeroCuenta",
          "configuracionPortal.rutTitular",
        ],
      },
    },
  );

  if (!configuracion) throw new Error("Falta la configuración del portal.");
  return configuracion;
}

/**
 * Las causas activas del cliente, cada una con la etapa en que va.
 *
 * Son dos cargas y un cruce en el portal. Para Desarrollo esto es **una sola
 * consulta con join**: acá se separa solo porque el adaptador de prototipo filtra
 * por igualdad exacta y no sabe pedir «las etapas de estos ids».
 */
async function cargarCausasDelCliente(clienteId: string): Promise<CausaConEtapa[]> {
  const causas = await read.load<Causa[]>(
    "causasActivasDelCliente",
    { clienteId, activa: true },
    {
      description: "Causas en curso del cliente, una por escritura o rol",
      trigger: "Al abrir el inicio o «Mis escrituras»",
      reads: {
        entities: ["causa"],
        fields: ["causa.rol", "causa.esCajaMadre", "causa.activa", "causa.etapaId"],
      },
    },
  );

  if (causas.length === 0) return [];

  const etapas = await read.load<Etapa[]>("etapasDeLasCausas", undefined, {
    description: "Etapa en que va cada causa del cliente",
    trigger: "Al abrir el inicio o «Mis escrituras»",
    reads: {
      entities: ["etapa"],
      fields: [
        "etapa.orden",
        "etapa.visibleParaCliente",
        "etapa.nombreParaCliente",
        "etapa.nivelUrgencia",
      ],
    },
  });

  const porId = new Map(etapas.map((etapa) => [etapa.id, etapa]));

  return causas.flatMap((causa) => {
    const etapa = porId.get(causa.etapaId);
    // Una causa sin etapa conocida no se muestra: es mejor no decir nada que
    // decir algo a medias sobre el caso de alguien.
    return etapa ? [{ causa, etapa }] : [];
  });
}

/**
 * La etapa de la gestión de Protección Patrimonial, si el cliente tiene una y su
 * servicio la admite. Sin datos no devuelve nada y el inicio no dibuja nada.
 */
async function cargarProteccionPatrimonial(
  clienteId: string,
  servicioId: string,
): Promise<Etapa | null> {
  if (!admiteProteccionPatrimonial(servicioId)) return null;

  const [gestion] = await read.load<GestionPatrimonial[]>(
    "gestionPatrimonialDelCliente",
    { clienteId, activa: true },
    {
      description: "Gestión de Protección Patrimonial del cliente, si tiene una en curso",
      trigger: "Al abrir el inicio",
      reads: {
        entities: ["gestionPatrimonial"],
        fields: ["gestionPatrimonial.activa", "gestionPatrimonial.etapaId"],
      },
    },
  );

  if (!gestion) return null;

  const [etapa] = await read.load<Etapa[]>(
    "etapaDeLaProteccionPatrimonial",
    { id: gestion.etapaId },
    {
      description: "Etapa en que va la Protección Patrimonial",
      trigger: "Al abrir el inicio",
      reads: {
        entities: ["etapa"],
        fields: ["etapa.visibleParaCliente", "etapa.nombreParaCliente", "etapa.nivelUrgencia"],
      },
    },
  );

  return etapa?.visibleParaCliente ? etapa : null;
}

/** Inicio: solo lo justo para saludar y anticipar si hay algo que hacer. */
export async function cargarInicio(): Promise<DatosInicio> {
  const cliente = await cargarClienteEnSesion();

  const [servicios, etapas, causas, proteccion, configuracion] = await Promise.all([
    read.load<Servicio[]>(
      "servicioEnInicio",
      { id: cliente.servicioId },
      {
        description: "Nombre y resumen del servicio contratado, para el destacado del inicio",
        trigger: "Al abrir el inicio",
        reads: { entities: ["servicio"], fields: ["servicio.nombre", "servicio.resumen"] },
      },
    ),
    read.load<Etapa[]>(
      "resumenDeLaEtapaEnInicio",
      { id: cliente.etapaActualId },
      {
        description: "Nombre y nivel de urgencia de la etapa, para adelantar si hay algo que hacer",
        trigger: "Al abrir el inicio",
        reads: {
          entities: ["etapa"],
          fields: ["etapa.visibleParaCliente", "etapa.nombreParaCliente", "etapa.nivelUrgencia"],
        },
      },
    ),
    cargarCausasDelCliente(cliente.id),
    cargarProteccionPatrimonial(cliente.id, cliente.servicioId),
    cargarConfiguracion(),
  ]);

  const servicio = servicios[0];
  if (!servicio) throw new Error("Falta el servicio contratado.");

  return { cliente, servicio, etapa: etapas[0] ?? null, causas, proteccion, configuracion };
}

/** «Mis escrituras»: la lista completa de causas en curso. */
export async function cargarMisEscrituras(): Promise<DatosMisEscrituras> {
  const cliente = await cargarClienteEnSesion();
  return { causas: await cargarCausasDelCliente(cliente.id) };
}

/** «¿En qué está mi caso?»: el contenido completo que escribió el capitán. */
export async function cargarMiCaso(): Promise<DatosMiCaso> {
  const cliente = await cargarClienteEnSesion();

  const etapas = await read.load<Etapa[]>(
    "etapaActualDelCaso",
    { id: cliente.etapaActualId },
    {
      description: "Contenido de la etapa en que está el caso, tal como lo escribió el capitán",
      trigger: "Al abrir «¿En qué está mi caso?»",
      reads: {
        entities: ["etapa"],
        fields: [
          "etapa.visibleParaCliente",
          "etapa.nombreParaCliente",
          "etapa.mensajePrincipal",
          "etapa.queHaceLexy",
          "etapa.queNecesitamosDelCliente",
          "etapa.quePuedePasarDespues",
          "etapa.plazoEsperado",
          "etapa.nivelUrgencia",
        ],
      },
    },
  );

  return { etapa: etapas[0] ?? null };
}

/** «Quiero conversar con mi equipo»: a quién le escribe y por dónde. */
export async function cargarMiEquipo(): Promise<DatosMiEquipo> {
  const cliente = await cargarClienteEnSesion();

  const [contactos, configuracion] = await Promise.all([
    read.load<Contacto[]>(
      "contactosDelCliente",
      { clienteId: cliente.id },
      {
        description: "Ejecutiva y abogado asignados al caso, para que el cliente les escriba",
        trigger: "Al abrir «Quiero conversar con mi equipo»",
        reads: {
          entities: ["contacto"],
          fields: ["contacto.nombre", "contacto.rol", "contacto.telefonoWhatsapp"],
        },
      },
    ),
    cargarConfiguracion(),
  ]);

  return { cliente, contactos, configuracion };
}

/** «Mis pagos»: la próxima cuota pendiente y por dónde pagarla. */
export async function cargarMisPagos(): Promise<DatosMisPagos> {
  const cliente = await cargarClienteEnSesion();

  const [cuotas, configuracion] = await Promise.all([
    read.load<Cuota[]>(
      "cuotasPendientesDelCliente",
      { clienteId: cliente.id, estado: "pendiente" },
      {
        description: "Cuotas de honorarios que el cliente todavía no ha pagado",
        trigger: "Al abrir «Mis pagos»",
        reads: {
          entities: ["cuota"],
          fields: ["cuota.numero", "cuota.fechaVencimiento", "cuota.monto", "cuota.estado"],
        },
      },
    ),
    cargarConfiguracion(),
  ]);

  // La próxima es la pendiente más antigua del plan.
  const proximaCuota = [...cuotas].sort((a, b) => a.numero - b.numero)[0] ?? null;

  return { cliente, proximaCuota, configuracion };
}

/** «¿Qué es mi servicio?»: la explicación y los resultados posibles. */
export async function cargarMiServicio(): Promise<DatosMiServicio> {
  const cliente = await cargarClienteEnSesion();

  const [servicios, resultados] = await Promise.all([
    read.load<Servicio[]>(
      "detalleDelServicio",
      { id: cliente.servicioId },
      {
        description: "Explicación del servicio contratado en lenguaje simple",
        trigger: "Al abrir «¿Qué es mi servicio?»",
        reads: { entities: ["servicio"], fields: ["servicio.nombre", "servicio.queEs"] },
      },
    ),
    read.load<ResultadoServicio[]>(
      "resultadosDelServicio",
      { servicioId: cliente.servicioId },
      {
        description: "Resultados que se pueden lograr con el servicio contratado",
        trigger: "Al abrir «¿Qué es mi servicio?»",
        reads: {
          entities: ["resultadoServicio"],
          fields: ["resultadoServicio.texto", "resultadoServicio.orden"],
        },
      },
    ),
  ]);

  const servicio = servicios[0];
  if (!servicio) throw new Error("Falta el servicio contratado.");

  return { servicio, resultados: [...resultados].sort((a, b) => a.orden - b.orden) };
}
