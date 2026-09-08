# Switch

Interruptor de palanca. Para activar/desactivar estados.

## Cuándo usarlo

Para activar o desactivar algo con efecto inmediato: notificaciones, un modo. Es un interruptor de luz — sin botón Guardar. Si el cambio se confirma después con el formulario, usa `Checkbox`.

## Composición

Una sola pieza (`Switch`) con su `Label` al lado. El estado se lee del propio control, no de un texto que cambia.

## Uso básico

```tsx
<Switch />
```

## Reglas

- Usa Switch según el propósito descrito.
- No abuses de este componente en contexts donde no aplica.

## Import

```tsx
import { Switch } from "@/shared/components/base/Switch";
```

## Props

Consulta la story en Storybook para ver las props disponibles.

## Para IA

1. Identifica el contexto de uso del componente.
2. Importa Switch desde el path correcto.
3. Configura las props según la necesidad.
4. Verifica que el componente se integre correctamente en el layout.
5. Solo usa variantes documentadas.
