import { useCarga } from "@/shared/hooks/useCarga";

import { CasoEnTrabajoInterno, EtapaContenido } from "./EtapaContenido";
import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import { cargarMiCaso } from "./portal-service";

export function MiCaso() {
  const { fase, datos, recargar } = useCarga("mi-caso", cargarMiCaso);
  const etapaVisible = datos?.etapa?.visibleParaCliente ? datos.etapa : null;

  return (
    <PaginaDelPortal titulo="Estado de mi caso">
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" ? (
        etapaVisible ? (
          <EtapaContenido etapa={etapaVisible} />
        ) : (
          <CasoEnTrabajoInterno />
        )
      ) : null}
    </PaginaDelPortal>
  );
}
