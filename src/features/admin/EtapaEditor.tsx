import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  CasoEnTrabajoInterno,
  type Etapa,
  EtapaContenido,
  NIVELES as NIVELES_DEL_CLIENTE,
} from "@/features/portal";
import { Button } from "@/shared/components/base/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/base/Form";
import { Input } from "@/shared/components/base/Input";
import { Label } from "@/shared/components/base/Label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/base/RadioGroup";
import { Switch } from "@/shared/components/base/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/base/Tabs";
import { Tag } from "@/shared/components/base/Tag";
import { Textarea } from "@/shared/components/base/Textarea";
import { cn } from "@/shared/lib/utils/cn";

/**
 * Se puede guardar una etapa a medio escribir, pero no publicarla vacía: si el
 * interruptor está encendido, el cliente va a leer estos textos.
 */
const TEXTOS_OBLIGATORIOS = [
  ["nombreParaCliente", "Escribe el nombre con que el cliente reconoce esta etapa."],
  ["mensajePrincipal", "Escribe en qué va el caso antes de mostrar la etapa."],
  ["queHaceLexy", "Cuenta qué está haciendo el equipo ahora."],
  ["queNecesitamosDelCliente", "Di qué necesitas del cliente, o que no necesita hacer nada."],
  ["quePuedePasarDespues", "Explica cuál es el siguiente paso."],
  ["plazoEsperado", "Indica el plazo o de qué depende."],
] as const;

const esquemaEtapa = z
  .object({
    visibleParaCliente: z.boolean(),
    nombreParaCliente: z.string(),
    mensajePrincipal: z.string(),
    queHaceLexy: z.string(),
    queNecesitamosDelCliente: z.string(),
    quePuedePasarDespues: z.string(),
    plazoEsperado: z.string(),
    nivelUrgencia: z.enum(["tranquilidad", "atencion", "urgente"]),
  })
  .superRefine((valores, contexto) => {
    if (!valores.visibleParaCliente) return;

    for (const [campo, mensaje] of TEXTOS_OBLIGATORIOS) {
      if (!valores[campo].trim()) {
        contexto.addIssue({ code: "custom", path: [campo], message: mensaje });
      }
    }
  });

type ValoresEtapa = z.infer<typeof esquemaEtapa>;

/**
 * Los tres niveles, con el nombre que usa el equipo y la ayuda que dice cuándo
 * corresponde cada uno.
 *
 * La frase que va a leer el cliente **no se escribe acá ni en ningún lado**: es
 * fija por nivel y vive en `nivel-urgencia.ts`, junto a su icono y su color. Por
 * eso se muestra al elegir, en vez de dejar que el capitán la imagine: lo que
 * elige no es un tono, es un texto concreto que la persona va a leer.
 */
const NIVELES = [
  {
    valor: "tranquilidad",
    titulo: "Tranquilo",
    ayuda: "El cliente solo necesita entender el avance.",
  },
  {
    valor: "atencion",
    titulo: "Atento",
    ayuda: "Puede venir una acción o respuesta del cliente.",
  },
  {
    valor: "urgente",
    titulo: "Urgente",
    ayuda: "Hay una acción necesaria para no frenar el proceso.",
  },
] as const;

/**
 * Lo que el cliente va a leer con ese nivel, tal cual y con su color. El capitán
 * no elige un tono abstracto: elige un texto concreto que alguien va a leer.
 */
function FraseDelCliente({ nivel }: { nivel: keyof typeof NIVELES_DEL_CLIENTE }) {
  const { etiqueta, frase, color, tono } = NIVELES_DEL_CLIENTE[nivel];

  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 type-meta">
      <Tag tone={tono} size="xs" shape="rounded">
        {etiqueta}
      </Tag>
      <span className={cn("font-medium", color)}>«{frase}»</span>
    </p>
  );
}

const CAMPOS_LARGOS = [
  {
    nombre: "mensajePrincipal",
    etiqueta: "Mensaje principal",
    ayuda: "Una o dos frases: dónde está el caso y qué significa eso para el cliente.",
  },
  {
    nombre: "queHaceLexy",
    etiqueta: "Qué está haciendo Lexy ahora",
    ayuda: "Qué gestiona el equipo y por qué el caso está en este punto.",
  },
  {
    nombre: "queNecesitamosDelCliente",
    etiqueta: "Qué necesitamos del cliente",
    ayuda: "Si no necesitas nada de él, dilo explícitamente: tranquiliza más que el silencio.",
  },
  {
    nombre: "plazoEsperado",
    etiqueta: "Plazo esperado",
    ayuda: "El estimado o de qué depende. Si no hay fecha, dilo con todas sus letras.",
  },
  {
    nombre: "quePuedePasarDespues",
    etiqueta: "Qué puede pasar después",
    ayuda: "El siguiente paso y la condición para avanzar. No prometas un resultado.",
  },
] as const;

export function EtapaEditor({
  etapa,
  onGuardar,
}: {
  etapa: Etapa;
  onGuardar: (etapa: Etapa) => Promise<void>;
}) {
  const valoresIniciales: ValoresEtapa = {
    visibleParaCliente: etapa.visibleParaCliente,
    nombreParaCliente: etapa.nombreParaCliente,
    mensajePrincipal: etapa.mensajePrincipal,
    queHaceLexy: etapa.queHaceLexy,
    queNecesitamosDelCliente: etapa.queNecesitamosDelCliente,
    quePuedePasarDespues: etapa.quePuedePasarDespues,
    plazoEsperado: etapa.plazoEsperado,
    nivelUrgencia: etapa.nivelUrgencia,
  };

  const form = useForm<ValoresEtapa>({
    resolver: zodResolver(esquemaEtapa),
    defaultValues: valoresIniciales,
  });

  // `useWatch` en vez de `form.watch()`: devuelve valores, no una función, y así
  // el compilador de React puede seguir optimizando esta vista.
  // Al pasar `defaultValue` con todos los campos, lo observado siempre viene
  // completo; el tipo de la librería igual lo declara parcial.
  const valores = useWatch({
    control: form.control,
    defaultValue: valoresIniciales,
  }) as ValoresEtapa;
  const vistaPrevia: Etapa = { ...etapa, ...valores };
  const faltanTextos = TEXTOS_OBLIGATORIOS.some(([campo]) => !valores[campo].trim());

  const enviar = async (valoresValidados: ValoresEtapa) => {
    try {
      await onGuardar({ ...etapa, ...valoresValidados });
      form.reset(valoresValidados);
    } catch {
      // El panel ya avisó del error; conservamos lo escrito para no perder trabajo.
    }
  };

  return (
    <Tabs defaultValue="contenido">
      <TabsList>
        <TabsTrigger value="contenido">Contenido</TabsTrigger>
        <TabsTrigger value="vista-previa">Vista previa</TabsTrigger>
      </TabsList>

      <TabsContent value="contenido">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(enviar)} className="space-y-6 pt-2">
            <FormField
              control={form.control}
              name="visibleParaCliente"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-lg bg-surface-container p-4">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="grid gap-1">
                    <FormLabel>Visible para el cliente</FormLabel>
                    <FormDescription>
                      Si está apagado, el cliente no ve esta etapa: en su lugar le mostramos que su
                      caso está en trabajo interno.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombreParaCliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre para el cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Esperando el atraso en tus deudas" {...field} />
                  </FormControl>
                  <FormDescription>
                    Breve, claro y sin tecnicismos. Es el título con que reconoce en qué va su caso.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {CAMPOS_LARGOS.map((campo) => (
              <FormField
                key={campo.nombre}
                control={form.control}
                name={campo.nombre}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{campo.etiqueta}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormDescription>{campo.ayuda}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="nivelUrgencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel de urgencia</FormLabel>
                  <FormDescription>
                    Define la pastilla que el cliente ve junto a la etapa y la frase que lee al
                    desplegarla. Las dos son fijas por nivel y no se pueden editar: así significan
                    lo mismo en todos los casos.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-3 pt-1"
                    >
                      {NIVELES.map((nivel) => (
                        <div key={nivel.valor} className="flex items-start gap-3">
                          <RadioGroupItem
                            value={nivel.valor}
                            id={`nivel-${nivel.valor}`}
                            className="mt-0.5"
                          />
                          <div className="grid gap-0.5">
                            <Label htmlFor={`nivel-${nivel.valor}`}>{nivel.titulo}</Label>
                            <p className="type-meta text-muted-foreground">{nivel.ayuda}</p>

                            <FraseDelCliente nivel={nivel.valor} />
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-4">
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                loadingLabel="Guardando…"
              >
                Guardar cambios
              </Button>
              {form.formState.isDirty ? (
                <p className="type-supporting text-muted-foreground">
                  Tienes cambios sin guardar.
                </p>
              ) : null}
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="vista-previa" className="pt-2">
        {valores.visibleParaCliente ? (
          <>
            {faltanTextos ? (
              <p className="mb-3 type-supporting text-muted-foreground">
                Faltan textos por escribir. Así se vería con lo que hay hasta ahora.
              </p>
            ) : null}
            <EtapaContenido etapa={vistaPrevia} />
          </>
        ) : (
          <>
            <p className="mb-3 type-supporting text-muted-foreground">
              Con el interruptor apagado el cliente no ve esta etapa. Esto es lo que lee en su
              lugar.
            </p>
            <CasoEnTrabajoInterno />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
