# Übergabe · KommunikationsTrainer Landingpage (IBK AI)

Statische Website (HTML, CSS, Vanilla-JS). Kein Build-Schritt, keine Abhängigkeiten, keine externen Requests (Schriften liegen lokal). Der Repo-Inhalt wird 1:1 als Webroot von **https://kommunikationstrainer.de** ausgeliefert.

Übergabestand: Git-Tag `handover-2026-10-08`. Bei Problemen immer zuerst dagegen vergleichen (`git diff handover-2026-10-08`).

Regeln für KI-Assistenten und Code-Agenten: **`AGENTS.md`**. `CLAUDE.md` und `tasks/lessons.md` sind die Design-Historie auf Spanisch (nur Hintergrund).

---

## Vor jedem Merge
```
python3 tools/check.py
```
Prüft:
- lokale Verweise,
- DE/EN-Gleichstand und die `data-*`-Hooks von `main.js`,
- Cache-Versionen,
- die Domain in `canonical`, `hreflang`, Open Graph, `sitemap.xml` und `robots.txt`,
- dass keine externen Schriften eingebunden sind,
- die 404-Seite und die Dateigrößen.

Der Check läuft auch als GitHub Action (`.github/workflows/check.yml`).

Lokal: `python3 serve.py` (Port 5180, mit Range-Support. Der Standard-`http.server` von Python kann nicht spulen).

---

## Für den Go-live

### Domain
- **Landingpage:** `kommunikationstrainer.de`. Alle absoluten URLs (canonical, hreflang, og:url, og:image, twitter:image, sitemap, robots) zeigen bereits dorthin.
  - **Achtung:** `kommunikationstrainer.de` und `www.` leiten aktuell per 301 auf `www.mto-consulting.de` weiter. DNS bzw. Weiterleitung müssen umgestellt werden.
  - `www` sollte per 301 auf die Apex-Domain leiten (oder umgekehrt, dann `SITE` anpassen, siehe unten).
- **App:** bleibt auf `kommunikationstrainer.ai`. Die Landingpage verlinkt absolut dorthin:
  - `/login`: „Zur App", „Web App starten", Demo-CTA,
  - `/demo`,
  - Rechtstexte im Footer: `/impressum`, `/datenschutz`, `/cookie-policy`, `/agb`. Sie existieren nur in der App und müssen dort erreichbar bleiben.
- **Domainwechsel:** `SITE` in `tools/check.py` ändern und `https://kommunikationstrainer.de` in `index.html`, `en/index.html`, `sitemap.xml` und `robots.txt` ersetzen. Der Check meldet jede vergessene Stelle.

### Server
- `404.html` im Root wird von Vercel und Netlify automatisch verwendet. Bei Nginx/Apache als `error_page 404` / `ErrorDocument 404` eintragen. Die Seite nutzt absolute Pfade (`/assets/...`).
- Range-Requests für `.mp4` müssen erlaubt sein (Standard bei Nginx, Apache und Vercel).
- Caching: Für `assets/` ist ein langes Caching möglich, weil CSS/JS über `?v=` versioniert sind. Bilder, Videos und Schriften ändern ihren Namen bei Austausch nicht, also eher moderat (z. B. 1 Tag). HTML: `no-cache`.

### Kontakt
Bewusst **ohne Formular**: `mailto:info@immblend.de?subject=KommunikationsTrainer`, je zwei Links in DE und EN (`#kontakt`). Bitte so lassen.

### Siegel
`assets/img/bsfz-siegel.png` trägt die Jahreszahl 2026. Bei Verlängerung die Datei unter gleichem Namen ersetzen.

---

## Bereits erledigt
- Schriften lokal in `assets/fonts/` (Space Grotesk, Geist, Geist Mono als Variable Fonts, `latin` + `latin-ext`, OFL), kein Google-Fonts-Request.
- SEO:
  - `canonical`, `hreflang` (de, en, x-default), Open Graph und Twitter Card je Sprache,
  - Vorschaubilder 1200×630 (`og-image.jpg`, `og-image-en.jpg`),
  - `sitemap.xml` mit hreflang-Alternates und `robots.txt`.
- 404-Seite (DE mit EN-Link, `noindex`).

## Struktur
```
index.html            DE (Hauptsprache)
en/index.html         EN, gleiche Struktur, Pfade mit ../
404.html              Fehlerseite (absolute Pfade)
assets/css/style.css  gesamtes Styling, Tokens in :root
assets/js/main.js     Navbar, Menü, Reveals, Zähler, Videos, Trailer, Demo, Glas-Effekt
assets/fonts/         lokale Schriften + fonts.css
assets/img, assets/video
sitemap.xml, robots.txt
tools/check.py        Integritätsprüfung
serve.py              lokaler Server mit Range-Support
```

Nicht verwendet, aber im Repo (können entfernt werden):
- `assets/img/ibk-ai-logo.svg` (offizielles Logo in `currentColor`),
- `scene-17/74/80/95.jpg`,
- `training-anywhere-{900,1600}.jpg`.
