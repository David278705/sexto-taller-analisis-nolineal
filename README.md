# Taller de Análisis No Lineal y Ecuaciones Diferenciales Parciales

Sitio web del taller organizado por la Universidad Tecnológica de Pereira.

| Ruta     | Edición                          |
| -------- | -------------------------------- |
| `/`      | VIII Taller · 2 – 5 junio 2027   |
| `/2025/` | VII Taller · 28 – 31 mayo 2025 (archivo) |

## Estructura

- `index.html`: edición actual (HTML estático, sin dependencias).
- `static/css/site.css`, `static/js/site.js`: estilos y comportamiento de la edición actual.
- `images/2027/`: imágenes optimizadas (WebP) de la edición actual.
- `images/`: imágenes originales, compartidas con el archivo 2025.
- `2025/`: sitio de la edición 2025 tal como se publicó (plantilla HTML5 UP).

## Archivar una edición

1. Crear la carpeta del año (p. ej. `2027/`) y mover allí `index.html`, `static/`.
2. Cambiar las rutas `images/` → `../images/` dentro del HTML archivado.
3. Enlazar la carpeta desde la sección «Talleres previos» de la nueva edición.

## Desarrollo local

```sh
python -m http.server 8000
```
