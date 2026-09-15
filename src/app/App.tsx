import { Navigate, Route, Routes, useLocation } from "react-router";

import { PanelEtapas } from "@/features/admin";
import { Ingresar, RutaProtegida } from "@/features/auth";
import { Inicio, MiCaso, MiEquipo, MiServicio, MisPagos } from "@/features/portal";
import { Toaster } from "@/shared/components/base/Toaster";

import {
  DesignerPanelPage,
  PrototypeDesignerPanel,
} from "../prototype/designer-panel/PrototypeDesignerPanel";

const showPrototypeDesignerPanel = import.meta.env.VITE_LEXY_PROTOTYPE !== "false";

export const App = () => {
  const location = useLocation();
  const isDesignerPanelPage = location.pathname === "/designer-panel";

  return (
    <>
      <Routes>
        <Route path="/ingresar" element={<Ingresar />} />

        <Route
          path="/"
          element={
            <RutaProtegida>
              <Inicio />
            </RutaProtegida>
          }
        />
        <Route
          path="/mi-servicio"
          element={
            <RutaProtegida>
              <MiServicio />
            </RutaProtegida>
          }
        />
        <Route
          path="/mi-caso"
          element={
            <RutaProtegida>
              <MiCaso />
            </RutaProtegida>
          }
        />
        <Route
          path="/mi-equipo"
          element={
            <RutaProtegida>
              <MiEquipo />
            </RutaProtegida>
          }
        />
        <Route
          path="/mis-pagos"
          element={
            <RutaProtegida>
              <MisPagos />
            </RutaProtegida>
          }
        />

        {/* El panel del capitán es interno y tendrá su propio acceso: por ahora
            queda abierto para poder revisarlo. */}
        <Route path="/admin" element={<PanelEtapas />} />

        {showPrototypeDesignerPanel ? (
          <Route path="/designer-panel" element={<DesignerPanelPage />} />
        ) : null}
        {/* Cualquier dirección que no exista lleva al inicio. Sin esto, una URL
            vieja —un enlace guardado, una pestaña que quedó abierta en algo que
            ya se borró— dejaba la pantalla en blanco, sin nada que explicara qué
            pasó ni cómo salir. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
      {showPrototypeDesignerPanel && !isDesignerPanelPage ? <PrototypeDesignerPanel /> : null}
    </>
  );
};
