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
      <HeaderBar />

      <main className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6 md:py-12">
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-6">
          <Link to="/">
            <ArrowLeft aria-hidden />
            Volver al inicio
          </Link>
        </Button>

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
