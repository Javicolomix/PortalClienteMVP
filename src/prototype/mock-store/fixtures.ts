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
  datasetVersion: 47,
  entities: {
    cliente: [
      // **Los cuatro casos que el portal tiene que saber armar.** No son
      // ejemplos sueltos: cada uno existe para probar una regla distinta de la
      // composición, y entre los cuatro se recorren todas.
      //
      // 1. Esteban — el compuesto en su forma más cargada: cuatro causas y tres
      //    escrituras. Es la pantalla más larga que puede salir.
      // 2. Soledad — un servicio concursal que **gana el bloque del caso** y le
      //    cuelga una causa y una escritura abajo.
      // 3. Juan — una renegociación y nada más: la pantalla más corta.
      // 4. Marcela — **solo la caja de monitoreo**, que no es un juicio. Es el
      //    único caso en que esa caja se mira, porque es lo único que hay.
      {
        id: "cli-001",
        nombre: "Esteban",
        apellido: "Carrasco",
        correo: "esteban.carrasco@example.com",
        rut: "14.208.753-K",
        servicioId: "srv-defensa-juicio",
        etapaActualId: "etp-lit-01",
      },
      {
        id: "cli-002",
        nombre: "Soledad",
        apellido: "Muñoz",
        correo: "soledad.munoz@example.com",
        rut: "13.907.442-K",
        servicioId: "srv-liquidacion",
        etapaActualId: "etp-liq-04",
      },
      {
        id: "cli-003",
        nombre: "Juan",
        apellido: "Cárdenas",
        correo: "juan.cardenas@example.com",
        rut: "16.482.937-5",
        servicioId: "srv-renegociacion",
        etapaActualId: "etp-reneg-06",
      },
      {
        id: "cli-004",
        nombre: "Marcela",
        apellido: "Ibáñez",
        correo: "marcela.ibanez@example.com",
        rut: "14.552.081-2",
        servicioId: "srv-defensa-juicio",
        etapaActualId: "etp-lit-00",
      },
    ],

    caja: [
      // Cada caja es un caso abierto en Streak. El inicio se arma con estas, no
      // con el servicio: por eso una misma persona puede ver el estado de su
      // liquidación y además la lista de sus juicios.

      // Esteban: cuatro causas y tres escrituras. Los cuatro acreedores son
      // distintos y las tres escrituras de tipos distintos, así que se ve la
      // lista larga sin repeticiones que la expliquen. Cada escritura lleva su
      // identificador y **ninguno lleva rótulo delante**: el tipo que va arriba
      // ya dice de qué se trata, así que bajo «Compraventa de Vehículo» una
      // patente se lee como patente y bajo «Compraventa de Inmueble» una calle
      // se lee como dirección. La fila solo se queda sin esa línea cuando el
      // dato viene vacío de Streak.
      {
        id: "caj-001",
        clienteId: "cli-001",
        tipo: "defensaEnJuicio",
        estado: "activa",
        identificador: "C-1502-2026",
        acreedor: "Banco Santander",
        etapaId: "etp-lit-04",
      },
      {
        id: "caj-002",
        clienteId: "cli-001",
        tipo: "defensaEnJuicio",
        estado: "activa",
        identificador: "C-3318-2025",
        acreedor: "Coopeuch",
        etapaId: "etp-lit-01",
      },
      {
        id: "caj-003",
        clienteId: "cli-001",
        tipo: "defensaEnJuicio",
        estado: "activa",
        identificador: "C-5740-2026",
        acreedor: "Banco Falabella",
        etapaId: "etp-lit-02",
      },
      {
        id: "caj-004",
        clienteId: "cli-001",
        tipo: "defensaEnJuicio",
        estado: "activa",
        identificador: "C-9126-2026",
        acreedor: "Caja Los Héroes",
        etapaId: "etp-lit-02",
      },
      {
        id: "caj-005",
        clienteId: "cli-001",
        tipo: "proteccionPatrimonial",
        estado: "activa",
        tipoDeEscritura: "Compraventa de Inmueble",
        identificador: "Los Maitenes 1234, Ñuñoa",
        etapaId: "etp-pp-03",
      },
      {
        id: "caj-006",
        clienteId: "cli-001",
        tipo: "proteccionPatrimonial",
        estado: "activa",
        tipoDeEscritura: "Compraventa de Vehículo",
        identificador: "JLXR·84",
        etapaId: "etp-pp-04",
      },
      {
        id: "caj-007",
        clienteId: "cli-001",
        tipo: "proteccionPatrimonial",
        estado: "activa",
        tipoDeEscritura: "Constitución de Sociedades",
        identificador: "Inversiones Carrasco SpA",
        etapaId: "etp-pp-02",
      },

      // Soledad: la liquidación gana el bloque del caso —renegociación y
      // liquidación ganan siempre— y la causa y la escritura se suman abajo, sin
      // quitarle el lugar.
      {
        id: "caj-008",
        clienteId: "cli-002",
        tipo: "liquidacion",
        estado: "activa",
        identificador: "",
        etapaId: "etp-liq-04",
      },
      {
        id: "caj-009",
        clienteId: "cli-002",
        tipo: "defensaEnJuicio",
        estado: "activa",
        identificador: "C-4471-2026",
        acreedor: "Banco Estado",
        etapaId: "etp-lit-01",
      },
      {
        id: "caj-010",
        clienteId: "cli-002",
        tipo: "proteccionPatrimonial",
        estado: "activa",
        tipoDeEscritura: "Cancelación y Alzamiento de Hipoteca",
        identificador: "Av. Pajaritos 4520, Maipú",
        etapaId: "etp-pp-02",
      },

      // Juan: una renegociación y nada más. Es la pantalla más corta que arma el
      // portal: el bloque del servicio y el estado del caso.
      {
        id: "caj-011",
        clienteId: "cli-003",
        tipo: "renegociacion",
        estado: "activa",
        identificador: "",
        etapaId: "etp-reneg-06",
      },

      // Marcela: **solo la caja de monitoreo**. En Lexy toda persona queda con
      // una en el embudo de juicio ejecutivo, la contrate o no: es una vigilancia
      // por defecto, no un juicio, y por eso nunca entra en la lista de causas ni
      // cuenta al resolver el servicio principal. Este es el único caso en que se
      // mira, porque es lo único que hay.
      {
        id: "caj-012",
        clienteId: "cli-004",
        tipo: "defensaEnJuicio",
        estado: "monitoreo",
        identificador: "",
        etapaId: "etp-lit-00",
      },
    ],

    servicio: [
      {
        id: "srv-renegociacion",
        tipo: "renegociacion",
        nombre: "Renegociación de deudas",
        nombreEnFrase: "La Renegociación",
        resumen:
          "Buscamos un acuerdo con tus acreedores para que pagues tus deudas en cuotas que sí puedas cumplir.",
        queEs:
          "La renegociación es un procedimiento para acordar con tus acreedores nuevas condiciones de pago, acordes a tus ingresos, y salir del sobreendeudamiento.",
      },
      {
        id: "srv-liquidacion",
        tipo: "liquidacion",
        nombre: "Liquidación de deudas",
        nombreEnFrase: "La Liquidación",
        resumen:
          "Cuando ya no es posible pagar, buscamos que un tribunal extinga tus deudas para que puedas partir de nuevo.",
        queEs:
          "La liquidación es un procedimiento ante un tribunal para cuando las deudas ya no se pueden pagar. Un liquidador ordena tus bienes, los reparte según la ley, y el saldo que queda impago se extingue.",
      },
      {
        id: "srv-defensa-juicio",
        tipo: "defensaEnJuicio",
        nombre: "Defensa en juicio",
        nombreEnFrase: "La Defensa en Juicio",
        resumen: "Te representamos ante el tribunal en cada causa que tengas abierta.",
        queEs:
          "En una defensa en juicio llevamos tu caso ante el tribunal: preparamos los escritos, presentamos las pruebas y te representamos en cada audiencia. Si tienes más de una causa, cada una avanza por su cuenta.",
      },
      {
        id: "srv-proteccion-patrimonial",
        tipo: "proteccionPatrimonial",
        nombre: "Protección Patrimonial",
        nombreEnFrase: "La Protección Patrimonial",
        resumen:
          "Ordenamos y resguardamos lo que tienes a tu nombre dentro de lo que permite la ley.",
        queEs:
          "En la protección patrimonial revisamos qué tienes a tu nombre y cómo ordenarlo para dejarlo resguardado dentro de lo que permite la ley. El trabajo se concreta en escrituras, y cada una avanza por su cuenta.",
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
        id: "res-liq-04",
        servicioId: "srv-liquidacion",
        orden: 4,
        titulo: "Las llamadas se terminan",
        texto:
          "Que las cobranzas dejen de llamarte y pasen a tratarse dentro del procedimiento.",
        icono: "silencio",
      },

      {
        id: "res-lit-01",
        servicioId: "srv-defensa-juicio",
        orden: 1,
        titulo: "Un abogado en cada audiencia",
        texto:
          "Llevar tu caso ante el tribunal con un abogado que te representa en cada audiencia.",
        icono: "balanza",
      },
      {
        id: "res-lit-02",
        servicioId: "srv-defensa-juicio",
        orden: 2,
        titulo: "Respuesta dentro de plazo",
        texto: "Responder una demanda en tu contra dentro de los plazos legales.",
        icono: "reloj",
      },
      {
        id: "res-lit-03",
        servicioId: "srv-defensa-juicio",
        orden: 3,
        titulo: "Tu juicio en palabras simples",
        texto: "Entender en qué va tu juicio sin tener que leer el expediente.",
        icono: "lupa",
      },
      {
        id: "res-lit-04",
        servicioId: "srv-defensa-juicio",
        orden: 4,
        titulo: "Embargos discutidos",
        texto: "Discutir ante el tribunal los embargos que pidan en tu contra.",
        icono: "escudo",
      },

      {
        id: "res-pp-01",
        servicioId: "srv-proteccion-patrimonial",
        orden: 1,
        titulo: "Bienes expuestos y protegidos",
        texto: "Saber qué bienes tuyos están expuestos y cuáles protege la ley.",
        // La lupa la tiene «Tu juicio en palabras simples», y con el servicio
        // compuesto los ocho beneficios caen en la misma lista: dos iguales ahí
        // se leen como un dato repetido.
        icono: "inventario",
      },
      {
        id: "res-pp-02",
        servicioId: "srv-proteccion-patrimonial",
        orden: 2,
        titulo: "Tu patrimonio ordenado",
        texto:
          "Dejar por escrito quién es dueño de qué, para que no quede en discusión más adelante.",
        icono: "documento",
      },
      {
        id: "res-pp-03",
        servicioId: "srv-proteccion-patrimonial",
        orden: 3,
        titulo: "Tu casa resguardada",
        texto: "Revisar si tu vivienda puede acogerse a las protecciones que contempla la ley.",
        icono: "casa",
      },
      {
        id: "res-pp-04",
        servicioId: "srv-proteccion-patrimonial",
        orden: 4,
        titulo: "Inscrita, no solo firmada",
        texto:
          "Dejar cada escritura inscrita en el registro que corresponde, que es cuando queda a firme.",
        icono: "sello",
      },
    ],

    etapa: [
      {
        id: "etp-reneg-01",
        servicioId: "srv-renegociacion",
        orden: 1,
        visibleParaCliente: true,
        nombreParaCliente: "Revisamos tus antecedentes",
        mensajePrincipal: "Estamos revisando si tu caso cumple los requisitos para renegociar.",
        queHaceLexy: "Revisamos tus deudas una por una: con quién están y cuánto suman.",
        queNecesitamosDelCliente:
          "Nada por ahora. Si falta algún documento, tu ejecutiva te lo pide.",
        quePuedePasarDespues: "Si cumples los requisitos, preparamos tu solicitud.",
        plazoEsperado: "Entre 5 y 10 días hábiles.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-02",
        servicioId: "srv-renegociacion",
        orden: 2,
        visibleParaCliente: true,
        nombreParaCliente: "Esperando el atraso en tus deudas",
        mensajePrincipal:
          "Tus deudas todavía no cumplen el atraso que la ley exige para renegociar.",
        queHaceLexy: "Vigilamos tus deudas para avisarte apenas se pueda avanzar.",
        queNecesitamosDelCliente:
          "Deja de pagar las deudas que acordamos y desactiva sus pagos automáticos.",
        quePuedePasarDespues:
          "Cuando se cumpla el plazo, te pedimos los documentos para presentar.",
        plazoEsperado: "Depende de tus deudas. Te avisamos cuando toque revisar de nuevo.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-03",
        servicioId: "srv-renegociacion",
        orden: 3,
        visibleParaCliente: true,
        nombreParaCliente: "Reuniendo tus antecedentes",
        mensajePrincipal:
          "Estamos reuniendo los antecedentes necesarios para poder preparar y presentar tu solicitud ante la Superintendencia.",
        queHaceLexy:
          "Tu ejecutivo legal te solicitará la documentación necesaria y estará revisando los documentos que envíes y orientándote durante el proceso, entregándote apoyo e indicaciones cuando sea necesario.",
        queNecesitamosDelCliente:
          "Reúne y carga en el portal los documentos solicitados dentro del plazo indicado, recuerda preguntar si tienes dudas o necesitas apoyo.",
        quePuedePasarDespues:
          "Una vez que hayas reunido toda la documentación, deberás firmar un mandato para que podamos representarte. Luego, tu abogado preparará y presentará tu solicitud ante la Superintendencia.",
        plazoEsperado: "Recuerda que debes enviar la documentación dentro de 10 días hábiles.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-reneg-04",
        servicioId: "srv-renegociacion",
        orden: 4,
        visibleParaCliente: false,
        nombreParaCliente: "Revisión final antes de presentar",
        mensajePrincipal: "Revisamos tu solicitud antes de presentarla.",
        queHaceLexy: "Un abogado comprueba que esté todo completo.",
        queNecesitamosDelCliente: "Nada. Es una revisión interna nuestra.",
        quePuedePasarDespues: "Presentamos tu solicitud ante la Superintendencia.",
        plazoEsperado: "2 o 3 días hábiles.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-05",
        servicioId: "srv-renegociacion",
        orden: 5,
        visibleParaCliente: true,
        nombreParaCliente: "Tu solicitud está en la Superintendencia",
        mensajePrincipal: "Presentamos tu solicitud y la Superintendencia la está revisando.",
        queHaceLexy: "Seguimos la revisión y respondemos cualquier observación.",
        queNecesitamosDelCliente:
          "No tomes deudas nuevas ni le pagues a un acreedor antes que a otro.",
        quePuedePasarDespues: "Si la declaran admisible, tus acreedores no pueden cobrarte.",
        plazoEsperado: "Entre 5 y 10 días hábiles. Ese plazo lo maneja la Superintendencia.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-06",
        servicioId: "srv-renegociacion",
        orden: 6,
        visibleParaCliente: true,
        nombreParaCliente: "Audiencia para fijar cuánto debes",
        mensajePrincipal: "En esta audiencia queda establecido cuánto debes y a quién.",
        queHaceLexy: "Vamos por ti y objetamos lo que no corresponda.",
        queNecesitamosDelCliente:
          "Avísanos si un acreedor te informa un monto distinto al que revisamos.",
        quePuedePasarDespues: "Fijado el monto, se cita a la audiencia de renegociación.",
        plazoEsperado: "La fecha la fija la Superintendencia. Te la avisamos apenas la tengamos.",
        contactoPrincipal: "ambos",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-reneg-08",
        servicioId: "srv-renegociacion",
        orden: 7,
        visibleParaCliente: true,
        nombreParaCliente: "Esperando tu audiencia de renegociación",
        mensajePrincipal:
          "La primera audiencia de tu proceso se realizó sin inconvenientes y los acreedores ya actualizaron los montos de las deudas que forman parte de tu renegociación.",
        queHaceLexy:
          "Estamos haciendo seguimiento de tu caso hasta la fecha de la Audiencia de Renegociación. Durante este periodo, prepararemos una simulación de tu propuesta de pago, considerando tus antecedentes y los montos actualizados de tus deudas. Además, aproximadamente una semana antes de la audiencia, nos pondremos en contacto contigo para actualizar la información de tus ingresos y asegurarnos de que la propuesta refleje correctamente tu situación actual.",
        queNecesitamosDelCliente:
          "Durante este periodo, debes mantener las mismas recomendaciones y restricciones informadas en la etapa anterior. Si tienes alguna duda o se produce algún cambio importante en tu situación económica, comunícaselo a tu abogado.",
        quePuedePasarDespues:
          "En la Audiencia de Renegociación, tu abogado negociará con tus acreedores una propuesta que se ajuste a tu situación y que permita reorganizar tus deudas bajo las mejores condiciones posibles, considerando aspectos como el monto de las cuotas, el plazo, los meses de gracia y, cuando corresponda, las tasas de interés.",
        plazoEsperado:
          "La audiencia se realizará en la fecha específica informada previamente a tu correo electrónico.",
        contactoPrincipal: "abogado",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-07",
        servicioId: "srv-renegociacion",
        orden: 8,
        visibleParaCliente: true,
        nombreParaCliente: "Audiencia de renegociación",
        mensajePrincipal: "Es la audiencia donde se discute el acuerdo con tus acreedores.",
        queHaceLexy: "Defendemos tu propuesta y negociamos una cuota posible con tus ingresos.",
        queNecesitamosDelCliente: "Que estés disponible ese día por si hay que consultarte algo.",
        quePuedePasarDespues: "Si aceptan, se firma el acuerdo y empiezas a pagar lo pactado.",
        plazoEsperado: "La fecha la fija la Superintendencia.",
        contactoPrincipal: "ambos",
        nivelUrgencia: "urgente",
      },

      {
        id: "etp-liq-01",
        servicioId: "srv-liquidacion",
        orden: 1,
        visibleParaCliente: true,
        nombreParaCliente: "Revisamos si la liquidación te conviene",
        mensajePrincipal: "Estamos confirmando si liquidar es el mejor camino para ti.",
        queHaceLexy:
          "Comparamos cuánto debes con lo que podrías pagar y con los bienes que tienes.",
        queNecesitamosDelCliente: "Nada por ahora. Si necesitamos otro documento, te lo pedimos.",
        quePuedePasarDespues: "Si liquidar es el camino, preparamos tu solicitud para el tribunal.",
        plazoEsperado: "Entre 5 y 10 días hábiles.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-liq-05",
        servicioId: "srv-liquidacion",
        orden: 2,
        visibleParaCliente: true,
        nombreParaCliente: "En espera del plazo para comenzar",
        mensajePrincipal:
          "Tu Liquidación es viable y podemos avanzar con ella 🚀. En este momento nos encontramos en una etapa previa a su presentación, por lo que lo más importante es esperar el momento adecuado para iniciar formalmente las gestiones. Por ahora, puedes estar tranquilo 🙌. Estamos atentos para avanzar contigo apenas llegue el momento.",
        queHaceLexy:
          "Nuestro equipo se encuentra preparando y revisando las condiciones necesarias para iniciar tu procedimiento, de manera que la presentación se realice correctamente y sin inconvenientes. 📋⚖️ Una vez que corresponda avanzar, comenzaremos oportunamente con las gestiones necesarias. 🚀",
        queNecesitamosDelCliente:
          "Por ahora, no necesitas realizar ninguna gestión. 🙌 Lo más importante es que nos mantengas informados si recibes alguna demanda, notificación judicial o comunicación relacionada con alguna deuda ⚠️📩. Si ocurre, avísanos de inmediato para que podamos revisar la situación y orientarte oportunamente.",
        quePuedePasarDespues:
          "Una vez cumplida la condición necesaria para iniciar tu procedimiento, comenzaremos formalmente con las gestiones de presentación de tu Liquidación ⚖️📄. A partir de ahí, te iremos informando sobre cada avance y sobre las acciones que correspondan en las siguientes etapas. 🚀",
        plazoEsperado:
          "Estamos a la espera de que se cumpla el plazo indicado por tu abogado ⏳. Este tiempo es necesario para poder iniciar tu procedimiento en las condiciones adecuadas. Una vez cumplido, podremos comenzar con las gestiones correspondientes. Mientras tanto, no debes preocuparte: tu procedimiento sigue siendo viable.",
        contactoPrincipal: "abogado",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-liq-02",
        servicioId: "srv-liquidacion",
        orden: 3,
        visibleParaCliente: true,
        nombreParaCliente: "Preparamos tu solicitud",
        mensajePrincipal: "Estamos preparando la solicitud para el tribunal.",
        queHaceLexy: "Ordenamos el detalle de tus deudas y de tus bienes.",
        queNecesitamosDelCliente:
          "Tu certificado de deudas y los papeles de los bienes a tu nombre.",
        quePuedePasarDespues: "Con todo listo presentamos y el tribunal revisa tu solicitud.",
        plazoEsperado: "5 días hábiles desde que recibimos tus documentos.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-liq-03",
        servicioId: "srv-liquidacion",
        orden: 4,
        visibleParaCliente: true,
        nombreParaCliente: "Tu caso está en el tribunal",
        mensajePrincipal: "Tu solicitud está en el tribunal, esperando resolución.",
        queHaceLexy: "Seguimos el expediente y respondemos lo que el tribunal pida.",
        queNecesitamosDelCliente:
          "Nada por ahora. Si te llega una notificación, avísale a tu ejecutiva.",
        quePuedePasarDespues: "Si el tribunal acoge la solicitud, designa a un liquidador.",
        plazoEsperado: "Los plazos los fija el tribunal. Te avisamos cada avance.",
        contactoPrincipal: "abogado",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-liq-04",
        servicioId: "srv-liquidacion",
        orden: 5,
        visibleParaCliente: true,
        nombreParaCliente: "Ya hay un liquidador a cargo",
        mensajePrincipal: "El tribunal designó un liquidador para tu caso.",
        queHaceLexy: "Acompañamos el proceso y revisamos cada paso del liquidador.",
        queNecesitamosDelCliente: "Responder al liquidador cuando te pida información.",
        quePuedePasarDespues: "Al terminar, el saldo que quede impago se extingue.",
        plazoEsperado: "Depende de cuántos bienes y acreedores haya. Suele tomar meses.",
        contactoPrincipal: "abogado",
        nivelUrgencia: "atencion",
      },

      {
        id: "etp-lit-00",
        servicioId: "srv-defensa-juicio",
        orden: 1,
        visibleParaCliente: true,
        nombreParaCliente: "Vigilando si te demandan",
        mensajePrincipal: "Hoy no tienes ninguna demanda en tu contra.",
        queHaceLexy: "Revisamos los tribunales buscando juicios de cobranza a tu nombre.",
        queNecesitamosDelCliente:
          "Si te llega un papel del tribunal, mándale una foto a tu ejecutiva ese mismo día.",
        quePuedePasarDespues:
          "Si aparece una demanda, la vas a ver acá y un abogado toma la defensa.",
        plazoEsperado: "Es permanente, mientras tengas tu servicio activo.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-lit-01",
        servicioId: "srv-defensa-juicio",
        orden: 2,
        visibleParaCliente: true,
        nombreParaCliente: "Estudiamos tu caso",
        mensajePrincipal: "Estamos revisando tus antecedentes para definir la estrategia.",
        queHaceLexy: "Un abogado lee tus documentos y revisa los plazos que corren.",
        queNecesitamosDelCliente: "Mándale a tu ejecutiva cualquier contrato o mensaje del caso.",
        quePuedePasarDespues: "Con la estrategia lista, presentamos tu defensa ante el tribunal.",
        plazoEsperado: "Entre 10 y 15 días hábiles.",
        contactoPrincipal: "abogado",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-lit-02",
        servicioId: "srv-defensa-juicio",
        orden: 3,
        visibleParaCliente: true,
        nombreParaCliente: "Presentamos tu caso al tribunal",
        mensajePrincipal: "Ya presentamos tu escrito. Ahora los plazos los fija el tribunal.",
        queHaceLexy: "Revisamos el expediente y respondemos cada trámite dentro de plazo.",
        queNecesitamosDelCliente:
          "Si te notifican algo en tu domicilio, avísale a tu ejecutiva ese mismo día.",
        quePuedePasarDespues: "El tribunal notifica a la otra parte y fija la primera audiencia.",
        plazoEsperado: "Los fija el tribunal y varían mucho. No podemos comprometer una fecha.",
        contactoPrincipal: "abogado",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-lit-03",
        servicioId: "srv-defensa-juicio",
        orden: 4,
        visibleParaCliente: false,
        nombreParaCliente: "Esperando respuesta del tribunal",
        mensajePrincipal: "",
        queHaceLexy: "",
        queNecesitamosDelCliente: "",
        quePuedePasarDespues: "",
        plazoEsperado: "",
        contactoPrincipal: "abogado",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-lit-04",
        servicioId: "srv-defensa-juicio",
        orden: 5,
        visibleParaCliente: true,
        nombreParaCliente: "Falta que firmes un documento",
        mensajePrincipal: "Necesitamos tu firma para presentar el escrito dentro del plazo.",
        queHaceLexy:
          "El escrito ya está redactado y revisado. Solo falta tu firma para presentarlo.",
        queNecesitamosDelCliente:
          "Firmar el poder que te envió tu ejecutiva. Sin eso no podemos actuar por ti.",
        quePuedePasarDespues:
          "Con tu firma presentamos dentro de plazo y el juicio sigue su curso.",
        plazoEsperado: "El tribunal fijó una fecha límite. Tu ejecutiva te dice cuál es.",
        contactoPrincipal: "ambos",
        nivelUrgencia: "urgente",
      },
      {
        id: "etp-pp-01",
        servicioId: "srv-proteccion-patrimonial",
        orden: 1,
        visibleParaCliente: true,
        nombreParaCliente: "Estudiamos qué tienes a tu nombre",
        mensajePrincipal: "Estamos revisando qué bienes están a tu nombre.",
        queHaceLexy: "Pedimos los certificados de tus propiedades y vehículos.",
        queNecesitamosDelCliente: "Cuéntanos si tienes bienes que no aparezcan en los registros.",
        quePuedePasarDespues: "Con el catastro listo te explicamos qué se puede proteger.",
        plazoEsperado: "Entre 10 y 15 días hábiles.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-pp-02",
        servicioId: "srv-proteccion-patrimonial",
        orden: 2,
        visibleParaCliente: true,
        nombreParaCliente: "Redactando la escritura",
        mensajePrincipal: "Estamos escribiendo el documento que vas a firmar ante notario.",
        queHaceLexy: "Un abogado redacta el texto y revisa cada cláusula.",
        queNecesitamosDelCliente: "Nada por ahora. Te mandamos el borrador antes de firmar.",
        quePuedePasarDespues: "Si estás de acuerdo con el borrador, coordinamos la firma.",
        plazoEsperado: "Entre 5 y 8 días hábiles.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-pp-03",
        servicioId: "srv-proteccion-patrimonial",
        orden: 3,
        visibleParaCliente: true,
        nombreParaCliente: "Esperando la firma ante notario",
        mensajePrincipal: "El documento está listo. Falta que lo firmes ante notario.",
        queHaceLexy: "Dejamos la escritura en la notaría y un abogado te acompaña.",
        queNecesitamosDelCliente:
          "Ir a firmar con tu cédula vigente. Tu ejecutiva te confirma el día.",
        quePuedePasarDespues:
          "Firmada la escritura, la inscribimos y el resguardo queda constituido.",
        plazoEsperado: "Depende de la hora que tengas para ir a la notaría.",
        contactoPrincipal: "ambos",
        nivelUrgencia: "urgente",
      },
      {
        id: "etp-pp-04",
        servicioId: "srv-proteccion-patrimonial",
        orden: 4,
        visibleParaCliente: true,
        nombreParaCliente: "Inscribiendo tu escritura",
        mensajePrincipal:
          "Ya firmaste. Ahora la estamos inscribiendo para que quede a firme.",
        queHaceLexy:
          "Llevamos la escritura al registro que corresponde y seguimos el trámite.",
        queNecesitamosDelCliente: "Nada. Te avisamos cuando esté inscrita.",
        quePuedePasarDespues:
          "Cuando la inscripción salga, te entregamos la copia y el resguardo queda completo.",
        plazoEsperado: "Entre 15 y 30 días hábiles, según el registro.",
        contactoPrincipal: "ejecutiva",
        nivelUrgencia: "tranquilidad",
      },
    ],

    contacto: [
      // A quién le escribe el botón flotante. Con dos, el panel ofrece los dos;
      // con uno, ese. Juan lleva solo la ejecutiva a propósito: es la variante
      // que hay que poder ver.
      {
        id: "con-001",
        clienteId: "cli-001",
        nombre: "Daniela Soto",
        rol: "ejecutiva",
        telefonoWhatsapp: "+56 9 4418 2036",
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
        nombre: "Andrés Peña",
        rol: "abogado",
        telefonoWhatsapp: "+56 9 7302 6641",
      },
      {
        id: "con-005",
        clienteId: "cli-003",
        nombre: "Camila Rivera",
        rol: "ejecutiva",
        telefonoWhatsapp: "+56 9 6721 4488",
      },
      {
        id: "con-006",
        clienteId: "cli-004",
        nombre: "Daniela Soto",
        rol: "ejecutiva",
        telefonoWhatsapp: "+56 9 4418 2036",
      },
      {
        id: "con-007",
        clienteId: "cli-004",
        nombre: "Andrés Peña",
        rol: "abogado",
        telefonoWhatsapp: "+56 9 7302 6641",
      },
    ],

    cuota: [
      // Esteban: doce cuotas, siete pagadas. El plan largo.
      {
        id: "cuo-101",
        clienteId: "cli-001",
        numero: 1,
        fechaVencimiento: "2026-03-08",
        monto: 148000,
        estado: "pagada",
        fechaPago: "2026-03-07",
      },
      {
        id: "cuo-102",
        clienteId: "cli-001",
        numero: 2,
        fechaVencimiento: "2026-04-08",
        monto: 148000,
        estado: "pagada",
        fechaPago: "2026-04-08",
      },
      {
        id: "cuo-103",
        clienteId: "cli-001",
        numero: 3,
        fechaVencimiento: "2026-05-08",
        monto: 148000,
        estado: "pagada",
        fechaPago: "2026-05-11",
      },
      {
        id: "cuo-104",
        clienteId: "cli-001",
        numero: 4,
        fechaVencimiento: "2026-06-08",
        monto: 148000,
        estado: "pagada",
        fechaPago: "2026-06-08",
      },
      {
        id: "cuo-105",
        clienteId: "cli-001",
        numero: 5,
        fechaVencimiento: "2026-07-08",
        monto: 148000,
        estado: "pagada",
        fechaPago: "2026-07-07",
      },
      {
        id: "cuo-106",
        clienteId: "cli-001",
        numero: 6,
        fechaVencimiento: "2026-08-08",
        monto: 148000,
        estado: "pagada",
        fechaPago: "2026-08-08",
      },
      {
        id: "cuo-107",
        clienteId: "cli-001",
        numero: 7,
        fechaVencimiento: "2026-09-08",
        monto: 148000,
        estado: "pagada",
        fechaPago: "2026-09-09",
      },
      {
        id: "cuo-108",
        clienteId: "cli-001",
        numero: 8,
        fechaVencimiento: "2026-10-08",
        monto: 148000,
        estado: "pendiente",
      },
      {
        id: "cuo-109",
        clienteId: "cli-001",
        numero: 9,
        fechaVencimiento: "2026-11-08",
        monto: 148000,
        estado: "pendiente",
      },
      {
        id: "cuo-110",
        clienteId: "cli-001",
        numero: 10,
        fechaVencimiento: "2026-12-08",
        monto: 148000,
        estado: "pendiente",
      },
      {
        id: "cuo-111",
        clienteId: "cli-001",
        numero: 11,
        fechaVencimiento: "2027-01-08",
        monto: 148000,
        estado: "pendiente",
      },
      {
        id: "cuo-112",
        clienteId: "cli-001",
        numero: 12,
        fechaVencimiento: "2027-02-08",
        monto: 148000,
        estado: "pendiente",
      },

      // Soledad: el plan con los **tres estados a la vista** —cuatro pagadas,
      // dos morosas y cuatro por venir—. Es la cartera que se abre para
      // comprobar que el historial muestra el plan entero y no solo lo que ya
      // pasó por caja. Las dos morosas son las dos últimas vencidas; las
      // pendientes vencen todas después de hoy, que es la única forma de que
      // una cuota impaga no sea morosa.
      {
        id: "cuo-201",
        clienteId: "cli-002",
        numero: 1,
        fechaVencimiento: "2026-04-05",
        monto: 115000,
        estado: "pagada",
        fechaPago: "2026-04-04",
      },
      {
        id: "cuo-202",
        clienteId: "cli-002",
        numero: 2,
        fechaVencimiento: "2026-05-05",
        monto: 115000,
        estado: "pagada",
        fechaPago: "2026-05-05",
      },
      {
        id: "cuo-203",
        clienteId: "cli-002",
        numero: 3,
        fechaVencimiento: "2026-06-05",
        monto: 115000,
        estado: "pagada",
        fechaPago: "2026-06-08",
      },
      {
        id: "cuo-204",
        clienteId: "cli-002",
        numero: 4,
        fechaVencimiento: "2026-07-05",
        monto: 115000,
        estado: "pagada",
        fechaPago: "2026-07-03",
      },
      {
        id: "cuo-205",
        clienteId: "cli-002",
        numero: 5,
        fechaVencimiento: "2026-08-05",
        monto: 115000,
        estado: "morosa",
      },
      {
        id: "cuo-206",
        clienteId: "cli-002",
        numero: 6,
        fechaVencimiento: "2026-09-05",
        monto: 115000,
        estado: "morosa",
      },
      {
        id: "cuo-207",
        clienteId: "cli-002",
        numero: 7,
        fechaVencimiento: "2026-10-05",
        monto: 115000,
        estado: "pendiente",
      },
      {
        id: "cuo-208",
        clienteId: "cli-002",
        numero: 8,
        fechaVencimiento: "2026-11-05",
        monto: 115000,
        estado: "pendiente",
      },
      {
        id: "cuo-209",
        clienteId: "cli-002",
        numero: 9,
        fechaVencimiento: "2026-12-05",
        monto: 115000,
        estado: "pendiente",
      },
      {
        id: "cuo-210",
        clienteId: "cli-002",
        numero: 10,
        fechaVencimiento: "2027-01-05",
        monto: 115000,
        estado: "pendiente",
      },

      // Juan: diez cuotas y ocho pagadas. El plan que va llegando al final.
      {
        id: "cuo-301",
        clienteId: "cli-003",
        numero: 1,
        fechaVencimiento: "2026-02-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-02-05",
      },
      {
        id: "cuo-302",
        clienteId: "cli-003",
        numero: 2,
        fechaVencimiento: "2026-03-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-03-06",
      },
      {
        id: "cuo-303",
        clienteId: "cli-003",
        numero: 3,
        fechaVencimiento: "2026-04-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-04-07",
      },
      {
        id: "cuo-304",
        clienteId: "cli-003",
        numero: 4,
        fechaVencimiento: "2026-05-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-05-06",
      },
      {
        id: "cuo-305",
        clienteId: "cli-003",
        numero: 5,
        fechaVencimiento: "2026-06-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-06-05",
      },
      {
        id: "cuo-306",
        clienteId: "cli-003",
        numero: 6,
        fechaVencimiento: "2026-07-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-07-06",
      },
      {
        id: "cuo-307",
        clienteId: "cli-003",
        numero: 7,
        fechaVencimiento: "2026-08-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-08-06",
      },
      {
        id: "cuo-308",
        clienteId: "cli-003",
        numero: 8,
        fechaVencimiento: "2026-09-06",
        monto: 94500,
        estado: "pagada",
        fechaPago: "2026-09-05",
      },
      {
        id: "cuo-309",
        clienteId: "cli-003",
        numero: 9,
        fechaVencimiento: "2026-10-06",
        monto: 94500,
        estado: "pendiente",
      },
      {
        id: "cuo-310",
        clienteId: "cli-003",
        numero: 10,
        fechaVencimiento: "2026-11-06",
        monto: 94500,
        estado: "pendiente",
      },

      // Marcela: seis cuotas, dos pagadas. El plan recién arrancado.
      {
        id: "cuo-401",
        clienteId: "cli-004",
        numero: 1,
        fechaVencimiento: "2026-08-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-08-13",
      },
      {
        id: "cuo-402",
        clienteId: "cli-004",
        numero: 2,
        fechaVencimiento: "2026-09-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-09-14",
      },
      {
        id: "cuo-403",
        clienteId: "cli-004",
        numero: 3,
        fechaVencimiento: "2026-10-14",
        monto: 62000,
        estado: "pendiente",
      },
      {
        id: "cuo-404",
        clienteId: "cli-004",
        numero: 4,
        fechaVencimiento: "2026-11-14",
        monto: 62000,
        estado: "pendiente",
      },
      {
        id: "cuo-405",
        clienteId: "cli-004",
        numero: 5,
        fechaVencimiento: "2026-12-14",
        monto: 62000,
        estado: "pendiente",
      },
      {
        id: "cuo-406",
        clienteId: "cli-004",
        numero: 6,
        fechaVencimiento: "2027-01-14",
        monto: 62000,
        estado: "pendiente",
      },
    ],

    configuracionPortal: [
      {
        id: "cfg-001",
        correoSoporte: "soporte@defensoriadeudor.cl",
        urlFormularioReclamos: "https://defensoriasalud.typeform.com/reclamos-lexy",
        // El enlace corto de reseña que entrega Google desde la ficha del
        // negocio. Reemplaza a la URL de búsqueda larga que se usaba antes, que
        // traía parámetros de la sesión del navegador de quien la copió y abría
        // la ficha entera en vez del formulario.
        urlResenasGoogle: "https://g.page/r/CZfUgMb0w7hAEBM/review",
        urlPagoEnLinea:
          "https://market.apio.cl/defensoria-deudor/login?redirect=%2Fdefensoria-deudor%2Fuserpanel%2Fcharges",
        // La cuenta de recaudación real, que la entregó el diseñador. No es un
        // dato personal: es la cuenta a la que se le transfiere y está para
        // mostrarse. En producción igual tiene que venir del backend — si
        // Finanzas la cambia, nadie debería tener que tocar el código.
        titularCuenta: "Asesorías Jurídicas Moller y Abadie Limitada",
        banco: "Banco de Chile",
        numeroCuenta: "00-162-36534-09",
        rutTitular: "77.727.144-K",
        // Finanzas atiende a toda la cartera por un solo número, a diferencia
        // de la ejecutiva y el abogado, que van por caso. Por eso vive acá y no
        // en `contacto`. Va el número y no el nombre: el portal nombra el cargo.
        telefonoFinanzas: "+56 9 8136 4658",
      },
    ],
  },
};
