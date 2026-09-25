import type { Caja, Contacto, Etapa, TipoServicio } from "./portal.types";

/**
 * **Quién es la persona detrás de una ficha de contacto.**
 *
 * El número de WhatsApp y no el nombre ni el id: es lo que decide a dónde va el
 * mensaje, así que dos fichas con el mismo número abren la misma conversación
 * por definición, se llamen como se llamen. Si el número faltara, el nombre
 * sirve de reemplazo.
 */
const personaDetras = (contacto: Contacto): string =>
  contacto.telefonoWhatsapp.replace(/\D/g, "") || contacto.nombre.trim().toLowerCase();

const esLaMismaPersona = (uno: Contacto, otro: Contacto): boolean =>
  personaDetras(uno) === personaDetras(otro);

/**
 * **Una ficha por persona y servicio.**
 *
 * Del panel de comunicaciones llega **una ficha por caja**, no por persona. Con
 * dos cajas del mismo embudo —una renegociación y su duplicado de «Demandado»,
 * por ejemplo— la misma ejecutiva y el mismo abogado llegan dos veces cada uno,
 * y el portal los listaba a los cuatro: dos filas idénticas, con el mismo
 * nombre, el mismo cargo y el mismo botón verde. Quien lo ve no entiende que es
 * la misma persona; entiende que hay dos, y que tiene que elegir.
 *
 * Se agrupa por **persona y servicio**, no solo por persona: alguien puede
 * atender liquidación y litigios a la vez con el mismo número, y ahí las dos
 * fichas dicen cosas distintas —la regla de contactos necesita las dos para
 * resolver cuál de los dos frentes ofrecer—. Lo que se descarta es la copia
 * exacta: misma persona, mismo servicio, mismo rol.
 *
 * Se aplica al cargar, no al mostrar, para que valga igual en el panel de
 * WhatsApp y en «Mi equipo». Cuando estuvo solo en el panel, el tope de dos
 * contactos tapaba el problema ahí y lo dejaba a la vista en la otra pantalla.
 */
export const sinFichasRepetidas = (contactos: Contacto[]): Contacto[] => {
  const vistas = new Set<string>();
  return contactos.filter((contacto) => {
    const clave = `${personaDetras(contacto)}|${contacto.servicioTipo}|${contacto.rol}`;
    if (vistas.has(clave)) return false;
    vistas.add(clave);
    return true;
  });
};

/**
 * **Nunca más de dos.** Lo fija la regla de operaciones y vale para todos los
 * caminos, también para los de respaldo: el panel es una salida, y una salida
 * con cinco puertas deja de serlo.
 */
const TOPE = 2;

/**
 * **A quién se le puede escribir desde el botón de WhatsApp.**
 *
 * El panel no es un directorio del equipo: es la salida de emergencia, y
 * ofrecer varios nombres cuando uno solo puede ayudar convierte una salida en
 * una decisión. Estas reglas las fijó operaciones.
 *
 * **El contacto sale del servicio principal, no de todo lo que la persona
 * tenga abierto.** Quien contrató una renegociación y además tiene un juicio le
 * escribe a renegociación: su equipo de allá es el que conoce el caso entero y
 * deriva hacia adentro lo que no pueda contestar. Al revés —ofrecerle las dos
 * puertas— la obliga a decidir cuál de sus problemas es este, que es justo lo
 * que no está en condiciones de decidir.
 *
 * | Servicio principal | Quién sale |
 * | --- | --- |
 * | Renegociación | El equipo de renegociación: ejecutiva y abogado, los que haya. |
 * | Liquidación | Depende de la etapa — ver abajo. |
 * | Defensa en juicio, con o sin protección patrimonial | El equipo de litigios. **El panel de PP se ignora**, también en el compuesto. |
 * | Protección patrimonial | El equipo de protección patrimonial. |
 *
 * **La liquidación es la única que mira la etapa.** Ahí sale una sola persona:
 * la que atiende esa etapa (`etapa.contactoPrincipal`), porque en un
 * procedimiento concursal quien está al día del expediente es uno solo y los
 * dos nombres se vuelven una pregunta. La excepción son «Mediata» y «En
 * espera» —`clase === "liquidacionEnEspera"`—: ahí el caso es viable pero
 * todavía no parte, y durante esos meses lo único que se mueve es el juicio o
 * la escritura que la persona tenga abiertos. Mandarla al abogado de la
 * liquidación con una duda de su juicio sería mandarla a alguien que no puede
 * contestarle.
 *
 * **Si tiene juicio y escritura, manda el juicio.** Un juicio tiene plazos que
 * corren y una escritura no: entre los dos, el que puede costarle algo esta
 * semana es el juicio.
 */
export function contactosVisibles({
  contactos,
  etapaDelCaso,
  servicioPrincipal,
  juicios,
  escrituras,
}: {
  contactos: Contacto[];
  /** La etapa que muestra «Estado de mi caso». Sin caso, no hay etapa. */
  etapaDelCaso: Etapa | null;
  /** El servicio principal ya resuelto: uno, o los dos del compuesto. */
  servicioPrincipal: TipoServicio[];
  /** Las causas que se muestran, sin monitoreo ni concursal. */
  juicios: Caja[];
  escrituras: Caja[];
}): Contacto[] {
  // En el compuesto manda litigios: `servicioPrincipal[0]` ya viene en ese
  // orden, así que el panel de PP queda fuera sin tener que nombrarlo.
  const principal = servicioPrincipal[0];
  if (!principal) return contactos.slice(0, TOPE);

  const delServicio = (tipo: TipoServicio, rol?: Contacto["rol"]) =>
    contactos.filter(
      (contacto) =>
        contacto.servicioTipo === tipo && (rol === undefined || contacto.rol === rol),
    );

  const equipo = delServicio(principal);

  // Un panel vacío por un dato incompleto es peor que un contacto que no era
  // exactamente el previsto: sin nadie cargado en el servicio, sale lo que
  // haya. **Pero nunca más de dos**, que es tope duro de la regla: sin el
  // corte, un cliente con equipo en tres embudos y sin `servicioTipo` en el que
  // le toca vería una lista de cinco nombres, que es exactamente lo que este
  // panel existe para no ser.
  if (equipo.length === 0) return contactos.slice(0, TOPE);

  if (principal !== "liquidacion") return equipo.slice(0, TOPE);

  const deLaLiquidacion =
    (etapaDelCaso ? delServicio("liquidacion", etapaDelCaso.contactoPrincipal)[0] : undefined) ??
    equipo[0];

  if (etapaDelCaso?.clase !== "liquidacionEnEspera") return [deLaLiquidacion];

  const delOtroFrente =
    (juicios.length > 0 ? delServicio("defensaEnJuicio")[0] : undefined) ??
    (escrituras.length > 0 ? delServicio("proteccionPatrimonial")[0] : undefined);

  // Puede coincidir con el de la liquidación si una misma persona atiende los
  // dos servicios: ahí es un contacto, no dos filas iguales. Se compara por
  // persona y no por id, porque son dos fichas distintas —una por servicio— con
  // el mismo número detrás.
  return delOtroFrente && !esLaMismaPersona(delOtroFrente, deLaLiquidacion)
    ? [deLaLiquidacion, delOtroFrente]
    : [deLaLiquidacion];
}
