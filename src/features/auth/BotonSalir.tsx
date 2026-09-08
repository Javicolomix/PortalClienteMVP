import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/shared/components/base/Button";

import { sesion } from "./sesion";
import { Despedida } from "./TransicionDeMarca";

/**
 * Salir no es inmediato: primero se ve el gesto de entrada al revés —la marca
 * apagándose— y recién después se cierra la sesión.
 *
 * Que el acceso no repita el gesto encendiendo lo resuelve la propia sesión, que
 * deja constancia de cuándo se cerró. No se manda como estado de la navegación
 * porque cerrar la sesión hace que `RutaProtegida` navegue por su cuenta, y esa
 * navegación pisaba el aviso: se veían los dos gestos, apagar y volver a
 * encender.
 */
export function BotonSalir() {
  const navegar = useNavigate();
  const [despidiendo, setDespidiendo] = useState(false);

  const terminarDeSalir = () => {
    sesion.cerrar();
    navegar("/ingresar", { replace: true });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        disabled={despidiendo}
        loading={despidiendo}
        loadingLabel="Saliendo…"
        onClick={() => setDespidiendo(true)}
      >
        <LogOut aria-hidden />
        Salir
      </Button>

      {despidiendo ? <Despedida onTerminar={terminarDeSalir} /> : null}
    </>
  );
}
