import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/base/Popover";

import { MarcaWhatsapp } from "./MarcaWhatsapp";
import type { Contacto } from "./portal.types";
import { enlaceWhatsapp, ETIQUETA_ROL, rotuloDelContacto } from "./whatsapp";

/**
 * La piel del botón, que es la misma lleve a donde lleve: el círculo verde. Solo
 * cambia qué pasa al tocarlo.
 */
const CLASES_DEL_BOTON =
  "group flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white transition-transform duration-150 ease-out [-webkit-tap-highlight-color:transparent] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:size-16";

const SOMBRA = { boxShadow: "0 6px 16px rgb(37 211 102 / 0.4)" } as const;

const Circulo = () => <MarcaWhatsapp className="size-7 md:size-8" />;

/**
 * El botón y su rótulo, anclados abajo a la derecha.
 *
 * El círculo verde solo dice «WhatsApp», no a quién ni para qué, y en una
 * pantalla donde todo lo demás está nombrado quedaba como el único elemento que
 * había que adivinar. El rótulo lo dice en dos palabras.
 *
 * Va en una pastilla blanca y no en texto suelto porque debajo pasa contenido
 * que se desplaza: sobre una tarjeta blanca o sobre el lienzo gris tiene que
 * leerse igual. No recibe clics (`pointer-events-none`): el objetivo es el
 * círculo, y una pastilla que se pudiera tocar sin hacer nada sería una promesa
 * falsa. Tampoco lo lee el lector de pantalla, que ya escucha el nombre del
 * botón.
 */
function Anclado({ children }: { children: ReactNode }) {
  return (
    <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-2 md:right-6 md:bottom-6">
      <span
        aria-hidden
        className="pointer-events-none rounded-full bg-card px-3 py-1 type-meta font-medium text-foreground ring-1 ring-border-subtle"
        style={{ boxShadow: "0 2px 8px rgb(11 1 60 / 0.10)" }}
      >
        Contacta a tu equipo
      </span>

      {children}
    </div>
  );
}

/**
 * Una persona del equipo dentro del panel: su nombre, su rol y el verde de
 * WhatsApp que dice por dónde se le escribe. Toda la fila es el enlace, no un
 * botón chico al costado: lo que se toca es la opción entera.
 *
 * **El chevron va siempre**, haya un contacto o dos. Es la señal de que la fila
 * lleva a alguna parte, y con un solo contacto es cuando más falta hace: una
 * fila sola y sin chevron se lee como un dato, no como algo que se puede tocar.
 */
function OpcionDeContacto({
  contacto,
  nombreCliente,
}: {
  contacto: Contacto;
  nombreCliente: string;
}) {
  return (
    <a
      href={enlaceWhatsapp(contacto.telefonoWhatsapp, nombreCliente)}
      target="_blank"
      rel="noreferrer"
      aria-label={rotuloDelContacto(contacto)}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-subtle active:bg-surface-muted focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
        <MarcaWhatsapp className="size-[18px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="type-item-title block truncate text-foreground">{contacto.nombre}</span>
        <span className="type-supporting block text-muted-foreground">
          {ETIQUETA_ROL[contacto.rol]}
        </span>
      </span>

      <ChevronRight className="size-5 shrink-0 text-foreground-faint" aria-hidden />
    </a>
  );
}

/**
 * El panel que se abre desde el botón. Se ancla al botón y se cierra con Escape
 * o tocando fuera — lo trae `Popover` del sistema, no hace falta cablearlo.
 *
 * Se abre **en la misma pantalla** y no lleva a una página aparte: escribirle a
 * alguien del equipo no es cambiar de lugar, y quien aprieta ese botón
 * normalmente está mirando algo de su caso que no quiere perder de vista.
 *
 * El título es **siempre el mismo**, haya uno o dos contactos. Se probó
 * «¿Con quién quieres hablar?» y con un solo contacto la pregunta no tenía
 * sentido: le ofrecía elegir entre una cosa.
 */
function PanelDeContactos({
  contactos,
  nombreCliente,
  correoSoporte,
}: {
  contactos: Contacto[];
  nombreCliente: string;
  correoSoporte: string;
}) {
  return (
    <Popover>
      <Anclado>
        <PopoverTrigger
          aria-label="Conversar con mi equipo por WhatsApp"
          className={CLASES_DEL_BOTON}
          style={SOMBRA}
        >
          <Circulo />
        </PopoverTrigger>
      </Anclado>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border-border-subtle p-3"
      >
        <p className="px-3 pt-1 pb-2 type-supporting font-medium text-foreground">
          Escríbenos por WhatsApp
        </p>

        {contactos.length > 0 ? (
          <div className="space-y-0.5">
            {contactos.map((contacto) => (
              <OpcionDeContacto
                key={contacto.id}
                contacto={contacto}
                nombreCliente={nombreCliente}
              />
            ))}
          </div>
        ) : null}

        <p className="mt-2 border-t border-border-subtle px-3 pt-3 type-supporting text-muted-foreground">
          Si prefieres el correo,{" "}
          <a
            href={`mailto:${correoSoporte}`}
            className="font-medium text-primary underline underline-offset-4"
          >
            {correoSoporte}
          </a>
          .
        </p>
      </PopoverContent>
    </Popover>
  );
}

/**
 * El botón flotante para escribirle al equipo. Reemplaza al acceso «Conversar
 * con mi equipo» de la lista: hablar con alguien no es una tarea más entre
 * otras, es la salida de emergencia, y tiene que estar a la vista en cualquier
 * punto de la pantalla.
 *
 * **A quién le escribe lo decide la configuración de la etapa, no el botón.** El
 * capitán define por etapa si al cliente se le muestra solo el abogado, solo la
 * ejecutiva o los dos, así que puede cambiar durante el mismo caso a medida que
 * avanza. El portal muestra lo que le llega y no elige.
 *
 * Por eso **el panel es siempre el mismo**, venga uno o dos contactos: mismo
 * título, mismas filas, mismo chevron. Se probó saltar directo a WhatsApp cuando
 * había un solo contacto y era peor: el botón se comportaba distinto según un
 * dato que la persona no ve, así que dos clientes de Lexy tenían dos productos
 * distintos en la mano.
 *
 * Si no viene ninguno, el panel ofrece el correo de soporte, que es la salida que
 * le queda. Un botón de emergencia que desaparece justo cuando no hay a quién
 * escribirle es el peor momento para que desaparezca.
 *
 * El contenedor de la página le deja sitio al pie con `pb-28` en el teléfono,
 * así el botón no queda encima de lo último que hay que leer.
 */
export function BotonWhatsapp({
  contactos,
  nombreCliente,
  correoSoporte,
}: {
  contactos: Contacto[];
  nombreCliente: string;
  correoSoporte: string;
}): ReactNode {
  return (
    <PanelDeContactos
      contactos={contactos}
      nombreCliente={nombreCliente}
      correoSoporte={correoSoporte}
    />
  );
}
