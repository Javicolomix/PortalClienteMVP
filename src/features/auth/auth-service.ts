import { read, write } from "@/prototype/ports";

/** Lo único que el acceso necesita saber de la persona. */
type ClienteConAcceso = {
  id: string;
  nombre: string;
  rut: string;
  correo: string;
};

export class CredencialesInvalidas extends Error {
  constructor() {
    super("El correo o la clave no coinciden.");
    this.name = "CredencialesInvalidas";
  }
}

/**
 * Deja el correo en el formato con que está guardado: sin espacios sobrantes y
 * en minúsculas. Escribirlo con mayúsculas no debería dejar a nadie afuera.
 */
export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}

/**
 * Comprobación de forma, no de existencia. Sirve para avisarle a la persona que
 * se equivocó al escribir el correo, en vez de mandarle un «no coinciden» que la
 * deja sin saber cuál de los dos campos está mal.
 */
export function correoEsValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}

/**
 * La clave del portal es la primera letra del nombre en mayúscula seguida del
 * RUT sin puntos ni dígito verificador. Ejemplo: Juan, 16.482.937-5 → J16482937.
 */
export function claveEsperada(nombre: string, rut: string): string {
  const inicial = nombre.trim().charAt(0).toUpperCase();
  const cuerpo = rut.split("-")[0].replace(/\D/g, "");
  return `${inicial}${cuerpo}`;
}

export async function iniciarSesion(correo: string, clave: string): Promise<string> {
  const [cliente] = await read.load<ClienteConAcceso[]>(
    "clientePorCorreo",
    { correo: normalizarCorreo(correo) },
    {
      description: "Busca a la persona por el correo con que intenta entrar al portal",
      trigger: "Botón «Ingresar» de la pantalla de acceso",
      reads: { entities: ["cliente"], fields: ["cliente.correo", "cliente.nombre", "cliente.rut"] },
    },
  );

  // En el prototipo la clave se comprueba acá para poder recorrer el flujo. En
  // producción esto lo hace el backend: la clave no debe compararse en el
  // navegador ni viajar junto a los datos de la persona.
  if (!cliente || claveEsperada(cliente.nombre, cliente.rut) !== clave) {
    throw new CredencialesInvalidas();
  }

  await write.publish(
    "sesionIniciada",
    { clienteId: cliente.id },
    {
      description: "La persona entró al portal con sus credenciales",
      trigger: "Botón «Ingresar» de la pantalla de acceso",
      writes: { entities: [], fields: [] },
    },
  );

  return cliente.id;
}
