import { ArrowRight, ChevronRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Link } from "react-router";

import { BotonSalir } from "@/features/auth";
import fondoMarca from "@/shared/assets/lexy-fondo-navy.png";
import { HeaderBar } from "@/shared/components/base/HeaderBar";
import { Logo } from "@/shared/components/base/Logo";
import { useCarga } from "@/shared/hooks/useCarga";
import { cn } from "@/shared/lib/utils/cn";

import { ICONOS } from "./iconos";
import { NIVELES } from "./nivel-urgencia";
import { CargandoPagina, ErrorDeCarga } from "./PaginaDelPortal";
import type { DatosInicio } from "./portal.types";
import { cargarInicio } from "./portal-service";
import { saludoSegunHora } from "./saludo";

type Icono = (typeof ICONOS)[keyof typeof ICONOS];

/** Rótulo editorial que nombra de qué es cada bloque. */
function Rotulo({ children, tono }: { children: ReactNode; tono?: string }) {
  return (
    <span
      className={cn(
        "type-meta font-medium tracking-widest uppercase",
        tono ?? "text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

/**
 * El icono de un acceso, dentro de su pastilla.
 *
 * La pastilla no es decoración: los cuatro iconos son de lucide y tienen pesos
 * ópticos muy distintos —la balanza es ancha y llena, el globo de mensaje es una
 * mancha redonda, la tarjeta es un rectángulo—, y sueltos no se leen como un
 * conjunto sino como cuatro dibujos sin relación. La pastilla les da a todos el
 * mismo cuadro y ahí sí forman una fila ordenada.
 *
 * Va en el lavanda rebajado de las tarjetas de arriba, no en el lila casi blanco
 * del tema: con ese, el icono quedaba del tamaño de un adorno.
 */
function ChipIcono({ Icono, grande }: { Icono: Icono; grande?: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-[#ded9fc]",
        grande ? "size-10" : "size-9",
      )}
    >
      <Icono
        className={cn("text-brand-navy", grande ? "size-5" : "size-4")}
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

/**
 * El nombre es lo único personal de la pantalla: se subraya para que la persona
 * se reconozca de inmediato, sin tener que leer la frase entera.
 */
function NombreSubrayado({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-warning" aria-hidden />
    </span>
  );
}

/**
 * El saludo, en una sola franja de marca **de borde a borde de la pantalla**,
 * con su contenido y las tarjetas de abajo contenidos dentro. Que la franja sea
 * más ancha que las tarjetas es lo que las deja «metidas» en el header en vez de
 * medir lo mismo que él; antes, en el computador, franja y tarjetas llegaban
 * exactamente al mismo borde y el solape no se leía como tal.
 *
 * Cierra en un arco ancho —media circunferencia, no una esquina redondeada— y
 * sigue por debajo de las tarjetas. El `-mb-20` es la mitad de ese abrazo y vive
 * acá, junto al `pb-28` que le deja el sitio: son un solo gesto y separarlos deja
 * el navy asomando o tapado.
 *
 * En el teléfono se queda con el isotipo y el saludo, nada más: el rótulo del
 * portal y la bajada empujarían hacia abajo lo que la persona vino a ver. En el
 * computador hay aire para la apertura completa.
 */
function Saludo({ saludo, nombre }: { saludo: string; nombre?: string }) {
  return (
    <header
      className="relative isolate -mb-20 overflow-hidden bg-brand-navy pt-6 pb-28 [--arco:3rem] md:pt-10 md:[--arco:2.5rem]"
      style={{
        // Radio elíptico: el horizontal es media pantalla, así los dos arcos se
        // encuentran al medio y el borde queda como un solo arco continuo. El
        // vertical es profundo a propósito: lo único que asoma de la curva son
        // los costados de las tarjetas, así que ahí tiene que notarse.
        borderBottomLeftRadius: "50% var(--arco)",
        borderBottomRightRadius: "50% var(--arco)",
      }}
    >
      <img
        src={fondoMarca}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 size-full object-cover"
      />

      {/* El mismo riel que el contenido de abajo: por eso el texto del saludo y
          las tarjetas quedan alineados aunque la franja se pase de largo. */}
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <div className="flex items-center gap-3 md:hidden">
          <Logo brand="lexy" surface="dark" layout="isotipe" className="h-9 w-auto shrink-0" />

          <h1 className="type-page-title text-xl text-balance text-white">
            {saludo}
            {nombre ? (
              <>
                , <NombreSubrayado>{nombre}</NombreSubrayado>
              </>
            ) : null}
          </h1>
        </div>

        <div className="hidden max-w-xl md:block">
          <Rotulo tono="text-brand-lavender">Portal de cliente</Rotulo>
          <h1 className="mt-3 type-page-title text-white">
            {saludo}
            {nombre ? (
              <>
                , <NombreSubrayado>{nombre}</NombreSubrayado>
              </>
            ) : null}
          </h1>
          <p className="mt-4 type-body text-white/70">
            Revisa el servicio contratado, el estado de tu caso o tus pagos. ¿Tienes dudas? Estamos
            a un mensaje de distancia.
          </p>
        </div>
      </div>
    </header>
  );
}

/**
 * Las dos tarjetas de arriba: icono, rótulo, nombre y «Ver más». Las
 * proporciones las fijó el diseñador —radio 14, 22/20 de padding, 6 px entre
 * rótulo y nombre, 14 de separación entre las dos— y son las que las dejan
 * bajas: antes se estiraban hasta media pantalla del teléfono sin decir más.
 *
 * Las dos son claras —lavanda de marca y blanco— y **eso es lo que hace que
 * funcione el solape**: caen sobre el navy del saludo, que las cruza por detrás,
 * y son ellas las que destacan. Se probó rellenar «Mi servicio» de navy y de
 * índigo, y las dos veces desapareció justo la mitad que tenía que verse.
 *
 * El estado apretado es sólido y encoge un pelo, nunca translúcido. Además se
 * apaga el resaltado que el navegador del teléfono pinta encima al tocar: es un
 * velo gris que no es del diseño y que ensuciaba el lavanda.
 */
function TarjetaDestacada({
  rotulo,
  Icono,
  tono,
  titulo,
  estado,
  ruta,
  lavanda,
}: {
  rotulo: string;
  Icono: Icono;
  tono?: string;
  titulo: string;
  estado?: ReactNode;
  ruta: string;
  lavanda?: boolean;
}) {
  return (
    <Link
      to={ruta}
      className={cn(
        "flex h-full flex-col rounded-xl px-5 py-4",
        "transition-[background-color,transform] duration-150 ease-out",
        "[-webkit-tap-highlight-color:transparent] active:scale-[0.985]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        lavanda
          ? // Lavanda de marca rebajado con blanco. El tema solo trae el lavanda
            // pleno (#9d90fc), que acá pesaba demasiado, y el lila casi blanco de
            // `accent`, que no se leía como color. Los tres pasos viven acá.
            "bg-[#ded9fc] hover:bg-[#d2ccfa] active:bg-[#c6bff7]"
          : "bg-card ring-1 ring-border-subtle hover:bg-surface-subtle active:bg-surface-muted",
      )}
      style={{
        boxShadow: lavanda ? "0 8px 20px rgb(11 1 60 / 0.12)" : "0 8px 20px rgb(11 1 60 / 0.08)",
      }}
    >
      {/* El icono va en la misma línea que el rótulo, no encima: apilado le
          sumaba una fila entera de alto a una tarjeta que solo dice dos cosas. */}
      <span className="flex items-center gap-2">
        <Icono
          className={cn("size-4 shrink-0", tono ?? (lavanda ? "text-brand-navy" : "text-primary"))}
          strokeWidth={1.75}
          aria-hidden
        />
        <Rotulo tono={lavanda ? "text-brand-navy/70" : undefined}>{rotulo}</Rotulo>
      </span>

      <span
        className={cn(
          "mt-1.5 block type-subsection-title font-medium text-balance",
          lavanda ? "text-brand-navy" : "text-foreground",
        )}
      >
        {titulo}
      </span>

      {estado}

      <span
        className={cn(
          "mt-auto flex items-center gap-1 pt-3 type-action-label",
          lavanda ? "text-brand-navy" : "text-primary",
        )}
      >
        Ver más
        <ArrowRight className="size-4 shrink-0" aria-hidden />
      </span>
    </Link>
  );
}

/**
 * Los puntos del carrusel. El borde asomado de la tarjeta siguiente ya invitaba
 * a arrastrar, pero solo una vez que la persona lo mira: los puntos lo dicen
 * antes, de un vistazo, y ocupan seis píxeles de alto.
 *
 * El punto activo se estira en vez de solo pintarse: dice a la vez cuántas hay y
 * en cuál estás. Van `aria-hidden` porque no son un control — el contenido se
 * alcanza con las propias tarjetas.
 */
function PuntosDelCarrusel({ total, activa }: { total: number; activa: number }) {
  return (
    <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
      {Array.from({ length: total }, (_, indice) => (
        <span
          key={indice}
          className={cn(
            "h-1.5 rounded-full transition-[width,background-color] duration-200",
            indice === activa ? "w-5 bg-primary" : "w-1.5 bg-border-strong",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Las dos tarjetas que dicen dónde está parada la persona.
 *
 * En el teléfono no se apilan: se deslizan de lado. Apiladas ocupaban casi toda
 * la pantalla y empujaban los accesos fuera de la vista, así que la persona
 * llegaba al inicio y no veía qué podía hacer. Deslizándose, las dos caben en la
 * altura de una y «¿qué necesitas hacer hoy?» queda a un golpe de vista.
 *
 * La primera tarjeta cae sobre el navy del saludo: ese solape es lo que hace que
 * la pantalla se lea como una sola pieza. Desde `md` vuelven a ser dos columnas,
 * donde caben sin competir.
 */
function Destacados({ datos }: { datos: DatosInicio }) {
  const etapaVisible = datos.etapa?.visibleParaCliente ? datos.etapa : null;
  const nivel = etapaVisible ? NIVELES[etapaVisible.nivelUrgencia] : null;

  const pista = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState(0);

  // La posición se mide contra el ancho de una tarjeta, no contra un valor fijo:
  // así sigue funcionando si mañana entra una tercera.
  const alDeslizar = () => {
    const carril = pista.current;
    const primera = carril?.firstElementChild as HTMLElement | null;
    if (!carril || !primera) return;
    setActiva(Math.round(carril.scrollLeft / primera.offsetWidth));
  };

  return (
    <>
      <div
        ref={pista}
        onScroll={alDeslizar}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3.5 overflow-x-auto px-4 pb-1",
          "md:mx-0 md:grid md:grid-cols-2 md:gap-3.5 md:overflow-visible md:px-0 md:pb-0",
        )}
      >
        <div className="w-[86%] shrink-0 snap-start md:w-auto">
          <TarjetaDestacada
            lavanda
            rotulo="Mi servicio"
            Icono={ICONOS.balanza}
            titulo={datos.servicio.nombre}
            ruta="/mi-servicio"
          />
        </div>

        <div className="w-[86%] shrink-0 snap-start md:w-auto">
          <TarjetaDestacada
            rotulo="Estado de mi caso"
            Icono={ICONOS.etapa}
            tono={nivel?.color}
            titulo={etapaVisible ? etapaVisible.nombreParaCliente : "Tu caso está avanzando"}
            estado={
              nivel ? (
                <span
                  className={cn(
                    "mt-2 flex items-center gap-1.5 type-supporting font-medium",
                    nivel.color,
                  )}
                >
                  <nivel.Icono className="size-4 shrink-0" aria-hidden />
                  {nivel.resumen}
                </span>
              ) : undefined
            }
            ruta="/mi-caso"
          />
        </div>
      </div>

      <PuntosDelCarrusel total={2} activa={activa} />
    </>
  );
}

type Opcion = {
  ruta: string;
  /** Frase completa, para la lista del computador. */
  titulo: string;
  /** Dos o tres palabras, para el cuadrado del teléfono. Siempre empieza con verbo. */
  corto: string;
  apoyo: string;
  Icono: Icono;
};

/**
 * Los iconos de los accesos van todos en el índigo de marca. El único color con
 * significado en esta pantalla es el del estado del caso, y ese vive arriba en
 * su tarjeta: repetirlo acá le quitaría fuerza.
 *
 * La lista es el índice completo del portal, así que incluye el servicio y el
 * caso aunque también tengan tarjeta arriba. Agregar un acceso nuevo es agregar
 * una fila acá: las dos presentaciones salen de la misma lista.
 */
const OPCIONES: Opcion[] = [
  {
    ruta: "/mi-servicio",
    titulo: "Saber sobre mi servicio",
    corto: "Ver mi servicio",
    apoyo: "Qué hacemos por ti y a qué resultado apuntamos",
    Icono: ICONOS.balanza,
  },
  {
    ruta: "/mi-caso",
    titulo: "Revisar estado de mi caso",
    corto: "Revisar mi caso",
    apoyo: "Qué estamos haciendo y qué viene después",
    Icono: ICONOS.etapa,
  },
  {
    ruta: "/mi-equipo",
    titulo: "Conversar con mi equipo",
    corto: "Escribir a mi equipo",
    apoyo: "Escríbele por WhatsApp a tu ejecutiva o a tu abogado",
    Icono: ICONOS.mensaje,
  },
  {
    ruta: "/mis-pagos",
    titulo: "Revisar y pagar mi cuota",
    corto: "Pagar mi cuota",
    apoyo: "Tu próxima cuota y cómo pagarla",
    Icono: ICONOS.pago,
  },
];

/**
 * Accesos del teléfono: cuadrados que se tocan, en dos columnas.
 *
 * El icono va suelto y grande, sin la pastilla lila detrás. La pastilla lo
 * encerraba en 36 px y lo dejaba del tamaño de un adorno; suelto a 28 px y en el
 * índigo de marca, **el icono es lo que se ve primero** y el nombre lo confirma.
 * Es también lo que distingue un cuadrado de otro de un vistazo, sin leer.
 *
 * `auto-rows-fr` iguala las filas, así los cuatro miden exactamente lo mismo
 * aunque un nombre ocupe dos líneas y otro una. El texto de apoyo no viaja acá:
 * en un cuadrado sobra, y el nombre del acceso ya dice a dónde lleva.
 */
function AccesosEnCuadricula() {
  return (
    <ul className="grid auto-rows-fr grid-cols-2 gap-3 md:hidden">
      {OPCIONES.map((opcion) => (
        <li key={opcion.ruta}>
          <Link
            to={opcion.ruta}
            className="flex h-full flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-border-subtle transition-[background-color,transform] duration-150 ease-out [-webkit-tap-highlight-color:transparent] hover:bg-surface-subtle active:scale-[0.98] active:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ChipIcono Icono={opcion.Icono} grande />
            <span className="type-item-title text-balance text-foreground">{opcion.corto}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Accesos del computador: una sola superficie con filas separadas por hairline,
 * no tarjetas sueltas — la regla de contención del sistema (espacio → superficie
 * → línea). Acá hay ancho de sobra para la frase completa y su apoyo.
 */
function AccesosEnLista() {
  return (
    <div className="hidden overflow-hidden rounded-lg bg-card ring-1 ring-border-subtle md:block">
      <ul>
        {OPCIONES.map((opcion, indice) => (
          <li key={opcion.ruta} className={cn(indice > 0 && "border-t border-border-subtle")}>
            <Link
              to={opcion.ruta}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-subtle active:bg-surface-muted focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <ChipIcono Icono={opcion.Icono} />

              <span className="min-w-0 flex-1">
                <span className="type-item-title block text-foreground">{opcion.titulo}</span>
                <span className="type-supporting mt-0.5 block text-muted-foreground">
                  {opcion.apoyo}
                </span>
              </span>

              <ChevronRight className="size-5 shrink-0 text-foreground-faint" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Inicio() {
  const { fase, datos, recargar } = useCarga("inicio", cargarInicio);
  const saludo = saludoSegunHora(new Date());
  const nombre = fase === "listo" && datos ? datos.cliente.nombre : undefined;

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* En el teléfono la barra sobra: el saludo ya trae el isotipo, y «Salir»
          baja al pie, que es donde se termina de leer la pantalla. */}
      <HeaderBar className="hidden md:flex" actions={<BotonSalir />} />

      <Saludo saludo={saludo} nombre={nombre} />

      {/* `relative z-10`: el saludo está posicionado, y en CSS un elemento
          posicionado se pinta sobre uno que no lo está aunque venga antes en el
          orden. Sin esto el navy tapaba la mitad de arriba de las tarjetas en
          vez de pasarles por detrás. */}
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-10 md:px-6 md:pb-14">
        <div>
          {fase === "cargando" ? <CargandoPagina /> : null}
          {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}

          {fase === "listo" && datos ? (
            <>
              <Destacados datos={datos} />

              <section className="mt-10 md:mt-12">
                <h2 className="type-page-title text-xl text-foreground md:text-3xl">
                  ¿Qué necesitas <em className="text-primary italic">hacer hoy</em>?
                </h2>
                <div className="mt-5">
                  <AccesosEnCuadricula />
                  <AccesosEnLista />
                </div>
              </section>

              {/* El pie tenía las tres cosas en fila y al mismo peso: un aviso,
                  una acción y el copyright. Ahora van por rango. Primero la
                  frase que tranquiliza, después la salida para cuando algo va
                  mal —que es lo único que alguien va a tocar acá— y al final el
                  chrome legal, en el cuerpo más chico. */}
              {/* El pie tenía las tres cosas en fila y al mismo peso: un aviso,
                  una acción y el copyright. Ahora va centrado y por rango: la
                  frase que tranquiliza y después la salida para cuando algo va
                  mal, que es lo único que alguien va a tocar acá. El copyright
                  salió: no le servía a nadie que entra a ver su caso. */}
              <footer className="mt-12 border-t border-border-subtle pt-8 text-center md:mt-14">
                <p className="type-supporting text-muted-foreground">
                  Tu información está protegida y es confidencial.
                </p>

                <p className="mt-3">
                  <a
                    href={datos.configuracion.urlFormularioReclamos}
                    target="_blank"
                    rel="noreferrer"
                    className="type-action-label inline-flex items-center gap-1.5 text-primary underline underline-offset-4 hover:text-primary-hover"
                  >
                    ¿Problemas con tu caso? Reclama Aquí
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                  </a>
                </p>

                {/* La única salida del teléfono: en el computador vive arriba,
                    en la barra. */}
                <p className="mt-6 md:hidden">
                  <BotonSalir />
                </p>
              </footer>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
