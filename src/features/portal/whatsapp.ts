import type { Contacto, RolContacto, TipoServicio } from "./portal.types";

/**
 * El enlace de WhatsApp hacia un contacto del equipo, con el mensaje ya
 * escrito. Que la conversación parta presentando a la persona le ahorra el
 * «hola, ¿con quién hablo?» a los dos lados, y es lo que hace que escribir no
 * cueste nada: se abre WhatsApp y solo queda apretar enviar.
 *
 * Va **nombre y apellido**, no el nombre de pila. Del otro lado hay alguien que
 * atiende a varios cientos de personas y que recibe el mensaje desde un número
 * que puede no tener agendado: «soy Valentina» no ubica a nadie y obliga a
 * pedir el RUT antes de poder ayudar, que es justo el trámite que este botón
 * viene a evitar.
 *
 * El número se limpia de espacios y signos porque `wa.me` solo acepta dígitos;
 * en los datos se guarda con el formato chileno legible («+56 9 6721 4488»),
 * que es como se muestra y como lo escribe quien lo carga.
 */
export const enlaceWhatsapp = (
  telefono: string,
  nombreCompletoDelCliente: string,
  consulta = "Tengo una consulta sobre mi caso.",
): string => {
  const numero = telefono.replace(/\D/g, "");
  const mensaje = encodeURIComponent(`Hola, soy ${nombreCompletoDelCliente}. ${consulta}`);
  return `https://wa.me/${numero}?text=${mensaje}`;
};

/** Cómo se nombra cada rol delante del cliente. Un solo lugar para las dos. */
export const ETIQUETA_ROL = {
  ejecutiva: "Tu ejecutiva",
  abogado: "Tu abogado",
} as const satisfies Record<RolContacto, string>;

/**
 * El servicio en **dos o tres palabras**, para ir detrás del rol. No es el
 * nombre completo del catálogo —«Liquidación de deudas», «Defensa en juicio con
 * Protección Patrimonial»—: eso titula una pantalla, y acá va dentro de una fila
 * de panel donde compite con el nombre de la persona, que es lo que se busca.
 */
export const ETIQUETA_SERVICIO = {
  renegociacion: "renegociación",
  liquidacion: "liquidación",
  defensaEnJuicio: "defensa en juicio",
  proteccionPatrimonial: "protección patrimonial",
} as const satisfies Record<TipoServicio, string>;

/**
 * **«Tu abogado de liquidación»**, y no solo «Tu abogado».
 *
 * Cuando el panel ofrece dos personas, las dos pueden ser abogados —uno de la
 * liquidación y otra del juicio— y sin el servicio detrás son dos filas que
 * dicen lo mismo. Con el servicio, la persona sabe a cuál escribirle sin tener
 * que abrir las dos conversaciones para averiguarlo.
 *
 * Va **siempre**, también cuando hay un solo contacto: que la fila diga más o
 * menos según un dato que la persona no ve haría que dos clientes de Lexy
 * tengan dos productos distintos en la mano.
 */
export const etiquetaDelContacto = (contacto: Contacto): string =>
  `${ETIQUETA_ROL[contacto.rol]} de ${ETIQUETA_SERVICIO[contacto.servicioTipo]}`;

/** «Escribirle a Camila Rivera, tu ejecutiva de liquidación, por WhatsApp». */
export const rotuloDelContacto = (contacto: Contacto): string =>
  `Escribirle a ${contacto.nombre}, ${etiquetaDelContacto(contacto).toLowerCase()}, por WhatsApp`;
