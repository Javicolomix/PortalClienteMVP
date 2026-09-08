import { useEffect, useState } from "react";

import fondoMarca from "@/shared/assets/lexy-fondo-navy.png";
import { cn } from "@/shared/lib/utils/cn";

import lockupIsotipo from "./assets/lexy-lockup-isotipo.svg";
import lockupTexto from "./assets/lexy-lockup-texto.svg";
import { ClicAnimado } from "./ClicAnimado";

/**
 * Las dos transiciones de marca del portal, que son la misma en los dos
 * sentidos: un cursor entra y toca el isotipo como si fuera un interruptor.
 *
 * - **Al entrar**, después de que la clave es correcta, lo enciende.
 * - **Al salir**, lo apaga.
 *
 * No hay transición antes del acceso: al abrir el enlace lo primero que se ve es
 * el formulario. El interruptor tiene sentido cuando responde a algo que la
 * persona hizo —entrar, salir—, no como espera antes de empezar.
 *
 * Usan el mismo fondo navy que el hero del acceso y el saludo del inicio: las
 * tres superficies de marca del portal son la misma, así que pasar de una a otra
 * no se siente como un corte.
 */

/** Caja del lockup, en las unidades del propio SVG. Fija la proporción de la marca. */
const LOCKUP = { ancho: 463.26293, alto: 626.4349 } as const;

/**
 * Centro del isotipo dentro de esa caja, en porcentaje. Es a la vez donde
 * aterriza la punta del cursor y el eje sobre el que se invierte el dibujo: el
 * logo cambia exactamente donde lo tocaron.
 */
const CENTRO_DEL_ISOTIPO = { x: 50, y: 24.2963 } as const;

/** Fuera de la caja, abajo a la derecha: el cursor se ve venir de afuera. */
const ORIGEN_DEL_CURSOR = { x: 134, y: 114 } as const;

/** El cruce entre una posición y la otra. Corto a propósito: es un cambio, no un viaje. */
const CRUCE = 120;

function TransicionDeMarca({
  invertido,
  onTerminar,
}: {
  invertido?: boolean;
  onTerminar: () => void;
}) {
  const [visible, setVisible] = useState(false);

  // Un cuadro de espera antes de subir la opacidad: si se monta ya visible, el
  // navegador no tiene desde dónde animar y la pantalla aparece de un salto.
  useEffect(() => {
    const cuadro = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(cuadro);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 isolate z-50 flex items-center justify-center overflow-hidden",
        "bg-brand-navy transition-opacity duration-300 motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <img
        src={fondoMarca}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 size-full object-cover"
      />

      <ClicAnimado
        invertido={invertido}
        onComplete={onTerminar}
        destino={CENTRO_DEL_ISOTIPO}
        origen={ORIGEN_DEL_CURSOR}
        className="w-44 md:w-52"
      >
        {(encendido) => <MarcaLexy encendido={encendido} />}
      </ClicAnimado>
    </div>
  );
}

/** La clave era correcta: el interruptor se enciende y recién entonces se entra. */
export function Bienvenida({ onTerminar }: { onTerminar: () => void }) {
  return (
    <>
      <TransicionDeMarca onTerminar={onTerminar} />
      <p aria-live="polite" className="sr-only">
        Entrando a tu portal.
      </p>
    </>
  );
}

/** Se apretó «Salir»: el mismo gesto al revés, como apagar la luz al salir. */
export function Despedida({ onTerminar }: { onTerminar: () => void }) {
  return (
    <>
      <TransicionDeMarca invertido onTerminar={onTerminar} />
      <p aria-live="polite" className="sr-only">
        Cerrando tu sesión.
      </p>
    </>
  );
}

/**
 * El lockup en dos planos: la palabra y el eslogan por un lado, el isotipo por
 * otro. Son dos recortes del mismo archivo del registry, con el mismo `viewBox`,
 * así que apilados dan exactamente el logo original.
 *
 * El isotipo va dos veces, una sobre otra, en sus dos posiciones. Apretar el
 * interruptor cruza de una a la otra en 120 ms: el logo cambia, sin que nada se
 * desplace. Girarlo a la vista sería otra cosa —un truco de animación— y no es
 * lo que hace un interruptor.
 */
function MarcaLexy({ encendido }: { encendido: boolean }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${LOCKUP.ancho} / ${LOCKUP.alto}` }}>
      <img src={lockupTexto} alt="Lexy" className="absolute inset-0 size-full" draggable={false} />

      <PosicionDelIsotipo visible={!encendido} />
      <PosicionDelIsotipo visible={encendido} invertida />
    </div>
  );
}

/**
 * Una de las dos posiciones del isotipo. La invertida es el mismo dibujo puesto
 * al revés sobre su propio centro: no es una versión nueva de la marca, es la
 * que ya existe con el volumen apuntando al otro lado.
 */
function PosicionDelIsotipo({ visible, invertida }: { visible: boolean; invertida?: boolean }) {
  return (
    <img
      src={lockupIsotipo}
      alt=""
      aria-hidden
      draggable={false}
      className={cn(
        "absolute inset-0 size-full transition-opacity ease-linear",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        transitionDuration: `${CRUCE}ms`,
        transformOrigin: `${CENTRO_DEL_ISOTIPO.x}% ${CENTRO_DEL_ISOTIPO.y}%`,
        transform: invertida ? "rotate(180deg)" : undefined,
      }}
    />
  );
}
