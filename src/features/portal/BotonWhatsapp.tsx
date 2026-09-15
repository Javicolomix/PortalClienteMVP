import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/base/Popover";

import type { Contacto, ContactoPrincipal } from "./portal.types";
import { enlaceWhatsapp, ETIQUETA_ROL, rotuloDelContacto } from "./whatsapp";

/**
 * La marca de WhatsApp. No está en lucide —es un logo, no un icono de interfaz—
 * así que va dibujada acá. El verde `#25D366` es el oficial de WhatsApp: es de
 * ellos, no del sistema de Lexy, y por eso se escribe directo y no como token.
 */
function MarcaWhatsapp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
  );
}

/**
 * La piel del botón, que es la misma lleve a donde lleve: el círculo verde. Solo
 * cambia qué pasa al tocarlo.
 */
const CLASES_DEL_BOTON =
  "group flex size-[46px] items-center justify-center rounded-full bg-[#25d366] text-white transition-transform duration-150 ease-out [-webkit-tap-highlight-color:transparent] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:size-[52px]";

const SOMBRA = { boxShadow: "0 6px 16px rgb(37 211 102 / 0.4)" } as const;

const Circulo = () => <MarcaWhatsapp className="size-6 md:size-7" />;

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
 * **A quién le escribe lo decide la etapa, no el botón.** El capitán configura
 * el contacto principal de cada etapa junto con el resto del contenido —solo la
 * ejecutiva, solo el abogado o los dos—, así que puede cambiar dentro del mismo
 * caso a medida que avanza: al principio atiende quien pide los documentos, en
 * audiencia quien va al tribunal. El portal no elige: filtra por lo que dice la
 * etapa.
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
  contactoPrincipal,
  contactos,
  nombreCliente,
  correoSoporte,
}: {
  contactoPrincipal: ContactoPrincipal;
  contactos: Contacto[];
  nombreCliente: string;
  correoSoporte: string;
}): ReactNode {
  // Si la etapa pide un rol que no está asignado, se ofrecen todos: quedarse sin
  // nadie a quien escribir por un dato mal cargado es el peor final posible para
  // el botón de emergencia de la pantalla.
  const deLaEtapa =
    contactoPrincipal === "ambos"
      ? contactos
      : contactos.filter((contacto) => contacto.rol === contactoPrincipal);

  return (
    <PanelDeContactos
      contactos={deLaEtapa.length > 0 ? deLaEtapa : contactos}
      nombreCliente={nombreCliente}
      correoSoporte={correoSoporte}
    />
  );
}
