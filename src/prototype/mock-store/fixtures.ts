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
  datasetVersion: 53,
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
      // 5. Patricia — **la liquidación detenida**. No prueba una regla de
      //    composición, como los cuatro de arriba, sino la de contactos: es la
      //    única cuya etapa de liquidación está «En espera», y por eso la única
      //    a la que el panel de WhatsApp le ofrece dos personas en vez de una.
      //    Soledad se queda donde está a propósito: entre las dos se ven las dos
      //    ramas de la regla sin tener que mover a nadie.
      {
        id: "cli-005",
        nombre: "Patricia",
        apellido: "Zúñiga",
        correo: "patricia.zuniga@example.com",
        rut: "15.734.209-6",
        servicioId: "srv-liquidacion",
        etapaActualId: "etp-liq-05",
      },
      // 6. Cristóbal — la misma liquidación detenida que Patricia, pero **sin
      //    juicio**. Es la otra mitad de la regla: cuando no hay causa, el
      //    segundo contacto sale de la escritura. Entre él y Patricia se ve por
      //    qué el juicio manda cuando están los dos.
      {
        id: "cli-006",
        nombre: "Cristóbal",
        apellido: "Reyes",
        correo: "cristobal.reyes@example.com",
        rut: "12.845.663-1",
        servicioId: "srv-liquidacion",
        etapaActualId: "etp-liq-05",
      },
      // 7. Gabriela — **la regla de «Demandado»**. Dos cajas de renegociación:
      //    una en «Demandado», que es el duplicado que Streak crea cuando la
      //    demandan, y la real. El caso tiene que contar la real, y la demanda
      //    aparece como juicio abajo.
      {
        id: "cli-007",
        nombre: "Gabriela",
        apellido: "Salinas",
        correo: "gabriela.salinas@example.com",
        rut: "17.209.554-8",
        servicioId: "srv-renegociacion",
        etapaActualId: "etp-reneg-05",
      },
      // 8. Tomás — **renegociación archivada**. Su única caja de RN está
      //    cerrada, así que renegociación deja de ser el servicio principal y
      //    manda lo que sigue: sus dos juicios.
      {
        id: "cli-008",
        nombre: "Tomás",
        apellido: "Miranda",
        correo: "tomas.miranda@example.com",
        rut: "13.660.812-4",
        servicioId: "srv-renegociacion",
        etapaActualId: "etp-reneg-09",
      },
      // 9. Ximena — **las dos exclusiones de escrituras y la causa concursal**.
      //    Tiene una caja madre, una caja obrera con el rol de madre en otra
      //    etapa, una escritura de verdad y una causa en «Concursal» que no debe
      //    contar como juicio.
      {
        id: "cli-009",
        nombre: "Ximena",
        apellido: "Ortega",
        correo: "ximena.ortega@example.com",
        rut: "11.480.327-9",
        servicioId: "srv-proteccion-patrimonial",
        etapaActualId: "etp-pp-02",
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
        identificador: "C-1502-2026",
        acreedor: "Banco Santander",
        etapaId: "etp-lit-04",
      },
      {
        id: "caj-002",
        clienteId: "cli-001",
        tipo: "defensaEnJuicio",
        identificador: "C-3318-2025",
        acreedor: "Coopeuch",
        etapaId: "etp-lit-01",
      },
      {
        id: "caj-003",
        clienteId: "cli-001",
        tipo: "defensaEnJuicio",
        identificador: "C-5740-2026",
        acreedor: "Banco Falabella",
        etapaId: "etp-lit-02",
      },
      {
        id: "caj-004",
        clienteId: "cli-001",
        tipo: "defensaEnJuicio",
        identificador: "C-9126-2026",
        acreedor: "Caja Los Héroes",
        etapaId: "etp-lit-02",
      },
      {
        id: "caj-005",
        clienteId: "cli-001",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Compraventa de Inmueble",
        identificador: "Los Maitenes 1234, Ñuñoa",
        etapaId: "etp-pp-03",
      },
      {
        id: "caj-006",
        clienteId: "cli-001",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Compraventa de Vehículo",
        identificador: "JLXR·84",
        etapaId: "etp-pp-04",
      },
      {
        id: "caj-007",
        clienteId: "cli-001",
        tipo: "proteccionPatrimonial",
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
        identificador: "",
        etapaId: "etp-liq-04",
      },
      {
        id: "caj-009",
        clienteId: "cli-002",
        tipo: "defensaEnJuicio",
        identificador: "C-4471-2026",
        acreedor: "Banco Estado",
        etapaId: "etp-lit-01",
      },
      {
        id: "caj-010",
        clienteId: "cli-002",
        tipo: "proteccionPatrimonial",
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
        identificador: "",
        etapaId: "etp-reneg-06",
      },

      // Patricia: la liquidación en «En espera» y, mientras tanto, una causa y
      // una escritura andando. Es exactamente el supuesto de la regla: el caso
      // concursal está detenido y lo que se mueve es el otro frente.
      {
        id: "caj-013",
        clienteId: "cli-005",
        tipo: "liquidacion",
        identificador: "",
        etapaId: "etp-liq-05",
      },
      {
        id: "caj-014",
        clienteId: "cli-005",
        tipo: "defensaEnJuicio",
        identificador: "C-2208-2026",
        acreedor: "Banco BICE",
        etapaId: "etp-lit-02",
      },
      {
        id: "caj-015",
        clienteId: "cli-005",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Declaración de Bien Familiar",
        identificador: "Pasaje Lircay 870, La Florida",
        etapaId: "etp-pp-02",
      },

      // Cristóbal: liquidación detenida y dos escrituras, **sin ninguna causa**.
      // Sin juicio que corra, lo que sigue andando es la protección
      // patrimonial, y de ahí sale su segundo contacto.
      {
        id: "caj-016",
        clienteId: "cli-006",
        tipo: "liquidacion",
        identificador: "",
        etapaId: "etp-liq-05",
      },
      {
        id: "caj-017",
        clienteId: "cli-006",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Declaración de Bien Familiar",
        identificador: "Camino El Roble 3155, Peñalolén",
        etapaId: "etp-pp-03",
      },
      {
        id: "caj-018",
        clienteId: "cli-006",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Constitución de Sociedades",
        identificador: "Comercial Reyes y Compañía Ltda.",
        etapaId: "etp-pp-02",
      },

      // Gabriela: la caja de RN real y su duplicado de «Demandado», más la
      // causa que originó ese duplicado. El caso cuenta la real; el duplicado
      // no se muestra en ninguna parte.
      {
        id: "caj-019",
        clienteId: "cli-007",
        tipo: "renegociacion",
        identificador: "",
        etapaId: "etp-reneg-05",
      },
      {
        id: "caj-020",
        clienteId: "cli-007",
        tipo: "renegociacion",
        identificador: "",
        etapaId: "etp-reneg-11",
      },
      {
        id: "caj-021",
        clienteId: "cli-007",
        tipo: "defensaEnJuicio",
        identificador: "C-6103-2026",
        acreedor: "Scotiabank",
        etapaId: "etp-lit-01",
      },

      // Tomás: renegociación archivada —deja de contar— y dos causas reales.
      {
        id: "caj-022",
        clienteId: "cli-008",
        tipo: "renegociacion",
        identificador: "",
        etapaId: "etp-reneg-09",
      },
      {
        id: "caj-023",
        clienteId: "cli-008",
        tipo: "defensaEnJuicio",
        identificador: "C-7741-2026",
        acreedor: "Banco Security",
        etapaId: "etp-lit-03",
      },
      {
        id: "caj-024",
        clienteId: "cli-008",
        tipo: "defensaEnJuicio",
        identificador: "C-8890-2025",
        acreedor: "Caja Los Andes",
        etapaId: "etp-lit-02",
      },

      // Ximena: las cuatro exclusiones juntas. La caja madre por etapa, la que
      // avanzó de etapa sin dejar de ser madre, una gestión abortada —que no se
      // muestra aunque haya otras escrituras al lado— y una causa que el
      // concurso ya absorbió. Lo único que se muestra es la escritura de verdad.
      {
        id: "caj-025",
        clienteId: "cli-009",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Constitución de Sociedades",
        identificador: "",
        etapaId: "etp-pp-05",
      },
      {
        id: "caj-026",
        clienteId: "cli-009",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Constitución de Sociedades",
        identificador: "Agrícola Ortega SpA",
        esCajaMadre: true,
        etapaId: "etp-pp-02",
      },
      {
        id: "caj-027",
        clienteId: "cli-009",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Declaración de Bien Familiar",
        identificador: "Los Nogales 455, Quilpué",
        etapaId: "etp-pp-03",
      },
      {
        id: "caj-030",
        clienteId: "cli-009",
        tipo: "proteccionPatrimonial",
        tipoDeEscritura: "Compraventa de Vehículo",
        identificador: "KDPT·19",
        etapaId: "etp-pp-06",
      },
      {
        id: "caj-028",
        clienteId: "cli-009",
        tipo: "defensaEnJuicio",
        identificador: "C-4417-2025",
        acreedor: "Banco Ripley",
        etapaId: "etp-lit-05",
      },
      {
        id: "caj-029",
        clienteId: "cli-009",
        tipo: "defensaEnJuicio",
        identificador: "",
        etapaId: "etp-lit-00",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "liquidacionEnEspera",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "monitoreo",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
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
        clase: "corriente",
        nivelUrgencia: "tranquilidad",
      },

      // **Las etapas con regla propia.** No describen un avance: son las que el
      // documento de reglas nombra una por una porque cambian qué se muestra.
      // Van juntas al final para que se vean como lo que son.
      {
        id: "etp-reneg-09",
        servicioId: "srv-renegociacion",
        orden: 9,
        visibleParaCliente: true,
        nombreParaCliente: "Tu renegociación se cerró",
        mensajePrincipal: "Esta gestión de renegociación quedó cerrada.",
        queHaceLexy: "Nada: la gestión terminó. Si abrimos otra, la vas a ver acá.",
        queNecesitamosDelCliente: "Nada por ahora.",
        quePuedePasarDespues: "Si más adelante corresponde otro camino, tu ejecutiva te lo propone.",
        plazoEsperado: "No aplica: la gestión ya terminó.",
        contactoPrincipal: "ejecutiva",
        clase: "archivada",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-10",
        servicioId: "srv-renegociacion",
        orden: 10,
        visibleParaCliente: true,
        nombreParaCliente: "Tu caso pasa a liquidación",
        mensajePrincipal: "Tu caso deja la renegociación y sigue por el camino de la liquidación.",
        queHaceLexy: "Preparamos el traspaso para que no pierdas tiempo entre un procedimiento y otro.",
        queNecesitamosDelCliente: "Nada por ahora. Tu ejecutiva te explica qué cambia.",
        quePuedePasarDespues: "Se abre tu caso de liquidación y desde ahí seguimos.",
        plazoEsperado: "Unos días hábiles.",
        contactoPrincipal: "ejecutiva",
        clase: "aLiquidacion",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-reneg-11",
        servicioId: "srv-renegociacion",
        orden: 11,
        visibleParaCliente: true,
        nombreParaCliente: "Te llegó una demanda",
        mensajePrincipal: "Recibimos una demanda en tu contra mientras tu renegociación avanza.",
        queHaceLexy: "Abrimos la causa en litigios para responderla dentro de plazo.",
        queNecesitamosDelCliente: "Si te llega un papel del tribunal, mándanos una foto el mismo día.",
        quePuedePasarDespues: "La causa sigue en «Mis juicios» y tu renegociación continúa por su cuenta.",
        plazoEsperado: "Los plazos los fija el tribunal.",
        contactoPrincipal: "abogado",
        clase: "demandado",
        nivelUrgencia: "atencion",
      },
      {
        id: "etp-lit-05",
        servicioId: "srv-defensa-juicio",
        orden: 6,
        visibleParaCliente: true,
        nombreParaCliente: "Tu causa entró al concurso",
        mensajePrincipal: "Esta causa quedó dentro de tu procedimiento concursal y ya no avanza por separado.",
        queHaceLexy: "La seguimos dentro del concurso, que es donde ahora se resuelve.",
        queNecesitamosDelCliente: "Nada por ahora.",
        quePuedePasarDespues: "Lo que pase con esta deuda se decide en el procedimiento concursal.",
        plazoEsperado: "Los plazos son los del concurso.",
        contactoPrincipal: "abogado",
        clase: "concursal",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-pp-05",
        servicioId: "srv-proteccion-patrimonial",
        orden: 5,
        visibleParaCliente: false,
        nombreParaCliente: "Tu servicio de escrituras",
        mensajePrincipal: "Esta es la carpeta que agrupa tus escrituras.",
        queHaceLexy: "Desde acá abrimos cada gestión que corresponda.",
        queNecesitamosDelCliente: "Nada: cada gestión tiene su propia ficha.",
        quePuedePasarDespues: "Cada escritura avanza por su cuenta.",
        plazoEsperado: "No aplica.",
        contactoPrincipal: "ejecutiva",
        clase: "cajaMadre",
        nivelUrgencia: "tranquilidad",
      },
      {
        id: "etp-pp-06",
        servicioId: "srv-proteccion-patrimonial",
        orden: 6,
        visibleParaCliente: true,
        nombreParaCliente: "Gestión no realizada",
        mensajePrincipal: "Esta gestión no se llegó a hacer.",
        queHaceLexy: "Revisamos si corresponde retomarla más adelante.",
        queNecesitamosDelCliente: "Nada por ahora.",
        quePuedePasarDespues: "Si corresponde retomarla, tu ejecutiva te lo propone.",
        plazoEsperado: "No aplica: la gestión no siguió.",
        contactoPrincipal: "ejecutiva",
        clase: "gestionAbortada",
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
        servicioTipo: "defensaEnJuicio",
        telefonoWhatsapp: "+56 9 4418 2036",
      },
      {
        id: "con-002",
        clienteId: "cli-001",
        nombre: "Matías Fuenzalida",
        rol: "abogado",
        servicioTipo: "defensaEnJuicio",
        telefonoWhatsapp: "+56 9 5530 9174",
      },
      {
        id: "con-003",
        clienteId: "cli-002",
        nombre: "Camila Rivera",
        rol: "ejecutiva",
        servicioTipo: "liquidacion",
        telefonoWhatsapp: "+56 9 6721 4488",
      },
      {
        id: "con-004",
        clienteId: "cli-002",
        nombre: "Andrés Peña",
        rol: "abogado",
        servicioTipo: "liquidacion",
        telefonoWhatsapp: "+56 9 7302 6641",
      },
      {
        id: "con-005",
        clienteId: "cli-003",
        nombre: "Camila Rivera",
        rol: "ejecutiva",
        servicioTipo: "renegociacion",
        telefonoWhatsapp: "+56 9 6721 4488",
      },
      {
        id: "con-006",
        clienteId: "cli-004",
        nombre: "Daniela Soto",
        rol: "ejecutiva",
        servicioTipo: "defensaEnJuicio",
        telefonoWhatsapp: "+56 9 4418 2036",
      },
      // Patricia tiene **uno por servicio**, y es el único caso donde el panel
      // muestra los dos. Sin `servicioTipo` las dos filas dirían «Tu abogado» y
      // «Tu ejecutiva» sin decir de qué, que es justo lo que había que resolver.
      {
        id: "con-008",
        clienteId: "cli-005",
        nombre: "Rodrigo Cifuentes",
        rol: "abogado",
        servicioTipo: "liquidacion",
        telefonoWhatsapp: "+56 9 8264 1179",
      },
      {
        id: "con-009",
        clienteId: "cli-005",
        nombre: "María Coloma",
        rol: "ejecutiva",
        servicioTipo: "defensaEnJuicio",
        telefonoWhatsapp: "+56 9 3915 7420",
      },
      // Cristóbal: el mismo reparto que Patricia, pero el segundo es de
      // protección patrimonial. El panel los nombra igual de distinto.
      {
        id: "con-010",
        clienteId: "cli-006",
        nombre: "Rodrigo Cifuentes",
        rol: "abogado",
        servicioTipo: "liquidacion",
        telefonoWhatsapp: "+56 9 8264 1179",
      },
      {
        id: "con-011",
        clienteId: "cli-006",
        nombre: "Javiera Bustos",
        rol: "ejecutiva",
        servicioTipo: "proteccionPatrimonial",
        telefonoWhatsapp: "+56 9 5487 3310",
      },
      // Gabriela tiene equipo en los tres embudos a propósito: con renegociación
      // de servicio principal, el panel tiene que ofrecer **solo** el de
      // renegociación aunque el de litigios exista y ella tenga un juicio.
      {
        id: "con-012",
        clienteId: "cli-007",
        nombre: "Paulina Tapia",
        rol: "ejecutiva",
        servicioTipo: "renegociacion",
        telefonoWhatsapp: "+56 9 7156 2284",
      },
      {
        id: "con-013",
        clienteId: "cli-007",
        nombre: "Ignacio Valdés",
        rol: "abogado",
        servicioTipo: "renegociacion",
        telefonoWhatsapp: "+56 9 6033 4471",
      },
      {
        id: "con-014",
        clienteId: "cli-007",
        nombre: "Felipe Araya",
        rol: "abogado",
        servicioTipo: "defensaEnJuicio",
        telefonoWhatsapp: "+56 9 4490 8815",
      },
      // Tomás: con la renegociación archivada, manda litigios. Su ejecutiva de
      // renegociación queda cargada y no debe salir.
      {
        id: "con-015",
        clienteId: "cli-008",
        nombre: "Paulina Tapia",
        rol: "ejecutiva",
        servicioTipo: "renegociacion",
        telefonoWhatsapp: "+56 9 7156 2284",
      },
      {
        id: "con-016",
        clienteId: "cli-008",
        nombre: "Felipe Araya",
        rol: "abogado",
        servicioTipo: "defensaEnJuicio",
        telefonoWhatsapp: "+56 9 4490 8815",
      },
      // Ximena: protección patrimonial manda, así que sale su equipo de PP y no
      // el de litigios, aunque tenga una causa —concursal, que no cuenta—.
      {
        id: "con-017",
        clienteId: "cli-009",
        nombre: "Javiera Bustos",
        rol: "ejecutiva",
        servicioTipo: "proteccionPatrimonial",
        telefonoWhatsapp: "+56 9 5487 3310",
      },
      {
        id: "con-018",
        clienteId: "cli-009",
        nombre: "Felipe Araya",
        rol: "abogado",
        servicioTipo: "defensaEnJuicio",
        telefonoWhatsapp: "+56 9 4490 8815",
      },
      {
        id: "con-007",
        clienteId: "cli-004",
        nombre: "Andrés Peña",
        rol: "abogado",
        servicioTipo: "defensaEnJuicio",
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

      // Marcela: **el plan terminado**. Seis cuotas, las seis pagadas: es la
      // cartera con que se ve la pantalla de quien ya no debe nada.
      {
        id: "cuo-401",
        clienteId: "cli-004",
        numero: 1,
        fechaVencimiento: "2026-03-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-03-13",
      },
      {
        id: "cuo-402",
        clienteId: "cli-004",
        numero: 2,
        fechaVencimiento: "2026-04-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-04-14",
      },
      {
        id: "cuo-403",
        clienteId: "cli-004",
        numero: 3,
        fechaVencimiento: "2026-05-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-05-16",
      },
      {
        id: "cuo-404",
        clienteId: "cli-004",
        numero: 4,
        fechaVencimiento: "2026-06-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-06-13",
      },
      {
        id: "cuo-405",
        clienteId: "cli-004",
        numero: 5,
        fechaVencimiento: "2026-07-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-07-14",
      },
      {
        id: "cuo-406",
        clienteId: "cli-004",
        numero: 6,
        fechaVencimiento: "2026-08-14",
        monto: 62000,
        estado: "pagada",
        fechaPago: "2026-08-12",
      },

      // Gabriela, Tomás y Ximena: planes cortos y al día. Están para probar
      // reglas de composición, no de cobranza.
      {
        id: "cuo-701",
        clienteId: "cli-007",
        numero: 1,
        fechaVencimiento: "2026-07-10",
        monto: 96000,
        estado: "pagada",
        fechaPago: "2026-07-09",
      },
      {
        id: "cuo-702",
        clienteId: "cli-007",
        numero: 2,
        fechaVencimiento: "2026-08-10",
        monto: 96000,
        estado: "pagada",
        fechaPago: "2026-08-10",
      },
      {
        id: "cuo-703",
        clienteId: "cli-007",
        numero: 3,
        fechaVencimiento: "2026-09-10",
        monto: 96000,
        estado: "pendiente",
      },
      {
        id: "cuo-704",
        clienteId: "cli-007",
        numero: 4,
        fechaVencimiento: "2026-10-10",
        monto: 96000,
        estado: "pendiente",
      },
      {
        id: "cuo-705",
        clienteId: "cli-007",
        numero: 5,
        fechaVencimiento: "2026-11-10",
        monto: 96000,
        estado: "pendiente",
      },
      {
        id: "cuo-801",
        clienteId: "cli-008",
        numero: 1,
        fechaVencimiento: "2026-04-10",
        monto: 89000,
        estado: "pagada",
        fechaPago: "2026-04-09",
      },
      {
        id: "cuo-802",
        clienteId: "cli-008",
        numero: 2,
        fechaVencimiento: "2026-05-10",
        monto: 89000,
        estado: "pagada",
        fechaPago: "2026-05-10",
      },
      {
        id: "cuo-803",
        clienteId: "cli-008",
        numero: 3,
        fechaVencimiento: "2026-06-10",
        monto: 89000,
        estado: "pagada",
        fechaPago: "2026-06-12",
      },
      {
        id: "cuo-804",
        clienteId: "cli-008",
        numero: 4,
        fechaVencimiento: "2026-07-10",
        monto: 89000,
        estado: "pagada",
        fechaPago: "2026-07-10",
      },
      {
        id: "cuo-805",
        clienteId: "cli-008",
        numero: 5,
        fechaVencimiento: "2026-08-10",
        monto: 89000,
        estado: "morosa",
      },
      {
        id: "cuo-901",
        clienteId: "cli-009",
        numero: 1,
        fechaVencimiento: "2026-07-10",
        monto: 112000,
        estado: "pagada",
        fechaPago: "2026-07-09",
      },
      {
        id: "cuo-902",
        clienteId: "cli-009",
        numero: 2,
        fechaVencimiento: "2026-08-10",
        monto: 112000,
        estado: "pagada",
        fechaPago: "2026-08-10",
      },
      {
        id: "cuo-903",
        clienteId: "cli-009",
        numero: 3,
        fechaVencimiento: "2026-09-10",
        monto: 112000,
        estado: "pendiente",
      },
      {
        id: "cuo-904",
        clienteId: "cli-009",
        numero: 4,
        fechaVencimiento: "2026-10-10",
        monto: 112000,
        estado: "pendiente",
      },
      {
        id: "cuo-905",
        clienteId: "cli-009",
        numero: 5,
        fechaVencimiento: "2026-11-10",
        monto: 112000,
        estado: "pendiente",
      },

      // Cristóbal: siete cuotas, cuatro pagadas. Otro plan al día.
      {
        id: "cuo-601",
        clienteId: "cli-006",
        numero: 1,
        fechaVencimiento: "2026-05-28",
        monto: 104000,
        estado: "pagada",
        fechaPago: "2026-05-27",
      },
      {
        id: "cuo-602",
        clienteId: "cli-006",
        numero: 2,
        fechaVencimiento: "2026-06-28",
        monto: 104000,
        estado: "pagada",
        fechaPago: "2026-06-28",
      },
      {
        id: "cuo-603",
        clienteId: "cli-006",
        numero: 3,
        fechaVencimiento: "2026-07-28",
        monto: 104000,
        estado: "pagada",
        fechaPago: "2026-07-30",
      },
      {
        id: "cuo-604",
        clienteId: "cli-006",
        numero: 4,
        fechaVencimiento: "2026-08-28",
        monto: 104000,
        estado: "pagada",
        fechaPago: "2026-08-28",
      },
      {
        id: "cuo-605",
        clienteId: "cli-006",
        numero: 5,
        fechaVencimiento: "2026-09-28",
        monto: 104000,
        estado: "pendiente",
      },
      {
        id: "cuo-606",
        clienteId: "cli-006",
        numero: 6,
        fechaVencimiento: "2026-10-28",
        monto: 104000,
        estado: "pendiente",
      },
      {
        id: "cuo-607",
        clienteId: "cli-006",
        numero: 7,
        fechaVencimiento: "2026-11-28",
        monto: 104000,
        estado: "pendiente",
      },

      // Patricia: ocho cuotas, tres pagadas y el resto por venir. Un plan sin
      // nada en rojo, que es lo normal: su caso está en la regla de contactos,
      // no en la de cobranza.
      {
        id: "cuo-501",
        clienteId: "cli-005",
        numero: 1,
        fechaVencimiento: "2026-06-18",
        monto: 98000,
        estado: "pagada",
        fechaPago: "2026-06-17",
      },
      {
        id: "cuo-502",
        clienteId: "cli-005",
        numero: 2,
        fechaVencimiento: "2026-07-18",
        monto: 98000,
        estado: "pagada",
        fechaPago: "2026-07-18",
      },
      {
        id: "cuo-503",
        clienteId: "cli-005",
        numero: 3,
        fechaVencimiento: "2026-08-18",
        monto: 98000,
        estado: "pagada",
        fechaPago: "2026-08-20",
      },
      {
        id: "cuo-504",
        clienteId: "cli-005",
        numero: 4,
        fechaVencimiento: "2026-09-18",
        monto: 98000,
        estado: "pendiente",
      },
      {
        id: "cuo-505",
        clienteId: "cli-005",
        numero: 5,
        fechaVencimiento: "2026-10-18",
        monto: 98000,
        estado: "pendiente",
      },
      {
        id: "cuo-506",
        clienteId: "cli-005",
        numero: 6,
        fechaVencimiento: "2026-11-18",
        monto: 98000,
        estado: "pendiente",
      },
      {
        id: "cuo-507",
        clienteId: "cli-005",
        numero: 7,
        fechaVencimiento: "2026-12-18",
        monto: 98000,
        estado: "pendiente",
      },
      {
        id: "cuo-508",
        clienteId: "cli-005",
        numero: 8,
        fechaVencimiento: "2027-01-18",
        monto: 98000,
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
