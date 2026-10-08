# Übergabe · KommunikationsTrainer Landingpage (IBK AI)

Statische Website (HTML, CSS, Vanilla-JS). Kein Build-Schritt, keine Abhängigkeiten. Alle Pfade sind relativ: Der Repo-Inhalt wird 1:1 als Webroot ausgeliefert.

Stand der Übergabe: Git-Tag `handover-2026-10-08`. Bei Problemen immer zuerst dagegen vergleichen (`git diff handover-2026-10-08`).

Regeln für KI-Assistenten und Code-Agenten: **`AGENTS.md`**. `CLAUDE.md` und `tasks/lessons.md` sind die Design-Historie auf Spanisch (nur als Hintergrund).

---

## Vor jedem Merge
```
python3 tools/check.py
```
Prüft lokale Verweise, DE/EN-Gleichstand, die von `main.js` benötigten `data-*`-Hooks, Cache-Versionen und Dateigrößen. Läuft zusätzlich als GitHub Action (`.github/workflows/check.yml`) bei Push und Pull Request.

Lokal: `python3 serve.py` (Port 5180). Der Standard-`http.server` von Python beantwortet keine Range-Requests, dadurch lässt sich der Trailer nicht spulen. Das betrifft nur lokal: Vercel, Nginx usw. können das.

---

## Offene Entscheidungen beim Go-live

### 1. Domain und App-Routen
Unter `kommunikationstrainer.ai` läuft heute die App. Die Landingpage verlinkt absolut auf diese App-Routen:

| Route | Verwendung |
|---|---|
| `/login` | „Zur App", „Web App starten", Demo-CTA |
| `/demo` | „Demo" in Navbar und Menü |
| `/impressum`, `/datenschutz`, `/cookie-policy`, `/agb` | Footer |

Wenn die Landingpage auf `/` der Domain geht, müssen diese Pfade weiter zur App führen (Rewrite oder Proxy), oder die App zieht auf eine Subdomain um. Dann müssen alle Links oben in **beiden** Sprachdateien angepasst werden. Die Rechtstexte gibt es nur in der App: Sie müssen erreichbar bleiben.

### 2. Kontakt und Formular
Es gibt **kein Formular**. Kontakt läuft über `mailto:info@immblend.de?subject=KommunikationsTrainer`, mit je zwei Links in DE und EN (Sektion `#kontakt`). Die alte Seite schickte an `stephan.lohss@immblend.de`, das wurde bewusst geändert.

Falls ein Formular dazukommt: Im Repo `immblend_homepage` gibt es `assets/js/contact-form.js`. Es unterstützt einen eigenen Endpoint (`data-endpoint`) und Web3Forms (`data-web3forms-key`), mit Fallback auf mailto, und hat Lade-, Erfolgs-, Fehler- und Validierungszustände. Die Texte dort sind auf „Sie" geschrieben, hier gilt **„du"**. Der Datenschutz der App muss den Formular-Dienstleister dann nennen.

### 3. SEO-Metadaten (noch domainlos)
- `og:image` ist relativ (`assets/img/hero-poster.jpg`). Für Social-Previews auf eine absolute URL setzen.
- `canonical` fehlt. `hreflang` ist relativ (`./`, `en/`) und sollte absolut werden.
- Es gibt kein `sitemap.xml` und kein `robots.txt`.

### 4. Google Fonts (DSGVO)
Space Grotesk, Geist und Geist Mono werden von `fonts.googleapis.com` geladen. Für den Betrieb in Deutschland: selbst hosten (LG München I, 3 O 17493/20) und die `<link>`-Tags in beiden HTML-Dateien ersetzen. Bitte dieselben Schnitte verwenden: Space Grotesk 300/400/500, Geist 300–600, Geist Mono 400/500.

### 5. Siegel
`assets/img/bsfz-siegel.png` trägt die Jahreszahl 2026. Bei Verlängerung muss die Datei ersetzt werden (Name gleich lassen).

---

## Struktur
```
index.html            DE (Hauptsprache)
en/index.html         EN, gleiche Struktur, Pfade mit ../
assets/css/style.css  gesamtes Styling, Tokens in :root
assets/js/main.js     Navbar, Menü, Reveals, Zähler, Videos, Trailer, Demo, Glas-Effekt
assets/img, assets/video
tools/check.py        Integritätsprüfung
serve.py              lokaler Server mit Range-Support
```

Nicht verwendet, aber im Repo: `assets/img/ibk-ai-logo.svg` (offizielles Logo in `currentColor`), `scene-17/74/80/95.jpg` und `training-anywhere-{900,1600}.jpg`. Sie können entfernt werden.
