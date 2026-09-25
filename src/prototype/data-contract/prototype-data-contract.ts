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
        apellido: {
          id: "apellido",
          productDescription:
            "Apellido de la persona. El portal no lo muestra en ninguna pantalla —saluda por el nombre de pila—, pero lo usa en los mensajes que salen hacia el equipo: el WhatsApp y el correo del comprobante parten con nombre y apellido para que quien recibe pueda ubicar a la persona sin pedirle el RUT.",
          dataType: "string",
          required: true,
          usage: { visible: false, editable: false, calculated: false, technical: true },
          usedIn: [PORTAL],
          origin: "lexyConfirmed",
          source: { kind: "unknown" },
          dataClassification: "sensitive",
          technicalValidation: {
            status: "pendingTi",
            note: "Confirmar si Lexy guarda el apellido separado del nombre, y qué se manda cuando la persona tiene dos apellidos: hoy el portal asume un solo campo y lo pega tal cual venga.",
          },
        },
        servicioId: {
          id: "servicioId",
          productDescription:
            "Servicio que figura contratado en la ficha. Quedó como respaldo: el servicio que el portal muestra sale de las cajas de la persona, no de acá. Solo se usa para quien todavía no tiene ninguna caja abierta.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar si este campo sigue teniendo dueño ahora que el servicio se deduce de las cajas, o si se puede retirar del contrato.",
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
        "Servicio que Lexy presta: renegociación, liquidación, defensa en juicio o protección patrimonial. Trae la explicación que el cliente lee para entender qué contrató.",
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
        tipo: {
          id: "tipo",
          productDescription:
            "Cuál de los cuatro servicios es: «renegociacion», «liquidacion», «defensaEnJuicio» o «proteccionPatrimonial». El portal se arma distinto según cuál sea el servicio principal de la persona, así que necesita el tipo como dato y no puede deducirlo del nombre.",
          dataType: "string",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar la lista cerrada de tipos y cómo se identifica cada uno en el origen. Si Lexy agrega un quinto servicio, hay que decidir con qué bloques se arma su inicio antes de publicarlo.",
            "lexyConfirmed",
          ),
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
        nombreEnFrase: {
          id: "nombreEnFrase",
          productDescription:
            "Cómo se titula la pantalla del servicio: «La Renegociación», con su artículo y su mayúscula. No se puede derivar del nombre: «Renegociación de deudas» se titula «La Renegociación», que es media frase menos, y «Defensa en juicio» se titula «La Defensa en Juicio», que sube una mayúscula.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...desdeUsabilidad(
            "Confirmar quién escribe esta forma del nombre. Es una decisión de redacción, no un dato de sistema: sale del mismo lugar que el nombre del servicio y tiene que mantenerse a la par.",
          ),
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

    caja: {
      id: "caja",
      productDescription:
        "Cada caso abierto que la persona tiene con Lexy: lo que en Streak es una tarjeta. Una misma persona puede tener varias a la vez —su servicio principal, más juicios y más escrituras— y cada una avanza por su propia etapa.",
      roleInExperience:
        "Es lo que decide cómo se arma el inicio: con el conjunto de cajas de la persona se resuelve primero cuál es su servicio principal, y de ahí si ve el estado de un caso único, la lista de sus juicios, la de sus escrituras, o una combinación. El servicio principal ya no se lee de la ficha del cliente: se deduce de las cajas.",
      usedIn: [PORTAL],
      ...pendienteTi(
        "LO MÁS IMPORTANTE DE RESOLVER: hoy no existe forma de saber qué cajas tiene una persona. Hay que definir cómo se listan las tarjetas de Streak asociadas a un mismo cliente y con qué campo se las agrupa. Cuál es «la principal» ya no hace falta preguntarlo: sale de las reglas del portal (renegociación o liquidación primero; si no, causas reales; si no, escrituras; si no, monitoreo).",
        "productAssumption",
      ),
      fields: {
        id: {
          id: "id",
          productDescription: "Identificador de la caja.",
          dataType: "identifier",
          required: true,
          usage: soloTecnico,
          usedIn: [PORTAL],
          ...pendienteTi("Confirmar el identificador de la tarjeta en Streak.", "productAssumption"),
        },
        clienteId: {
          id: "clienteId",
          productDescription: "Persona dueña de esta caja.",
          dataType: "identifier",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar con qué campo se asocian a una misma persona todas sus tarjetas de Streak. Sin esto el portal no puede juntar los casos de alguien.",
            "productAssumption",
          ),
        },
        tipo: {
          id: "tipo",
          productDescription:
            "En qué embudo de Streak vive esta caja, con los mismos cuatro valores que `servicio.tipo`: renegociación, liquidación, juicio ejecutivo (`defensaEnJuicio`) y escrituras públicas (`proteccionPatrimonial`).",
          dataType: "string",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar el nombre exacto de cada uno de los cuatro embudos de Streak y cómo se leen desde la tarjeta.",
            "productAssumption",
          ),
        },
        esCajaMadre: {
          id: "esCajaMadre",
          productDescription:
            "Marca las cajas del embudo de escrituras que son la «caja madre»: el paraguas del servicio, no una gestión. Nunca se le muestran al cliente, porque debajo cuelga la caja obrera donde está el trabajo real. Sale del campo «Rol de caja» de Streak y es aparte de la etapa: una caja madre puede avanzar de etapa sin dejar de serlo, y ahí la etapa ya no alcanza para reconocerla.",
          dataType: "boolean",
          required: false,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar de qué campo de Streak sale el rol de caja y con qué valor exacto se marca la madre. Reemplaza al antiguo `caja.estado`, que mezclaba tres cosas distintas —monitoreo, caja madre y el resto— en un solo campo; monitoreo pasó a ser una clase de etapa.",
            "productAssumption",
          ),
        },
        identificador: {
          id: "identificador",
          productDescription:
            "Qué distingue esta caja de otra del mismo tipo, desde la columna «identificador» de Streak: en juicio ejecutivo, el ROL de la causa («C-4821-2026»); en escrituras públicas, lo que identifica el bien o la gestión —la patente del vehículo, el rol de avalúo del inmueble, el nombre de la sociedad—. Se muestra tal cual viene, sin rótulo delante: en esa columna cabe una patente, un rol o un nombre, y cualquier palabra que le pusiéramos sería correcta para un tipo de escritura y falsa para los demás. Va vacío en las cajas que no se listan.",
          dataType: "string",
          required: false,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar que la columna «identificador» de Streak exista en los dos embudos y venga siempre completa, y qué formato trae en escrituras (¿patente con guión o con punto medio? ¿el rol de avalúo con comuna o sin ella?). Si viniera vacía, la fila queda con el tipo de escritura solo y dos del mismo tipo vuelven a verse idénticas.",
            "productAssumption",
          ),
        },
        tipoDeEscritura: {
          id: "tipoDeEscritura",
          productDescription:
            "De qué es la escritura: «Compraventa de Vehículo», «Constitución de Sociedades». Solo en el embudo de escrituras públicas. Es la línea con tinta de la fila —lo que la persona reconoce primero— y además elige el dibujo de la marca.",
          dataType: "string",
          required: false,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar de qué columna de Streak sale el tipo de escritura y con qué lista de valores. El portal tiene dibujo propio para veinticinco tipos y uno genérico para el resto: un valor escrito distinto al de esa lista se dibuja con el genérico, no falla, pero se ve como si fuera de otra clase.",
            "productAssumption",
          ),
        },
        acreedor: {
          id: "acreedor",
          productDescription:
            "Quién demandó, solo en las cajas del embudo de juicio ejecutivo: «Banco Estado», «Coopeuch». Se muestra junto al ROL y no en su lugar — el rol identifica el expediente, el acreedor es lo que la persona reconoce.",
          dataType: "string",
          required: false,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...desdeUsabilidad(
            "Con dos causas abiertas, el ROL solo no le dice nada a nadie: lo que la persona reconoce es a quién le debe. Falta confirmar de qué campo de Streak sale el acreedor y si viene siempre completo.",
          ),
        },
        etapaId: {
          id: "etapaId",
          productDescription: "Etapa en que va esta caja. Cada una avanza por su cuenta.",
          dataType: "identifier",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar cómo se sabe la etapa de cada tarjeta por separado. Hoy el contrato tiene la etapa en el cliente (`cliente.etapaActualId`), que solo funciona si la persona tiene un caso; con varias cajas ese campo queda corto.",
            "productAssumption",
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
            "Una o dos frases que dicen dónde está el caso y qué significa eso para el cliente. Es opcional: si el capitán lo deja en blanco, el portal no muestra esa sección —ni el dibujo, ni el título, ni un «no aplica»—; el panel se arma solo con lo que tenga texto. Sin este texto, el recuadro de «¿Qué significa esta etapa?» desaparece; si además la etapa es urgente o de atención, queda solo el aviso de color.",
          dataType: "string",
          required: false,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          ...pendienteTi(
            "Confirmar si hay largo máximo para este mensaje, y si el panel de comunicaciones debe advertirle al capitán cuando deja en blanco los cinco campos de una etapa: ahí el cliente no ve nada del caso, solo el aviso de que está en trabajo interno.",
            "lexyConfirmed",
          ),
        },
        queHaceLexy: {
          id: "queHaceLexy",
          productDescription: "Qué está gestionando el equipo ahora y por qué el caso está ahí. Es opcional: si el capitán lo deja en blanco, el portal no muestra esa sección —ni el dibujo, ni el título, ni un «no aplica»—; el panel se arma solo con lo que tenga texto.",
          dataType: "string",
          required: false,
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
            "Qué le toca hacer al cliente, o la indicación explícita de que no debe hacer nada. Es opcional: si el capitán lo deja en blanco, el portal no muestra esa sección —ni el dibujo, ni el título, ni un «no aplica»—; el panel se arma solo con lo que tenga texto. Ojo con la diferencia: dejarlo en blanco no es lo mismo que escribir «no tienes que hacer nada» — lo primero calla la sección, lo segundo la muestra diciendo eso.",
          dataType: "string",
          required: false,
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
            "Siguiente paso del proceso y la condición para avanzar, sin prometer resultado. Es opcional: si el capitán lo deja en blanco, el portal no muestra esa sección —ni el dibujo, ni el título, ni un «no aplica»—; el panel se arma solo con lo que tenga texto.",
          dataType: "string",
          required: false,
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
            "Plazo estimado de la etapa o de qué depende. Es texto, no fecha: muchas veces no hay fecha y hay que decirlo. Es opcional: si el capitán lo deja en blanco, el portal no muestra esa sección —ni el dibujo, ni el título, ni un «no aplica»—; el panel se arma solo con lo que tenga texto.",
          dataType: "string",
          required: false,
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
        contactoPrincipal: {
          id: "contactoPrincipal",
          productDescription:
            "Quién atiende al cliente durante esta etapa: la ejecutiva o el abogado. No es el mismo en todo el proceso —mientras se juntan papeles atiende la ejecutiva, y con el asunto en el tribunal atiende el abogado—, así que se fija por etapa y puede cambiar dentro del mismo caso. Es el contacto que ofrece el botón de WhatsApp.",
          dataType: "enum",
          required: true,
          usage: visibleYEditable,
          usedIn: [PORTAL, PANEL],
          enumValues: ["ejecutiva", "abogado"],
          ...pendienteTi(
            "Confirmar que el capitán pueda fijar esto por etapa desde el panel, y qué pasa si el rol elegido no tiene a nadie asignado en ese caso.",
            "productAssumption",
          ),
        },
        clase: {
          id: "clase",
          productDescription:
            "Qué significa esta etapa para las reglas del portal. Casi todas son «corriente» y solo describen un avance; las demás cambian qué se le muestra al cliente: «monitoreo» y «concursal» son etapas de juicio ejecutivo cuyas cajas no cuentan como juicio ni se listan; «archivada» y «aLiquidacion» son etapas de renegociación que, si son la única caja del cliente, hacen que renegociación deje de ser su servicio principal; «demandado» es el duplicado que se crea en renegociación cuando demandan al cliente, y su etapa nunca se muestra si hay otra caja; «liquidacionEnEspera» cubre «Mediata» y «En espera»; «cajaMadre» y «gestionAbortada» son etapas de escrituras.",
          dataType: "enum",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          enumValues: [
            "corriente",
            "monitoreo",
            "concursal",
            "archivada",
            "aLiquidacion",
            "demandado",
            "liquidacionEnEspera",
            "cajaMadre",
            "gestionAbortada",
          ],
          ...pendienteTi(
            "Mapear cada etapa real de los cuatro embudos de Streak a una de estas clases, y confirmar los nombres exactos: «Archivados», «A liquidación», «Demandado» en renegociación; «Monitoreo» y «Concursal» en juicio ejecutivo; «Mediata» y «En espera» en liquidación —las dos llevan la clase `liquidacionEnEspera`—; «Caja madre» y «Gestión abortada» en escrituras. Es el dato del que cuelga toda la composición del inicio: una etapa mal clasificada puede esconderle un juicio al cliente o mostrarle un servicio que no tiene.",
            "productAssumption",
          ),
        },
      },
    },

    contacto: {
      id: "contacto",
      productDescription: "Persona de Lexy asignada al caso con la que el cliente puede hablar.",
      roleInExperience:
        "Le pone nombre y cara al equipo: el cliente sabe a quién le escribe, no a un buzón anónimo. El botón flotante de WhatsApp abre un panel con las personas que corresponden a la etapa en que va el caso —regla en `contactos-visibles.ts`—, no con todas las asignadas: en renegociación y liquidación sale una sola, salvo que la liquidación esté detenida («Mediata» o «En espera»), donde sale también la del juicio o la escritura que siga andando.",
      usedIn: [PORTAL],
      ...pendienteTi(
        "LO QUE FALTA: **quién de los dos ve el cliente lo configura el capitán por etapa**, en un panel de administración —solo abogado, solo ejecutiva o los dos—, así que puede cambiar durante el mismo caso a medida que avanza. Hay que definir dónde vive esa configuración y cómo llega al portal, que muestra lo que le llega y no elige. Además: en «defensa en juicio con protección patrimonial» tienen que venir la ejecutiva legal y/o el abogado de litigios de esa persona, nunca un contacto genérico de Lexy.",
        "productAssumption",
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
        servicioTipo: {
          id: "servicioTipo",
          productDescription:
            "De qué servicio es esta persona, con los mismos cuatro valores que `servicio.tipo`. Una persona puede tener abogado de liquidación y ejecutiva de defensa en juicio al mismo tiempo, y el panel de WhatsApp los nombra por separado: «Tu abogado de liquidación», «Tu ejecutiva de defensa en juicio».",
          dataType: "enum",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          enumValues: ["renegociacion", "liquidacion", "defensaEnJuicio", "proteccionPatrimonial"],
          ...pendienteTi(
            "Confirmar cómo se sabe en Streak de qué servicio es cada persona asignada. Sin este dato, un cliente con dos contactos ve dos filas que dicen «Tu abogado» sin decir de qué, y tiene que abrir las dos conversaciones para averiguar a cuál escribirle.",
            "productAssumption",
          ),
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
        "Responde en cinco segundos «cuánto debo y cuándo». El portal destaca solo la próxima pendiente; las pagadas quedan en un historial desplegable, para comprobar que un pago se registró.",
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
          productDescription:
            "En qué quedó la cuota: pendiente de pago, pagada, o morosa —vencida sin que se registrara el pago—. El portal las trata distinto: la pendiente más antigua es la que destaca arriba, las otras dos van al historial, y la morosa ahí en rojo.",
          dataType: "enum",
          required: true,
          usage: { ...soloTecnico, filterable: true },
          usedIn: [PORTAL],
          enumValues: ["pendiente", "pagada", "morosa"],
          ...pendienteTi(
            "DOS COSAS: (1) cuánto se demora en reflejarse un pago, porque el cliente puede transferir y seguir viendo la cuota como pendiente; (2) quién y cuándo marca una cuota como morosa. Si el paso de pendiente a morosa lo hace un proceso por fecha, hay que definir a los cuántos días corre, porque el portal la muestra en rojo y eso llega antes que cualquier llamado de cobranza.",
            "lexyConfirmed",
          ),
        },
        fechaPago: {
          id: "fechaPago",
          productDescription:
            "Cuándo se pagó la cuota. Solo viene en las pagadas, y es lo que el portal muestra en el historial: la persona busca cuándo pagó, no cuándo vencía.",
          dataType: "date",
          required: false,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Confirmar de dónde sale la fecha efectiva de pago, y qué se muestra cuando una cuota se pagó fuera de plazo o en partes.",
            "productAssumption",
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
        urlResenasGoogle: {
          id: "urlResenasGoogle",
          productDescription:
            "Enlace a la ficha de Google de Lexy Deudor, abierta en el formulario de reseña. Es a donde lleva «Felicitar a mi equipo».",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...pendienteTi(
            "Es el enlace corto de reseña que entrega Google desde la ficha del negocio (`g.page/r/…/review`), no una URL de búsqueda. Confirmar que la ficha a la que apunta es la vigente de Lexy Deudor y quién avisa si el negocio se reclama de nuevo, porque en ese caso el código cambia.",
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
        telefonoFinanzas: {
          id: "telefonoFinanzas",
          productDescription:
            "WhatsApp de finanzas: por dónde el cliente reclama un cobro. Es el mismo para todos, a diferencia de la ejecutiva y el abogado, que van por caso. El portal nombra el cargo —«nuestra ejecutiva de finanzas»— y no a la persona, así que el nombre de quien atiende no hace falta.",
          dataType: "string",
          required: true,
          usage: soloVisible,
          usedIn: [PORTAL],
          ...desdeUsabilidad(
            "Confirmar si finanzas atiende por un número personal o por uno de la empresa. Si es personal, hay que definir qué pasa el día que esa persona sale de Lexy: el texto ya no la nombra, pero el número la sigue apuntando a ella.",
          ),
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
