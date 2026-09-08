import { sesion } from "@/features/auth";
import { read } from "@/prototype/ports";

import type {
  Cliente,
  ConfiguracionPortal,
  Contacto,
  Cuota,
  DatosInicio,
  DatosMiCaso,
  DatosMiEquipo,
  DatosMiServicio,
  DatosMisPagos,
  Etapa,
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

/** Inicio: solo lo justo para saludar y anticipar si hay algo que hacer. */
export async function cargarInicio(): Promise<DatosInicio> {
  const cliente = await cargarClienteEnSesion();

  const [servicios, etapas, configuracion] = await Promise.all([
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
    cargarConfiguracion(),
  ]);

  const servicio = servicios[0];
  if (!servicio) throw new Error("Falta el servicio contratado.");

  return { cliente, servicio, etapa: etapas[0] ?? null, configuracion };
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
