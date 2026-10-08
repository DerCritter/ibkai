# CLAUDE.md · Propuesta web KommunikationsTrainer (IBK AI)

> **External developers / AI agents: read `AGENTS.md` and `HANDOFF.md` first** (German). This file is the design history in Spanish.

Rediseño propuesto de **kommunikationstrainer.ai** (producto de ImmBlend GmbH, marca **IBK AI**): entrenador de conversaciones y presentaciones con IA (web, móvil y VR).
Debe estar al nivel de las webs de ImmBlend (Awwwards), pero con **identidad propia**: claro, cristal, azul hielo, sci-fi minimalista.

Repo: https://github.com/DerCritter/ibkai (rama main; Vercel despliega al hacer push).

Antes de empezar, lee `tasks/lessons.md`. Web en **alemán** (`/`) e **inglés** (`/en/`). Comunicación con el usuario: **español**.

## Estructura
```
index.html               versión DE
en/index.html            versión EN (generada a partir de DE con un mapa de traducción; mantener en sincronía)
assets/css/style.css     todo el estilo (tokens en :root)
assets/js/main.js        nav, menú móvil, reveals, contadores, hero vídeo, tráiler, demo, brillo cristal; textos JS por idioma (objeto T según <html lang>)
assets/img/              ibk-ai-logo-color.svg (logo oficial recoloreado), ibk-ai-logo.svg (oficial, currentColor),
                         hero-poster, trailer-poster (etalonado frío), avatar-anna, scene-* (fotogramas del tráiler sin franjas),
                         training-anywhere-{1600,900}.jpg (foto del usuario, ya sin uso), training-poster.jpg, favicon/apple-touch-icon
assets/video/            logo-loop-{1920,1280}.mp4 (logo animado en bounce, sin audio), trailer-{1080,720}.mp4 (con audio),
                         redeangst-{900,600}.mp4 (vídeo Veo del usuario: recortado 4:3 sin marca Veo, etalonado frío, bucle hacia delante de 7 s con fundido de 1 s entre final e inicio (el ping-pong se rechazó), sin audio) + img/redeangst-poster.jpg;
                         training-{900,600}.mp4 (vídeo Veo del usuario para Online-Kurse, mismo tratamiento)
```
- Fuentes: tráiler `../ibkai_ trailer/mp4_export/IBKAI-Trailer_V3.mp4` (1:48), logo animado (Veo) en Downloads, logo oficial `../ib_kommunikationstrainer_AI/exports/IBKAI_PNG_SVG/IBKAI_LOGO_SVG.svg`.
- Entrega: `HANDOFF.md` (programador) + `AGENTS.md` (reglas para su IA) + `tools/check.py` (también como GitHub Action). Tag `handover-2026-10-08`.
- Servidor: `python3 serve.py 5180` en el **panel Terminal** (http.server de Python no soporta Range y los vídeos no se pueden adelantar) (Bash en segundo plano se corta). Caché: subir `?v=` de style.css / main.js en **ambos** HTML.

## Dirección de arte (decidida con el usuario)
- **Fondo** azul hielo `#eef4fa` con bokeh vivo (`.aura`), paneles de **cristal esmerilado** claros (`.glass`) con brillo que sigue al ratón.
- **Tipografía**: **Space Grotesk Light** (titulares y cifras), **Geist** (texto), **Geist Mono** (etiquetas, 2 tamaños: 11/12 px). **Sin serifas** (Instrument Serif rechazada: "muy refinada, casi escrita a mano"). No usar las fuentes de ImmBlend (Montserrat, Inter Tight, JetBrains Mono).
- **Color**: navy `#0d2035` (texto), azul `#2f7fd1`, cian `#59b6e6`. Palabras destacadas = color azul, sin cambiar de fuente.
- **Botones "línea de luz"** (elegidos en lab): cápsula de cristal casi transparente con borde degradado fino cian→blanco→azul, sin biseles ni brillos gruesos (lo "Frutiger Aero" se rechazó).
- **Logo** en barra/footer: SVG oficial recoloreado entero en degradado cian→azul (navy en las letras se veía negro).
- **Hero**: banda con el logo animado a sangre, fundida con máscara (sin costura), titular debajo. Claim: **«Souverän sprechen. Mit KI trainiert.»**.
- **Imágenes**: tono frío y aireado horneado en el archivo (desaturar, balance frío, velo azul hielo).

## Estructura de la página (sigue las categorías de la web original)
Navbar: **Portal · IBK AI-VR · Online-Kurse · Kontakt** + selector DE/EN + Demo + Zur App; hamburguesa ≤960 px.
1. Hero · 2. cinta de escenarios · 3. Tráiler (carga al pulsar, encuadre completo) · 4. Warum (4 estadísticas con fuentes)
5. **IBK AI-VR / Gesprächs-Trainer**: 4 tarjetas originales + **demo interactiva** (8 escenarios y 7 personalidades reales de la app → llamada con Anna Richter; diálogo real del tráiler para Jahresgespräch; autoscroll al asistente; opción elegida marcada)
6. KI-Feedback (KI-Bewertung real recreada: 9/10, Stärken, Verbesserungen, Tipps)
7. Community («KI und Community. Für deine Präsentation.»: Rhetorik-Score, KI-Feedback, Community)
8. Präsentieren («Ängste verlieren. Menschen gewinnen.»): vídeo en bucle del usuario (`[data-section-video]`: carga al acercarse, solo suena en pantalla; póster con reduced-motion/saveData)
9. Interaktive Online-Kurse / Training-to-go (vídeo en bucle del usuario, `[data-section-video]`)
10. Portal («Smart trainieren. Digital überzeugen.», 6 funciones) + Wirkung (cuenta de ejemplo del tráiler)
11. Visión · 12. Kontakt (info@immblend.de) · Footer (legales enlazados a kommunikationstrainer.ai, LinkedIn prezp, **sello BSFZ/FuE como imagen** `img/bsfz-siegel.png` (pedido del cliente; de la web original), Powered by ImmBlend)

## Reglas de contenido
- Tratamiento **"du"** en toda la web alemana.
- **No usar "Erfolgsrate 80 %"** (sin fuente; decisión del usuario).
- Contenido real: web original, tráiler y app. Lo redactado por nosotros, avisarlo.
- Sin guiones largos en copy nuevo.
- Contacto: info@immblend.de (Impressum). La web original enviaba a stephan.lohss@immblend.de.

## Calidad
- Probar a 1440 / 1024 / 768 / 375: sin scroll horizontal, anclas que dejan el título ~100 px bajo la barra, menú móvil, demo completa, tráiler.
- Elementos no clicables no deben parecer botones.
