import type { Caja, Contacto, Etapa, TipoServicio } from "./portal.types";

/** Los dos servicios que arman un «caso» con etapas: ahí manda esta regla. */
const CONCURSALES: TipoServicio[] = ["renegociacion", "liquidacion"];

/**
 * **A quién se le puede escribir desde el botón de WhatsApp.**
 *
 * El panel no es un directorio del equipo: es la salida de emergencia, y
 * ofrecer varios nombres cuando uno solo puede ayudar convierte una salida en
 * una decisión. Estas reglas las fijó operaciones.
 *
 * **En renegociación y liquidación: uno, el que atiende esta etapa.** Son los
 * servicios que arman un caso con etapas, y cada etapa dice si la atiende la
 * ejecutiva o el abogado (`etapa.contactoPrincipal`). Quien atiende informa, y
 * si aparece una duda que no puede resolver la deriva internamente: la persona
 * no tiene por qué saber a cuál de los dos le toca.
 *
 * **La excepción: la liquidación detenida.** Cuando la liquidación está en
 * «Mediata» o «En espera» —`etapa.liquidacionEnEspera`— el caso es viable pero
 * todavía no parte, y durante ese tiempo lo único que se mueve es el juicio o
 * la escritura que la persona tenga abiertos. Ahí salen dos: el de la
 * liquidación y el del otro frente. Mandarla al abogado de la liquidación con
 * una duda de su juicio sería mandarla a alguien que no puede contestarle, y en
 * una etapa que puede durar meses.
 *
 * **Si tiene juicio y escritura, manda el juicio.** Un juicio tiene plazos que
 * corren y una escritura no: entre los dos, el que puede costarle algo esta
 * semana es el juicio.
 *
 * **En litigios y protección patrimonial no cambia nada**: sale el equipo que
 * tenga asignado. Ahí no hay un caso con etapas del que colgar la regla —lo que
 * hay son causas y escrituras, cada una por su cuenta— y no existe un «otro
 * frente» que agregar, porque ese ya es el frente.
 *
 * El monitoreo no cuenta como juicio: es la vigilancia que Lexy le abre a toda
 * persona, no una causa real, y no tiene de qué hablar. Por eso acá entran las
 * causas ya filtradas por `componerInicio` y no las cajas en bruto.
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
  /** Las causas reales, sin el monitoreo. */
  juicios: Caja[];
  escrituras: Caja[];
}): Contacto[] {
  const concursal = servicioPrincipal.find((tipo) => CONCURSALES.includes(tipo));

  // Sin caso no hay etapa de la cual leer quién atiende, así que el panel
  // ofrece lo que haya. Antes que dejar a alguien sin nadie a quien escribirle.
  if (!concursal || !etapaDelCaso) return contactos;

  const delServicio = (tipo: TipoServicio, rol?: Contacto["rol"]) =>
    contactos.find(
      (contacto) =>
        contacto.servicioTipo === tipo && (rol === undefined || contacto.rol === rol),
    );

  // Si el rol que pide la etapa no está cargado, sale el del servicio sin mirar
  // el rol, y si tampoco, el primero que haya: un panel vacío por un dato
  // incompleto es peor que un contacto que no era exactamente el previsto.
  const principal =
    delServicio(concursal, etapaDelCaso.contactoPrincipal) ??
    delServicio(concursal) ??
    contactos[0];

  if (!principal) return [];

  const detenida = concursal === "liquidacion" && etapaDelCaso.liquidacionEnEspera;
  if (!detenida) return [principal];

  const delOtroFrente =
    (juicios.length > 0 ? delServicio("defensaEnJuicio") : undefined) ??
    (escrituras.length > 0 ? delServicio("proteccionPatrimonial") : undefined);

  // Puede coincidir con el principal si una misma persona atiende los dos
  // servicios: ahí es un contacto, no dos filas iguales.
  return delOtroFrente && delOtroFrente.id !== principal.id
    ? [principal, delOtroFrente]
    : [principal];
}
