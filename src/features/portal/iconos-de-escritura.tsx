import { Eraser, Handshake } from "lucide-react";
import type { ComponentType } from "react";

import type { Caja, TipoServicio } from "./portal.types";

/**
 * **El banco de dibujos de los tipos de escritura**, uno por cada tipo real que
 * Lexy tiene abierto en Streak. Lo entregó el diseñador y es el primer set
 * propio del portal: hasta acá los dibujos salían de lucide, que sirve para
 * iconos de interfaz pero no tiene con qué nombrar una resciliación o un
 * alzamiento de prenda.
 *
 * Son de **Tabler Icons (licencia MIT)** y van dibujados acá, no importados de
 * una librería: son veintiséis de dos mil, y traer el paquete entero para eso
 * pesaría más que el portal. El trazo va en `currentColor`, así que el color lo
 * pone quien los usa —la tinta del acreedor en las causas, la del reparto en las
 * escrituras— y este archivo no sabe nada de colores.
 *
 * El `viewBox` y el grosor de trazo son los de Tabler (24×24, trazo 2). Se
 * dibujan más fino, a 1.75, que es el peso con que el portal usa todos sus
 * iconos.
 */
export type IconoDelPortal = ComponentType<{ className?: string; strokeWidth?: number }>;

const dibujo =
  (nombre: string, trazos: string[]): IconoDelPortal =>
  ({ className, strokeWidth = 2 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      data-icono={nombre}
    >
      {trazos.map((trazo) => (
        <path key={trazo} d={trazo} />
      ))}
    </svg>
  );

/**
 * **El martillo.** Es el de «Mis juicios»: titula la sección y marca cada causa.
 * Que sea el mismo arriba y en cada fila no es repetirse — dice que las filas
 * son de eso.
 */
export const Martillo = dibujo("gavel", [
  "M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385",
  "M6 9l4 4",
  "M13 10l-4 -4",
  "M3 21h7",
  "M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0",
]);

/**
 * El documento genérico. Es la red de seguridad: los tipos los mantiene Streak y
 * la lista va a crecer sin avisarnos, así que uno que todavía no esté acá cae en
 * el documento y la fila sigue diciendo su nombre entero al lado.
 */
const Documento = dibujo("file-text", [
  "M14 3v4a1 1 0 0 0 1 1h4",
  "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z",
  "M9 9l1 0",
  "M9 13l6 0",
  "M9 17l6 0",
]);

/**
 * **Los veinticinco tipos, con el dibujo que le tocó a cada uno.** La clave es el
 * nombre tal como lo escribe Streak; el emparejamiento se hace normalizado
 * —sin tildes, sin mayúsculas, sin espacios de más— porque el nombre llega
 * escrito a mano y «Compraventa de Vehiculo» tiene que encontrar su auto.
 */
const POR_TIPO: Record<string, IconoDelPortal> = {
  "constitucion de sociedades": dibujo("users", [
    "M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",
    "M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2",
    "M16 3.13a4 4 0 0 1 0 7.75",
    "M21 21v-2a4 4 0 0 0 -3 -3.85",
  ]),

  "compraventa de vehiculo": dibujo("car", [
    "M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
    "M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
    "M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5",
  ]),

  // Una casa **con una moneda**, y no la casa a secas del banco de Tabler: una
  // compraventa no es una casa, es una casa que cambia de dueño por plata. El
  // techo y el cuerpo son los del `home` del banco; la puerta se reemplaza por
  // la moneda, que es donde el ojo cae.
  "compraventa de inmueble": dibujo("home-dollar", [
    "M5 12l-2 0l9 -9l9 9l-2 0",
    "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7",
    "M9.5 16.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0",
    "M12 15v3",
  ]),

  "compraventa de bienes muebles": dibujo("armchair", [
    "M5 11a2 2 0 0 1 2 2v2h10v-2a2 2 0 1 1 4 0v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2",
    "M5 11v-5a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v5",
    "M6 19v2",
    "M18 19v2",
  ]),

  "cesion de derechos hereditarios": dibujo("home-heart", [
    "M21 12l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h6",
    "M9 21v-6a2 2 0 0 1 2 -2h2c.39 0 .754 .112 1.061 .304",
    "M19 21.5l2.518 -2.58a1.74 1.74 0 0 0 0 -2.413a1.627 1.627 0 0 0 -2.346 0l-.168 .172l-.168 -.172a1.627 1.627 0 0 0 -2.346 0a1.74 1.74 0 0 0 0 2.412l2.51 2.59l0 -.009",
  ]),

  "liquidacion de sociedad conyugal": dibujo("heart-off", [
    "M3 3l18 18",
    "M19.5 12.572l-1.5 1.428m-2 2l-4 4l-7.5 -7.428a5 5 0 0 1 -1.288 -5.068a4.976 4.976 0 0 1 1.788 -2.504m3 -1c1.56 0 3.05 .727 4 2a5 5 0 1 1 7.5 6.572",
  ]),

  "compraventa de acciones (empresa en un dia)": dibujo("bolt", [
    "M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11",
  ]),

  "compraventa de acciones (regimen tradicional)": dibujo("trending-up", [
    "M3 17l6 -6l4 4l8 -8",
    "M14 7l7 0l0 7",
  ]),

  "comodato de bienes muebles": dibujo("refresh", [
    "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4",
    "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4",
  ]),

  mandato: dibujo("signature", [
    "M3 17c3.333 -3.333 5 -6 5 -8c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 4.877 2.5 6c1.5 2 2.5 2.5 3.5 1l2 -3c.333 2.667 1.333 4 3 4c.53 0 2.639 -2 3 -2c.517 0 1.517 .667 3 2",
  ]),

  "cesion de derechos": dibujo("certificate", [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5",
    "M3 14a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
    "M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5",
  ]),

  "contrato de arriendo": dibujo("key", [
    "M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0",
    "M15 9h.01",
  ]),

  "cancelacion y alzamiento de hipoteca": dibujo("home-x", [
    "M19 13.4v-1.4h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h5.5",
    "M9 21v-6a2 2 0 0 1 2 -2h2c.402 0 .777 .119 1.091 .323",
    "M21.5 21.5l-5 -5",
    "M16.5 21.5l5 -5",
  ]),

  "cancelacion y alzamiento de prenda": dibujo("lock-x", [
    "M13 21h-6a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v.5",
    "M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0",
    "M8 11v-4a4 4 0 1 1 8 0v4",
    "M22 22l-5 -5",
    "M17 22l5 -5",
  ]),

  "declaracion jurada de allegado": dibujo("user-check", [
    "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",
    "M6 21v-2a4 4 0 0 1 4 -4h4",
    "M15 19l2 2l4 -4",
  ]),

  "compraventa de derecho de llaves": dibujo("door", [
    "M14 12v.01",
    "M3 21h18",
    "M6 21v-16a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v16",
  ]),

  "compraventa de patente comercial": dibujo("building-store", [
    "M3 21l18 0",
    "M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4",
    "M5 21l0 -10.15",
    "M19 21l0 -10.15",
    "M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4",
  ]),

  "aporte inmobiliario srl": dibujo("building-skyscraper", [
    "M3 21l18 0",
    "M5 21v-14l8 -4v18",
    "M19 21v-10l-6 -4",
    "M9 9l0 .01",
    "M9 12l0 .01",
    "M9 15l0 .01",
    "M9 18l0 .01",
  ]),

  "compraventa de inmueble y usufructo": dibujo("home-link", [
    "M9 21v-6a2 2 0 0 1 2 -2h2c.247 0 .484 .045 .702 .127",
    "M19 12h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h5",
    "M16 22l5 -5",
    "M21 21.5v-4.5h-4.5",
  ]),

  "compraventa de nuda propiedad": dibujo("home-dot", [
    "M19 12h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h5",
    "M16 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
    "M9 21v-6a2 2 0 0 1 2 -2h2c.641 0 1.212 .302 1.578 .771",
  ]),

  "mandato con autocontrato": dibujo("edit", [
    "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1",
    "M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415",
    "M16 5l3 3",
  ]),

  "pacto de sustitucion de regimen matrimonial": dibujo("heart-handshake", [
    "M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572",
    "M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25",
    "M12.5 15.5l2 2",
    "M15 13l2 2",
  ]),

  "transferencia de vehiculo (rc)": dibujo("steering-wheel", [
    "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
    "M10 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
    "M12 14l0 7",
    "M10 12l-6.75 -2",
    "M14 12l6.75 -2",
  ]),

  resciliacion: dibujo("arrow-back-up", ["M9 14l-4 -4l4 -4", "M5 10h11a4 4 0 1 1 0 8h-1"]),

  "renuncia a los gananciales": dibujo("hand-stop", [
    "M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5",
    "M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5",
    "M14 5.5a1.5 1.5 0 0 1 3 0v6.5",
    "M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47",
  ]),
};

/**
 * Sin tildes, sin mayúsculas y sin espacios de más. El tipo llega escrito a mano
 * en Streak: «Compraventa de Vehiculo» y «COMPRAVENTA DE VEHÍCULO» tienen que
 * encontrar el mismo auto.
 */
const normalizar = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export const iconoDeEscritura = (tipo: string): IconoDelPortal =>
  POR_TIPO[normalizar(tipo)] ?? Documento;

/** Los tipos que el banco tiene fichados, para revisarlos de una. */
export const TIPOS_CON_DIBUJO = Object.keys(POR_TIPO);

/**
 * El dibujo de una caja en su lista.
 *
 * **Las causas llevan todas el mismo martillo.** Lo que distingue una de otra es
 * el nombre del acreedor, que va en grande arriba, y el rol debajo; el color de
 * la marca acompaña —dos causas del mismo banco comparten el suyo— pero no es lo
 * que se lee. **Las escrituras llevan el dibujo de su tipo**, que sale del banco
 * de arriba.
 */
export const iconoDeLaCaja = (caja: Caja): IconoDelPortal =>
  caja.tipo === "proteccionPatrimonial"
    ? iconoDeEscritura(caja.tipoDeEscritura ?? "")
    : Martillo;

/**
 * **El dibujo del servicio**, que es el que lleva la fila del estado del caso.
 * Esa fila no es una causa ni una escritura: es la renegociación o la
 * liquidación entera, y lo que la nombra es el servicio.
 *
 * - **Renegociación, el apretón de manos.** El servicio es literalmente llegar a
 *   un acuerdo con los acreedores: dos partes que se dan la mano.
 * - **Liquidación, la goma.** Es lo que el servicio hace y lo que la gente ya
 *   dice de él —borrón y cuenta nueva—: un liquidador reparte lo que hay y el
 *   saldo que queda impago se extingue. Se eligieron y descartaron una balanza
 *   (es de tribunales, no de este trámite en particular) y un visto bueno (dice
 *   «listo», no dice qué pasó).
 * - **Defensa en juicio, el martillo**, el mismo de la lista de causas: cuando
 *   el estado del caso aparece en defensa es porque la persona solo tiene la
 *   caja de monitoreo, y lo que se está vigilando son juicios.
 *
 * Los dos primeros son de lucide y no de Tabler. Es la excepción del set: los
 * dos tienen el mismo trazo y la misma caja, y traer un dibujo suelto de otra
 * librería costaba más de lo que ordenaba.
 */
export const iconoDelServicio = (tipo: TipoServicio): IconoDelPortal => {
  if (tipo === "renegociacion") return Handshake;
  if (tipo === "liquidacion") return Eraser;
  if (tipo === "defensaEnJuicio") return Martillo;
  return Documento;
};
