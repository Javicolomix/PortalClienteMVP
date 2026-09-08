import { definePrototypeDataContract } from "./data-contract-schema";

/**
 * Fuente de verdad de los datos usados por el prototipo.
 *
 * El designer describe el producto en lenguaje natural; el agente mantiene este
 * contrato y ejecuta `pnpm check:data-contract` antes de implementar la UI.
 */

const PORTAL = "Portal del cliente";
const PANEL = "Panel de etapas del capitán";

/**
 * El portal es nuevo: ningún campo tiene todavía una fuente confirmada por TI.
 * Por eso todo entra como pendiente con la pregunta concreta que hay que
 * resolver, en vez de inventar nombres de tablas que nadie validó.
 */
const pendienteTi = (note: string, origin: "lexyConfirmed" | "productAssumption") =>
  ({
    origin,
    source: { kind: "unknown" } as const,
    dataClassification: "internal" as const,
    technicalValidation: { status: "pendingTi" as const, note },
  }) as const;

/** Campo que nació de una necesidad de la pantalla, no del encargo original. */
const desdeUsabilidad = (note: string) =>
  ({
    origin: "generatedByUsability" as const,
    source: { kind: "unknown" } as const,
    dataClassification: "internal" as const,
    technicalValidation: { status: "pendingTi" as const, note },
  }) as const;

const soloTecnico = { visible: false, editable: false, calculated: false, technical: true } as const;
const soloVisible = {
  visible: true,
  editable: false,
  calculated: false,
  technical: false,
} as const;
const visibleYEditable = {
  visible: true,
  editable: true,
  calculated: false,
  technical: false,
} as const;

export const prototypeDataContract = definePrototypeDataContract({
  contractVersion: "1",
  project: {
    name: "portalcliente",
    description:
      "Portal donde una persona con deudas ve en qué va su caso, entiende qué servicio contrató y sabe si tiene que hacer algo. El contenido de cada etapa lo escribe un capitán de Lexy desde un panel interno.",
  },
  entities: {
    cliente: {
      id: "cliente",
      productDescription: "Persona que contrató un servicio y entra al portal a ver su caso.",
      roleInExperience:
        "Sostiene el saludo del portal y apunta al servicio contratado y a la etapa en la que va el caso.",
      usedIn: [PORTAL],
      ...pendienteTi(
        "Confirmar de qué sistema de Lexy sale la persona que entra al portal y cómo se identifica en la sesión.",
        "lexyConfirmed",
      ),
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador de la persona dentro de Lexy.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar qué identificador usa Lexy para la persona.", "lexyConfirmed"),
        },
        nombre: {
          id: "nombre",
          productDescription:
            "Nombre de pila con el que se saluda a la persona al abrir el portal.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          origin: "lexyConfirmed",
          source: { kind: "unknown" },
          dataClassification: "sensitive",
          technicalValidation: {
            status: "pendingTi",
            note: "Confirmar de dónde sale el nombre y si viene separado del apellido: el saludo usa solo el nombre de pila.",
          },
        },
        servicioId: {
          id: "servicioId",
          productDescription: "Servicio que la persona tiene contratado.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar cómo se sabe qué servicio contrató la persona y qué pasa si tiene más de uno.",
            "lexyConfirmed",
          ),
        },
        correo: {
          id: "correo",
          productDescription: "Correo con el que la persona entra al portal. Es su nombre de usuario.",
          dataType: "string",
          required: true,
          usage: { visible: false, editable: false, calculated: false, technical: true, filterable: true },
          usedIn: [PORTAL],
          origin: "lexyConfirmed",
          source: { kind: "unknown" },
          dataClassification: "sensitive",
          technicalValidation: {
            status: "pendingTi",
            note: "Confirmar qué correo se usa si Lexy tiene más de uno registrado, y qué pasa si la persona lo cambia.",
          },
        },
        rut: {
          id: "rut",
          productDescription: "RUT de la persona. El portal no lo muestra: lo usa para formar su clave.",
          dataType: "string",
          required: true,
          usage: { visible: false, editable: false, calculated: false, technical: true },
          usedIn: [PORTAL],
          origin: "lexyConfirmed",
          source: { kind: "unknown" },
          dataClassification: "sensitive",
          technicalValidation: {
            status: "pendingTi",
            note: "Confirmar en qué formato viene el RUT (con puntos, con guion, con K mayúscula), porque de eso depende que la clave calce.",
          },
        },
        claveDeAcceso: {
          id: "claveDeAcceso",
          productDescription: "Clave con la que la persona entra al portal.",
          dataType: "string",
          required: true,
          usage: { visible: false, editable: false, calculated: true, technical: true },
          usedIn: [PORTAL],
          derivation:
            "Primera letra del nombre en mayúscula, seguida del RUT sin puntos ni dígito verificador. Ejemplo: Juan, 16.482.937-4 → J16482937.",
          origin: "lexyConfirmed",
          source: { kind: "derived" },
          dataClassification: "restricted",
          technicalValidation: {
            status: "pendingTi",
            note: "RIESGO DE SEGURIDAD A RESOLVER: la clave se deduce del nombre y del RUT, que no son secretos. Quien conozca el RUT de la persona puede entrar a ver su deuda. Definir con seguridad si se exige cambiarla en el primer ingreso o si se reemplaza el mecanismo.",
          },
        },
        etapaActualId: {
          id: "etapaActualId",
          productDescription: "Etapa del proceso en la que está el caso en este momento.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar quién mueve el caso de una etapa a otra y desde qué sistema se lee la etapa vigente.",
            "lexyConfirmed",
          ),
        },
      },
    },

    servicio: {
      id: "servicio",
      productDescription:
        "Servicio que Lexy presta: renegociación, liquidación o litigios. Trae la explicación que el cliente lee para entender qué contrató.",
      roleInExperience:
        "Explica al cliente en qué consiste su servicio, y agrupa las etapas que el capitán configura en el panel.",
      usedIn: [PORTAL, PANEL],
      ...pendienteTi(
        "Confirmar el catálogo real de servicios y quién mantiene su texto explicativo.",
        "lexyConfirmed",
      ),
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador del servicio.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi("Confirmar el identificador de cada servicio.", "lexyConfirmed"),
        },
        nombre: {
          id: "nombre",
          productDescription: "Nombre del servicio tal como lo ve el cliente.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi("Confirmar el nombre comercial de cada servicio.", "lexyConfirmed"),
        },
        resumen: {
          id: "resumen",
          productDescription:
            "Una frase que explica el servicio apenas se abre el portal, junto al saludo.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...desdeUsabilidad(
            "El cliente necesita entender qué contrató sin bajar a leer la sección completa. Confirmar quién escribe y mantiene esta frase.",
          ),
        },
        queEs: {
          id: "queEs",
          productDescription:
            "Explicación en lenguaje simple de en qué consiste el servicio y cómo funciona.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar quién es dueño de este texto y con qué frecuencia cambia.",
            "lexyConfirmed",
          ),
        },
      },
    },

    resultadoServicio: {
      id: "resultadoServicio",
      productDescription: "Cada resultado concreto que la persona puede lograr con su servicio.",
      roleInExperience:
        "Responde la pregunta «¿y esto en qué me deja?» sin prometer un resultado garantizado.",
      usedIn: [PORTAL],
      ...pendienteTi(
        "Confirmar quién define y aprueba la lista de resultados posibles de cada servicio.",
        "productAssumption",
      ),
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador del resultado.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar el identificador del resultado.", "productAssumption"),
        },
        servicioId: {
          id: "servicioId",
          productDescription: "Servicio al que pertenece este resultado.",
          dataType: "identifier",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar cómo se asocia el resultado a su servicio.", "productAssumption"),
        },
        orden: {
          id: "orden",
          productDescription: "Posición del resultado dentro de la lista del servicio.",
          dataType: "number",
          required: true,
          usage: { ...soloTecnico, sortable: true },
          usedIn: [PORTAL],
          ...desdeUsabilidad(
            "La lista necesita un orden estable para no cambiar entre visitas. Confirmar si el orden lo define alguien o es alfabético.",
          ),
        },
        titulo: {
          id: "titulo",
          productDescription:
            "El resultado en dos o tres palabras. Es el titular de su tarjeta en «Mi servicio».",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar quién redacta el titular. Es texto nuevo: hoy solo existe la frase larga.",
            "productAssumption",
          ),
        },
        texto: {
          id: "texto",
          productDescription: "El resultado, escrito en una frase para el cliente.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar quién redacta y aprueba estos textos.", "productAssumption"),
        },
        icono: {
          id: "icono",
          productDescription:
            "Clave del icono que acompaña al resultado (por ejemplo «escudo» o «balanza»). El portal la traduce a un dibujo del set de Lexy; no se guarda el dibujo, solo la clave.",
          dataType: "string",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Definir la lista cerrada de claves de icono junto con diseño, y qué pasa si llega una clave que el portal no conoce.",
            "productAssumption",
          ),
        },
      },
    },

    etapa: {
      id: "etapa",
      productDescription:
        "Etapa del proceso de un servicio, con el contenido que el capitán escribe para que el cliente entienda dónde está su caso.",
      roleInExperience:
        "Es el corazón del portal: lo que el cliente viene a ver. En el panel es la unidad que el capitán edita y publica.",
      usedIn: [PORTAL, PANEL],
      ...pendienteTi(
        "Este contenido no existe hoy en ningún sistema: hay que definir dónde se guarda, quién puede editarlo y si queda historial de versiones.",
        "productAssumption",
      ),
      states: [
        {
          id: "visibleEnPortal",
          productDescription: "La etapa se muestra en el portal del cliente.",
          activationCondition: "El capitán deja encendido «Visible para el cliente».",
          visualImpact:
            "El cliente ve la etapa completa: nombre, mensaje, qué hace Lexy, qué se necesita de él, qué puede pasar después y plazo.",
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar si una etapa puede publicarse con campos vacíos o si el sistema debe exigirlos.",
            "lexyConfirmed",
          ),
        },
        {
          id: "soloInterna",
          productDescription: "La etapa existe para el equipo pero no se muestra al cliente.",
          activationCondition: "El capitán deja apagado «Visible para el cliente».",
          visualImpact:
            "El portal no muestra el detalle de la etapa: en su lugar el cliente lee un mensaje de que su caso está avanzando y cómo contactarnos.",
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar qué se le muestra al cliente cuando su caso está parado en una etapa interna por mucho tiempo.",
            "productAssumption",
          ),
        },
      ],
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador de la etapa.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi("Confirmar el identificador de la etapa.", "productAssumption"),
        },
        servicioId: {
          id: "servicioId",
          productDescription: "Servicio al que pertenece la etapa.",
          dataType: "identifier",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar si una etapa puede compartirse entre servicios o siempre pertenece a uno.",
            "productAssumption",
          ),
        },
        orden: {
          id: "orden",
          productDescription: "Posición de la etapa dentro del proceso del servicio.",
          dataType: "number",
          required: true,
          usage: { ...soloTecnico, sortable: true },
          usedIn: [PANEL],
          ...desdeUsabilidad(
            "El capitán necesita ver las etapas en el orden real del proceso para ubicarse. Confirmar si el orden es fijo o lo puede reordenar.",
          ),
        },
        visibleParaCliente: {
          id: "visibleParaCliente",
          productDescription:
            "Si la etapa se muestra en el portal o queda solo para uso interno del equipo.",
          dataType: "boolean",
          required: true,
          usage: { ...visibleYEditable, filterable: true },
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar quién puede cambiar este interruptor y si el cambio necesita aprobación.",
            "lexyConfirmed",
          ),
        },
        nombreParaCliente: {
          id: "nombreParaCliente",
          productDescription:
            "Nombre breve y sin tecnicismos con el que el cliente reconoce la etapa.",
          dataType: "string",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar si la etapa también necesita un nombre técnico interno distinto del que ve el cliente.",
            "lexyConfirmed",
          ),
        },
        mensajePrincipal: {
          id: "mensajePrincipal",
          productDescription:
            "Una o dos frases que dicen dónde está el caso y qué significa eso para el cliente.",
          dataType: "string",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi("Confirmar si hay largo máximo para este mensaje.", "lexyConfirmed"),
        },
        queHaceLexy: {
          id: "queHaceLexy",
          productDescription: "Qué está gestionando el equipo ahora y por qué el caso está ahí.",
          dataType: "string",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar si este texto es fijo por etapa o puede variar caso a caso.",
            "lexyConfirmed",
          ),
        },
        queNecesitamosDelCliente: {
          id: "queNecesitamosDelCliente",
          productDescription:
            "Qué le toca hacer al cliente, o la indicación explícita de que no debe hacer nada.",
          dataType: "string",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar si esto debe conectarse a documentos o tareas reales del caso más adelante.",
            "lexyConfirmed",
          ),
        },
        quePuedePasarDespues: {
          id: "quePuedePasarDespues",
          productDescription:
            "Siguiente paso del proceso y la condición para avanzar, sin prometer resultado.",
          dataType: "string",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar si Legal debe revisar estos textos antes de publicarse.",
            "lexyConfirmed",
          ),
        },
        plazoEsperado: {
          id: "plazoEsperado",
          productDescription:
            "Plazo estimado de la etapa o de qué depende. Es texto, no fecha: muchas veces no hay fecha y hay que decirlo.",
          dataType: "string",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Decisión de producto: se guarda como texto libre justamente para poder decir «no depende de nosotros». Confirmar que no se espera una fecha calculada.",
            "lexyConfirmed",
          ),
        },
        nivelUrgencia: {
          id: "nivelUrgencia",
          productDescription:
            "Si el cliente debe actuar ya, revisar algo, o simplemente esperar tranquilo.",
          dataType: "enum",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          enumValues: ["tranquilidad", "atencion", "urgente"],
          ...pendienteTi(
            "Confirmar los tres niveles con el equipo: son los que definen el tono con que el cliente lee su etapa.",
            "lexyConfirmed",
          ),
        },
      },
    },

    contacto: {
      id: "contacto",
      productDescription: "Persona de Lexy asignada al caso con la que el cliente puede hablar.",
      roleInExperience:
        "Le pone nombre y cara al equipo: el cliente sabe a quién le escribe, no a un buzón anónimo.",
      usedIn: [PORTAL],
      ...pendienteTi(
        "Confirmar de dónde salen la ejecutiva y el abogado asignados a un caso.",
        "lexyConfirmed",
      ),
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador del contacto.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar el identificador del contacto.", "lexyConfirmed"),
        },
        clienteId: {
          id: "clienteId",
          productDescription: "Cliente al que este contacto está asignado.",
          dataType: "identifier",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar cómo se asigna un contacto a un caso.", "lexyConfirmed"),
        },
        nombre: {
          id: "nombre",
          productDescription: "Nombre de la persona de Lexy que atiende el caso.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar qué se muestra si el caso todavía no tiene abogado asignado.",
            "lexyConfirmed",
          ),
        },
        rol: {
          id: "rol",
          productDescription: "Si es la ejecutiva del caso o el abogado.",
          dataType: "enum",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          enumValues: ["ejecutiva", "abogado"],
          ...pendienteTi("Confirmar si existen otros roles que el cliente pueda contactar.", "lexyConfirmed"),
        },
        telefonoWhatsapp: {
          id: "telefonoWhatsapp",
          productDescription: "Número de WhatsApp por el que el cliente escribe a esa persona.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar si son números personales o de un WhatsApp Business compartido, y qué se muestra fuera de horario.",
            "lexyConfirmed",
          ),
        },
      },
    },

    cuota: {
      id: "cuota",
      productDescription:
        "Cada cuota de los honorarios que el cliente acordó pagar, con su vencimiento y monto.",
      roleInExperience:
        "Responde en cinco segundos «cuánto debo y cuándo». El portal muestra solo la próxima pendiente.",
      usedIn: [PORTAL],
      ...pendienteTi(
        "Confirmar de qué sistema salen las cuotas y quién marca una como pagada.",
        "lexyConfirmed",
      ),
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador de la cuota.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar el identificador de la cuota.", "lexyConfirmed"),
        },
        clienteId: {
          id: "clienteId",
          productDescription: "Cliente al que pertenece la cuota.",
          dataType: "identifier",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar cómo se asocia la cuota al cliente.", "lexyConfirmed"),
        },
        numero: {
          id: "numero",
          productDescription: "Número de la cuota dentro del plan de pago.",
          dataType: "number",
          required: true,
          usage: { visible: true, editable: false, calculated: false, technical: false, sortable: true },
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar si conviene mostrar también el total de cuotas del plan («cuota 18 de 24»).",
            "lexyConfirmed",
          ),
        },
        fechaVencimiento: {
          id: "fechaVencimiento",
          productDescription: "Día en que vence la cuota.",
          dataType: "date",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          origin: "lexyConfirmed",
          source: { kind: "unknown" },
          dataClassification: "sensitive",
          technicalValidation: {
            status: "pendingTi",
            note: "Confirmar qué se le muestra al cliente cuando la cuota ya venció: hoy el portal no distingue ese caso.",
          },
        },
        monto: {
          id: "monto",
          productDescription: "Monto a pagar de la cuota, en pesos chilenos sin decimales.",
          dataType: "number",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          origin: "lexyConfirmed",
          source: { kind: "unknown" },
          dataClassification: "sensitive",
          technicalValidation: {
            status: "pendingTi",
            note: "Confirmar si el monto puede incluir intereses o recargos por atraso, y si eso debe desglosarse.",
          },
        },
        estado: {
          id: "estado",
          productDescription: "Si la cuota está pendiente o ya fue pagada.",
          dataType: "enum",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          enumValues: ["pendiente", "pagada"],
          ...pendienteTi(
            "Confirmar cuánto se demora en reflejarse un pago: el cliente puede transferir y seguir viendo la cuota como pendiente.",
            "lexyConfirmed",
          ),
        },
      },
    },

    configuracionPortal: {
      id: "configuracionPortal",
      productDescription: "Datos del portal que son iguales para todos los clientes.",
      roleInExperience: "Sostiene el correo de soporte y el enlace al formulario de reclamos.",
      usedIn: [PORTAL],
      ...pendienteTi(
        "Confirmar quién mantiene esta configuración y dónde vive.",
        "productAssumption",
      ),
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador de la configuración.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar si habrá una sola configuración o una por servicio.", "productAssumption"),
        },
        correoSoporte: {
          id: "correoSoporte",
          productDescription: "Correo al que el cliente puede escribir si no logra resolver por WhatsApp.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar el correo de soporte real del portal.", "lexyConfirmed"),
        },
        urlFormularioReclamos: {
          id: "urlFormularioReclamos",
          productDescription: "Enlace al formulario externo donde el cliente puede dejar un reclamo.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "El enlace de Typeform viene del encargo. Confirmar si se mantiene estable o si cambia por campaña.",
            "lexyConfirmed",
          ),
        },
        urlPagoEnLinea: {
          id: "urlPagoEnLinea",
          productDescription: "Enlace a la plataforma externa donde el cliente paga su cuota con tarjeta.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar si el enlace puede llevar al cliente directo a su cuota en vez de a la pantalla de login.",
            "lexyConfirmed",
          ),
        },
        titularCuenta: {
          id: "titularCuenta",
          productDescription: "Nombre a nombre de quien está la cuenta bancaria de Lexy.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar los datos bancarios vigentes con Finanzas.", "lexyConfirmed"),
        },
        banco: {
          id: "banco",
          productDescription: "Banco donde está la cuenta de Lexy.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar los datos bancarios vigentes con Finanzas.", "lexyConfirmed"),
        },
        numeroCuenta: {
          id: "numeroCuenta",
          productDescription: "Número de la cuenta corriente de Lexy.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar los datos bancarios vigentes con Finanzas.", "lexyConfirmed"),
        },
        rutTitular: {
          id: "rutTitular",
          productDescription: "RUT de la empresa titular de la cuenta.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar los datos bancarios vigentes con Finanzas.", "lexyConfirmed"),
        },
      },
    },
  },

  relations: [
    {
      id: "clienteContrataServicio",
      fromEntity: "cliente",
      toEntity: "servicio",
      cardinality: "oneToOne",
      productDescription: "Cada cliente del portal ve el servicio que tiene contratado.",
      requiredBy: [PORTAL],
      resolution: "queried",
      ...pendienteTi(
        "Confirmar qué pasa si una persona tiene dos servicios contratados a la vez.",
        "lexyConfirmed",
      ),
    },
    {
      id: "clienteEstaEnEtapa",
      fromEntity: "cliente",
      toEntity: "etapa",
      cardinality: "oneToOne",
      productDescription: "El caso del cliente está en una etapa a la vez.",
      requiredBy: [PORTAL],
      resolution: "queried",
      ...pendienteTi(
        "Confirmar quién y cuándo mueve el caso de etapa, y si el cliente debería enterarse del cambio.",
        "lexyConfirmed",
      ),
    },
    {
      id: "servicioTieneEtapas",
      fromEntity: "servicio",
      toEntity: "etapa",
      cardinality: "oneToMany",
      productDescription: "Cada servicio tiene su propio proceso, con sus etapas y su contenido.",
      requiredBy: [PORTAL, PANEL],
      resolution: "queried",
      ...pendienteTi(
        "Confirmar el proceso real de cada servicio con el equipo legal.",
        "lexyConfirmed",
      ),
    },
    {
      id: "servicioTieneResultados",
      fromEntity: "servicio",
      toEntity: "resultadoServicio",
      cardinality: "oneToMany",
      productDescription: "Cada servicio declara qué resultados se pueden lograr con él.",
      requiredBy: [PORTAL],
      resolution: "queried",
      ...pendienteTi("Confirmar quién aprueba esta lista.", "productAssumption"),
    },
    {
      id: "clienteTieneCuotas",
      fromEntity: "cliente",
      toEntity: "cuota",
      cardinality: "oneToMany",
      productDescription:
        "El cliente tiene un plan de cuotas; el portal muestra la próxima que está pendiente.",
      requiredBy: [PORTAL],
      resolution: "queried",
      ...pendienteTi(
        "Confirmar qué se muestra si el cliente no tiene plan de cuotas o pagó todo al contado.",
        "lexyConfirmed",
      ),
    },
    {
      id: "clienteTieneContactos",
      fromEntity: "cliente",
      toEntity: "contacto",
      cardinality: "oneToMany",
      productDescription: "Al cliente se le asignan una ejecutiva y un abogado.",
      requiredBy: [PORTAL],
      resolution: "queried",
      ...pendienteTi(
        "Confirmar si siempre hay dos contactos o si a veces solo hay ejecutiva.",
        "lexyConfirmed",
      ),
    },
  ],
});
