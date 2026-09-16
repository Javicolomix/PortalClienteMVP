import { ChevronRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { BotonSalir } from "@/features/auth";
import fondoMarca from "@/shared/assets/lexy-fondo-navy.png";
import { HeaderBar } from "@/shared/components/base/HeaderBar";
import { Logo } from "@/shared/components/base/Logo";
import { useCarga } from "@/shared/hooks/useCarga";
import { cn } from "@/shared/lib/utils/cn";

import { BotonWhatsapp } from "./BotonWhatsapp";
import { muestraBloque, nombreDelServicioPrincipal } from "./composicion";
import { ICONOS } from "./iconos";
import { FilaDesplegable, ListaDeCajas, TituloDeBloque } from "./ListaDeCajas";
import { CargandoPagina, ErrorDeCarga } from "./PaginaDelPortal";
import { type DatosInicio, type Etapa, nombreCompleto } from "./portal.types";
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
 * El icono de un acceso. Va **suelto, en navy y sin pastilla detrás**.
 *
 * La pastilla lila existía para darles a los cuatro iconos el mismo cuadro
 * óptico, pero el remedio pesaba más que la enfermedad: cuatro manchas moradas
 * en fila se leían antes que los nombres de los accesos, y el icono adentro
 * quedaba del tamaño de un adorno. Suelto y grande, el icono es lo que
 * distingue un acceso de otro de un vistazo.
 *
 * El navy es el mismo de los títulos de los bloques desplegables: en esta
 * pantalla el único color con significado es el del nivel de urgencia.
 */
function IconoDeAcceso({ Icono, grande }: { Icono: Icono; grande?: boolean }) {
  return (
    <Icono
      className={cn("shrink-0 text-brand-navy", grande ? "size-7" : "size-5")}
      strokeWidth={2}
      aria-hidden
    />
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
 * La bajada del saludo. La escribió el diseñador y va literal: es la promesa
 * completa del portal en una línea, y por eso reemplazó a las dos frases que
 * había antes —una enumeraba las secciones, que ya están más abajo, y la otra
 * ofrecía ayuda, que ya la ofrece el botón de WhatsApp.
 */
const BAJADA = "Todo lo que debes saber de tu servicio a un solo click.";

/**
 * El saludo, en una sola franja de marca **de borde a borde de la pantalla**,
 * con su contenido y la tarjeta del servicio contenidos dentro. Que la franja
 * sea más ancha que la tarjeta es lo que la deja «metida» en el header en vez de
 * medir lo mismo que él; antes, en el computador, franja y tarjeta llegaban
 * exactamente al mismo borde y el solape no se leía como tal.
 *
 * **Cierra en un arco ancho** —media circunferencia, no una esquina redondeada—
 * que sigue por debajo de la tarjeta del servicio. Con la tarjeta encima lo que
 * se ve son los dos costados de la curva, y ahí es donde tiene que notarse.

 *
 * El solape se queda: el `-mb-12` es la mitad del alto de la tarjeta del
 * servicio y vive acá, junto al `pb-20` que le deja el sitio. Son un solo gesto
 * y separarlos deja el navy asomando o tapado; el valor hay que revisarlo si esa
 * tarjeta cambia de porte.
 *
 * La bajada es una línea y la misma en los dos tamaños. Antes eran dos frases y
 * en el teléfono no aparecían: empujaban hacia abajo lo que la persona vino a
 * ver. Con una línea sí cabe, y el saludo sin bajada dejaba el isotipo y el
 * nombre solos contra una franja de navy demasiado alta.
 *
 * El teléfono se queda sin el rótulo «Portal de cliente»: ahí sí sobra.
 */
function Saludo({ saludo, nombre }: { saludo: string; nombre?: string }) {
  return (
    <header
      className="relative isolate -mb-12 overflow-hidden bg-brand-navy pt-5 pb-20 [--arco:3rem] md:pt-7 md:pb-24 md:[--arco:2.5rem]"
      style={{
        // Radio elíptico: el horizontal es media pantalla, así los dos arcos se
        // encuentran al medio y el borde queda como un solo arco continuo. El
        // vertical es profundo a propósito: con la tarjeta del servicio encima,
        // lo único que asoma de la curva son los costados, y ahí tiene que
        // notarse.
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
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
        <div className="md:hidden">
          {/* La fila de chrome del teléfono: la marca a la izquierda y la salida
              a la derecha, que es donde se la busca. Antes «Salir» vivía al pie,
              al final de todo, y para cerrar sesión había que recorrer la página
              entera. */}
          <div className="flex items-center justify-between gap-3">
            <Logo brand="lexy" surface="dark" layout="isotipe" className="h-9 w-auto shrink-0" />

            <BotonSalir className="-mr-2 text-white hover:bg-white/10 hover:text-white" />
          </div>

          {/* En una sola línea, siempre. Partido en dos —«Buenas tardes,» arriba
              y el nombre abajo— el saludo deja de leerse como un saludo y el
              nombre queda colgando, que es justo lo personal de la pantalla. */}
          <h1 className="mt-4 type-page-title text-xl whitespace-nowrap text-white">
            {saludo}
            {nombre ? (
              <>
                , <NombreSubrayado>{nombre}</NombreSubrayado>
              </>
            ) : null}
          </h1>

          <p className="mt-2 type-supporting text-balance text-white/70">{BAJADA}</p>
        </div>

        <div className="hidden max-w-xl md:block">
          <Rotulo tono="text-brand-lavender">Portal de cliente</Rotulo>
          <h1 className="mt-3 type-page-title whitespace-nowrap text-white">
            {saludo}
            {nombre ? (
              <>
                , <NombreSubrayado>{nombre}</NombreSubrayado>
              </>
            ) : null}
          </h1>
          <p className="mt-3 type-body text-white/70">{BAJADA}</p>
        </div>
      </div>
    </header>
  );
}

/**
 * **Bloque A — Mi servicio.** Dice qué contrató la persona, y nada más: no se
 * despliega, no lleva a ninguna parte, no tiene chevron ni cursor de enlace.
 *
 * Es **lo primero y lo más grande** de la página después del saludo, porque es
 * la respuesta a la primera pregunta que trae alguien que entra: qué contraté.
 * El nombre del servicio va en cuerpo de titular, no de ítem.
 *
 * Que sea grande y aun así no compita con el estado del caso es posible porque
 * las dos cosas dejaron de ser el mismo objeto: A es una tarjeta y B es una
 * sección con título y filas. Antes eran dos tarjetas casi iguales pero no del
 * todo —otro color, otro ancho, una con chevron y la otra no—, y un par así se
 * lee como un error de armado. Achicar A fue el primer intento de arreglarlo;
 * lo que en realidad lo arregló fue que B pasara a ser otra cosa, y por eso A
 * pudo volver a pesar lo que le corresponde.
 *
 * En el computador **se encoge al largo de su nombre**, entre 352 px y 576 px:
 * no llega a los dos márgenes. Un cuadro que toca los dos bordes se lee como una
 * franja del encabezado y no como una tarjeta apoyada encima, y ese apoyo es lo
 * que amarra la franja navy con el contenido. Los topes existen para que un
 * nombre corto no deje una cajita y el compuesto no se estire hasta el borde: se
 * parte en dos líneas antes.
 *
 * En el teléfono va a todo el ancho, que ahí es lo único razonable.
 *
 * **La medida es la de la referencia del diseñador**, que es también la de su
 * especificación original: rótulo en versalitas
 * y nombre navy `#0B013C` en Geist, 20 px. Los dos colores van escritos a mano
 * porque el tema no los cubre —su lavanda de baja intensidad es más frío y su
 * gris de texto de apoyo, más claro—; si el sistema los incorpora, se cambian
 * acá y no en la pantalla.
 *
 * Antes de llegar acá se recorrieron las dos familias del sistema en varios
 * pesos: negrita, versalitas, display. Todas empujaban en la dirección
 * equivocada. **La elegancia de esta tarjeta no está en la letra sino en lo que
 * le falta**: no tiene icono, no tiene borde y el rótulo se apaga a gris.
 *
 * La balanza vuelve, **junto al rótulo y no junto al nombre**: en el gris del
 * rótulo y por debajo de su altura, acompaña sin competir. Le devuelve identidad
 * a una tarjeta que sin ella era un rectángulo lila con dos líneas de texto, y
 * no es un elemento nuevo — es la misma balanza que usa el acceso «Consultar mi
 * servicio». Repetir algo que ya existe en el sistema no es lo mismo que agregar
 * un adorno.
 *
 * **El rótulo nunca puede pesar más que el nombre.** Con los dos en versalitas
 * la diferencia de cuerpo se nota poco, y un icono de 16 px al lado de un texto
 * de 12 hacía que la línea del rótulo midiera más de alto que la del nombre: la
 * etiqueta se leía primero y el dato después. Por eso el rótulo bajó a 11 px y
 * la balanza a 14, con el interletrado más abierto para que siga siendo cómodo
 * de leer.
 *
 * El nombre va en **versalitas**, con el interletrado abierto y **chico**: 16 px
 * en el teléfono, 18 en el computador. Las mayúsculas llenan toda la altura de
 * la línea y pesan bastante más que su cuerpo, así que el número de píxeles no
 * dice cuánto van a ocupar: a 24 px se convertían en un muro, y en el nombre
 * compuesto, en dos.
 *
 * El interletrado va abierto porque es lo que hace legible una versalita; en
 * caja baja, en cambio, deja las palabras deshilachadas. Caja y interletrado se
 * mueven juntos, no son dos decisiones.
 *
 * El peso de la tarjeta, entonces, no lo carga el grosor de la letra sino el
 * lila un paso más profundo que `accent`, el hairline que le define el canto y
 * una sombra corta. Con la esquina más redonda y la sombra larga y difusa, un
 * cuadro lila claro flotando se leía blando.
 *
 * Cae sobre el navy del saludo: ese solape es lo que hace que la pantalla se lea
 * como una sola pieza.
 */
function TarjetaDelServicio({ nombres }: { nombres: string[] }) {
  return (
    <section
      className={cn(
        "w-full rounded-xl bg-[#e4e1fa] px-6 py-5 md:w-fit md:min-w-[24rem] md:max-w-2xl md:px-9 md:py-6",
        // Con un nombre de una línea la tarjeta queda baja al lado de la del
        // nombre compuesto, que ocupa dos. Se le suma aire abajo para acercarlas
        // de porte. Es aire y no una línea de texto reservada: reservada dejaba
        // medio bloque de lila vacío, que era peor que la diferencia de alto.
        nombres.length === 1 && "pb-8 md:pb-9",
      )}
      style={{ boxShadow: "0 8px 24px rgb(11 1 60 / 0.10)" }}
    >
      <p className="flex items-center gap-1.5 type-meta text-[11px] font-medium tracking-[0.1em] text-[#4a4478] uppercase">
        <ICONOS.balanza className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        Mi servicio
      </p>

      {/* Con el nombre compuesto, cada servicio va en su propia línea y el «con»
          cierra la primera: «Defensa en juicio con» / «Protección Patrimonial».
          Suelto, el navegador lo parte donde le alcance el ancho y el corte cae
          en mitad de un nombre —«…Protección» arriba, «Patrimonial» abajo—, que
          hace leer dos veces para entender que es un solo servicio.

          El nombre **no reserva una segunda línea**. Se probó reservarla para
          que la tarjeta midiera lo mismo en todas las cuentas, y el remedio era
          peor: con un nombre de una línea quedaba medio bloque de lila vacío
          debajo. La consistencia de alto entre cuentas no la ve nadie —cada
          persona entra a la suya— y el vacío lo ve todo el mundo. */}
      <p className="mt-2 type-subsection-title text-base leading-[1.35] tracking-[0.06em] text-balance text-brand-navy uppercase md:text-base">
        {nombres.map((nombre, indice) => (
          <span key={nombre} className="block">
            {indice < nombres.length - 1 ? `${nombre} con` : nombre}
          </span>
        ))}
      </p>
    </section>
  );
}

/**
 * **Bloque B — Estado de mi caso.** El estado de un caso único.
 *
 * Es **la misma pieza que un juicio o una escritura**: título de bloque con su
 * icono sobrio y, debajo, una fila que se despliega en el lugar. Los tres
 * responden la misma pregunta con el mismo contenido, así que se ven igual;
 * antes esta era una tarjeta aparte, parecida pero no idéntica, y esa mitad de
 * diferencia era justamente lo que se leía mal.
 *
 * Su fila tiene **la misma anatomía que las de los juicios y las escrituras**:
 * rótulo chico arriba, etapa abajo, etiqueta de urgencia y chevron. En las listas
 * el rótulo dice de cuál de todas se trata —el ROL, el tipo de escritura— y acá
 * dice de qué servicio es el caso, que responde la misma pregunta cuando hay uno
 * solo. Sin él, las dos filas del inicio tenían distinto número de líneas y se
 * leían como piezas de dos sistemas distintos.
 *
 * No se repite con la tarjeta de arriba: allá el servicio es el titular de la
 * página, en versalitas; acá es un rótulo gris de doce píxeles que ubica la fila.
 *
 * Al desplegarse trae **todo** lo que escribió el capitán —la bajada de la
 * etapa, las tres respuestas y «qué puede pasar después»—, y no la versión
 * breve de las listas. Desde que «Revisar estado de mi caso» salió de los
 * accesos, este es el único lugar donde se lee la etapa entera, y no puede
 * quedarse contenido afuera sin ninguna pantalla que lo muestre.
 */
function BloqueDelCaso({ etapa, servicio }: { etapa: Etapa | null; servicio: string }) {
  return (
    <section className="mt-10 md:mt-12">
      <TituloDeBloque Icono={ICONOS.etapa}>Estado de mi caso</TituloDeBloque>

      <div className="mt-3">
        <FilaDesplegable
          id="mi-caso"
          identidad={{ principal: servicio, claveDeColor: servicio }}
          Icono={ICONOS.etapa}
          etapa={etapa}
          completo
        />
      </div>
    </section>
  );
}

type Opcion = {
  /** Identifica la opción en la lista y en el acordeón. */
  clave: string;
  /** Frase completa, para la lista del computador. */
  titulo: string;
  /** Dos o tres palabras, para el cuadrado del teléfono. Siempre empieza con verbo. */
  corto: string;
  apoyo: string;
  Icono: Icono;
  /** A dónde lleva. */
  ruta: string;
  /** Sale del portal: se abre en otra pestaña y se dice antes de tocarlo. */
  externo?: boolean;
};

/**
 * Los iconos de los accesos van todos en el navy de marca. El único color con
 * significado en esta pantalla es el del estado del caso, y ese vive arriba en
 * su bloque: repetirlo acá le quitaría fuerza.
 *
 * «Conversar con mi equipo» ya no está acá: escribirle a alguien no es una tarea
 * más entre otras, así que salió a un botón flotante que se ve desde cualquier
 * punto de la pantalla.
 *
 * Las dos últimas salen del portal. Van al final y en ese orden a propósito:
 * primero el agradecimiento y después el reclamo, porque son las dos salidas de
 * quien ya terminó de mirar su caso y no queremos que la última palabra de la
 * pantalla sea «algo salió mal».
 *
 * La lista se arma con los datos a la mano porque las direcciones de afuera y la
 * explicación del servicio son datos del portal, no constantes.
 */
const opciones = (datos: DatosInicio): Opcion[] => [
  {
    clave: "servicio",
    ruta: "/mi-servicio",
    titulo: "Consultar mi servicio",
    corto: "Consultar mi servicio",
    apoyo: "Qué hacemos por ti y a qué resultado apuntamos",
    Icono: ICONOS.balanza,
  },
  {
    clave: "pagos",
    ruta: "/mis-pagos",
    titulo: "Pagar mis honorarios",
    corto: "Pagar mis honorarios",
    apoyo: "Tu próxima cuota y cómo pagarla",
    Icono: ICONOS.pago,
  },
  {
    clave: "felicitar",
    ruta: datos.configuracion.urlResenasGoogle,
    externo: true,
    titulo: "Felicitar a mi equipo",
    corto: "Felicitar al equipo",
    apoyo: "Déjanos una reseña en Google si te ayudamos",
    Icono: ICONOS.felicitacion,
  },
  {
    clave: "reclamo",
    ruta: datos.configuracion.urlFormularioReclamos,
    externo: true,
    titulo: "Ingresar un reclamo",
    corto: "Ingresar un reclamo",
    apoyo: "Cuéntanos qué salió mal para poder arreglarlo",
    Icono: ICONOS.reclamo,
  },
];

/**
 * El envoltorio de un acceso: los de adentro del portal navegan sin recargar y
 * los de afuera se abren en otra pestaña —y lo dicen antes, con el icono de
 * enlace externo.
 */
function EnlaceDeAcceso({
  opcion,
  className,
  children,
}: {
  opcion: Opcion;
  className: string;
  children: ReactNode;
}) {
  if (opcion.externo) {
    return (
      <a href={opcion.ruta} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={opcion.ruta} className={className}>
      {children}
    </Link>
  );
}

const CLASES_DEL_CUADRADO =
  "relative flex h-full w-full flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-border-subtle transition-[background-color,transform] duration-150 ease-out [-webkit-tap-highlight-color:transparent] hover:bg-surface-subtle active:scale-[0.98] active:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Accesos del teléfono: cuadrados que se tocan, en dos columnas.
 *
 * El icono va suelto y grande, sin pastilla detrás: es lo que distingue un
 * cuadrado de otro de un vistazo, sin leer. El texto de apoyo no viaja acá: en
 * un cuadrado sobra, y el nombre del acceso ya dice a dónde lleva.
 */
function AccesosEnCuadricula({ opciones }: { opciones: Opcion[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:hidden">
      {opciones.map((opcion) => (
        <li key={opcion.clave}>
          <EnlaceDeAcceso opcion={opcion} className={CLASES_DEL_CUADRADO}>
            <IconoDeAcceso Icono={opcion.Icono} grande />
            <span className="type-item-title text-balance text-foreground">{opcion.corto}</span>

            {opcion.externo ? (
              <>
                <ExternalLink
                  className="absolute top-3 right-3 size-3.5 text-foreground-faint"
                  aria-hidden
                />
                <span className="sr-only">Se abre fuera del portal</span>
              </>
            ) : null}
          </EnlaceDeAcceso>
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
function AccesosEnLista({ opciones }: { opciones: Opcion[] }) {
  return (
    <div className="hidden overflow-hidden rounded-lg bg-card ring-1 ring-border-subtle md:block">
      <ul>
        {opciones.map((opcion, indice) => (
          <li key={opcion.clave} className={cn(indice > 0 && "border-t border-border-subtle")}>
            <EnlaceDeAcceso
              opcion={opcion}
              className="flex w-full items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-subtle active:bg-surface-muted focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <IconoDeAcceso Icono={opcion.Icono} />

              <span className="min-w-0 flex-1">
                <span className="type-item-title block text-foreground">{opcion.titulo}</span>
                <span className="type-supporting mt-0.5 block text-muted-foreground">
                  {opcion.apoyo}
                </span>
              </span>

              {opcion.externo ? (
                <>
                  <span className="sr-only">Se abre fuera del portal</span>
                  <ExternalLink className="size-4 shrink-0 text-foreground-faint" aria-hidden />
                </>
              ) : (
                <ChevronRight className="size-5 shrink-0 text-foreground-faint" aria-hidden />
              )}
            </EnlaceDeAcceso>
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
      {/* En el teléfono la barra sobra: el saludo ya trae el isotipo y «Salir»,
          que están dentro de la franja navy. */}
      <HeaderBar className="hidden md:flex" actions={<BotonSalir />} />

      <Saludo saludo={saludo} nombre={nombre} />

      {/* `relative z-10`: el saludo está posicionado, y en CSS un elemento
          posicionado se pinta sobre uno que no lo está aunque venga antes en el
          orden. Sin esto el navy tapaba la mitad de arriba de las tarjetas en
          vez de pasarles por detrás. */}
      {/* El `pb` le deja sitio al botón flotante y a su rótulo, para que no
          queden encima de lo último que hay que leer.

          El riel es `max-w-3xl`, que con la base tipográfica del producto son
          816 px. El ancho grande (`max-w-4xl`) se eligió
          cuando el inicio era un tablero de dos columnas, y dejó de serlo cuando
          «Mi servicio» y el estado del caso se apilaron. Con una sola columna,
          896 px dejaban cada fila con el identificador a la izquierda y el
          chevron a treinta centímetros a la derecha, con el medio vacío. Es el
          mismo riel que usa el saludo, para que el nombre y la tarjeta queden
          alineados. */}
      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-28 md:px-6 md:pb-24">
        <div>
          {fase === "cargando" ? <CargandoPagina /> : null}
          {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}

          {fase === "listo" && datos ? (
            <>
              {/* Arriba, sola, la etiqueta de qué contrató. Después los bloques
                  desplegables, todos con la misma piel y en el orden de la
                  composición: primero el que reemplaza al caso, después el que
                  se le suma. Cada caja va por su propia etapa, así que los
                  juicios y las escrituras se listan por separado. */}
              <TarjetaDelServicio
                nombres={datos.serviciosPrincipales.map((servicio) => servicio.nombre)}
              />

              {muestraBloque(datos.composicion, "caso") ? (
                <BloqueDelCaso
                  etapa={datos.etapa?.visibleParaCliente ? datos.etapa : null}
                  servicio={nombreDelServicioPrincipal(datos.serviciosPrincipales)}
                />
              ) : null}

              <ListaDeCajas titulo="Mis juicios" Icono={ICONOS.tribunal} items={datos.juicios} />
              <ListaDeCajas
                titulo="Mis escrituras"
                Icono={ICONOS.documento}
                items={datos.escrituras}
                // Solo cuando las escrituras son el servicio principal: ahí el
                // bloque está aunque no haya ninguna en marcha todavía. Como
                // aditivo de una renegociación, si no hay nada no aparece.
                vacio={
                  muestraBloque(datos.composicion, "escrituras")
                    ? "Todavía no hay ninguna escritura en marcha. Cuando empecemos con la primera, la vas a ver acá con la etapa en que va."
                    : undefined
                }
              />

              <section className="mt-10 md:mt-12">
                {/* Bajó de 30 a 24 px en el computador: con el nombre del
                    servicio como pieza más grande de la página, una pregunta
                    más grande que él invertía la jerarquía. */}
                {/* Al mismo porte y en la misma tipografía que «Estado de mi
                    caso» y «Mis juicios»: los tres encabezan una sección del
                    inicio y están al mismo nivel, así que no hay razón para que
                    uno vaya en la tipografía de display y a cuatro píxeles más.
                    El énfasis en índigo y cursiva se queda: eso es lo que le da
                    personalidad, no el tamaño. */}
                <h2 className="type-section-title text-foreground md:text-lg">
                  ¿Qué necesitas <em className="text-primary italic">hacer hoy</em>?
                </h2>
                <div className="mt-5">
                  <AccesosEnCuadricula opciones={opciones(datos)} />
                  <AccesosEnLista opciones={opciones(datos)} />
                </div>
              </section>

              {/* El reclamo subió a los accesos, como una opción más de «qué
                  necesitas hacer hoy». Acá abajo repetido serían dos caminos al
                  mismo formulario en una misma pantalla, y el de arriba es el
                  que la persona va a encontrar. Queda el pie con lo que sí es
                  de pie: la frase que tranquiliza y la salida del teléfono. */}
              <footer className="mt-12 border-t border-border-subtle pt-8 text-center md:mt-14">
                <p className="type-supporting text-muted-foreground">
                  Tu información está protegida y es confidencial.
                </p>
              </footer>

              <BotonWhatsapp
                contactos={datos.contactos}
                nombreCliente={nombreCompleto(datos.cliente)}
                correoSoporte={datos.configuracion.correoSoporte}
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
