import type { Etapa, Servicio } from "@/features/portal";
import { read, write } from "@/prototype/ports";

export async function cargarServicios(): Promise<Servicio[]> {
  return read.load<Servicio[]>("catalogoDeServicios", undefined, {
    description: "Servicios que el capitán puede configurar",
    trigger: "Al entrar al panel de etapas",
    reads: { entities: ["servicio"], fields: ["servicio.nombre"] },
  });
}

export async function cargarEtapasDelServicio(servicioId: string): Promise<Etapa[]> {
  const etapas = await read.load<Etapa[]>(
    "etapasDelServicio",
    { servicioId },
    {
      description: "Etapas del servicio con el contenido que ve el cliente",
      trigger: "Al elegir un servicio en el panel",
      reads: {
        entities: ["etapa"],
        fields: [
          "etapa.orden",
          "etapa.visibleParaCliente",
          "etapa.nombreParaCliente",
          "etapa.mensajePrincipal",
          "etapa.queHaceLexy",
          "etapa.queNecesitamosDelCliente",
          "etapa.quePuedePasarDespues",
          "etapa.plazoEsperado",
          "etapa.nivelUrgencia",
        ],
      },
    },
  );

  return [...etapas].sort((a, b) => a.orden - b.orden);
}

export async function guardarEtapa(etapa: Etapa): Promise<void> {
  await write.publish("etapaActualizada", etapa, {
    description: "El capitán guarda el contenido que el cliente lee en esta etapa",
    trigger: "Botón «Guardar cambios» del panel de etapas",
    writes: {
      entities: ["etapa"],
      fields: [
        "etapa.visibleParaCliente",
        "etapa.nombreParaCliente",
        "etapa.mensajePrincipal",
        "etapa.queHaceLexy",
        "etapa.queNecesitamosDelCliente",
        "etapa.quePuedePasarDespues",
        "etapa.plazoEsperado",
        "etapa.nivelUrgencia",
      ],
    },
  });
}
