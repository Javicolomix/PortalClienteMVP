import { Route, Routes, useLocation } from "react-router";

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
      </Routes>
      <Toaster />
      {showPrototypeDesignerPanel && !isDesignerPanelPage ? <PrototypeDesignerPanel /> : null}
    </>
  );
};
