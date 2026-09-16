import { sesion } from "@/features/auth";
import { read } from "@/prototype/ports";

import { componerInicio, determinarServicioPrincipal, nombreDelServicioPrincipal } from "./composicion";
import type {
  Caja,
  CajaConEtapa,
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
import { servicioEnFrase } from "./portal.types";

/**
 * La persona de la sesión, o ninguna.
 *
 * Si el id guardado **no corresponde a nadie**, la sesión se cierra antes de
 * fallar. Pasa cada vez que cambia el set de datos —un cliente que se retira
 * deja a quien lo tenía abierto apuntando a alguien que ya no está— y sin esto
 * el portal mostraba «No pudimos cargar esta información. Revisa tu conexión»,
 * que manda a revisar justo lo que no tiene nada que ver: la persona reintenta,
 * vuelve a fallar y no hay forma de salir de ahí más que apretar «Salir» de
 * pura intuición. Con la sesión cerrada, `RutaProtegida` lleva al acceso, que
 * es la pantalla donde esto sí se arregla: entrando de nuevo.
 */
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
        fields: [
          "cliente.nombre",
          "cliente.apellido",
          "cliente.servicioId",
          "cliente.etapaActualId",
        ],
      },
    },
  );

  if (!cliente) {
    sesion.cerrar();
    throw new Error("La sesión apuntaba a un caso que ya no existe.");
  }

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
 * Junta cada caja con la etapa en que va. Las etapas se piden todas de una vez y
 * después se reparten: pedir una por caja sería una llamada por juicio.
 */
async function conSusEtapas(cajas: Caja[], todas: Etapa[]): Promise<CajaConEtapa[]> {
  const porId = new Map(todas.map((etapa) => [etapa.id, etapa]));
  return cajas.map((caja) => ({ caja, etapa: porId.get(caja.etapaId) ?? null }));
}

/** Inicio: solo lo justo para saludar y anticipar si hay algo que hacer. */
export async function cargarInicio(): Promise<DatosInicio> {
  const cliente = await cargarClienteEnSesion();

  const [servicios, etapas, configuracion, cajas, contactos] = await Promise.all([
    read.load<Servicio[]>(
      "serviciosDelCatalogo",
      undefined,
      {
        description:
          "Nombre de cada servicio de Lexy. El inicio toma el del servicio principal, que puede ser uno o la combinación de dos",
        trigger: "Al abrir el inicio",
        reads: { entities: ["servicio"], fields: ["servicio.tipo", "servicio.nombre"] },
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
    read.load<Caja[]>(
      "cajasDelCliente",
      { clienteId: cliente.id },
      {
        description:
          "Todos los casos abiertos de la persona. Con estos se decide qué bloques arman su inicio",
        trigger: "Al abrir el inicio",
        reads: {
          entities: ["caja"],
          fields: [
            "caja.tipo",
            "caja.estado",
            "caja.identificador",
            "caja.acreedor",
            "caja.etapaId",
          ],
        },
      },
    ),
    read.load<Contacto[]>(
      "contactosParaElBotonDeWhatsapp",
      { clienteId: cliente.id },
      {
        description: "Ejecutiva y abogado asignados, para el botón flotante de WhatsApp",
        trigger: "Al abrir el inicio",
        reads: {
          entities: ["contacto"],
          fields: ["contacto.nombre", "contacto.rol", "contacto.telefonoWhatsapp"],
        },
      },
    ),
  ]);

  const contratado = servicios.find((candidato) => candidato.id === cliente.servicioId);
  if (!contratado) throw new Error("Falta el servicio contratado.");

  // Paso 0: con las cajas de la persona se resuelve cuál es su servicio
  // principal, y de ahí salen los bloques. Lo que figura contratado solo se usa
  // de respaldo, para quien todavía no tiene ninguna caja abierta.
  const composicion = componerInicio(cajas, contratado.tipo);

  const serviciosPrincipales = composicion.servicioPrincipal.flatMap((tipo) => {
    const servicio = servicios.find((candidato) => candidato.tipo === tipo);
    return servicio ? [servicio] : [];
  });

  // Las etapas de las cajas se piden aparte de la del caso: son las de los
  // juicios y las escrituras, que van cada una por su cuenta.
  const etapasDeLasCajas = await read.load<Etapa[]>(
    "etapasDeLasCajas",
    undefined,
    {
      description:
        "Etapa en que va cada juicio y cada escritura. El inicio muestra el nombre en la lista, y el resto al desplegar la caja",
      trigger: "Al abrir el inicio, cuando la persona tiene más de un caso",
      reads: {
        entities: ["etapa"],
        fields: [
          "etapa.visibleParaCliente",
          "etapa.nombreParaCliente",
          "etapa.queHaceLexy",
          "etapa.queNecesitamosDelCliente",
          "etapa.plazoEsperado",
        ],
      },
    },
  );

  const [juicios, escrituras] = await Promise.all([
    conSusEtapas(composicion.juicios, etapasDeLasCajas),
    conSusEtapas(composicion.escrituras, etapasDeLasCajas),
  ]);

  return {
    cliente,
    serviciosPrincipales,
    etapa: etapas[0] ?? null,
    configuracion,
    composicion,
    juicios,
    escrituras,
    contactos,
  };
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
      "cuotasDelCliente",
      { clienteId: cliente.id },
      {
        description:
          "Todas las cuotas de honorarios de la persona: la próxima por pagar y las que ya pagó",
        trigger: "Al abrir «Mis pagos»",
        reads: {
          entities: ["cuota"],
          fields: [
            "cuota.numero",
            "cuota.fechaVencimiento",
            "cuota.monto",
            "cuota.estado",
            "cuota.fechaPago",
          ],
        },
      },
    ),
    cargarConfiguracion(),
  ]);

  // La próxima es la pendiente más antigua del plan. Una morosa no compite por
  // ese lugar: ya venció, y ponerla ahí haría que la pantalla pidiera pagar algo
  // distinto de lo que toca este mes.
  const proximaCuota =
    cuotas.filter((cuota) => cuota.estado === "pendiente").sort((a, b) => a.numero - b.numero)[0] ??
    null;

  // Todas, en el orden del plan. El historial las muestra enteras —pagadas,
  // morosas y las que vienen— porque la pregunta que se contesta ahí es «cómo va
  // mi plan completo», y para eso el orden es el de los meses.
  const todas = [...cuotas].sort((a, b) => a.numero - b.numero);

  return { cliente, proximaCuota, cuotas: todas, configuracion };
}

/**
 * «¿Qué es mi servicio?»: la explicación y los resultados posibles.
 *
 * Explica el **servicio principal**, resuelto con las mismas cajas que arman el
 * inicio, no lo que figura contratado en la ficha. Cuando el principal es
 * compuesto —defensa en juicio con protección patrimonial— se explican los dos:
 * el bloque de arriba del inicio los nombra juntos, y quien entra acá desde ahí
 * viene a leer de qué se tratan las dos cosas.
 */
export async function cargarMiServicio(): Promise<DatosMiServicio> {
  const cliente = await cargarClienteEnSesion();

  const [servicios, resultados, cajas] = await Promise.all([
    read.load<Servicio[]>(
      "detalleDeLosServicios",
      undefined,
      {
        description: "Explicación de cada servicio de Lexy en lenguaje simple",
        trigger: "Al abrir «¿Qué es mi servicio?»",
        reads: {
          entities: ["servicio"],
          fields: [
            "servicio.tipo",
            "servicio.nombre",
            "servicio.nombreEnFrase",
            "servicio.queEs",
          ],
        },
      },
    ),
    read.load<ResultadoServicio[]>(
      "resultadosDeLosServicios",
      undefined,
      {
        description: "Resultados que se pueden lograr con cada servicio",
        trigger: "Al abrir «¿Qué es mi servicio?»",
        reads: {
          entities: ["resultadoServicio"],
          fields: [
            "resultadoServicio.servicioId",
            "resultadoServicio.titulo",
            "resultadoServicio.texto",
            "resultadoServicio.icono",
            "resultadoServicio.orden",
          ],
        },
      },
    ),
    read.load<Caja[]>(
      "cajasDelClienteEnMiServicio",
      { clienteId: cliente.id },
      {
        description:
          "Casos abiertos de la persona, para saber cuál es el servicio que hay que explicarle",
        trigger: "Al abrir «¿Qué es mi servicio?»",
        reads: { entities: ["caja"], fields: ["caja.tipo", "caja.estado"] },
      },
    ),
  ]);

  const contratado = servicios.find((candidato) => candidato.id === cliente.servicioId);
  if (!contratado) throw new Error("Falta el servicio contratado.");

  const principales = determinarServicioPrincipal(cajas, contratado.tipo).flatMap((tipo) => {
    const encontrado = servicios.find((candidato) => candidato.tipo === tipo);
    return encontrado ? [encontrado] : [];
  });

  return {
    nombre: nombreDelServicioPrincipal(principales),
    enFrase: servicioEnFrase(principales),
    servicios: principales.map((servicio) => ({
      servicio,
      resultados: resultados
        .filter((resultado) => resultado.servicioId === servicio.id)
        .sort((a, b) => a.orden - b.orden),
    })),
  };
}
