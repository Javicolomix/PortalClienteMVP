import type { Contacto, RolContacto } from "./portal.types";

/**
 * El enlace de WhatsApp hacia un contacto del equipo, con el mensaje ya
 * escrito. Que la conversación parta con el nombre de la persona le ahorra el
 * «hola, ¿con quién hablo?» a los dos lados, y es lo que hace que escribir no
 * cueste nada: se abre WhatsApp y solo queda apretar enviar.
 *
 * El número se limpia de espacios y signos porque `wa.me` solo acepta dígitos;
 * en los datos se guarda con el formato chileno legible («+56 9 6721 4488»),
 * que es como se muestra y como lo escribe quien lo carga.
 */
export const enlaceWhatsapp = (telefono: string, nombreCliente: string): string => {
  const numero = telefono.replace(/\D/g, "");
  const mensaje = encodeURIComponent(
    `Hola, soy ${nombreCliente}. Tengo una consulta sobre mi caso.`,
  );
  return `https://wa.me/${numero}?text=${mensaje}`;
};

/** Cómo se nombra cada rol delante del cliente. Un solo lugar para las dos. */
export const ETIQUETA_ROL = {
  ejecutiva: "Tu ejecutiva",
  abogado: "Tu abogado",
} as const satisfies Record<RolContacto, string>;

/** «Escribirle a Camila Rivera, tu ejecutiva, por WhatsApp». */
export const rotuloDelContacto = (contacto: Contacto): string =>
  `Escribirle a ${contacto.nombre}, ${ETIQUETA_ROL[contacto.rol].toLowerCase()}, por WhatsApp`;
