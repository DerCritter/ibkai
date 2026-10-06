# Lessons · Propuesta KommunikationsTrainer (IBK AI)

Leer al inicio. Tras cada corrección del usuario, añadir una entrada.

## Cómo trabajar con este usuario
### Partir de la web original, no solo del material nuevo
- **Error**: construí la página alrededor del tráiler (ventas y liderazgo) y omití secciones y categorías de la web original: el menú Portal / IBK AI-VR / Online-Kurse, «Ängste verlieren. Menschen gewinnen.» y la Community. El menú estaba oculto en un desplegable y no lo vi.
- **Regla**: antes de rediseñar, inventariar **todas** las secciones, el menú (también los desplegables y el menú móvil) y las categorías de la web original. Presentar la tabla «original → propuesta» y preguntar qué se omite.

### No decidir solo sobre contenido de negocio
- **Error**: quité el «Erfolgsrate 80 %» y cambié el claim sin avisar; escribí en «Sie» cuando la web usa «du».
- **Regla**: claims, cifras y tratamiento se confirman. Vigente: nuestro claim, sin 80 %, «du».

### Decisiones visuales: lab con variantes
- **Contexto**: tipografía y botones necesitaron varias vueltas; con `_lab.html` el usuario eligió en una sola ronda.
- **Regla**: para tipografía, botones o color, montar un lab con 3 a 6 variantes reales y preguntar; borrar el lab después.

## Diseño
- **Tipografía**: Instrument Serif cursiva = «muy refinada, casi escrita a mano» → rechazada. Vigente: Space Grotesk Light, sin serifas. No reutilizar las fuentes de ImmBlend.
- **Botones**: azul translúcido = poco cristal; bisel grueso y brillo = «muy Frutiger Aero». Vigente: «línea de luz» casi transparente con borde degradado fino.
- **Logo**: degradado de color cortado o letras navy (se ven negras) → mal. Vigente: logo oficial entero en degradado cian→azul, coloreado dentro del SVG.
- **Vídeo del hero**: la unión con el fondo no debe verse → máscara CSS (`mask-image` con degradados en los 4 bordes), no capas de color.
- **Imágenes**: llevarlas al tono de la web (frío, aireado) horneando el ajuste; evitar repetir el mismo motivo en dos secciones.

## Técnica
- `[hidden]` lo pisa `video { display:block }` → añadir `[hidden]{display:none !important}` (el tráiler salía duplicado).
- Fotogramas del tráiler traen franjas negras de cine → recortarlas antes de usarlas.
- Anclas con secciones de mucho padding: `scroll-margin-top: calc(var(--sec-pad) * -1 + 20px)`.
- Demo en móvil: al cambiar de paso, desplazar al inicio del asistente.
- Los textos de la demo están en JS: usar un objeto de textos por idioma según `<html lang>` y atributos neutros (`data-random`, `data-script`) en vez de comparar textos alemanes.
- Servidores largos en el panel Terminal, no en Bash en segundo plano.
- Las capturas del panel con viewport emulado a veces salen reducidas o sin vídeo: verificar también con mediciones del DOM.
- Vídeos en bucle: **no usar ping-pong** (ida y vuelta) en esta web; bucle hacia delante con fundido corto entre final e inicio.
- `python3 -m http.server` no responde a peticiones Range: el tráiler no se podía adelantar. Usar `serve.py` (con Range). En Vercel funciona sin cambios.
