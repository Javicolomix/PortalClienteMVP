# BrandBackground

Fondos oficiales del manual de marca Lexy (sección 05. Fondos) como componente:
las tramas isométricas de cubos y aspas en los siete tonos de la paleta, el
gradiente grainient y el aspa de esquina para portadas. Llenan a su contenedor
con `object-cover` y son puramente decorativos.

## Cuándo usarlo

En superficies expresivas de marca: el hero de una portada, la apertura de una
sección, una tarjeta destacada o la pantalla de un pendón/demo. Nunca en
superficies de trabajo — si la pantalla es operativa (formularios, tablas,
flujos), el fondo debe ser plano.

## Motivos y tonos

- `motif="cubos"` — trama isométrica de cubos pequeños. La más sobria: es la
  indicada cuando hay texto encima.
- `motif="aspas"` — trama de aspas (el isotipo) grandes. Más expresiva, para
  superficies con poco contenido.
- `motif="grainient"` — gradiente lavanda/índigo con grano. Solo lavanda.
- `motif="aspa-esquina"` — un aspa gigante en la esquina inferior derecha,
  pensado para portadas. Solo lavanda.

Los motivos `cubos` y `aspas` aceptan `tone`: `navy` (por defecto),
`indigo-oscuro`, `indigo`, `lavanda`, `blanco`, `magenta` y `teal`. Magenta y
teal son tonos de sub-marca: úsalos solo en contextos de esas líneas.

## Uso

Montado absoluto detrás del contenido, con un color de fondo de respaldo en el
contenedor mientras la imagen carga:

```tsx
<section className="relative isolate overflow-hidden rounded-lg bg-brand-navy">
  <BrandBackground motif="cubos" tone="navy" className="absolute inset-0" />
  <div className="relative">{/* contenido */}</div>
</section>
```

## Atenuación

Cuando hay texto encima, la trama plena compite con la lectura. La prop `dim`
(0–1) la atenúa fundiéndola hacia el color de fondo del contenedor — por eso
el contenedor debe llevar el tono correspondiente (`bg-brand-navy` para
`tone="navy"`). Con `dim={0.9}` la trama queda apenas insinuada, como textura:

```tsx
<section className="relative isolate overflow-hidden rounded-lg bg-brand-navy">
  <BrandBackground motif="cubos" tone="navy" dim={0.9} className="absolute inset-0" />
  <div className="relative">{/* contenido */}</div>
</section>
```

## Contraste

Sobre `navy` e `indigo-oscuro` el texto va blanco; sobre `lavanda`, `blanco` y
el `grainient` va en tinta (`brand-navy`). Verifica el contraste real: las
tramas son sutiles pero existen. Para bloques largos de texto, usa `cubos` con
`dim` alto o un fondo plano.

## Accesibilidad

La imagen es decorativa: lleva `alt=""` y `aria-hidden`, no porta significado
y no debe usarse como único vehículo de identidad de una sección.
