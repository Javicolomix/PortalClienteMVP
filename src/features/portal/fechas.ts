/** Fecha ISO `aaaa-mm-dd` → `dd/mm/aaaa`. Se parte, no se parsea, para no correrla de día. */
export function formatearFechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

/**
 * La misma fecha con el año en dos dígitos: `dd/mm/aa`. Es para la tabla del
 * historial en el teléfono, donde cuatro columnas y un año de cuatro cifras no
 * caben juntos y la que se cortaba era la del estado, que es la que se viene a
 * mirar. Fuera de ahí va siempre la larga: dos dígitos de año ahorran espacio,
 * pero se leen peor.
 */
export function formatearFechaBreve(iso: string): string {
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio.slice(2)}`;
}
