import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";
import { z } from "zod";

import fondoMarca from "@/shared/assets/lexy-fondo-navy.png";
import { Button } from "@/shared/components/base/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/base/Form";
import { Input } from "@/shared/components/base/Input";

import logoClaro from "./assets/lexydeudor-claro.svg";
import { correoEsValido, CredencialesInvalidas, iniciarSesion } from "./auth-service";
import { sesion, useSesion } from "./sesion";
import { Bienvenida } from "./TransicionDeMarca";

const esquemaAcceso = z.object({
  correo: z
    .string()
    .trim()
    .min(1, "Escribe tu correo.")
    .refine(correoEsValido, "Revisa tu correo: parece que le falta algo."),
  clave: z.string().min(1, "Escribe tu clave."),
});

type ValoresAcceso = z.infer<typeof esquemaAcceso>;

/**
 * Mitad de marca de la tarjeta de acceso: arriba en el teléfono, al costado
 * izquierdo desde `lg`. El fondo es el degradé navy → índigo con la trama de
 * rombos que entregó diseño.
 */
function Hero() {
  return (
    <div className="relative isolate flex flex-col items-center overflow-hidden px-8 py-10 text-center lg:items-start lg:px-10 lg:py-12 lg:text-left">
      <img
        src={fondoMarca}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 size-full object-cover"
      />

      <div className="flex w-full flex-1 flex-col items-center lg:items-start lg:justify-center">
        {/* El logo y su eslogan son **un solo bloque de marca**, del ancho del
            logo. El eslogan se alinea con la palabra «lexydeudor» y no con el
            centro del conjunto: el isotipo se lleva el primer 23 % del lockup,
            así que centrado bajo todo caía un poco a la izquierda de la palabra
            y los dos textos no compartían ningún borde.

            El 23 % es proporción y no píxeles a propósito: vale igual cuando el
            logo mide 192 px en el teléfono y 240 en el computador. */}
        <div className="w-48 lg:w-60">
          <img src={logoClaro} alt="Lexy Deudor" className="w-full" />

          {/* En el teléfono el eslogan iba en el mismo cuerpo que un título de
            sección, justo debajo de un logo de 192 px: pesaba tanto como la
            marca y competía con ella. Acá abajo es una bajada —más chica y sin
            negrita— y recién desde `lg`, donde el hero tiene aire de sobra,
            vuelve a su tamaño de título.

            En el teléfono va **sin nada de aire**, apoyado en el borde del
            wordmark: es parte del lockup de la marca, no un párrafo debajo de
            él. Cualquier separación, por chica que sea, los vuelve dos
            elementos sueltos que casualmente están uno encima del otro. Desde
            `lg` sí se separa, porque ahí crece a cuerpo de título y necesita su
            propio aire. */}
          <p className="type-supporting pl-[23%] text-left text-white lg:mt-5 lg:pl-0 lg:text-lg lg:font-semibold">
            Hacemos <em className="italic">fácil</em> lo legal
          </p>
        </div>

        <p className="mt-4 hidden max-w-sm type-body text-white/75 lg:block">
          Desde tu Portal Cliente podrás consultar el avance de tu caso, revisar tus pagos y
          comunicarte con tu abogado cuando lo necesites.
        </p>
      </div>

      <p className="mt-10 hidden type-supporting text-white/60 lg:block">
        Tu información está protegida y es confidencial.
      </p>
    </div>
  );
}

function CampoClave({
  nombre,
  valor,
  onChange,
  onBlur,
}: {
  nombre: string;
  valor: string;
  onChange: (evento: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}) {
  const [verClave, setVerClave] = useState(false);

  return (
    <div className="relative">
      <FormControl>
        <Input
          type={verClave ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Tu clave"
          className="pr-10"
          name={nombre}
          value={valor}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormControl>

      <button
        type="button"
        onClick={() => setVerClave((visible) => !visible)}
        aria-label={verClave ? "Ocultar clave" : "Mostrar clave"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-control text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {verClave ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

export function Ingresar() {
  const clienteEnSesion = useSesion();
  const navegar = useNavigate();

  const [errorDeAcceso, setErrorDeAcceso] = useState<string | null>(null);

  // La clave ya fue correcta y se está viendo el encendido de la marca. La
  // sesión todavía no se abre: si se abriera acá, la pantalla se iría a `/` al
  // instante y no habría animación que ver.
  const [clienteEntrando, setClienteEntrando] = useState<string | null>(null);

  const form = useForm<ValoresAcceso>({
    resolver: zodResolver(esquemaAcceso),
    defaultValues: { correo: "", clave: "" },
  });

  if (clienteEnSesion) return <Navigate to="/" replace />;

  const entrar = async (valores: ValoresAcceso) => {
    setErrorDeAcceso(null);
    try {
      const clienteId = await iniciarSesion(valores.correo, valores.clave);
      setClienteEntrando(clienteId);
    } catch (error) {
      setErrorDeAcceso(
        error instanceof CredencialesInvalidas
          ? "El correo o la clave no coinciden. Revísalos e inténtalo de nuevo."
          : "No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.",
      );
    }
  };

  const terminarDeEntrar = () => {
    if (!clienteEntrando) return;
    sesion.abrir(clienteEntrando);
    navegar("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle p-4 md:p-8">
      {clienteEntrando ? <Bienvenida onTerminar={terminarDeEntrar} /> : null}

      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-overlay lg:grid-cols-2">
        <Hero />

        <div className="px-6 py-10 md:px-10 md:py-12">
          {/* En el teléfono va a la misma escala que el saludo del inicio, que
              es la portada equivalente. Más grande llenaba la línea de borde a
              borde de la tarjeta y pesaba tanto como el hero de marca que tiene
              justo encima: dos cosas fuertes apiladas en una pantalla cuyo
              trabajo real son dos campos y un botón. */}
          <h1 className="type-page-title text-xl text-foreground md:text-3xl">
            Ingresa a tu portal
          </h1>
          <p className="mt-2 type-body text-muted-foreground">
            Usa el correo y la clave que te enviamos.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(entrar)} className="mt-8 space-y-5">
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        inputMode="email"
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="tucorreo@ejemplo.cl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clave</FormLabel>
                    <CampoClave
                      nombre={field.name}
                      valor={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorDeAcceso ? (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 px-3 py-2 type-supporting text-destructive"
                >
                  {errorDeAcceso}
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={form.formState.isSubmitting || clienteEntrando !== null}
                loadingLabel="Entrando…"
              >
                Ingresar
              </Button>

              {/* El correo va escrito acá porque el acceso ocurre antes de la sesión:
                  todavía no hay `configuracion.correoSoporte` que leer. */}
              <p className="text-center type-supporting text-muted-foreground">
                ¿No puedes entrar? Escríbenos a{" "}
                <a
                  href="mailto:soporte@defensoriadeudor.cl"
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  soporte@defensoriadeudor.cl
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
