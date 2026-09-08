import { useSyncExternalStore } from "react";

const CLAVE_STORAGE = "lexy:portal:sesion:v1";

const leerDeStorage = (): string | null => {
  try {
    return globalThis.localStorage?.getItem(CLAVE_STORAGE) ?? null;
  } catch {
    return null;
  }
};

let clienteEnSesion = leerDeStorage();
const escuchas = new Set<() => void>();

const avisar = () => {
  for (const escucha of escuchas) escucha();
};

/**
 * Sesión del portal: solo guarda a quién corresponde el caso que se está
 * viendo. En producción esto lo reemplaza el token que emita el backend.
 */
export const sesion = {
  getSnapshot: () => clienteEnSesion,

  subscribe: (escucha: () => void) => {
    escuchas.add(escucha);
    return () => {
      escuchas.delete(escucha);
    };
  },

  abrir: (clienteId: string) => {
    clienteEnSesion = clienteId;
    try {
      globalThis.localStorage?.setItem(CLAVE_STORAGE, clienteId);
    } catch {
      // Sin almacenamiento la sesión dura lo que dure la pestaña.
    }
    avisar();
  },

  cerrar: () => {
    clienteEnSesion = null;
    try {
      globalThis.localStorage?.removeItem(CLAVE_STORAGE);
    } catch {
      // nada que limpiar
    }
    avisar();
  },
};

export function useSesion(): string | null {
  return useSyncExternalStore(sesion.subscribe, sesion.getSnapshot, () => null);
}
