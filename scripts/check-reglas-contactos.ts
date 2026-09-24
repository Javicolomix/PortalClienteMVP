/**
 * **La tabla de decisión de contactos, ejecutada.**
 *
 * Las reglas de qué contacto ve cada cliente las fijó operaciones y viven en
 * `contactos-visibles.ts`. Este script las vuelve a correr una por una contra
 * la función real: no comprueba que el código diga lo que se pretendía, sino
 * que haga lo que la tabla pide.
 *
 * Está acá y no en un test porque el proyecto todavía no tiene corredor de
 * pruebas, y esta es la regla con más ramas de todo el portal: siete
 * combinaciones en liquidación, más las de los otros cuatro servicios. Se corre
 * con `npx tsx scripts/check-reglas-contactos.ts` y devuelve 1 si algo falla.
 */
import { contactosVisibles } from "../src/features/portal/contactos-visibles";
import type { Caja, Contacto, Etapa, TipoServicio } from "../src/features/portal/portal.types";

const contacto = (
  id: string,
  servicioTipo: Contacto["servicioTipo"],
  rol: Contacto["rol"],
): Contacto => ({
  id,
  clienteId: "cli",
  nombre: id,
  rol,
  servicioTipo,
  telefonoWhatsapp: "+56 9 0000 0000",
});

/** Un cliente con equipo en los cuatro embudos: el peor caso para la regla. */
const EQUIPO = [
  contacto("LIQ-abogado", "liquidacion", "abogado"),
  contacto("LIQ-ejecutiva", "liquidacion", "ejecutiva"),
  contacto("LIT-abogado", "defensaEnJuicio", "abogado"),
  contacto("LIT-ejecutiva", "defensaEnJuicio", "ejecutiva"),
  contacto("PP-ejecutiva", "proteccionPatrimonial", "ejecutiva"),
  contacto("RN-ejecutiva", "renegociacion", "ejecutiva"),
  contacto("RN-abogado", "renegociacion", "abogado"),
];

const etapa = (
  clase: Etapa["clase"],
  contactoPrincipal: Etapa["contactoPrincipal"] = "abogado",
): Etapa => ({
  id: "etp",
  servicioId: "srv",
  orden: 1,
  visibleParaCliente: true,
  nombreParaCliente: "Una etapa",
  mensajePrincipal: "",
  queHaceLexy: "",
  queNecesitamosDelCliente: "",
  quePuedePasarDespues: "",
  plazoEsperado: "",
  contactoPrincipal,
  clase,
  nivelUrgencia: "tranquilidad",
});

const caja = (tipo: Caja["tipo"]): Caja => ({
  id: "caj",
  clienteId: "cli",
  tipo,
  identificador: "",
  etapaId: "etp",
});

type Caso = {
  nombre: string;
  servicioPrincipal: TipoServicio[];
  etapaDelCaso: Etapa | null;
  litigios?: boolean;
  pp?: boolean;
  esperado: string[];
};

const EN_ESPERA = etapa("liquidacionEnEspera");
const CORRIENTE = etapa("corriente");

const CASOS: Caso[] = [
  // ── Liquidación: la tabla de decisión, fila por fila ──────────────────────
  {
    nombre: "Liquidación · Mediata o En espera · con litigios, sin PP",
    servicioPrincipal: ["liquidacion"],
    etapaDelCaso: EN_ESPERA,
    litigios: true,
    esperado: ["LIQ-abogado", "LIT-abogado"],
  },
  {
    nombre: "Liquidación · Mediata o En espera · sin litigios, con PP",
    servicioPrincipal: ["liquidacion"],
    etapaDelCaso: EN_ESPERA,
    pp: true,
    esperado: ["LIQ-abogado", "PP-ejecutiva"],
  },
  {
    nombre: "Liquidación · Mediata o En espera · con litigios y con PP",
    servicioPrincipal: ["liquidacion"],
    etapaDelCaso: EN_ESPERA,
    litigios: true,
    pp: true,
    esperado: ["LIQ-abogado", "LIT-abogado"],
  },
  {
    nombre: "Liquidación · Mediata o En espera · sin litigios ni PP",
    servicioPrincipal: ["liquidacion"],
    etapaDelCaso: EN_ESPERA,
    esperado: ["LIQ-abogado"],
  },
  {
    nombre: "Liquidación · otra etapa · con litigios y con PP",
    servicioPrincipal: ["liquidacion"],
    etapaDelCaso: CORRIENTE,
    litigios: true,
    pp: true,
    esperado: ["LIQ-abogado"],
  },
  {
    nombre: "Liquidación · otra etapa · con litigios",
    servicioPrincipal: ["liquidacion"],
    etapaDelCaso: CORRIENTE,
    litigios: true,
    esperado: ["LIQ-abogado"],
  },
  {
    nombre: "Liquidación · otra etapa · el rol lo fija la etapa",
    servicioPrincipal: ["liquidacion"],
    etapaDelCaso: etapa("corriente", "ejecutiva"),
    esperado: ["LIQ-ejecutiva"],
  },

  // ── Los otros servicios ───────────────────────────────────────────────────
  {
    nombre: "Renegociación · con juicio abierto, igual sale renegociación",
    servicioPrincipal: ["renegociacion"],
    etapaDelCaso: CORRIENTE,
    litigios: true,
    pp: true,
    esperado: ["RN-ejecutiva", "RN-abogado"],
  },
  {
    nombre: "Defensa en juicio con PP · manda litigios, el panel de PP se ignora",
    servicioPrincipal: ["defensaEnJuicio", "proteccionPatrimonial"],
    etapaDelCaso: null,
    litigios: true,
    pp: true,
    esperado: ["LIT-abogado", "LIT-ejecutiva"],
  },
  {
    nombre: "Defensa en juicio sola",
    servicioPrincipal: ["defensaEnJuicio"],
    etapaDelCaso: null,
    litigios: true,
    esperado: ["LIT-abogado", "LIT-ejecutiva"],
  },
  {
    nombre: "Protección patrimonial",
    servicioPrincipal: ["proteccionPatrimonial"],
    etapaDelCaso: null,
    pp: true,
    esperado: ["PP-ejecutiva"],
  },
];

const correr = (caso: Caso) =>
  contactosVisibles({
    contactos: EQUIPO,
    etapaDelCaso: caso.etapaDelCaso,
    servicioPrincipal: caso.servicioPrincipal,
    juicios: caso.litigios ? [caja("defensaEnJuicio")] : [],
    escrituras: caso.pp ? [caja("proteccionPatrimonial")] : [],
  });

let fallos = 0;

for (const caso of CASOS) {
  const salida = correr(caso).map((contacto) => contacto.id);
  const ok = salida.join("|") === caso.esperado.join("|");
  if (!ok) fallos++;
  console.log(`${ok ? "  ✓" : "  ✗"} ${caso.nombre}`);
  console.log(`      ${salida.join(" + ") || "(ninguno)"}`);
  if (!ok) console.log(`      esperado: ${caso.esperado.join(" + ")}`);
}

// ── Las dos reglas duras, sobre todos los casos a la vez ────────────────────
const salidas = CASOS.map(correr);

const tope = Math.max(...salidas.map((contactos) => contactos.length));
if (tope > 2) {
  fallos++;
  console.log(`\n  ✗ Se mostraron ${tope} contactos, y el tope es 2`);
} else {
  console.log(`\n  ✓ Nunca más de 2 contactos`);
}

// En liquidación el contacto del servicio aparece siempre, sea cual sea la etapa.
const liquidaciones = CASOS.map((caso, i) => [caso, salidas[i]] as const).filter(
  ([caso]) => caso.servicioPrincipal[0] === "liquidacion",
);
const siempreLiquidacion = liquidaciones.every(([, contactos]) =>
  contactos.some((contacto) => contacto.servicioTipo === "liquidacion"),
);
if (siempreLiquidacion) {
  console.log("  ✓ El contacto de Liquidación aparece en todas sus etapas");
} else {
  fallos++;
  console.log("  ✗ Alguna etapa de liquidación se quedó sin su contacto");
}

// El respaldo por datos incompletos tampoco puede pasarse del tope.
const sinServicioCargado = contactosVisibles({
  contactos: EQUIPO,
  etapaDelCaso: CORRIENTE,
  servicioPrincipal: ["liquidacion"],
  juicios: [],
  escrituras: [],
});
const sinNadieDelServicio = contactosVisibles({
  contactos: EQUIPO.filter((contacto) => contacto.servicioTipo !== "liquidacion"),
  etapaDelCaso: CORRIENTE,
  servicioPrincipal: ["liquidacion"],
  juicios: [],
  escrituras: [],
});
if (sinNadieDelServicio.length <= 2 && sinServicioCargado.length <= 2) {
  console.log("  ✓ Con el servicio sin contactos cargados, el respaldo respeta el tope");
} else {
  fallos++;
  console.log(
    `  ✗ El respaldo se pasó del tope: ${sinNadieDelServicio.length} contactos`,
  );
}

if (fallos > 0) {
  console.error(`\n✗ ${fallos} regla(s) de contactos sin cumplir`);
  process.exit(1);
}

console.log(`\n✓ Reglas de contactos al día\n  ${CASOS.length} casos, 3 reglas duras`);
