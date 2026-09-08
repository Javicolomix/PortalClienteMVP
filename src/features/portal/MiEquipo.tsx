import { MessageCircle } from "lucide-react";

import { Button } from "@/shared/components/base/Button";
import { useCarga } from "@/shared/hooks/useCarga";
import { cn } from "@/shared/lib/utils/cn";

import { CargandoPagina, ErrorDeCarga, PaginaDelPortal } from "./PaginaDelPortal";
import type { DatosMiEquipo, RolContacto } from "./portal.types";
import { cargarMiEquipo } from "./portal-service";

const ETIQUETA_ROL = {
  ejecutiva: "Tu ejecutiva",
  abogado: "Tu abogado",
} as const satisfies Record<RolContacto, string>;

const enlaceWhatsapp = (telefono: string, nombreCliente: string) => {
  const numero = telefono.replace(/\D/g, "");
  const mensaje = encodeURIComponent(
    `Hola, soy ${nombreCliente}. Tengo una consulta sobre mi caso.`,
  );
  return `https://wa.me/${numero}?text=${mensaje}`;
};

function Contactos({ datos }: { datos: DatosMiEquipo }) {
  return (
    <>
      <div className="overflow-hidden rounded-lg bg-card ring-1 ring-border-subtle">
        <ul>
          {datos.contactos.map((contacto, indice) => (
            <li
              key={contacto.id}
              className={cn("px-5 py-4", indice > 0 && "border-t border-border-subtle")}
            >
              {/* Los dos contactos pesan lo mismo, así que sus botones también:
                  mismo estilo y mismo ancho. Antes el primero iba relleno y el
                  segundo delineado, y además la fila los acomodaba al lado del
                  nombre solo si cabían — con «Camila Rivera» cabía y con
                  «Matías Fuenzalida» no, así que cada uno quedaba en un sitio
                  distinto. Acá abajo se apilan siempre; desde `sm` van al
                  costado los dos. */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="block type-item-title text-foreground">{contacto.nombre}</span>
                  <span className="block type-supporting text-muted-foreground">
                    {ETIQUETA_ROL[contacto.rol]}
                  </span>
                </span>

                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <a
                    href={enlaceWhatsapp(contacto.telefonoWhatsapp, datos.cliente.nombre)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle aria-hidden />
                    Escribir por WhatsApp
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 type-supporting text-muted-foreground">
        Si prefieres el correo, escríbenos a{" "}
        <a
          href={`mailto:${datos.configuracion.correoSoporte}`}
          className="font-medium text-primary underline underline-offset-4"
        >
          {datos.configuracion.correoSoporte}
        </a>
        .
      </p>
    </>
  );
}

export function MiEquipo() {
  const { fase, datos, recargar } = useCarga("mi-equipo", cargarMiEquipo);

  return (
    <PaginaDelPortal
      titulo="Conversar con mi equipo"
      descripcion="Escríbeles por WhatsApp cuando tengas una duda. No hay preguntas tontas."
    >
      {fase === "cargando" ? <CargandoPagina /> : null}
      {fase === "error" ? <ErrorDeCarga onReintentar={recargar} /> : null}
      {fase === "listo" && datos ? <Contactos datos={datos} /> : null}
    </PaginaDelPortal>
  );
}
