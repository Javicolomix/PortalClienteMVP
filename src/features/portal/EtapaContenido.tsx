import { Card, CardContent, CardHeader } from "@/shared/components/base/Card";

import { BloqueDestacado, TarjetaInformativa } from "./BloquesDelPortal";
import { ICONOS } from "./iconos";
import { NIVELES } from "./nivel-urgencia";
import type { Etapa } from "./portal.types";

/** Cuando la etapa del caso es de trabajo interno, el cliente igual sabe dónde está parado. */
export function CasoEnTrabajoInterno() {
  return (
    <Card>
      <CardHeader>
        <h2 className="type-subsection-title text-foreground">Tu caso está avanzando</h2>
        <p className="mt-2 type-body text-muted-foreground">
          Ahora mismo tu caso está en una etapa de trabajo interno de nuestro equipo, así que no hay
          novedades que mostrarte todavía. Apenas las haya, las vas a ver acá.
        </p>
      </CardHeader>
      <CardContent>
        <p className="type-body text-muted-foreground">
          No necesitas hacer nada. Si igual quieres saber cómo va, escríbele a tu ejecutiva.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Renderiza los campos que el capitán escribió como contenido legible, no como
 * una ficha de datos. El orden es el de una explicación hablada: dónde estás,
 * qué está haciendo el equipo, qué te toca a ti, cuánto puede demorar, qué viene
 * después — y recién al final si puedes quedarte tranquilo o tienes que estar
 * atento, que es la conclusión de todo lo anterior.
 *
 * La pantalla tiene dos niveles y nada más: el bloque lila dice en qué etapa
 * estás, y debajo van las respuestas, todas del mismo peso. El mensaje principal
 * entra dentro del bloque porque es la bajada del nombre de la etapa, no una
 * sección aparte.
 */
export function EtapaContenido({ etapa }: { etapa: Etapa }) {
  const nivel = NIVELES[etapa.nivelUrgencia];
  const { Icono } = nivel;

  return (
    <div className="space-y-6">
      <BloqueDestacado rotulo="Etapa actual" titulo={etapa.nombreParaCliente}>
        {etapa.mensajePrincipal}
      </BloqueDestacado>

      <div className="space-y-2.5">
        <TarjetaInformativa Icono={ICONOS.equipo} titulo="Qué está haciendo tu equipo">
          {etapa.queHaceLexy}
        </TarjetaInformativa>

        <TarjetaInformativa Icono={ICONOS.tarea} titulo="Qué necesitamos de ti">
          {etapa.queNecesitamosDelCliente}
        </TarjetaInformativa>

        <TarjetaInformativa Icono={ICONOS.reloj} titulo="Plazo esperado">
          {etapa.plazoEsperado}
        </TarjetaInformativa>

        <TarjetaInformativa Icono={ICONOS.camino} titulo="Qué puede pasar después">
          {etapa.quePuedePasarDespues}
        </TarjetaInformativa>
      </div>

      {/* Cierre: la señal de si hay que actuar o no cierra la lectura, después
          de que el cliente ya sabe qué le toca. Sin caja —una más acá abajo se
          leería como una quinta tarjeta— pero en el color de su nivel, el mismo
          de la pastilla que la persona vio en el inicio. Lo dice el texto, con
          el icono acompañando; nunca dependió del color para entenderse. */}
      <p
        className={`flex items-start gap-2 border-t border-border-subtle pt-5 type-supporting font-medium ${nivel.color}`}
      >
        <Icono className="mt-0.5 size-4 shrink-0" aria-hidden />
        {nivel.frase}
      </p>
    </div>
  );
}
