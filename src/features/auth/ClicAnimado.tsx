import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils/cn";

/**
 * Un cursor entra en cuadro, aprieta algo y ese algo cambia. Como un
 * interruptor: se aprieta y queda en la otra posición.
 *
 * El componente solo pone la coreografía: no sabe qué está cambiando. Le pasas
 * como hijo una función que recibe `encendido` y devuelve lo que se ve, así el
 * objeto es dueño de su propio cambio y esta pieza sirve para cualquiera.
 *
 * Cuando termina avisa con `onComplete`: quien lo usa decide qué hacer después.
 */

/** Punto dentro de la caja, en porcentaje: sirve igual en un teléfono que en un monitor. */
interface Punto {
  x: number;
  y: number;
}

interface ClicAnimadoProps {
  /** Lo que se ve. Recibe si el interruptor ya se apretó. */
  children: (encendido: boolean) => ReactNode;
  /** Se llama una vez, cuando la animación completa terminó. */
  onComplete: () => void;
  /** Dónde aterriza la punta del cursor. Por defecto, el centro de la caja. */
  destino?: Punto;
  /** Desde dónde entra el cursor. Fuera de la caja (>100) se siente venir de afuera. */
  origen?: Punto;
  /** Al revés: se llega con el interruptor encendido y el clic lo apaga. */
  invertido?: boolean;
  className?: string;
}

/**
 * Los tiempos de la secuencia, en milisegundos. Suman 2 s, los mismos que fijó
 * la referencia del diseñador.
 */
const COREOGRAFIA = {
  /** El logo se sostiene solo, antes de que aparezca nadie. */
  antesDelCursor: 500,
  /** Viaje hasta el interruptor. Frena al llegar, no se detiene en seco. */
  viaje: 700,
  /** Llega, apoya y recién entonces aprieta. Sin esta pausa el clic se lee atropellado. */
  antesDeApretar: 50,
  /** Cuánto se queda hundido el cursor. */
  presion: 150,
  /** Ya soltó, sigue ahí un momento: se ve que lo que cambió fue por su culpa. */
  despuesDeSoltar: 350,
  /** El cursor se desvanece. */
  salida: 250,
  /** Sin movimiento: se muestra el resultado y se sostiene un momento. */
  sinMovimiento: 900,
} as const;

type Fase = "esperando" | "viajando" | "presionando" | "soltando" | "cerrando";

/** El interruptor ya se apretó: de acá en adelante lo que se ve está encendido. */
const yaSeApreto = (fase: Fase) => fase !== "esperando" && fase !== "viajando";

const DESTINO_POR_DEFECTO: Punto = { x: 50, y: 50 };
const ORIGEN_POR_DEFECTO: Punto = { x: 128, y: 112 };

/**
 * La preferencia no cambia a mitad de una animación de dos segundos, así que se
 * lee una sola vez al montar.
 */
function useMovimientoReducido() {
  const [reducido] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  return reducido;
}

export function ClicAnimado({
  children,
  onComplete,
  destino = DESTINO_POR_DEFECTO,
  origen = ORIGEN_POR_DEFECTO,
  invertido,
  className,
}: ClicAnimadoProps) {
  const movimientoReducido = useMovimientoReducido();
  const [fase, setFase] = useState<Fase>(movimientoReducido ? "cerrando" : "esperando");

  // `onComplete` puede cambiar de identidad entre renders sin que eso deba
  // reiniciar la secuencia: la guardamos en una ref y el efecto de abajo corre
  // una sola vez.
  const avisar = useRef(onComplete);
  useEffect(() => {
    avisar.current = onComplete;
  });

  useEffect(() => {
    if (movimientoReducido) {
      const aTerminar = setTimeout(() => avisar.current(), COREOGRAFIA.sinMovimiento);
      return () => clearTimeout(aTerminar);
    }

    const { antesDelCursor, viaje, antesDeApretar, presion, despuesDeSoltar, salida } = COREOGRAFIA;
    const alApretar = antesDelCursor + viaje + antesDeApretar;
    const alSoltar = alApretar + presion;
    const alIrse = alSoltar + despuesDeSoltar;

    const relojes = [
      setTimeout(() => setFase("viajando"), antesDelCursor),
      setTimeout(() => setFase("presionando"), alApretar),
      setTimeout(() => setFase("soltando"), alSoltar),
      setTimeout(() => setFase("cerrando"), alIrse),
      setTimeout(() => avisar.current(), alIrse + salida),
    ];

    return () => relojes.forEach(clearTimeout);
  }, [movimientoReducido]);

  return (
    <div className={cn("relative", className)}>
      {/* El clic no enciende: cambia. Invertido, se llega prendido y se apaga. */}
      {children(invertido ? !yaSeApreto(fase) : yaSeApreto(fase))}

      {movimientoReducido ? null : <Cursor fase={fase} destino={destino} origen={origen} />}
    </div>
  );
}

/**
 * El cursor y su clic.
 *
 * Va en capas del tamaño de la caja para poder moverse con `translate` en
 * porcentaje —que es porcentaje de la caja, no del icono— y así animar solo
 * `transform` y `opacity`, sin tocar `left`/`top`.
 *
 * Son dos capas y no una porque cada eje viaja con su propia curva: la
 * horizontal usa el perfil de mínimo-jerk del tema (`fluid-glide`, el del
 * movimiento humano) y la vertical frena más tarde, así el recorrido se arquea
 * en vez de ser una diagonal recta. Una mano tampoco llega en línea recta.
 */
function Cursor({ fase, destino, origen }: { fase: Fase; destino: Punto; origen: Punto }) {
  const enPosicionInicial = fase === "esperando";
  const desplazamiento = { x: origen.x - destino.x, y: origen.y - destino.y };
  const viaje = `transform ${COREOGRAFIA.viaje}ms`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        transform: enPosicionInicial ? `translateX(${desplazamiento.x}%)` : "translateX(0%)",
        transition: `${viaje} var(--ease-fluid-glide)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: enPosicionInicial ? `translateY(${desplazamiento.y}%)` : "translateY(0%)",
          transition: `${viaje} var(--ease-standard)`,
        }}
      >
        <span
          className={cn(
            "absolute block origin-top-left transition-[translate,opacity]",
            fase === "presionando" ? "translate-y-[5px] duration-[110ms]" : "duration-[180ms]",
            enPosicionInicial || fase === "cerrando" ? "opacity-0" : "opacity-100",
            "ease-out",
          )}
          style={{
            // La punta del glifo, no su caja, es la que cae sobre el objetivo:
            // por eso el icono se corre esos pocos píxeles.
            left: `calc(${destino.x}% - 4px)`,
            top: `calc(${destino.y}% - 2px)`,
          }}
        >
          <PunteroDelMouse />
        </span>
      </div>
    </div>
  );
}

/**
 * El puntero clásico, con cola: es el dibujo que todo el mundo reconoce como
 * «alguien está haciendo clic». El de lucide no la tiene y se lee como una
 * flecha cualquiera. Va crudo y no como icono del sistema porque no significa
 * nada en la interfaz: es utilería de la animación.
 *
 * La punta está en (4,2) del `viewBox`, que es lo que se compensa arriba.
 */
function PunteroDelMouse() {
  return (
    <svg viewBox="0 0 24 24" className="block size-6" aria-hidden>
      <path
        d="M4 2 L4 20 L9 15 L12.5 22 L15 21 L11.5 14 L18 14 Z"
        fill="#f1efe8"
        stroke="var(--color-brand-navy)"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}
