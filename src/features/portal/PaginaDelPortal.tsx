import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { Button } from "@/shared/components/base/Button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/base/Empty";
import { HeaderBar } from "@/shared/components/base/HeaderBar";
import { Skeleton } from "@/shared/components/base/Skeleton";

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
  children,
}: {
  titulo: string;
  descripcion?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-subtle">
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
        brand={
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/">
              <ArrowLeft aria-hidden />
              Volver al inicio
            </Link>
          </Button>
        }
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
