import { useCallback, useEffect, useRef, useState } from "react";

export type FaseCarga = "cargando" | "error" | "listo";

export type Carga<T> = {
  fase: FaseCarga;
  datos: T | null;
  recargar: () => void;
};

type Resultado<T> = { clave: string } & (
  | { estado: "listo"; datos: T }
  | { estado: "error"; datos: null }
);

/**
 * Resuelve las tres fases de una carga de datos (cargando, error, listo) para
 * que cada vista no las vuelva a escribir. Se recarga cuando cambia `clave`.
 *
 * La fase se deriva de si el último resultado corresponde a la clave vigente:
 * mientras no corresponda, la carga está en curso. Así no hace falta escribir
 * estado dentro del efecto.
 */
export function useCarga<T>(clave: string, cargar: () => Promise<T>): Carga<T> {
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);
  const [intento, setIntento] = useState(0);
  const claveVigente = `${clave}#${intento}`;

  const cargarRef = useRef(cargar);
  useEffect(() => {
    cargarRef.current = cargar;
  });

  useEffect(() => {
    let vigente = true;

    cargarRef
      .current()
      .then((datos) => {
        if (vigente) setResultado({ clave: claveVigente, estado: "listo", datos });
      })
      .catch(() => {
        if (vigente) setResultado({ clave: claveVigente, estado: "error", datos: null });
      });

    return () => {
      vigente = false;
    };
  }, [claveVigente]);

  const recargar = useCallback(() => setIntento((numero) => numero + 1), []);

  const alDia = resultado?.clave === claveVigente ? resultado : null;

  return {
    fase: alDia?.estado ?? "cargando",
    datos: alDia?.datos ?? null,
    recargar,
  };
}
