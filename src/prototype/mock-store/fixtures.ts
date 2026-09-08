import type { MockEntityRecord } from "./mock-store";

export type Fixtures = {
  datasetVersion: number;
  entities: Record<string, MockEntityRecord[]>;
};

/**
 * Datos sintéticos, deterministas y revisables en PR. Sin Math.random(),
 * Date.now() ni new Date(). Usa contexto chileno (es-CL, RUT con K mayúscula,
 * teléfonos +56, fechas ISO, CLP entero, correos example.com).
 */
export const fixtures: Fixtures = {
  datasetVersion: 13,
  entities: {
    cliente: [
      {
        id: "cli-001",
        nombre: "Juan",
        correo: "juan.cardenas@example.com",
        rut: "16.482.937-5",
        servicioId: "srv-renegociacion",
        etapaActualId: "etp-reneg-02",
      },
      {
        id: "cli-002",
        nombre: "Javiera",
        correo: "javiera.rojas@example.com",
        rut: "15.204.336-8",
        servicioId: "srv-renegociacion",
        etapaActualId: "etp-reneg-02",
      },
    ],

    servicio: [
      {
        id: "srv-renegociacion",
        nombre: "Renegociación de deudas",
        resumen:
          "Buscamos un acuerdo con tus acreedores para que pagues tus deudas en cuotas que sí puedas cumplir.",
        queEs:
          "La Renegociación es un procedimiento voluntario y administrativo que tiene por finalidad la repactación de las deudas de la persona estableciendo nuevas condiciones de pago con los acreedores.\n\nSu objetivo es que la persona deudora llegue a un acuerdo con todos los acreedores, obteniendo mejores condiciones de pago, las cuales vayan acorde a sus ingresos, para que de esta manera pueda resolver su problema de sobreendeudamiento y restaurar tu estabilidad financiera.",
      },
      {
        id: "srv-liquidacion",
        nombre: "Liquidación de deudas",
        resumen:
          "Cuando ya no es posible pagar, buscamos que un tribunal extinga tus deudas para que puedas partir de nuevo.",
        queEs:
          "La liquidación es un procedimiento ante un tribunal para personas cuyas deudas ya no se pueden pagar, ni siquiera en cuotas. Un liquidador designado por el tribunal ordena tus bienes, los reparte entre tus acreedores según lo que dice la ley, y al terminar el procedimiento el saldo que quedó impago se extingue.\n\nHay bienes que la ley protege y que no entran en la liquidación. Antes de partir te explicamos exactamente qué pasa con lo tuyo, para que decidas con la información completa.",
      },
      {
        id: "srv-litigios",
        nombre: "Litigios y Protección Patrimonial",
        resumen:
          "Te representamos ante el tribunal y ordenamos tu patrimonio para dejarlo resguardado.",
        queEs:
          "Este servicio cubre dos frentes que suelen ir juntos. En los litigios llevamos tu caso ante el tribunal: preparamos la demanda o la defensa, presentamos las pruebas y te representamos en cada audiencia.\n\nEn la protección patrimonial revisamos qué tienes a tu nombre, qué riesgos corre y cómo ordenarlo para dejarlo resguardado dentro de lo que permite la ley.\n\nUn juicio tiene tiempos que fija el tribunal y no nosotros. Por eso, más que darte una fecha de término, te vamos contando en qué va y qué se viene en cada etapa.",
      },
    ],

    resultadoServicio: [
      {
        id: "res-reneg-01",
        servicioId: "srv-renegociacion",
        orden: 1,
        titulo: "Cuotas más bajas",
        texto: "Reducir lo que paga mensualmente por sus deudas.",
        icono: "baja",
      },
      {
        id: "res-reneg-02",
        servicioId: "srv-renegociacion",
        orden: 2,
        titulo: "Sin intereses",
        texto: "Establecer nuevas cuotas sin intereses.",
        icono: "acuerdo",
      },
      {
        id: "res-reneg-03",
        servicioId: "srv-renegociacion",
        orden: 3,
        titulo: "Período de gracia",
        texto: "Conseguir un período de gracia de 3 meses.",
        icono: "reloj",
      },
      {
        id: "res-reneg-04",
        servicioId: "srv-renegociacion",
        orden: 4,
        titulo: "Salir de DICOM",
        texto: "Si el cliente se encuentra en DICOM, eliminarlo del registro.",
        icono: "borron",
      },

      {
        id: "res-liq-01",
        servicioId: "srv-liquidacion",
        orden: 1,
        titulo: "Deudas extinguidas",
        texto: "Extinguir las deudas que quedan impagas al terminar el procedimiento.",
        icono: "borron",
      },
      {
        id: "res-liq-02",
        servicioId: "srv-liquidacion",
        orden: 2,
        titulo: "Juicios detenidos",
        texto: "Frenar los juicios de cobranza y los embargos en tu contra.",
        icono: "escudo",
      },
      {
        id: "res-liq-03",
        servicioId: "srv-liquidacion",
        orden: 3,
        titulo: "Bienes que la ley protege",
        texto: "Saber desde el principio qué bienes protege la ley y no entran en la liquidación.",
        icono: "casa",
      },

      {
        id: "res-lit-01",
        servicioId: "srv-litigios",
        orden: 1,
        titulo: "Un abogado en cada audiencia",
        texto:
          "Llevar tu caso ante el tribunal con un abogado que te representa en cada audiencia.",
        icono: "balanza",
      },
      {
        id: "res-lit-02",
        servicioId: "srv-litigios",
        orden: 2,
        titulo: "Respuesta dentro de plazo",
        texto: "Responder una demanda en tu contra dentro de los plazos legales.",
        icono: "reloj",
      },
      {
        id: "res-lit-03",
        servicioId: "srv-litigios",
        orden: 3,
        titulo: "Tu juicio en palabras simples",
        texto: "Entender en qué va tu juicio sin tener que leer el expediente.",
        icono: "lupa",
      },
      {
        id: "res-lit-04",
        servicioId: "srv-litigios",
        orden: 4,
        titulo: "Bienes expuestos y protegidos",
        texto: "Saber qué bienes tuyos están expuestos y cuáles protege la ley.",
        icono: "casa",
      },
    ],

    etapa: [
      {
        id: "etp-reneg-01",
        servicioId: "srv-renegociacion",
        orden: 1,
        visibleParaCliente: true,
        nombreParaCliente: "Revisamos tus antecedentes",
        mensajePrincipal:
          "Recibimos tus documentos y estamos revisando si tu caso cumple los requisitos para renegociar. Es el paso previo a preparar tu solicitud.",
        queHaceLexy:
          "Estamos revisando tus deudas una por una: con quién están, hace cuánto están impagas y cuánto suman. Con eso confirmamos que tu caso cumple lo que la ley exige para entrar a renegociación.",
        queNecesitamosDelCliente:
          "Por ahora nada. Si al revisar nos falta algún documento, tu ejecutiva te lo pide por WhatsApp.",
        quePuedePasarDespues:
          "Si tus deudas cumplen los requisitos, pasamos a preparar tu solicitud. Si todavía no los cumplen, te explicamos qué falta y desde cuándo podrías entrar.",
        plazoEsperado: "Entre 5 y 10 días hábiles desde que recibimos todos tus documentos.",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-02",
        servicioId: "srv-renegociacion",
        orden: 2,
        visibleParaCliente: true,
        nombreParaCliente: "Esperando el atraso en tus deudas",
        mensajePrincipal:
          "Estamos esperando que tus deudas cumplan el período de atraso necesario para poder presentar tu solicitud de renegociación.",
        queHaceLexy:
          "Tu abogado ya revisó tu caso y confirmó que todavía no se cumplen los días de atraso requeridos para acceder a la renegociación. Mientras tanto, monitorearemos el estado de tus deudas para identificar cuándo sea posible avanzar.",
        queNecesitamosDelCliente:
          "Sigue las indicaciones de tu consentimiento informado sobre las deudas que debes dejar de pagar. Si tienes pagos automáticos asociados a esas deudas, recuerda desactivarlos para evitar que se interrumpa la morosidad.",
        quePuedePasarDespues:
          "Cuando se acerque la fecha estimada, tu abogado revisará nuevamente el caso. Si ya cumples los requisitos, tu ejecutiva legal te solicitará los documentos necesarios para presentar la solicitud.",
        plazoEsperado:
          "El avance depende de que tus deudas alcancen los días de atraso exigidos. Te enviamos la fecha aproximada por correo electrónico al firmar tu consentimiento informado. De todos modos, te informaremos cuando corresponda realizar una nueva revisión.",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-03",
        servicioId: "srv-renegociacion",
        orden: 3,
        visibleParaCliente: true,
        nombreParaCliente: "Preparamos tu solicitud",
        mensajePrincipal:
          "Tus deudas ya cumplen el atraso necesario. Estamos armando la solicitud que vamos a presentar ante la Superintendencia.",
        queHaceLexy:
          "Estamos ordenando el detalle de tus deudas, tus ingresos y tus gastos, y redactando la propuesta de pago que vamos a llevar a la mesa.",
        queNecesitamosDelCliente:
          "Necesitamos tus últimas 3 liquidaciones de sueldo y tu certificado de deudas del Boletín Comercial. Tu ejecutiva te explica por WhatsApp cómo enviárnoslos.",
        quePuedePasarDespues:
          "Con tus documentos completos presentamos la solicitud. La Superintendencia tiene que revisarla y declararla admisible para que el proceso parta formalmente.",
        plazoEsperado:
          "Presentamos dentro de los 5 días hábiles siguientes a recibir tus documentos.",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-reneg-04",
        servicioId: "srv-renegociacion",
        orden: 4,
        visibleParaCliente: false,
        nombreParaCliente: "Revisión final antes de presentar",
        mensajePrincipal: "Estamos dando una última revisada a tu solicitud antes de presentarla.",
        queHaceLexy:
          "Un abogado del equipo revisa que la solicitud y los antecedentes estén completos y bien presentados.",
        queNecesitamosDelCliente: "Nada. Es una revisión interna nuestra.",
        quePuedePasarDespues: "Presentamos tu solicitud ante la Superintendencia.",
        plazoEsperado: "Entre 2 y 3 días hábiles.",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-05",
        servicioId: "srv-renegociacion",
        orden: 5,
        visibleParaCliente: true,
        nombreParaCliente: "Tu solicitud está en la Superintendencia",
        mensajePrincipal:
          "Presentamos tu solicitud. Ahora la Superintendencia de Insolvencia y Reemprendimiento la está revisando para declararla admisible.",
        queHaceLexy:
          "Estamos atentos a lo que resuelva la Superintendencia y respondemos cualquier observación que nos haga.",
        queNecesitamosDelCliente:
          "Desde que tu solicitud es admisible no puedes tomar deudas nuevas ni pagarle a un acreedor antes que a otro: eso puede echar abajo el proceso. Si tienes dudas sobre un pago, pregúntale a tu ejecutiva antes de hacerlo.",
        quePuedePasarDespues:
          "Si la solicitud se declara admisible, la Superintendencia cita a la primera audiencia y tus acreedores quedan impedidos de cobrarte mientras dure el proceso. Si observa algo, lo corregimos y volvemos a presentar.",
        plazoEsperado:
          "La Superintendencia suele responder dentro de 5 a 10 días hábiles. Ese plazo lo maneja ella, no nosotros.",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-reneg-06",
        servicioId: "srv-renegociacion",
        orden: 6,
        visibleParaCliente: true,
        nombreParaCliente: "Audiencia para fijar cuánto debes",
        mensajePrincipal:
          "La Superintendencia citó a la audiencia donde queda establecido de manera oficial cuánto debes y a quién.",
        queHaceLexy:
          "Vamos a la audiencia por ti. Revisamos que lo que declara cada acreedor calce con tus antecedentes y objetamos lo que no corresponda.",
        queNecesitamosDelCliente:
          "Avísanos si recibes una carta o un correo de algún acreedor con un monto distinto al que revisamos contigo. Esa información nos sirve para la audiencia.",
        quePuedePasarDespues:
          "Una vez fijado el monto total, la Superintendencia cita a la audiencia de renegociación, donde se discute la propuesta de pago.",
        plazoEsperado: "La fecha la fija la Superintendencia. Te la avisamos apenas la tengamos.",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-reneg-07",
        servicioId: "srv-renegociacion",
        orden: 7,
        visibleParaCliente: true,
        nombreParaCliente: "Audiencia de renegociación",
        mensajePrincipal:
          "Es la audiencia donde se discute con tus acreedores el acuerdo para pagar tus deudas. Es la instancia que define cómo termina tu proceso.",
        queHaceLexy:
          "Presentamos y defendemos tu propuesta de pago frente a tus acreedores, y negociamos las condiciones para que la cuota sea posible con tus ingresos reales.",
        queNecesitamosDelCliente:
          "Necesitamos que estés disponible el día de la audiencia, por si hay que consultarte algo en el momento. Tu ejecutiva te confirma la hora y cómo conectarte.",
        quePuedePasarDespues:
          "Si tus acreedores aceptan la propuesta, se firma el acuerdo y empiezas a pagar según lo pactado. Si no hay acuerdo, el proceso puede pasar a liquidación: te explicamos qué significa antes de que ocurra.",
        plazoEsperado: "La fecha la fija la Superintendencia. Te avisamos apenas esté.",
        nivelUrgencia: "urgente",
      },

      {
        id: "etp-liq-01",
        servicioId: "srv-liquidacion",
        orden: 1,
        visibleParaCliente: true,
        nombreParaCliente: "Revisamos si la liquidación te conviene",
        mensajePrincipal:
          "Estamos estudiando tu situación para confirmar que liquidar es el mejor camino para ti, y no una renegociación.",
        queHaceLexy:
          "Comparamos cuánto debes con lo que podrías llegar a pagar y con los bienes que tienes. Con eso definimos si te conviene renegociar o liquidar.",
        queNecesitamosDelCliente:
          "Por ahora nada. Si necesitamos algún documento más, tu ejecutiva te lo pide.",
        quePuedePasarDespues:
          "Si la liquidación es el camino, preparamos tu solicitud para el tribunal. Si te conviene renegociar, te lo explicamos y cambiamos de ruta.",
        plazoEsperado: "Entre 5 y 10 días hábiles desde que tenemos todos tus antecedentes.",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-liq-02",
        servicioId: "srv-liquidacion",
        orden: 2,
        visibleParaCliente: true,
        nombreParaCliente: "Preparamos tu solicitud",
        mensajePrincipal:
          "Estamos armando la presentación que va al tribunal para pedir la liquidación de tus deudas.",
        queHaceLexy:
          "Redactamos la solicitud y ordenamos el listado de tus deudas, tus bienes y tus ingresos como lo exige el tribunal.",
        queNecesitamosDelCliente:
          "Necesitamos tu declaración de bienes firmada y el listado de tus acreedores. Tu ejecutiva te acompaña a completarlos.",
        quePuedePasarDespues:
          "Con todo completo presentamos al tribunal, que revisa y dicta la resolución de liquidación.",
        plazoEsperado:
          "Presentamos dentro de los 5 días hábiles siguientes a recibir tus documentos.",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-liq-03",
        servicioId: "srv-liquidacion",
        orden: 3,
        visibleParaCliente: true,
        nombreParaCliente: "Tu caso está en el tribunal",
        mensajePrincipal:
          "Presentamos tu solicitud. El tribunal la está revisando para dictar la resolución que abre tu liquidación.",
        queHaceLexy: "Seguimos el expediente y respondemos lo que el tribunal pida.",
        queNecesitamosDelCliente:
          "Nada por ahora. Si te llega una notificación del tribunal, mándasela a tu ejecutiva apenas la recibas.",
        quePuedePasarDespues:
          "Cuando el tribunal dicte la resolución, tus acreedores dejan de poder cobrarte directamente y se designa un liquidador que se hace cargo de tus bienes.",
        plazoEsperado: "Los plazos los maneja el tribunal. Te avisamos apenas haya novedades.",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-liq-04",
        servicioId: "srv-liquidacion",
        orden: 4,
        visibleParaCliente: true,
        nombreParaCliente: "Ya hay un liquidador a cargo",
        mensajePrincipal:
          "El tribunal abrió tu liquidación y designó a un liquidador, que es quien va a ordenar y repartir tus bienes entre tus acreedores.",
        queHaceLexy:
          "Te representamos frente al liquidador y revisamos que solo se considere lo que corresponde por ley. Hay bienes que no se pueden liquidar y los defendemos.",
        queNecesitamosDelCliente:
          "El liquidador te va a pedir información y documentos. Respóndele siempre con copia a tu ejecutiva, así lo revisamos antes de que entregues algo.",
        quePuedePasarDespues:
          "Cuando el liquidador termine de repartir, el tribunal dicta el término del procedimiento y el saldo impago de tus deudas se extingue.",
        plazoEsperado: "Depende de cuántos bienes y acreedores haya. Suele tomar varios meses.",
        nivelUrgencia: "atencion",
      },

      {
        id: "etp-lit-01",
        servicioId: "srv-litigios",
        orden: 1,
        visibleParaCliente: true,
        nombreParaCliente: "Estudiamos tu caso",
        mensajePrincipal:
          "Estamos revisando tus antecedentes para definir con qué argumentos y con qué pruebas conviene ir a tribunales.",
        queHaceLexy:
          "Un abogado está leyendo tus documentos, revisando los plazos que corren y armando la estrategia que le conviene a tu caso.",
        queNecesitamosDelCliente:
          "Si tienes contratos, correos o mensajes relacionados con el caso, mándaselos a tu ejecutiva aunque te parezcan poco importantes.",
        quePuedePasarDespues:
          "Con la estrategia definida, preparamos la demanda o la defensa y la presentamos ante el tribunal.",
        plazoEsperado: "Entre 10 y 15 días hábiles desde que tenemos todos tus antecedentes.",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-lit-02",
        servicioId: "srv-litigios",
        orden: 2,
        visibleParaCliente: true,
        nombreParaCliente: "Presentamos tu caso al tribunal",
        mensajePrincipal:
          "Ya presentamos tu escrito ante el tribunal. Desde ahora el caso avanza según los plazos que fija el propio tribunal.",
        queHaceLexy:
          "Revisamos el expediente periódicamente y respondemos cada trámite dentro de plazo para que el caso no se detenga.",
        queNecesitamosDelCliente:
          "Nada por ahora. Si te notifican algo en tu domicilio o por correo, avísale a tu ejecutiva el mismo día.",
        quePuedePasarDespues:
          "El tribunal notifica a la otra parte y fija la primera audiencia. Te avisamos cuando tengamos fecha.",
        plazoEsperado:
          "Los tiempos los fija el tribunal y varían mucho de un caso a otro. No podemos comprometer una fecha.",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-lit-03",
        servicioId: "srv-litigios",
        orden: 3,
        visibleParaCliente: false,
        nombreParaCliente: "Esperando respuesta del tribunal",
        mensajePrincipal: "",
        queHaceLexy: "",
        queNecesitamosDelCliente: "",
        quePuedePasarDespues: "",
        plazoEsperado: "",
        nivelUrgencia: "tranquilidad",
      },
    ],

    contacto: [
      {
        id: "con-001",
        clienteId: "cli-001",
        nombre: "Camila Rivera",
        rol: "ejecutiva",
        telefonoWhatsapp: "+56 9 6721 4488",
      },
      {
        id: "con-002",
        clienteId: "cli-001",
        nombre: "Matías Fuenzalida",
        rol: "abogado",
        telefonoWhatsapp: "+56 9 5530 9174",
      },
      {
        id: "con-003",
        clienteId: "cli-002",
        nombre: "Camila Rivera",
        rol: "ejecutiva",
        telefonoWhatsapp: "+56 9 6721 4488",
      },
      {
        id: "con-004",
        clienteId: "cli-002",
        nombre: "Matías Fuenzalida",
        rol: "abogado",
        telefonoWhatsapp: "+56 9 5530 9174",
      },
    ],

    cuota: [
      {
        id: "cuo-016",
        clienteId: "cli-001",
        numero: 16,
        fechaVencimiento: "2026-08-06",
        monto: 9450,
        estado: "pagada",
      },
      {
        id: "cuo-017",
        clienteId: "cli-001",
        numero: 17,
        fechaVencimiento: "2026-09-06",
        monto: 9450,
        estado: "pagada",
      },
      {
        id: "cuo-018",
        clienteId: "cli-001",
        numero: 18,
        fechaVencimiento: "2026-10-06",
        monto: 9450,
        estado: "pendiente",
      },
      {
        id: "cuo-019",
        clienteId: "cli-001",
        numero: 19,
        fechaVencimiento: "2026-11-06",
        monto: 9450,
        estado: "pendiente",
      },
      {
        id: "cuo-103",
        clienteId: "cli-002",
        numero: 3,
        fechaVencimiento: "2026-08-15",
        monto: 12900,
        estado: "pagada",
      },
      {
        id: "cuo-104",
        clienteId: "cli-002",
        numero: 4,
        fechaVencimiento: "2026-10-15",
        monto: 12900,
        estado: "pendiente",
      },
    ],

    configuracionPortal: [
      {
        id: "cfg-001",
        correoSoporte: "soporte@defensoriadeudor.cl",
        urlFormularioReclamos: "https://defensoriasalud.typeform.com/reclamos-lexy",
        urlPagoEnLinea:
          "https://market.apio.cl/defensoria-deudor/login?redirect=%2Fdefensoria-deudor%2Fuserpanel%2Fcharges",
        // Cuenta sintética. La real la pone Desarrollo desde el backend, que es
        // de donde tiene que venir: un dato bancario no se escribe en el código.
        titularCuenta: "Servicios Legales Demo SpA",
        banco: "Banco de Chile",
        numeroCuenta: "12-345-67890-01",
        rutTitular: "76.543.210-3",
      },
    ],
  },
};
