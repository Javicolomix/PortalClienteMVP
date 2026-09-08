/** Fecha ISO `aaaa-mm-dd` → `dd/mm/aaaa`. Se parte, no se parsea, para no correrla de día. */
export function formatearFechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}
