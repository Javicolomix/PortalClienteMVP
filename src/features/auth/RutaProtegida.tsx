import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useSesion } from "./sesion";

/** Sin sesión no hay caso que mostrar: se vuelve a la pantalla de acceso. */
export function RutaProtegida({ children }: { children: ReactNode }) {
  const clienteEnSesion = useSesion();
  if (!clienteEnSesion) return <Navigate to="/ingresar" replace />;
  return <>{children}</>;
}
