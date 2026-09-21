import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { BrandBackground } from "@/shared/components/base/BrandBackground";
import { Button } from "@/shared/components/base/Button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/base/Empty";
import { HeaderBar } from "@/shared/components/base/HeaderBar";
import { Logo } from "@/shared/components/base/Logo";
import { Skeleton } from "@/shared/components/base/Skeleton";
import { cn } from "@/shared/lib/utils/cn";

/**
 * Shell de las pantallas de detalle: una idea por pantalla y **una sola salida**,
 * que es «Volver al inicio». La marca vive en la barra superior; el contenido
 * queda plano y legible, que es lo que la persona vino a leer.
 *
 * La barra no lleva «Salir». Con las dos, la esquina de arriba ofrecía dos
 * salidas a la vez —una que retrocede y otra que cierra la sesión— y en un
 * teléfono están a un centímetro de distancia: quien viene a ver su cuota puede
 * cerrar sesión sin querer. Cerrar sesión se hace desde el inicio, que es de
 * donde se entró.
 */
export function PaginaDelPortal({
  titulo,
  descripcion,
  conTramaDeMarca,
  sobreBlanco,
  children,
}: {
  titulo: ReactNode;
  descripcion?: ReactNode;
  /**
   * La trama de aspas del manual de marca detrás del contenido.
   *
   * El manual la reserva para superficies expresivas y pide fondo plano en las
   * operativas, pero acá va en las dos pantallas de detalle —«Mi servicio» y
   * «Mis pagos»— por decisión del diseñador. Funciona porque en las dos el
   * contenido vive dentro de recuadros blancos opacos: la trama pasa por detrás
   * y nunca debajo de un texto. La tabla del historial, que es lo más operativo
   * que hay acá, vive dentro de un modal y tampoco la toca.
   */
  conTramaDeMarca?: boolean;
  /**
   * Fondo blanco en vez del lienzo gris. Es para «Mis pagos», donde lo que hay
   * que mirar es un solo bloque —cuánto y cuándo, en navy— y todo lo demás son
   * instrucciones. Sobre blanco el navy es lo único que pesa; sobre el gris, las
   * tarjetas blancas de «cómo pagar» levantaban y le hacían coro.
   */
  sobreBlanco?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("relative isolate min-h-screen", sobreBlanco ? "bg-background" : "bg-surface-canvas")}
    >
      {/* Va **fija al viewport**, no al alto de la página. La imagen es
          1920×1080 y estirada sobre una página de cuatro mil píxeles de alto los
          cubos salen deformados; fija, se ve siempre en su proporción y el
          contenido pasa por encima. `-z-10` la deja detrás de todo sin sacarla
          del apilamiento de la barra superior, que es `sticky`. */}
      {conTramaDeMarca ? (
        <BrandBackground
          motif="aspas"
          tone="blanco"
          // **Nítida, y callada por opacidad.** Estuvo desenfocada para que las
          // aspas no le compitieran al título: son líneas largas y rectas, que
          // es exactamente lo que persigue una mirada. Pero el desenfoque sobre
          // una imagen que ya se estira a pantalla completa no se lee como
          // atmósfera sino como una foto mal exportada, y eso ensucia la
          // pantalla entera.
          //
          // Lo que bajaba el ruido era el contraste, no el contorno: con la
          // trama al 65 % las aspas quedan tan tenues como estaban pero con el
          // borde limpio. Sin desenfoque tampoco hace falta el `scale-110`, que
          // solo existía para sacar de cuadro la orla que dejaba el `blur`
          // contra el borde de la imagen.
          dim={0.35}
          className="pointer-events-none fixed inset-0 -z-10"
        />
      ) : null}
      {/* La vuelta al inicio vive en la barra, **no en el cuerpo de la página**.
          Es lo único que no se va con el scroll: en «Mis pagos», que mide varias
          pantallas en el teléfono, un botón arriba del título queda fuera de
          vista apenas empiezas a leer, y había que repetirlo al final para
          compensarlo.

          Va donde estaba el logo y no junto a él. La marca ya se presenta en el
          inicio, que es de donde se entra; acá la barra tiene un solo trabajo,
          que es decir cómo se sale. Con las dos cosas, la que importa compite
          con la que no.

          `sticky` es lo que sostiene todo esto: sin eso es un botón arriba más. */}
      <HeaderBar
        sticky
        // 48 px y no los 64 del sistema: la misma altura que la barra del inicio,
        // y lo más baja que puede quedar sin apretar lo que lleva dentro —el
        // botón de volver mide 32 y el logo 24—. Una barra con una salida y una
        // marca no necesita más; cada píxel de más es uno que le quita a la
        // pantalla.
        className="h-12"
        brand={
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/">
              <ArrowLeft aria-hidden />
              Volver al inicio
            </Link>
          </Button>
        }
        // El logo pasa a la derecha. En el inicio la marca abre la barra, porque
        // esa es la portada; acá el lugar de la izquierda lo ocupa la salida,
        // que es lo que la pantalla tiene que ofrecer primero, y la marca cierra
        // por el otro lado. Va chico y no es un enlace: quien quiera volver ya
        // tiene el botón al frente, y dos cosas que llevan al mismo sitio en la
        // misma barra son una de más.
        actions={<Logo className="h-6" />}
      />

      <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-12 md:px-6 md:pt-10 md:pb-16">
        {/* Misma escala que el acceso y que el saludo del inicio: los títulos
            de portada bajan en el teléfono. */}
        <h1 className="type-page-title text-2xl text-foreground md:text-3xl">{titulo}</h1>
        {descripcion ? <p className="mt-3 type-body text-muted-foreground">{descripcion}</p> : null}

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function CargandoPagina() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function ErrorDeCarga({ onReintentar }: { onReintentar: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No pudimos cargar esta información</EmptyTitle>
        <EmptyDescription>
          Revisa tu conexión e inténtalo de nuevo. Si sigue sin cargar, escríbele a tu ejecutiva y
          lo vemos contigo.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onReintentar}>
          Volver a intentar
        </Button>
      </EmptyContent>
    </Empty>
  );
}
