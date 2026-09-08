import type { CausaConEtapa, Etapa } from "./portal.types";

/**
 * Cómo el portal decide qué le muestra al cliente en «Estado de mi caso».
 *
 * Vive aparte de la pantalla porque son reglas del negocio, no de diseño: qué
 * cuenta como avance, qué se esconde y qué manda cuando hay varios frentes. Si
 * mañana el CRM cambia la forma de marcar una caja, se toca esto y ninguna
 * pantalla se entera.
 *
 * Hay dos formas de llevar un caso y el portal las trata distinto:
 *
 * - **Renegociación y Liquidación** avanzan por un embudo único: el cliente está
 *   en una etapa a la vez y esa es la que se muestra.
 * - **Litigios** puede tener varias causas abiertas en paralelo, una por
 *   escritura o rol, cada una en su etapa.
 */

/**
 * Renegociación no admite Protección Patrimonial: son incompatibles. Si llegaran
 * datos de PP para alguien en renegociación, el portal no los muestra —ni la
 * tarjeta ni un espacio vacío—, porque sería contarle de un servicio que no
 * tiene.
 *
 * La regla vive como lista de servicios porque hoy es lo único que la determina.
 * Si mañana el CRM la marca de otra forma, se reemplaza acá y ninguna pantalla
 * cambia.
 */
const SERVICIOS_SIN_PROTECCION_PATRIMONIAL = ["srv-renegociacion"];

export const admiteProteccionPatrimonial = (servicioId: string): boolean =>
  !SERVICIOS_SIN_PROTECCION_PATRIMONIAL.includes(servicioId);

/**
 * Las causas que cuentan para el estado.
 *
 * La caja madre es monitoreo, no un frente con avance propio: si hay otras
 * causas activas se excluye, porque mostrar su «no hay novedades» taparía el
 * trabajo que sí está pasando. Cuando es lo único que hay, sí se muestra — es la
 * respuesta honesta: no hay nada en curso ahora mismo.
 */
export function causasQueCuentan(causas: CausaConEtapa[]): CausaConEtapa[] {
  const activas = causas.filter(({ causa }) => causa.activa);
  const conAvancePropio = activas.filter(({ causa }) => !causa.esCajaMadre);
  return conAvancePropio.length > 0 ? conAvancePropio : activas;
}

/**
 * De varias causas, cuál manda en la tarjeta del inicio.
 *
 * Primero la que pide algo del cliente. Es la única jerarquía que le sirve a
 * quien abre el portal: si hay algo que hacer, tiene que verlo, aunque venga de
 * la causa menos avanzada. Solo cuando ninguna pide nada gana la más avanzada,
 * que es la que mejor responde «¿en qué voy?».
 */
export function causaQueManda(causas: CausaConEtapa[]): CausaConEtapa | null {
  if (causas.length === 0) return null;

  const pidenAlgo = causas.filter(({ etapa }) => etapa.nivelUrgencia !== "tranquilidad");
  const candidatas = pidenAlgo.length > 0 ? pidenAlgo : causas;

  return candidatas.reduce((mejor, actual) =>
    actual.etapa.orden > mejor.etapa.orden ? actual : mejor,
  );
}

/** Lo que el inicio necesita saber del caso, ya resuelto. */
export type EstadoDelCaso = {
  /** La etapa que se muestra en la tarjeta. `null` cuando no hay nada publicable. */
  etapa: Etapa | null;
  /** Las causas activas que cuentan. Vacío en los servicios de embudo único. */
  causas: CausaConEtapa[];
  /** Si vale la pena ofrecerle la lista completa de sus escrituras. */
  tieneVariasCausas: boolean;
};

/**
 * Resuelve el estado a partir de lo que el cliente tiene.
 *
 * `etapaDelEmbudo` es la etapa del cliente en los servicios de embudo único; las
 * causas llegan vacías ahí. En Litigios pasa al revés. Se resuelve con lo que
 * haya en vez de preguntar por el nombre del servicio: así, si mañana otro
 * servicio empieza a trabajar con causas, funciona sin tocar nada.
 *
 * Una etapa que el capitán dejó como interna no se muestra: el portal cuenta
 * aparte que el caso está avanzando, en vez de dejar la tarjeta a medias.
 */
export function resolverEstadoDelCaso(
  etapaDelEmbudo: Etapa | null,
  causasDelCliente: CausaConEtapa[],
): EstadoDelCaso {
  const causas = causasQueCuentan(causasDelCliente);

  if (causas.length === 0) {
    return {
      etapa: etapaDelEmbudo?.visibleParaCliente ? etapaDelEmbudo : null,
      causas: [],
      tieneVariasCausas: false,
    };
  }

  const manda = causaQueManda(causas);

  return {
    etapa: manda?.etapa.visibleParaCliente ? manda.etapa : null,
    causas,
    // Con una sola causa no hay lista que ofrecer: lo que se ve arriba ya es todo.
    tieneVariasCausas: causas.length > 1,
  };
}
