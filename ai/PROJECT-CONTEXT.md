# Contexto de este proyecto

> **Para agentes de IA:** lee este archivo al comenzar cada sesión de diseño y
> mantenlo al día. Es la memoria del proyecto: captura una sola vez lo que el
> diseñador ya decidió, para no volver a preguntarlo en cada sesión.
>
> - Si una sección dice _Por definir_, **pregunta** lo que necesites en la
>   primera tarea que lo requiera y **escribe aquí la respuesta**.
> - Cuando el diseñador tome una decisión de alcance, audiencia o referencia
>   («esto es para clientes», «usa este Figma», «sin login por ahora»),
>   **regístrala aquí** en una línea.
> - Mantén el archivo corto (una pantalla). Esto no es documentación: es el
>   brief vivo del proyecto.
>
> Lo técnico no va aquí: `architecture`, `world`, `addons` y rutas viven en
> `.lexy` (fuente de verdad técnica, no la dupliques).

## Qué estamos construyendo

Portal del Cliente de Lexy (MVP): una web donde una persona con deudas ve en qué
va su caso, entiende qué servicio contrató y sabe si tiene que hacer algo. Existe
para bajar la incertidumbre: hoy el cliente no tiene visibilidad del avance ni
entiende bien lo que contrató.

Incluye un panel interno donde un **capitán** escribe el contenido de cada etapa
por servicio. Ese contenido es lo que el cliente lee.

## Para quién es

Dos audiencias, dos mundos:

- **Portal (`/`) — mundo cliente.** Persona endeudada, asustada, sin vocabulario
  legal. Aire, una idea por pantalla, tono de calma.
- **Panel de etapas (`/admin`) — mundo CRM.** Capitán de Lexy configurando
  contenido. Densidad jerarquizada, tarea al centro, vista previa a la mano.

## Pantallas y flujos clave

El portal es un **inicio con opciones**, no una página larga. Cada opción abre su
propia página, con botón «Volver al inicio».

- **Inicio (`/`)**: bloque navy con el saludo según la hora, dos destacados
  («Tu servicio» y «Estado de tu caso») y la pregunta «¿Qué necesitas hoy?» con
  tres accesos. Al pie, confidencialidad y el enlace a reclamos.
- **`/mi-servicio`** — «Mi servicio»: en qué consiste y qué puedes conseguir.
- **`/mi-caso`** — «Información de mi caso»: la etapa, con sus 7 campos
  convertidos en contenido legible.
- **`/mi-equipo`** — «Quiero conversar con mi equipo»: WhatsApp de la ejecutiva y
  del abogado, más el correo de soporte.
- **`/mis-pagos`** — «Mis pagos»: la próxima cuota (monto destacado, fecha y
  número) y dos formas de pagar: en línea por APIO, o transferencia con los
  datos copiables y el envío del comprobante.
- **Panel de etapas (`/admin`)**: selector de servicio → lista de etapas con su
  estado (visible / solo interno / falta contenido) → editor de los 7 campos con
  pestaña de **vista previa** que muestra exactamente lo que leerá el cliente.

## Datos principales

Cliente, servicio contratado (con su explicación y sus resultados posibles),
etapas configurables, contactos asignados y configuración del portal.

Nada de esto tiene todavía fuente confirmada por TI: el portal es nuevo y el
contenido de etapas no existe hoy en ningún sistema. Todo el contrato está
marcado como pendiente con la pregunta concreta que hay que resolver.

**Lo más importante que Desarrollo tiene que definir:** dónde se guarda el
contenido de las etapas, quién puede editarlo y si queda historial de versiones.

## Referencias

- Formulario externo de reclamos: https://defensoriasalud.typeform.com/reclamos-lexy
  El texto del enlace es literal y lo fijó el diseñador: «¿Problemas con tu caso?
  Reclama Aquí». No corregirlo a sentence case.

## Decisiones y restricciones

- Proyecto generado con `create-lexy` el 2026-09-03 con el nombre `portalcliente`.
- 2026-09-03: fuera de alcance en esta versión — pagos, subida de documentos,
  chat en vivo y notificaciones push.
- 2026-09-07: **el portal tiene acceso con correo y clave.** Usuario: el correo
  del cliente. Clave: la primera letra de su nombre en mayúscula + su RUT sin
  puntos ni dígito verificador. Credenciales de prueba:
  `juan.cardenas@example.com` / `J16482937` y
  `javiera.rojas@example.com` / `J15204336`.
  Las dos personas van en el mismo servicio y la misma etapa, para poder
  comparar.
- 2026-09-08: las dos cuentas de prueba son **sintéticas**. Había una con el
  correo y el RUT reales de la diseñadora, y como la clave se deduce del RUT,
  publicar el repositorio la habría dejado a la vista. Se reemplazó antes del
  primer commit: en el historial de git no queda.
- 2026-09-07: **riesgo de seguridad abierto** — la clave se deduce del nombre y
  del RUT, que no son secretos. Quien tenga el RUT de una persona puede entrar a
  ver su deuda. Está anotado en el contrato (`cliente.claveDeAcceso`) como
  pendiente con seguridad. Definir si se exige cambiarla al primer ingreso.
- 2026-09-07: en el prototipo la clave se comprueba en el navegador para poder
  recorrer el flujo. En producción la valida el backend, siempre.
- 2026-09-07: `/admin` queda **sin protección** por ahora: es interno y va a
  tener su propio acceso, distinto al del cliente.
- 2026-09-03: el portal es mundo cliente y el panel del capitán es mundo CRM.
  Conviven en el mismo proyecto con densidades distintas a propósito.
- 2026-09-03: el inicio **no muestra contenido, muestra opciones**. Era una sola
  página larga y se sentía cargada. Ahora saluda, nombra el servicio en una
  línea y pregunta «¿Qué necesitas hoy?».
- 2026-09-03: cada opción es una **página propia con botón volver**, no un modal.
  El botón atrás del teléfono funciona y cada sección tiene su dirección.
- 2026-09-03: el inicio sí adelanta el nombre de la etapa y si hay algo que
  hacer. Los plazos y las acciones pendientes no se esconden detrás de un clic.
- 2026-09-03: «Mis pagos» muestra **solo la próxima cuota pendiente**, no el plan
  completo. El objetivo es que en cinco segundos se entienda cuánto y cuándo.
- 2026-09-03: el correo de soporte del portal es **soporte@defensoriadeudor.cl**,
  el mismo al que se envía el comprobante de transferencia.
- 2026-09-03: los datos bancarios se muestran con botón de copiar, no como texto
  corrido, y el enlace del comprobante abre el correo con el nombre del cliente
  ya escrito en el asunto.
- 2026-09-03: pagar sigue fuera de alcance como funcionalidad propia: el portal
  deriva a APIO o a transferencia, no procesa pagos.
- 2026-09-03: el saludo cambia con la hora **del dispositivo de la persona**:
  06:00–12:00 «Buenos días», 12:01–19:59 «Buenas tardes», 20:00–05:59 «Buenas
  noches».
- 2026-09-07: **estética editorial sobre canvas gris cálido.** El fondo de todo
  el portal es `surface-subtle` y el contenido vive en superficies blancas. Los
  blancos destacan porque el lienzo no es blanco. Se retiró la banda navy con
  `BrandBackground`: la identidad ahora la cargan el canvas, la tipografía y el
  índigo de marca, sin fondo decorativo.
- 2026-09-07: la barra superior es **blanca con borde inferior**, con «Salir» a
  la derecha.
- 2026-09-07: la pantalla de acceso (`/ingresar`) es el **momento de marca** del
  portal: es la única pantalla sin contenido del caso, así que la identidad
  puede pesar más que en el resto. Hoy la carga el hero de la tarjeta.
- 2026-09-07: el acceso **no explica la regla de la contraseña**. Hay que
  hacérsela llegar al cliente por otra vía.
- 2026-09-07: quien no puede entrar se deriva al **correo de soporte**
  (soporte@defensoriadeudor.cl), no a su ejecutiva. El acceso ocurre antes de la
  sesión, así que ahí el correo va escrito en el código: todavía no hay
  `configuracion.correoSoporte` que leer.
- 2026-09-08: en «Mis pagos» los datos bancarios tienen **un botón que se los
  lleva los cuatro de una vez**, con su etiqueta delante y un dato por línea. El
  copiar de cada fila se quedó, reducido a su icono: sirve para pegar un dato
  suelto en el campo del banco. Cuatro botones con la palabra «Copiar» repetida
  competían entre ellos y con los datos.
- 2026-09-08: **el inicio tiene una composición propia de teléfono**, no el
  desktop encogido. De arriba a abajo: saludo + isotipo → las dos tarjetas
  deslizándose de lado → «¿Qué necesitas hacer hoy?» → los accesos en cuadrados.
  El objetivo es que en una pantalla se entienda dónde está, qué servicio tiene,
  en qué estado va su caso y qué puede hacer ahora.
- 2026-09-08: en el teléfono el **encabezado es una franja de marca que cierra en
  un arco ancho y sigue por debajo de la primera tarjeta**. El **isotipo va a la
  izquierda** y el saludo a su lado; se fueron el rótulo «PORTAL DE CLIENTE», la
  bajada y la barra superior. En el computador el encabezado completo se mantiene
  igual.
- 2026-09-08: el encabezado **cruza las dos tarjetas destacadas por la mitad, por
  detrás**, en las dos versiones: arco de 72 px en el teléfono y de 40 px en el
  computador, con las tarjetas montadas encima. Lo que destaca son las tarjetas,
  no la franja. La curva alcanza a verse en los costados y en el hueco entre las
  dos tarjetas; el centro del arco queda tapado por construcción.
- 2026-09-08: en el teléfono **«Salir» vive al pie**, después del enlace de
  reclamos. Es la única salida del portal ahí y no había dónde ponerla sin
  ensuciar el encabezado, que el diseñador pidió con dos elementos y nada más.
  Vale la pena revisarlo si aparece un menú de cuenta.
- 2026-09-08: en el teléfono las tarjetas de «Mi servicio» y «Estado de mi caso»
  **se deslizan de lado**, no se apilan. Apiladas ocupaban casi toda la pantalla
  y empujaban los accesos fuera de la vista. Debajo van **dos puntitos** que
  siguen la posición: el borde asomado de la siguiente solo invita una vez que la
  persona lo mira, los puntos lo dicen antes. El punto activo se estira en vez de
  solo pintarse. Desde `md` vuelven a ser dos columnas y los puntos desaparecen.
- 2026-09-08: en el teléfono los accesos son **cuadrados en dos columnas**, todos
  del mismo porte (`auto-rows-fr`), con el **icono suelto y grande (28 px, índigo
  de marca) y sin la pastilla lila detrás**: encerrado en la pastilla el icono
  quedaba del tamaño de un adorno y no distinguía un cuadrado de otro. El nombre
  va debajo, sin el texto de apoyo, que en un cuadrado sobra. Como filas anchas se leían como un menú de trámites. En el computador
  siguen siendo la lista con hairlines. Las dos presentaciones salen de la misma
  constante `OPCIONES`, que gana un campo `corto` (dos o tres palabras, siempre
  empezando con verbo: «Ver mi servicio», «Pagar mi cuota»). Agregar un acceso
  es agregar una fila ahí.
- 2026-09-08: el titular de los accesos lleva **«hacer hoy» en índigo y cursiva**,
  el énfasis que fijó el diseñador. El rótulo «ACCESOS RÁPIDOS» ya no aparece en
  el teléfono.
- 2026-09-08: las dos tarjetas destacadas son **claras: «Mi servicio» en lila
  (`accent`) y «Estado de mi caso» en blanco**, y quedaron **compactas: icono,
  rótulo y nombre**, con la tarjeta entera como enlace y una flecha en la
  esquina. Se fueron el resumen del servicio y la línea «Conoce más del
  servicio»: entre las dos, la tarjeta se estiraba hasta media pantalla del
  teléfono sin decir más (reemplaza a la decisión del 2026-09-03 de «título,
  resumen y un enlace»). Se probó «Mi servicio» rellena de navy —como la
  referencia del diseñador, donde el encabezado era un degradé claro— y también
  en índigo: las dos se descartaron porque sobre el navy del saludo desaparecía
  justo la mitad que tenía que verse. Llevan la sombra más suave del sistema
  porque acá sí flotan sobre otra superficie. La señal de urgencia sigue en la
  tarjeta del caso.
- 2026-09-08: las pantallas de detalle tienen **dos niveles y un solo color**.
  Arriba un bloque lila (`bg-accent`) que dice dónde estás parado —«ETAPA ACTUAL»
  + nombre + bajada en «Estado de mi caso», «EN QUÉ CONSISTE» en «Mi servicio»—
  y debajo tarjetas blancas con hairline, todas idénticas entre sí: mismo fondo,
  mismo borde, icono en navy de marca. **Ninguna se destaca**: subrayar «qué
  necesitamos de ti» parecería una ayuda, pero la pantalla es para alguien
  asustado y es justo lo que no hay que hacer. Reemplaza a las tarjetas con
  sombra e icono índigo. Las dos piezas viven en
  `src/features/portal/BloquesDelPortal.tsx` y las comparten las dos pantallas.
  Sin stepper, sin línea de tiempo, sin badges de «acción requerida».
- 2026-09-08: en «Estado de mi caso» el **nivel de urgencia cierra en gris**, sin
  caja: una nota al pie con su icono, no una quinta tarjeta. El color de esa
  pantalla lo carga entero el bloque de la etapa. El mensaje no cambió y se sigue
  entendiendo detenido, sin depender del color. En el **inicio** el nivel sí
  conserva su color (verde / azul / ámbar): ahí la fila del caso es la única con
  color propio y el verde significa algo.
- 2026-09-08: «Qué puede pasar después» **se queda** en «Estado de mi caso», con
  la misma piel que las otras tres. Se evaluó sacarla y se descartó: es contenido
  que el capitán escribe y parte del orden hablado de la pantalla.
- 2026-09-08: la rampa morada del bloque destacado (`#534AB7` rótulo, `#26215C`
  título, `#3C3489` texto) la entregó diseño y **el tema no la cubre**: solo tiene
  el índigo de acción y el navy del wordmark, ninguno pensado para texto sobre
  lila. Vive en un solo archivo. Si el sistema incorpora la rampa, se reemplaza
  por tokens sin tocar las pantallas.
- 2026-09-08: en el teléfono el **eslogan del acceso** («Hacemos fácil lo legal»)
  baja a cuerpo de texto de apoyo y sin negrita. Iba en el mismo cuerpo que un
  título de sección, justo debajo de un logo de 192 px, y competía con la marca.
  Desde `lg` vuelve a su tamaño de título, donde el hero tiene aire.
- 2026-09-08: **no hay pantalla de transición antes del acceso**. Al abrir el
  enlace lo primero que se ve es el formulario. El interruptor de la marca ahora
  responde a algo que la persona hizo, no a la espera de empezar:
  - **al entrar**, cuando la clave es correcta, un cursor entra y **enciende** el
    isotipo; recién al terminar se abre la sesión y se pasa al portal;
  - **al salir**, el mismo gesto al revés: lo **apaga**, y recién ahí se cierra
    la sesión.
  Reemplaza a la transición de ~1,2 s que se mostraba sola antes del login
  (2026-09-07) y al gesto que corría al abrir el acceso.
  En los dos casos la sesión se toca **después** de la animación: abrirla o
  cerrarla antes cambia de pantalla al instante y no queda animación que ver.
  Las dos viven en `src/features/auth/TransicionDeMarca.tsx` y son el mismo
  componente con el sentido invertido.
- 2026-09-07: antes del acceso va una **pantalla de transición** que se
  disuelve sola: el mismo fondo navy de marca y el **logo principal de Lexy** (no
  la sub-marca) en su lockup vertical con eslogan. Nada más — ni botones ni
  campos. El eslogan «Hacemos fácil lo legal» viene dibujado dentro del archivo,
  así que no se repite como texto. Se probaron el lavanda plano y un degradé
  navy→lavanda, y los dos se descartaron: **todo lo de marca tiende al navy.**
- 2026-09-07: el acceso es **una tarjeta flotante partida en dos**: hero de marca
  (la imagen de marca que entregó diseño) arriba en el teléfono y
  al costado izquierdo desde `lg`; formulario sobre blanco en la otra mitad. Se
  probó el fondo a pantalla completa con una sola tarjeta encima y se volvió a
  esta versión: es la base sobre la que seguimos trabajando. Sin «¿olvidaste tu
  clave?» ni «crear cuenta»: la clave es fija y no hay autorregistro.
- 2026-09-07: **pendiente** — en el teléfono el acceso todavía no convence. El
  hero queda en una franja apretada sobre el formulario. Por resolver sobre esta
  estructura, sin cambiarla por el fondo completo.
- 2026-09-07: el logo de la sub-marca vive en `src/features/auth/assets/` como
  archivo entregado por diseño, en dos colores (navy para fondo claro, gris claro
  para fondo oscuro). **Ojo**: el registry trae su propio `lexydeudor` con
  proporciones algo distintas; si el archivo de diseño es el vigente, hay que
  reemplazar también el del registry para que no queden dos verdades.
- 2026-09-07: **pendiente para producción** — la clave se deriva del RUT y del
  nombre de pila, que no son secretos. Sirve para el prototipo; antes de salir
  hay que cambiarlo.
- 2026-09-07: el inicio abre con un **bloque navy** que contiene el saludo. De
  ahí para abajo el fondo es plano.
- 2026-09-07: el fondo de marca es **un solo archivo entregado por diseño**
  (`src/shared/assets/lexy-fondo-navy.png`: navy con la trama de cubos muy
  atenuada) y se usa en los dos lugares donde aparece la marca sobre oscuro —el
  la transición, el hero del acceso y el bloque del saludo del inicio— para que
  sean la misma
  superficie. Reemplazó al componente `BrandBackground` del registry, que
  generaba la trama por código: con el archivo de diseño conviviendo, eran dos
  verdades. `BrandBackground` sigue instalado pero ya no lo usa nadie.
- 2026-09-07: bajo el bloque navy van **dos destacados**: «Mi servicio» y
  «Estado de mi caso». Nunca «estado actual».
- 2026-09-07: el portal habla **en primera persona del cliente** («mi servicio»,
  «estado de mi caso», «mis pagos»), y los accesos empiezan con un **verbo**
  («Saber sobre…», «Revisar…», «Conversar con…», «Revisar y pagar…»). La pregunta
  que los encabeza es «¿Qué necesitas hacer hoy?».
- 2026-09-07: los accesos rápidos son **cuatro** e incluyen el servicio, aunque
  también tenga tarjeta arriba: la lista es el índice completo del portal.
- 2026-09-07: en «Estado de mi caso» el orden lo fijó el diseñador y es el de una
  explicación hablada: **nombre de la etapa · mensaje principal · qué está
  haciendo tu equipo · qué necesitamos de ti · plazo esperado · qué puede pasar
  después · nivel de urgencia.** El mensaje principal es la bajada del nombre y
  no lleva rótulo. Los otros cuatro van cada uno en su **tarjeta blanca sobre el
  lienzo gris**, con el icono en columna propia a la izquierda, el título en
  negrita y el texto en gris — la referencia visual que fijó el diseñador. Antes
  eran bloques con barra índigo al costado; como tarjetas se separan mejor,
  porque cada una responde una pregunta distinta. «Mi servicio» usa la misma
  piel: una sola tarjeta en todo el portal.
  Reemplaza al orden anterior, que ponía «qué necesitamos de ti» segundo: ahora
  el cliente primero entiende dónde está y qué se está haciendo, y por eso la
  petición se lee sin sobresalto.
- 2026-09-07: el **nivel de urgencia cierra la pantalla**, no la abre. Antes era
  una banda arriba del nombre de la etapa. Como conclusión —después de que el
  cliente ya sabe qué le toca— dice si puede quedarse tranquilo o estar atento.
  Sigue siendo el único signo de urgencia de la pantalla.
- 2026-09-07: el **plazo esperado tiene bloque propio**. Estaba escondido como
  una línea dentro de «próximos pasos», y es una de las tres preguntas que trae
  el cliente. En el panel del capitán pasó de campo de una línea a campo largo:
  los plazos reales se explican, no se resumen en una fecha.
- 2026-09-07: el estado vive **solo en su tarjeta**, no también en la fila de
  accesos. Un signo de estado por pantalla; repetirlo le quita fuerza al verde.
- 2026-09-07: las tarjetas destacadas **no despliegan detalle**. Título, resumen
  y un enlace a la página completa. Se evaluó agregar «Qué buscamos / Tu rol / El
  siguiente paso» y se dejó fuera: son textos nuevos que alguien tendría que
  escribir y mantener por cada servicio.
- 2026-09-07: los bloques llevan **rótulo editorial** en versalitas
  («PORTAL DE CLIENTE», «TU SERVICIO», «ACCESOS RÁPIDOS»), siguiendo la
  referencia del diseñador. «TU SERVICIO» nombra el contenido de su tarjeta; los
  otros dos son decorativos y se pueden quitar sin perder nada.
- 2026-09-10: el inicio usa **`max-w-3xl`**, que con la base tipográfica del
  producto (17 px) son 816 px. El ancho grande (`max-w-4xl`) se
  eligió el 2026-09-07 porque el inicio era un tablero de dos columnas, y dejó de
  serlo cuando «Mi servicio» y el estado del caso se apilaron: con una sola
  columna, 896 px dejaban cada fila con el identificador a la izquierda y el
  chevron muy lejos a la derecha, con el medio vacío. Se bajó a 768 y quedó corto
  —demasiado lienzo gris a los lados—, y 884 quedó ancho de nuevo. El valor final
  está entre los tres; si se vuelve a mover, conviene saber que ya se probaron
  768, 832, 884 y 896. El saludo comparte el mismo
  riel, para que el nombre y la tarjeta queden alineados. Las pantallas de
  detalle siguen en `max-w-2xl`, que es medida de lectura.
- 2026-09-07: **sin «última actualización»** en el inicio. Se probó y se sacó; el
  campo `cliente.etapaActualizadaEn` salió también del contrato para no dejarle a
  Desarrollo un dato que ninguna pantalla usa. Aparece en una referencia visual
  posterior, pero la decisión de dejarlo fuera se mantuvo.
- 2026-09-07: **los iconos con significado viven en un solo archivo**
  (`src/features/portal/iconos.ts`): las pantallas y los datos usan una clave
  («escudo», «balanza», «etapa»), nunca el dibujo. Hoy los dibujos son de lucide,
  que es lineal y del mismo peso que el set de Lexy pero no es el set de Lexy;
  cuando llegue el set propio en SVG se reemplazan ahí y cambia todo el portal
  de una vez. **Pendiente de diseño:** los iconos de Lexy llegaron como PNG en
  navy (`Lexy-Icono-3`, `Lexy-Icono-9`), y así no se pueden recolorear al índigo
  del sistema ni escalar sin perder nitidez. Hacen falta en SVG.
- 2026-09-07: en «Mi servicio», «Qué se puede lograr» pasó de lista con viñetas a
  **tarjetas con icono**: son cosas distintas que se pueden lograr, no los puntos
  de una misma enumeración. Cada resultado ganó dos campos en el contrato,
  `titulo` (dos o tres palabras) e `icono` (la clave), y los dos están marcados
  como pendientes: el titular es texto nuevo que alguien tendrá que escribir por
  servicio.
- 2026-09-03: **todos los iconos del inicio van en el índigo de marca**. La
  única fila con color propio es la del caso, porque su color codifica el nivel
  de urgencia. Si cada acceso tuviera su color, el ojo buscaría un patrón que no
  existe y el verde dejaría de significar «no tienes nada pendiente».
- 2026-09-03: los accesos del inicio son **una sola superficie con filas
  separadas por hairline**, no tarjetas sueltas. Tarjetas blancas idénticas con
  icono y chevron es el kit por defecto de cualquier plantilla; la regla de
  contención del sistema (espacio → superficie → línea) da una lista agrupada.
- 2026-09-03: el hover de las filas es **sólido**, nunca translúcido.
- 2026-09-03: el nivel de urgencia no se muestra como etiqueta suelta, sino como
  una línea con tono (verde / azul / ámbar) arriba de la etapa. Un solo signo de
  urgencia por pantalla.
- 2026-09-03: una etapa se puede **guardar** incompleta, pero no se puede
  **publicar** (marcar visible) con textos vacíos. Regla del panel, no del
  backend todavía.
- 2026-09-03: cuando la etapa del caso es interna, el cliente ve un mensaje de
  «tu caso está avanzando» en vez de una pantalla vacía.
- 2026-09-03: los textos nunca prometen resultado ni fecha. La lista de
  resultados del servicio va acompañada siempre de la advertencia de que cada
  caso es distinto.

- 2026-09-09: **son cuatro servicios, no tres.** «Litigios y Protección
  Patrimonial» se partió en **«Defensa en juicio»** y **«Protección
  Patrimonial»**, que son cosas distintas y se muestran distinto: un juicio es
  una causa con rol y el otro son escrituras. Cada uno se llevó su explicación,
  sus resultados y sus etapas.
- 2026-09-09: **el inicio no es una pantalla por servicio: son cuatro bloques que
  se componen.** Servicio (siempre) · estado del caso · mis juicios · estado de
  mis escrituras. Las reglas: el bloque del servicio principal **reemplaza** al
  estado del caso; el de un servicio secundario **se suma** debajo sin quitar
  nada; y una caja en **monitoreo se omite** si la persona tiene alguna activa.
  Viven en `src/features/portal/composicion.ts`, en una función pura y sin JSX,
  para poder corregir las reglas sin abrir un componente.
- 2026-09-09: **la unidad de datos es la «caja»**, que es la tarjeta de Streak.
  Una persona puede tener varias y cada una va por su propia etapa. Es lo que
  hace posible el sistema de bloques. **Lo más importante que Desarrollo tiene
  que resolver ahora:** hoy no hay forma de saber qué cajas tiene una persona
  —con qué campo se agrupan las tarjetas de Streak de un mismo cliente, y qué
  etapas de Streak cuentan como «monitoreo»—. Está en el contrato como
  `caja`, todo marcado pendiente.
- 2026-09-09: `cliente.etapaActualId` **queda corto** y sobrevive solo para el
  bloque del caso único. Con varias cajas la etapa vive en cada caja.
- 2026-09-09: hay **ocho cuentas de prueba**, una por situación de la tabla de
  decisión. Reemplaza la idea de tener las cuentas en el mismo servicio y la
  misma etapa: lo que hay que poder comparar son las composiciones.

  | Cuenta | Correo / clave | Cajas | Servicio principal | Bloques |
  | --- | --- | --- | --- | --- |
  | Juan | `juan.cardenas@example.com` / `J16482937` | Renegociación + monitoreo | Renegociación | A + B |
  | Soledad | `soledad.munoz@example.com` / `S13907442` | Liquidación + 1 causa + monitoreo | Liquidación | A + B + C |
  | Marcela | `marcela.ibanez@example.com` / `M14552081` | Solo monitoreo | Defensa en juicio | A + B |
  | Ignacio | `ignacio.bravo@example.com` / `I12345678` | 2 causas + monitoreo | Defensa en juicio | A + C |
  | Rosa | `rosa.mella@example.com` / `R9876543` | 3 escrituras (dos del mismo tipo) + madre + monitoreo | Protección Patrimonial | A + D |
  | Ximena | `ximena.torres@example.com` / `X10338771` | Solo caja madre + monitoreo | Protección Patrimonial | A + D vacío |
  | Patricio | `patricio.vergara@example.com` / `P11203764` | 2 causas + 1 escritura + madre + monitoreo | Defensa en juicio con Protección Patrimonial | A + C + D |
  | Héctor | `hector.salas@example.com` / `H8442315` | Renegociación + 1 escritura + madre + monitoreo | Renegociación | A + B + D |
  | Javiera | `javiera.rojas@example.com` / `J15204336` | Renegociación + 1 causa + 1 escritura + madre + monitoreo | Renegociación | A + B + C + D |

  Para el botón de WhatsApp: **Marcela** tiene solo ejecutiva y **Ignacio** solo
  abogado (los dos abren WhatsApp directo); las otras siete tienen los dos y
  pasan por «Mi equipo».

- 2026-09-09: los juicios y las escrituras **se despliegan en el inicio**, no
  llevan a otra pantalla. Con dos o tres causas abiertas la pregunta no es «cómo
  va esta» sino «cuál de todas me pide algo», y eso se responde comparando, no
  navegando. Es la única excepción a «cada opción es una página propia»: al
  desplegarse muestran las mismas tarjetas que «Estado de mi caso», sin «qué
  puede pasar después», que es lectura de fondo y no ayuda a comparar.
- 2026-09-09: **«Conversar con mi equipo» salió de la lista de accesos** y es un
  **botón flotante de WhatsApp** abajo a la derecha (46 px en el teléfono, 52 en
  el computador, verde oficial `#25D366`). Escribirle a alguien no es una tarea
  más entre otras: es la salida de emergencia y tiene que verse desde cualquier
  punto de la pantalla.
- 2026-09-09: **el destino del botón de WhatsApp lo deciden los contactos
  asignados, no el botón.** A una persona pueden venirle asignados el abogado y
  la ejecutiva, o solo uno de los dos —y cuál de los dos puede depender de la
  etapa—. El portal muestra lo que le llega: **con un solo contacto abre WhatsApp
  directo** con esa persona y el mensaje ya escrito; **con los dos lleva a
  `/mi-equipo`**, donde elige y encuentra el correo de soporte. Sin contactos se
  queda igual y lleva a `/mi-equipo`: un botón de emergencia no puede desaparecer
  justo cuando no hay a quién escribirle. La regla de a quién se le muestra a
  quién vive del lado de Lexy, no del portal; está anotada en el contrato como
  pendiente. Cuentas para recorrerlo: Marcela (solo ejecutiva), Ignacio (solo
  abogado), el resto con los dos.
- 2026-09-09: **«Revisar mi caso» desaparece de los accesos** cuando el bloque
  del caso fue reemplazado por la lista de juicios o la de escrituras: esa
  información ya está más arriba en la misma pantalla. «Mi servicio» y «Mis
  pagos» son transversales y están siempre.
- 2026-09-09: las medidas de la especificación (`#FAFAFA`, `#D1D1D1`, textos de
  10-11 px) **se tradujeron al sistema Lexy** en vez de escribirse a mano:
  superficie `card`, borde `border-subtle`, radio `lg` —que ya son 10 px, igual
  que pedía la especificación— y la escala tipográfica del tema. Los 10-11 px del
  mockup se dejaron fuera a propósito: esta pantalla la lee alguien asustado y
  con el teléfono en la mano. El único color escrito a mano es el verde de
  WhatsApp, que es de WhatsApp y no del sistema.

- 2026-09-09: **Paso 0 — el servicio principal se deduce de las cajas, no de la
  ficha del cliente.** El orden: renegociación o liquidación gana siempre (los
  juicios y las escrituras se le suman abajo); si no hay, las causas reales dan
  «defensa en juicio», y si además hay escrituras, el nombre compuesto **«Defensa
  en juicio con Protección Patrimonial»**, con C arriba y D abajo, las dos al
  mismo nivel; si solo hay escrituras, protección patrimonial; y si no hay nada
  más que monitoreo, defensa en juicio con el estado del caso. `cliente.servicioId`
  quedó de respaldo, solo para quien no tiene ninguna caja abierta.
- 2026-09-09: **la caja de monitoreo no es un juicio.** Lexy se la abre a toda
  persona en el embudo de juicio ejecutivo, la contrate o no, así que no entra en
  la lista de causas ni cuenta para decidir el servicio principal. Se evalúa una
  sola vez: cuando es lo único que la persona tiene. Reemplaza a la regla
  anterior de «monitoreo se esconde si hay algo activo», que dejaba la puerta
  abierta a mostrarlo como una causa más. Todas las cuentas de prueba tienen la
  suya, para que la regla se vea funcionando.
- 2026-09-09: el identificador de cada ítem es **el ROL en los juicios y el tipo
  de escritura en las escrituras**, que son los campos de Streak. Las escrituras
  dejaron de llamarse «Escritura de la casa de Ñuñoa» y pasaron a su tipo
  («Declaración de bien familiar», «Usufructo vitalicio»).
- 2026-09-09: **dos escrituras del mismo tipo se muestran las dos, con el título
  repetido.** No hay en Streak con qué distinguirlas y no se va a inventar una
  diferencia: numerarlas («1 de 2») sería un orden que cambia solo si mañana
  entra una tercera. Lo que las separa es la etapa, que va justo debajo del
  título y es además lo que la persona vino a mirar —«cuál de todas me pide
  algo»—. Rosa tiene el caso cargado, con dos «Compraventa de inmueble» en
  etapas distintas. Las listas de juicios y escrituras van **ordenadas por
  identificador** justamente por esto: las del mismo tipo quedan juntas —separadas
  por una tercera parecerían un dato repetido por error— y el orden no cambia
  entre una visita y otra.
- 2026-09-09: **«Mi servicio» (bloque A) dejó de ser interactivo.** Ni enlace, ni
  chevron, ni «Ver más»: es texto informativo y nada más. Una tarjeta que parece
  tocarse y no hace nada gasta la primera atención de alguien que entra asustado,
  y la explicación se alcanza igual desde «Saber sobre mi servicio», que está
  siempre en los accesos. Bajó de lavanda pleno a `accent`: ya no tiene que pedir
  que la toquen.
- 2026-09-09: **«Estado de mi caso» (bloque B) se despliega en el lugar**, como
  los juicios y las escrituras: los tres bloques desplegables responden la misma
  pregunta y ahora tienen el mismo gesto. El nivel de urgencia se sigue viendo
  con la tarjeta cerrada. La pantalla completa `/mi-caso` se queda, con «qué
  puede pasar después», y sigue llegándose desde los accesos.
- 2026-09-09: **se fue el carrusel del teléfono.** Existía porque las dos
  tarjetas eran altas y apiladas empujaban los accesos fuera de la pantalla;
  ahora que A es solo rótulo y nombre y B llega cerrada, las dos apiladas miden
  menos que una de las de antes. Y un panel que se abre dentro de un carril que
  se arrastra de lado es un mal sitio para leer. Desde `md` siguen en paralelo,
  alineadas arriba para que al desplegarse crezca solo el caso. Reemplaza a la
  decisión del 2026-09-08 sobre las tarjetas deslizándose y sus puntitos.
- 2026-09-09: **«Mi servicio» explica el servicio principal, no el contratado.**
  Con el nombre compuesto explica los dos, uno debajo del otro, cada uno con su
  «qué se puede lograr»; la advertencia de que cada caso es distinto va una sola
  vez al cierre. Si el bloque A los nombra juntos, la pantalla que lo explica no
  puede contar solo la mitad.

- 2026-09-09: **«Mi servicio» es un cuadro solo arriba, siempre, y el estado del
  caso viene a continuación** — nunca al lado. Se fue la grilla de dos columnas
  del computador: con B desplegable, el panel abierto ocupaba media pantalla y
  dejaba la otra columna vacía.
- 2026-09-09: **«Mi servicio» es la pieza principal del inicio y se ve como
  tal**: el nombre del servicio en cuerpo de titular (20 px en el teléfono, 24 en
  el computador), la tarjeta más grande y la primera de la página. Es la
  respuesta a la primera pregunta de quien entra. **No se estira de borde a
  borde**: se encoge al largo de su nombre, porque un cuadro que llega a los dos
  márgenes se lee como una franja del encabezado y no como una tarjeta apoyada
  encima.
  El problema que había —dos tarjetas casi iguales pero no del todo, otro color,
  otro ancho, una con chevron y la otra no— **no se arregló achicando A**, que
  fue el primer intento y la dejaba sin peso; se arregló haciendo que **B dejara
  de ser una tarjeta** y pasara a ser una sección con título y filas. Resuelto
  eso, A pudo volver a pesar lo que le corresponde.
  El solape con el navy (`-mb-12`) sale del alto de esta tarjeta: si cambia de
  porte hay que revisarlo, porque de más queda entera dentro de la franja y de
  menos se despega.
- 2026-09-09: **B, C y D son literalmente la misma pieza.** «Estado de mi caso»
  dejó de ser una tarjeta aparte y pasó a ser lo que ya eran los juicios y las
  escrituras: título de bloque con su icono, y debajo filas que se despliegan en
  el lugar (`FilaDesplegable` en `ListaDeCajas.tsx`). Los tres responden la misma
  pregunta con el mismo contenido del capitán; siendo lo mismo, se ven iguales.
  Lo único propio de B es la segunda línea: ahí va el **nivel de urgencia** en
  vez del nombre de la etapa, porque con un caso solo el nombre ya está de título
  y lo que falta es si hay algo que hacer.
- 2026-09-09: **los tres bloques desplegables llevan icono en el título, en navy
  y sin pastilla**: hito para el caso, tribunal para los juicios, documento para
  las escrituras. Dejan reconocer de qué es cada sección sin leer el título.
- 2026-09-09: **se fue la pastilla lila de los iconos de los accesos.** Existía
  para darles a todos el mismo cuadro óptico, pero cuatro manchas moradas en fila
  se leían antes que los nombres, y el icono adentro quedaba del tamaño de un
  adorno. Van sueltos y en navy, el mismo de los títulos de bloque. Reemplaza a
  la decisión del 2026-09-03 de los iconos del inicio en índigo de marca: en esta
  pantalla **el único color con significado es el del nivel de urgencia**, y si
  los iconos estructurales también se tiñen, ese deja de decir nada.
- 2026-09-09: en el embudo de escrituras hay una **caja madre** —la que dice que
  contrató protección patrimonial— y las **cajas obreras**, que son las gestiones.
  La madre no se lista: no es una escritura, y mostrarla sería anunciar una
  gestión que no existe. Sí cuenta para saber que el servicio está contratado.
- 2026-09-09: **el bloque de escrituras está aunque no haya ninguna en marcha**,
  cuando protección patrimonial es el servicio principal: ahí ese bloque *es* el
  servicio, y en blanco diría que el portal está roto. Dice que todavía no hay
  ninguna y que aparecerá cuando empiece la primera. Como bloque aditivo de una
  renegociación, en cambio, si no hay nada que listar no aparece. Ximena tiene el
  caso cargado.
- 2026-09-09: **si el bloque B se muestra o no depende del servicio principal, no
  de si las listas quedaron vacías.** Se probó lo segundo y le ponía un «estado
  de mi caso» genérico a quien contrató escrituras y todavía no arranca ninguna.
  En protección patrimonial ese bloque no existe, ni siquiera vacío.
- 2026-09-09: «¿Qué necesitas hacer hoy?» gana **dos accesos que salen del
  portal**: «Felicitar a mi equipo», que lleva a la ficha de Google de Lexy
  Deudor abierta en el formulario de reseña, e «Ingresar un reclamo». Van al
  final y en ese orden: primero el agradecimiento y después el reclamo, para que
  la última palabra de la pantalla no sea «algo salió mal». Se abren en otra
  pestaña y lo dicen antes de tocarlos, con el icono de enlace externo.
- 2026-09-09: **el enlace de reclamos bajó del pie a la lista de accesos.** Dos
  caminos al mismo formulario en la misma pantalla eran uno de más, y el de
  arriba es el que la persona encuentra. Reemplaza la decisión del 2026-09-03
  sobre «¿Problemas con tu caso? Reclama Aquí» al pie: el texto literal se fue
  con él y ahora el acceso se llama «Ingresar un reclamo». El pie queda con la
  frase de confidencialidad y, en el teléfono, «Salir».
- 2026-09-09: **la cuenta de transferencia es la real** — Asesorías Jurídicas
  Moller y Abadie Limitada, Banco de Chile, cuenta corriente 00-162-36534-09,
  RUT 77.727.144-K, correo soporte@defensoriadeudor.cl. El correo pasó a ser el
  quinto dato de la lista además de estar en la frase de abajo: el formulario del
  banco lo pide para avisar la transferencia.
- 2026-09-09: en «Mis pagos» **quedó un solo botón de copiar**, el de abajo que
  se lleva todos los datos. Se fueron los iconos de copiar de cada fila: eran
  cinco controles casi invisibles al costado de los datos, compitiendo con el
  botón que sí resuelve el caso normal. Reemplaza a la decisión del 2026-09-08,
  que los había dejado reducidos a su icono.

- 2026-09-10: **la tarjeta de «Mi servicio» va a todo el ancho y el nombre en
  versalitas**, con el interletrado abierto y **chico para lo que ocupa**: 18 px
  en el teléfono, 20 en el computador. La caja alta suma mancha por sí sola —las
  mayúsculas llenan toda la altura de la línea, sin ascendentes ni descendentes
  que aireen la palabra—, así que al tamaño con que funcionaba en minúsculas se
  volvía un muro. La presencia se la dan el lila, el ancho completo y estar
  arriba de todo, no el cuerpo de la letra.
  **La balanza va junto al rótulo, no junto al nombre**: al tamaño del rótulo y
  en su mismo gris. Le devuelve identidad a una tarjeta que sin ella era un
  rectángulo lila con dos líneas de texto, y no es un elemento nuevo — es la
  misma balanza del acceso «Consultar mi servicio». A todo el ancho la página queda con un solo riel de izquierda a
  derecha; encogida al largo de su nombre parecía que no había sabido decidir su
  tamaño. En caja alta y con aire entre letras no hay contraforma que engordar
  —que era el problema de las negritas a tamaño grande— y el nombre deja de
  leerse como una frase para leerse como un emblema, que es lo correcto: nadie
  *lee* «Protección Patrimonial», lo reconoce.
- 2026-09-09: la tarjeta conserva **la piel de la especificación original**, que
  es la que el diseñador reconoció como elegante en su referencia: fondo
  `#EEEDFE`, rótulo gris `#616161` en versalitas, nombre navy `#0B013C` en Geist,
  radio 14, sin borde y con sombra suave.
  **La elegancia de esta tarjeta está en lo que le falta**, no en la letra: sin
  icono, sin borde, con el rótulo apagado a gris y el nombre sin gritar. Lo que
  la hace destacar es que flota sobre el navy.
  Antes de llegar acá se recorrieron las dos únicas familias del sistema —Geist
  para texto e interfaz, Switzer para display; Geist Mono es de código— en varios
  pesos y tamaños. **Descartadas por el diseñador:** Geist en negrita, Switzer en
  negrita, Switzer en peso medio, Geist en versalitas y Geist regular a 28 px.
  No hay una tercera familia: Neue Montreal y Satoshi se descartaron en agosto de
  2026 (ninguna en uso, y Neue Montreal es free-personal-use).
  Se compararon las **dos únicas familias del sistema** —Geist para texto e
  interfaz, Switzer para display; Geist Mono es de código— en varios pesos, y el
  diseñador eligió esta. Neue Montreal y Satoshi se habían descartado en agosto
  de 2026 (ninguna en uso, y Neue Montreal es free-personal-use). **No hay una
  tercera opción tipográfica**: lo que queda por mover es peso, tamaño e
  interletrado, porque las dos familias son variables (100–900).
- 2026-09-09: la tarjeta de «Mi servicio» **destaca por densidad y por color, no
  por tamaño**: lila un paso más profundo que `accent` (`#E7E4FC`) con hairline
  `#CBC4F2`, negrita con el interletrado cerrado, esquina de 10 px en vez de 14 y
  sombra corta. Con la esquina redonda y la sombra larga y difusa flotaba blanda.
  Los iconos estructurales del inicio subieron a trazo 2 por lo mismo.
- 2026-09-09: **la jerarquía del inicio, de mayor a menor:** nombre del servicio
  (24 px en el teléfono, 28 en el computador) → «¿Qué necesitas hacer hoy?»
  (20/24) → títulos de bloque (16/18) → contenido de las filas (16). **Lo más
  grande de la página es el nombre del servicio**: es la respuesta a la primera
  pregunta de quien entra, y todo lo demás se lee en relación a él. Por eso la
  pregunta bajó de 30 a 24 px y los títulos de bloque quedaron chicos y elegantes,
  con el contador aún más chico y en gris. Se probó darles el tamaño de la
  pregunta y el resultado fue el contrario: título, nombre de la etapa y nombre
  del servicio medían casi lo mismo y no había jerarquía que leer. Después de «Mi
  servicio» son el mensaje principal de la pantalla —lo que la persona vino a
  leer— y tienen que pesar como tal, no como el rótulo de una lista más.
- 2026-09-09: **cada título de bloque lleva su icono sobrio en navy**: un hito
  para «Estado de mi caso», un tribunal para «Mis juicios» y un documento para
  «Mis escrituras». Dejan reconocer de qué es cada sección al pasar la
  vista, sin leer. En navy porque el único color con significado en la pantalla es
  el del nivel de urgencia.
- 2026-09-10: **las tres filas del inicio tienen la misma anatomía**: rótulo chico
  arriba, etapa abajo, etiqueta de urgencia y chevron. En los juicios y las
  escrituras el rótulo dice de cuál de todas se trata; en el estado del caso dice
  de qué servicio es, que responde la misma pregunta cuando hay uno solo. Sin él,
  la fila del caso tenía una línea y las otras dos, y se leían como piezas de dos
  sistemas distintos aunque la tipografía fuera idéntica. No se repite con la
  tarjeta de arriba: allá el servicio es el titular de la página, acá un rótulo
  gris de doce píxeles que ubica la fila.
- 2026-09-09: **en las filas manda la etapa, no el identificador.** El ROL de una
  causa y el tipo de una escritura pasaron arriba y en chico, como rótulo de la
  fila; el nombre de la etapa ocupa la línea principal. Nadie entra al portal a
  leer un rol: entra a saber en qué va.
- 2026-09-10: **todo panel desplegado abre con el bloque lila «ETAPA ACTUAL»**,
  con la explicación de la etapa pero **sin repetir su nombre**: ese ya está en el
  título de la fila, justo arriba, y repetido a diez píxeles y en cuerpo más
  grande la persona lee dos veces lo mismo y la segunda parece otra cosa. Sin el
  bloque, el panel empezaba directo por «qué está haciendo tu equipo», que
  responde otra pregunta.
- 2026-09-09: **«Revisar estado de mi caso» salió de los accesos**: la
  información ya está arriba, en su propio bloque. Con eso, el desplegable del
  caso pasó a traer **todo** lo que escribe el capitán —la bajada de la etapa y
  «qué puede pasar después» incluidas—, no la versión breve de las listas: es el
  único lugar donde se lee la etapa entera y no puede quedar contenido sin dónde
  mostrarse. **Consecuencia:** la página `/mi-caso` quedó sin ninguna entrada
  desde el portal. Sigue funcionando por URL; hay que decidir si se elimina.
- 2026-09-09: **el botón de WhatsApp abre un panel anclado al botón**, no una
  página aparte, cuando la persona tiene los dos contactos: elegir entre dos
  nombres no es cambiar de lugar, y quien aprieta ese botón normalmente está
  mirando algo de su caso que no quiere perder de vista. El panel trae también el
  correo de soporte. Con un solo contacto sigue abriendo WhatsApp directo.
  Usa `Popover` del registry (instalado el 2026-09-09), que ya trae el cierre con
  Escape y con clic afuera. **Consecuencia:** a `/mi-equipo` solo le queda una
  entrada, desde el estado vacío de «Mis pagos»; también hay que decidir si se
  mantiene.

- 2026-09-09: la bajada del saludo es **«Todo lo que debes saber de tu servicio
  a un solo click.»**, la escribió el diseñador y va literal (con «click», no
  «clic»). Reemplaza a las dos frases anteriores: una enumeraba las secciones,
  que ya están más abajo, y la otra ofrecía ayuda, que ya la ofrece el botón de
  WhatsApp. **Ahora también aparece en el teléfono**, donde antes no cabía: con
  una sola línea sí entra, y el saludo sin bajada dejaba el isotipo y el nombre
  solos contra demasiada franja de navy. El rótulo «Portal de cliente» sigue
  siendo solo del computador.
- 2026-09-09: **el encabezado se subió**: menos aire arriba y abajo del saludo
  (`pt-5 pb-20`, `md:pt-7 md:pb-24`), así el contenido empieza antes.

- 2026-09-09: sobre el botón flotante de WhatsApp va el rótulo **«Contacta a tu
  equipo»**, chico y en una pastilla blanca. El círculo verde solo dice
  «WhatsApp», no a quién ni para qué, y en una pantalla donde todo lo demás está
  nombrado era el único elemento que había que adivinar. La pastilla no recibe
  clics —el objetivo es el círculo— y va en blanco porque debajo se desplaza
  contenido y tiene que leerse igual sobre una tarjeta o sobre el lienzo gris.

- 2026-09-09: los accesos se llaman **«Consultar mi servicio»** y **«Pagar mis
  honorarios»** (antes «Saber sobre mi servicio» y «Revisar y pagar mi cuota»).
- 2026-09-11: **«Consultar mi servicio» lleva a `/mi-servicio`**, como los demás
  accesos. Se probó desplegándolo en el inicio y se volvió atrás. La pantalla usa
  los dos rótulos que se definieron mientras era desplegable —«Objetivo del
  servicio» y «Beneficios que puedes obtener»—, y el inicio deja de cargar la
  explicación y los resultados, que ya no muestra.
  **Pendiente:** `/mi-caso` sigue sin entrada desde el portal, porque su
  contenido está completo en el desplegable del estado del caso. Funciona por
  URL; hay que decidir si se elimina.
- 2026-09-09: en el teléfono **«Salir» está arriba a la derecha**, en la misma
  fila que el isotipo, dentro del encabezado navy. Antes vivía al pie y había que
  recorrer la página entera para cerrar sesión. Reemplaza a la decisión del
  2026-09-08 de dejarlo al pie por falta de sitio en el encabezado.

- 2026-09-15: **el nivel de urgencia se cuenta en dos tiempos.** En la fila
  cerrada va una **pastilla de una palabra** a la derecha —Tranquilo · Atento ·
  Urgente—, chica (20 px de caja, 11 de letra), porque con dos o tres causas
  abiertas la pregunta es «cuál de todas me pide algo» y eso se compara de un
  vistazo. Al **desplegar** aparece la instrucción completa, cerrando el detalle.
  Las tres frases son **estándar y cerradas**: redactadas libremente, dos etapas
  «urgentes» dirían cosas distintas. El título dice **qué pasa** y el nivel dice
  **qué hacer con eso**. El color nunca es la única señal.
- 2026-09-10: **el panel de WhatsApp es siempre el mismo**, venga uno o dos
  contactos: título fijo «Escríbenos por WhatsApp», una fila por persona con el
  círculo verde, el nombre, el rol y **chevron siempre**, y abajo, tras una
  divisoria, el correo de soporte. Se descartó saltar directo a WhatsApp cuando
  hay un solo contacto: el botón se comportaba distinto según un dato que la
  persona no ve, así que dos clientes tenían dos productos distintos en la mano.
  También se descartó el título «¿Con quién quieres hablar?», que con un solo
  contacto ofrecía elegir entre una cosa.
- 2026-09-10: **quién ve el cliente lo configura el capitán por etapa**, no por
  servicio —solo abogado, solo ejecutiva o los dos—, así que puede cambiar
  durante el mismo caso. Está en el contrato como lo que falta definir en
  `contacto`: dónde vive esa configuración y cómo llega al portal.
- 2026-09-10: en «Mis juicios» cada causa se rotula **«Rol N.° [ROL] · [Acreedor]»**
  —«Rol N.° C-4821-2026 · Banco Estado»—. El acreedor es un campo nuevo de la
  caja y **se suma al ROL, no lo reemplaza**: el rol identifica el expediente,
  pero lo que la persona reconoce es a quién le debe.

- 2026-09-10: el bloque D se llama **«Mis escrituras»**, no «Estado de mis
  escrituras». Queda a la par de «Mis juicios» y el «estado» ya lo cuenta cada
  fila con su etapa.

- 2026-09-10: **cada fila lleva su propio nivel de urgencia**, sea del caso, de
  un juicio o de una escritura. La etapa se muestra igual en los tres bloques, así
  que si el capitán marca urgente la etapa de una escritura, la persona tiene que
  verlo ahí. Reemplaza a la regla del 2026-09-07 de **un solo signo de urgencia
  por pantalla**: funcionaba con un caso único y se caía con varios —callar la
  urgencia de dos juicios para no repetir un color es esconder justo lo que hay
  que decir—. Es además lo que hace útil una lista de tres causas: la pregunta que
  trae la persona es «cuál de todas me pide algo».
- 2026-09-10: en el panel del capitán, al elegir el nivel **se muestra la frase
  exacta que va a leer el cliente**, con su icono y su color. La frase es fija por
  nivel y no se edita; mostrarla evita que el capitán elija «un tono» imaginando
  otra cosa. Los tres niveles se llaman ahí **Tranquilo · Atento · Urgente**.

- 2026-09-10: **el portal ya no aparece ampliado al entrar desde el teléfono.**
  No era el portal: iOS hace zoom sobre cualquier campo con letra menor a 16 px
  al enfocarlo, y ese zoom no se deshace al navegar, así que el acceso lo dejaba
  ampliado y el portal heredaba la pantalla descolocada. Los campos del sistema
  (`Input`, `Textarea`, `Select`) pasaron a 16 px en el teléfono y vuelven a 14
  desde `md`. Se descartó `maximum-scale=1` en el viewport: apaga el pellizco
  para ampliar en toda la aplicación y deja afuera a quien necesita ampliar para
  leer.
- 2026-09-10: **las pantallas de detalle no llevan «Salir»**, solo «Volver al
  inicio». Con las dos, la esquina de arriba ofrecía dos salidas a la vez —una
  que retrocede y otra que cierra la sesión— y en un teléfono están a un
  centímetro: quien viene a ver su cuota podía cerrar sesión sin querer. Cerrar
  sesión se hace desde el inicio, que es de donde se entró.
- 2026-09-10: **la línea de urgencia va en cuerpo de metadato** (12 px, icono a
  la par) para que la frase más larga —«Puede que necesitemos algo de ti
  pronto»— nunca ocupe dos líneas en el teléfono. Partida en dos deja de leerse
  de un vistazo, que es lo único que esa línea tiene que hacer.

- 2026-09-10: al desplegar «Consultar mi servicio» se muestran **dos cosas y
  nada más**: «Objetivo del servicio» y «Beneficios que puedes obtener». Los
  beneficios van como lista con su icono al costado, no como tarjetas blancas —
  el panel ya es un contenedor y meterle tarjetas adentro es una caja dentro de
  otra caja.
  **Son dos rótulos, no dos frases:** el objetivo va con la explicación completa
  (`servicio.queEs`). Se probó dejarlo en el resumen de una línea y se perdía casi
  todo lo que la persona necesita para entender qué contrató, que es lo que este
  acceso viene a responder.
  El texto va a **medida de lectura (65 caracteres)** y no a lo ancho del panel:
  en el computador el panel mide 900 px y una línea de ese largo hace perder el
  renglón al volver.
- 2026-09-10: en el teléfono, el acceso desplegable **se abre en una sola pieza**:
  la tarjeta pasa a las dos columnas y el panel queda dentro de ella, con el mismo
  margen que su texto. Antes quedaba un cuadrado chico arriba y un panel ancho
  suelto debajo, que se leía como dos cosas distintas.
- 2026-09-10: en el acceso, el logo y el eslogan **«Hacemos fácil lo legal» son
  un solo bloque de marca**: pegados, sin aire entre los dos, y el eslogan
  **alineado con la palabra «lexydeudor»**, no con el centro del conjunto. El
  isotipo se lleva el primer 23 % del lockup, así que centrado bajo todo caía a
  la izquierda de la palabra y los dos textos no compartían ningún borde. El
  23 % va como proporción y no en píxeles: vale igual en el teléfono (192 px) y
  en el computador (240 px). Desde `lg` el eslogan recupera su aire y su tamaño
  de título.

- 2026-09-10: **los títulos de portada bajan a 24 px en el teléfono** y vuelven a
  30 desde `md`: «Ingresa a tu portal» y los de las pantallas de detalle. A 30 px
  llenaban la línea de borde a borde y competían con lo que tenían al lado —en el
  acceso, con el hero de marca justo encima—. El saludo del inicio ya lo hacía;
  eran las únicas dos portadas que no escalaban.

- 2026-09-10: **el encabezado del inicio cierra en arco** —media circunferencia,
  no una esquina redondeada—, con la tarjeta del servicio montada encima: lo que
  se ve de la curva son los dos costados. Se probó cerrarlo recto y se volvió al
  arco. El solape de la tarjeta sobre la franja es lo que amarra el encabezado
  con el contenido.
- 2026-09-10: **las respuestas de la etapa van apiladas, no de lado.** Se probaron
  deslizándose en el teléfono y se volvió atrás: las cuatro no son alternativas
  entre las que se elige una, son las cuatro partes de una misma explicación, y
  esconder tres detrás de un gesto obliga a descubrir que existen antes de poder
  leerlas. El problema que el carrusel intentaba resolver —que el detalle medía
  varias pantallas— se resolvió acortando los textos.
- 2026-09-10: **los textos de las etapas son cortos**: una o dos frases por campo,
  81 caracteres el más largo. Estaban escritos como párrafos y en un teléfono el
  detalle de una etapa medía varias pantallas. Las explicaciones de servicio
  (`servicio.queEs`) también se acortaron a un párrafo. Son textos de ejemplo: el
  largo real lo fija el capitán, pero este es el que la pantalla soporta bien.

- 2026-09-10: la transición de marca (entrar y salir) **se dibuja colgada del
  `body`**, no donde está el botón que la dispara. «Salir» vive en el encabezado
  navy del inicio, que crea su propio contexto de apilamiento: ahí adentro su
  `z-50` solo competía con los hermanos del encabezado, y el contenido de la
  página se pintaba encima. Al salir se veía la transición de fondo con las
  tarjetas del portal flotando sobre ella.

- 2026-09-10: **todo el producto va un punto más grande**: la base tipográfica
  quedó en 106,25 % de la del navegador (17 px con la configuración por defecto,
  en vez de 16). Va en un solo lugar (`src/index.css`) y no retocando pantalla por
  pantalla, porque el sistema está construido en `rem`: tipografía, espaciado,
  radios y anchos salen todos de esa base, así que subirla escala el conjunto sin
  romper ninguna de las proporciones afinadas una por una. En porcentaje y no en
  píxeles para que quien tenga agrandada la letra en su navegador conserve su
  ajuste. **Efecto secundario a tener presente:** los breakpoints también están en
  `rem`, así que el corte a escritorio pasa de 768 a 816 px.

- 2026-09-10: en el nombre compuesto, **cada servicio va en su propia línea** y
  el «con» cierra la primera: «DEFENSA EN JUICIO CON» / «PROTECCIÓN PATRIMONIAL».
  Suelto, el navegador lo parte donde le alcanza el ancho y el corte cae en mitad
  de un nombre, que obliga a leer dos veces para entender que es un solo
  servicio. El nombre **reserva siempre dos líneas**, así que la tarjeta mide lo
  mismo tenga el servicio que tenga: antes era baja en «Renegociación de deudas»
  y alta en el compuesto, y su solape con la franja navy está calculado contra un
  alto fijo.

- 2026-09-15: en las pantallas de detalle, **la vuelta al inicio vive en la barra
  superior fija**, donde estaba el logo. Es lo único que no se va con el scroll:
  «Mis pagos» mide varias pantallas en el teléfono y un botón sobre el título
  desaparece apenas empiezas a leer —había que repetirlo al final para
  compensarlo—. Va en vez del logo y no junto a él: la marca se presenta en el
  inicio, que es de donde se entra, y acá la barra tiene un solo trabajo. Se dejó
  fuera el nombre de la sección al lado, que el boceto mostraba: el título está
  unos centímetros más abajo y repetido tan cerca se lee dos veces.
  Reemplaza al botón fantasma sobre el título y a su copia al pie.

- 2026-09-15: «Mis pagos» gana un **historial de cuotas pagadas, cerrado por
  defecto** y al final de la página. Es información de respaldo —sirve para
  comprobar que un pago se registró, no para decidir algo hoy—, así que no puede
  competir con la cuota que sí hay que pagar. Al desplegarlo: **tabla con
  encabezados desde `md`** y **lista apilada en el teléfono**, porque cuatro
  columnas en 375 px obligan a desplazar de lado. La cuota gana el campo
  `fechaPago`: la persona busca cuándo pagó, no cuándo vencía.
- 2026-09-15: **cualquier dirección que no exista lleva al inicio.** Antes una URL
  vieja dejaba la pantalla en blanco, sin nada que explicara qué pasó ni cómo
  salir.

- 2026-09-15: **«Mi servicio» muestra un solo servicio, aunque sea el
  compuesto.** «Defensa en juicio con Protección Patrimonial» es un servicio con
  nombre propio, no dos contratados por separado: la pantalla lo mostraba
  partido en dos y contradecía el bloque del inicio del que se entra. Los dos
  objetivos van de corrido bajo un solo rótulo y los beneficios en una sola
  lista.
- 2026-09-15: **el lienzo del portal es el gris neutro del sistema**
  (`--color-surface-canvas`, #f5f5f5) y las tarjetas levantan con
  `shadow-raised`. Cuatro intentos hasta llegar: #edeef3 y #f2f2f9 con lavanda
  de marca separaban bien pero se veían serios —el azul enfría—; #f6f4f0 tibio
  se pasaba al otro lado. El neutro no le impone temperatura a una pantalla cuyo
  único color con significado es el índigo de la marca. Con el gris casi blanco
  de antes, tarjetas y fondo eran del mismo tono y la pantalla se leía como una
  sola lámina plana. Aplica a todas las pantallas, no solo a «Mi servicio»: una
  sola con otro fondo se habría leído como un error.
- 2026-09-15: **de cada marca se conserva el matiz y se descartan la saturación
  y la luminosidad** (`armonizar()`, 45 % / 68 % para todas). Veinticuatro
  manuales de marca no se hablan entre sí: crudos, cada fila pesaba distinto y la
  lista parecía un mosaico de logos pegados encima. El matiz es lo que la persona
  reconoce; la intensidad es lo que hacía que unas gritaran más que otras.
  PENDIENTE: los bancos chilenos se agolpan en el azul, así que BancoEstado y
  Caja Los Andes quedan casi iguales. El nombre del acreedor los separa, pero si
  molesta hay que subir la saturación y perder algo de integración.
- 2026-09-15: **las dos pantallas de detalle llevan la trama de aspas del manual**
  (`BrandBackground motif="aspas" tone="blanco"`), fija al viewport para que no
  se deforme en una página larga. El manual la reserva para superficies
  expresivas, pero acá va también en «Mis pagos» por decisión del diseñador:
  funciona porque todo el contenido vive dentro de recuadros blancos opacos y la
  trama nunca queda debajo de un texto.
- 2026-09-15: **«Mi servicio» se titula «En qué consiste la renegociación»** y
  no con el nombre del servicio, que repetía el rótulo del bloque del que se
  entra. Necesita un campo nuevo, `servicio.nombreEnFrase` («la renegociación»),
  que no se puede derivar del nombre: «Renegociación de deudas» se dice «la
  renegociación», que es media frase menos. PENDIENTE: quién lo escribe y
  mantiene.
- 2026-09-15: **los beneficios van de a dos, en cajitas**, desde el teléfono. En
  una columna había que llegar al final para saber cuántos eran; en dos se ven
  los cuatro de una mirada. El dibujo va arriba del título y no al costado: con
  columnas de 150 px, al costado el título se partía en tres líneas.
- 2026-09-15: **los títulos de los recuadros van en navy y sus dibujos en
  índigo.** Es el único color que entra a esa pantalla y entra en lo que la
  ordena.
- 2026-09-15: **la trama va difuminada** (`blur-[3px] scale-110`). Nítida, las
  aspas son líneas largas y rectas que el ojo sigue, y el título de la pantalla
  competía con ellas. El `scale` saca de cuadro la orla que el desenfoque deja
  en el borde de la imagen.
- 2026-09-15: **se acabó el lila para el objetivo del servicio.** El lila es el
  color con que el portal marca lo que escribió el capitán —la etapa del caso—;
  usarlo también para la explicación del servicio le quitaba ese significado.
  «Mi servicio» pasa a **dos recuadros blancos completos**: uno de objetivo y
  otro de beneficios, cada uno con su dibujo en el título, y los beneficios
  adentro del segundo separados por hairlines en vez de una tarjeta cada uno.
- 2026-09-15: **cuatro beneficios por servicio, siempre.** Liquidación, defensa
  en juicio y protección patrimonial tenían tres. Los tres textos nuevos los
  escribí yo, no vinieron de Lexy: hay que revisarlos.
- 2026-09-15: **la fila del estado del caso lleva el dibujo de su servicio**: un
  apretón de manos en renegociación —el servicio es literalmente llegar a un
  acuerdo— y una goma en liquidación —borrón y cuenta nueva, que es como la
  propia empresa lo describe—. El hito sigue titulando la sección: el título
  nombra la sección, la fila nombra de qué es el caso. Los dos dibujos son de
  lucide y no de Tabler; es la excepción del set.
- 2026-09-15: **fuera el dibujo del rótulo «Mi servicio»** del bloque de arriba
  del inicio. Con las listas llenas de marcas, era el que sobraba: el primero
  que se mira, en el único bloque que no necesitaba uno.
- 2026-09-15: **el rol va siempre debajo del acreedor**, no solo cuando no cabe.
  Al lado competía por la misma línea de lectura; debajo, la fila se lee en el
  orden en que se pregunta: quién me demanda, cuál de las causas, en qué va. La
  etapa sube a 15 px.
- 2026-09-15: **fuera la sección «Tu plan de pago»** de «Mis pagos» —las bolitas
  del avance—, a pedido del diseñador. Lo que queda es el historial completo en
  el modal.

- 2026-09-15: **el martillo lleva el color de la marca del acreedor** —rojo
  Santander, celeste Caja Los Andes, azul BancoEstado—, que es lo que la persona
  tiene visto de la tarjeta y del cajero. La tabla vive en
  `color-de-acreedor.ts`, resuelve por palabra clave (el nombre llega escrito a
  mano en Streak) y un acreedor que no esté cae en el reparto de tintas neutras.
  PENDIENTE: **de los valores, solo tres están tomados de fuente** —Santander,
  BancoEstado y Banco de Chile—; el resto están sacados a ojo del logo y hay que
  confirmarlos. OJO: hay colores de marca rojos y verdes, que son los mismos del
  nivel de urgencia. Cuando la pastilla vuelva, hay que mirarlo junto.
- 2026-09-15: **los iconos van sin fondo.** El círculo gris los hacía parecer el
  avatar de una aplicación de mensajería.
- 2026-09-15: **la pastilla de urgencia sale de las listas por ahora**, a pedido
  del diseñador, para verlas sin ella. El nivel sigue en los datos y en el
  detalle desplegado; volver a mostrarla es revertir un commit.
- 2026-09-15: el historial de cuotas pasa a **un modal con la tabla completa**
  —las doce cuotas, no solo las pagadas— con su estado: Pagada en verde, Morosa
  en rojo, Pendiente en gris. Abierto en la página empujaba todo lo demás hacia
  abajo, y es información de respaldo. La columna de fecha se llama **«Fecha» y
  no «Fecha de pago»**: con las pendientes a la vista, ese rótulo sobre una
  fecha de vencimiento diría algo falso.

- 2026-09-15 (reunión con Litigios y PP): **la pastilla de urgencia deja de
  nombrar emociones.** «Tranquilo» y «Atento» pasan a «Sin acción» y «Atención»;
  «Urgente» queda igual. El equipo objetó que el portal le indicara un estado de
  ánimo a alguien que está siendo demandado: la pastilla dice cuánta acción se le
  pide, no cómo debería sentirse. Va con **punto de semáforo** adentro y una
  **leyenda desplegable** en la cabecera de cada bloque, porque tres palabras
  sueltas no se entienden a primera vista.
- 2026-09-15 (misma reunión): en una causa, **el acreedor va antes que el rol**.
  La persona reconoce su juicio por a quién le debe, no por el número del
  expediente. El rol se mantiene, en gris y detrás, porque es lo único que
  distingue dos causas del mismo banco.
- 2026-09-15: **arriba el nombre de la gestión, abajo la etapa.** Estaba al
  revés. Con listas de una o dos filas la única pregunta era «en qué va»; con
  cuatro escrituras pasó a ser **cuál de todas es esta**, y eso lo contesta el
  tipo, no la etapa. La etapa baja de jerarquía pero **sube a 14 px**: bajar de
  jerarquía no es volverse letra chica. La pastilla de urgencia se muda a la
  línea de la etapa, que es a lo que califica, y de paso le devuelve al titular
  los ochenta píxeles que le faltaban para entrar en una línea de teléfono.
- 2026-09-15: **las causas llevan todas el mismo martillo.** Iban con las
  iniciales del acreedor y se leían como el avatar de un contacto, no como un
  juicio. Lo que distingue una causa de otra es el nombre del banco, que va en
  grande arriba, y el rol debajo. La **etapa sube a gris de texto y medio peso
  de más**: es la segunda línea, pero es lo que la persona vino a leer.
- 2026-09-15: **el banco de dibujos lo entregó el diseñador**: 25 tipos reales
  de escritura, uno por icono de Tabler (MIT), más el martillo para «Mis
  juicios». Viven dibujados en `iconos-de-escritura.tsx` —26 de dos mil, traer
  el paquete pesaría más que el portal— y el emparejamiento es por nombre
  normalizado, sin tildes ni mayúsculas, porque el tipo llega escrito a mano
  desde Streak. Un tipo que no esté cae en un documento genérico. Reemplaza al
  emparejamiento por palabra clave con iconos de lucide.
- 2026-09-15 (reemplazado): las escrituras llevaban **un dibujo por tipo** —una casa para una
  compraventa de inmueble, un auto para una de vehículo—, resuelto por palabra
  clave y no por el nombre exacto, porque los tipos los mantiene Streak y la
  lista va a crecer. Las causas siguen con las iniciales del acreedor: no existe
  el dibujo de «Banco Estado».
- 2026-09-15 (misma reunión): cada caja de las listas lleva una **marca de color
  con sus iniciales o su dibujo** —propuesta de Javi—. El color va **en la marca
  y no en el círculo**, que queda gris: cuatro discos de colores en fila pesan
  como cuatro semáforos y en esta pantalla el semáforo ya existe. Nace de que dos escrituras del
  mismo tipo, o dos causas del mismo acreedor, se leían como un dato repetido por
  error. El color sale del **acreedor** en las causas (dos del mismo banco
  comparten burbuja a propósito) y de la **caja** en las escrituras (donde no hay
  nada que las distinga y el color es lo único que las separa). Evita verde,
  ámbar y rojo, que ya significan urgencia.
- 2026-09-15: **el WhatsApp sale con nombre y apellido.** Del otro lado hay
  alguien que atiende a cientos de personas: «soy Valentina» obliga a pedir el
  RUT antes de poder ayudar. El cliente gana el campo `apellido`, que el portal
  nunca le muestra a ella.
- 2026-09-15: «Mis pagos» gana **cuánto llevas del plan, en bolitas** (pagadas,
  morosas y por venir) y un **contacto directo con cobranza** —Scarlet, la misma
  persona para toda la cartera, así que su número vive en la configuración del
  portal—. La cuota gana el estado `morosa`, que va en rojo en el historial.
  PENDIENTE CON TI: quién y cuándo marca una cuota como morosa.

- 2026-09-03: **PP = Protección Patrimonial**. El servicio quedó como «Litigios y
  Protección Patrimonial».
- 2026-09-03: los tres servicios cargados (renegociación, liquidación, litigios y
  protección patrimonial) son **un ejemplo, no el catálogo definitivo**. No
  inviertas en afinar su contenido hasta que Lexy confirme la lista real.

## Preguntas abiertas

- ¿Cuál es el catálogo real de servicios del portal?
- ¿El portal es transversal a Lexy o específico de Defensoría del Deudor? Hoy usa
  el logo Lexy genérico; existe la variante `Logo brand="deudor"` si corresponde.
