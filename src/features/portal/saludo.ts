const SEIS_AM = 6 * 60;
const MEDIODIA = 12 * 60;
const OCHO_PM = 20 * 60;

/**
 * Saludo según la hora del dispositivo de la persona, no la del servidor:
 * 06:00–12:00 «Buenos días», 12:01–19:59 «Buenas tardes», 20:00–05:59
 * «Buenas noches».
 */
export function saludoSegunHora(fecha: Date): string {
  const minutos = fecha.getHours() * 60 + fecha.getMinutes();

  if (minutos >= SEIS_AM && minutos <= MEDIODIA) return "Buenos días";
  if (minutos > MEDIODIA && minutos < OCHO_PM) return "Buenas tardes";
  return "Buenas noches";
}
