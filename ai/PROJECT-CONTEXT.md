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
- 2026-09-07: el inicio usa `max-w-4xl` porque es un tablero de dos columnas;
  las pantallas de detalle siguen en `max-w-2xl`, que es medida de lectura.
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

- 2026-09-03: **PP = Protección Patrimonial**. El servicio quedó como «Litigios y
  Protección Patrimonial».
- 2026-09-03: los tres servicios cargados (renegociación, liquidación, litigios y
  protección patrimonial) son **un ejemplo, no el catálogo definitivo**. No
  inviertas en afinar su contenido hasta que Lexy confirme la lista real.

- 2026-09-08: **el estado del caso se calcula, no se lee de un campo**. La regla
  vive en `src/features/portal/estado-del-caso.ts`, aparte de las pantallas:
  - **Renegociación y Liquidación** avanzan por un embudo único; se muestra la
    etapa en que está el cliente.
  - **Litigios** puede tener varias causas abiertas (las «cajas» del sistema
    interno, una por escritura o rol). La **caja madre se excluye** cuando hay
    otras activas: mostrar su «no hay novedades» taparía el trabajo real. Si es
    lo único que hay, sí se muestra.
  - Entre varias causas manda **la que pide algo del cliente**, aunque sea la
    menos avanzada; solo si ninguna pide nada gana la más avanzada.
- 2026-09-08: con **más de una causa** el inicio muestra arriba el estado
  principal y aparece un cuadrado **«Mis escrituras»** que lleva a la lista
  completa, con el rol de cada causa y en qué va. Con una sola causa el acceso no
  aparece: llevaría a una lista de un elemento.
- 2026-09-08: **Protección Patrimonial es una tarjeta más** del carrusel, no una
  línea dentro del estado del caso: avanza por su cuenta y con otros tiempos.
  Solo se dibuja si el cliente tiene una gestión activa —sin datos no hay ni
  placeholder— y **nunca en Renegociación**, que es incompatible.
- 2026-09-08: **pendiente de contenido legal.** El copy de las etapas de Litigios
  y de Protección Patrimonial está escrito como marcador de posición para poder
  recorrer el flujo. Falta el texto real de **Admisibilidad** y **Término
  probatorio**, que tiene que definir el equipo legal.
- 2026-09-08: cuenta de prueba de Litigios con tres causas (una madre) y
  Protección Patrimonial: `rodrigo.paredes@example.com` / `R17845221`.

## Preguntas abiertas

- ¿Cuál es el catálogo real de servicios del portal?
- ¿El portal es transversal a Lexy o específico de Defensoría del Deudor? Hoy usa
  el logo Lexy genérico; existe la variante `Logo brand="deudor"` si corresponde.
