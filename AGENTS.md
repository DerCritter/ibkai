# AGENTS.md · Regeln für KI-Assistenten

Statische Landingpage für den KommunikationsTrainer (IBK AI). Kontext für Menschen: `HANDOFF.md`.

## Pflicht vor jeder Abgabe
- `python3 tools/check.py` muss mit `OK` enden.
- Änderungen sichtbar prüfen bei 375, 768 und 1440 px: kein horizontales Scrollen, Menü, Demo (alle 3 Schritte), Trailer, DE/EN-Umschalter.

## Nicht brechen
1. **Kein Framework, kein Build, kein Bundler, kein npm.** Nicht „modernisieren". Pfade bleiben relativ.
2. **Zwei Sprachdateien mit identischer Struktur:** `index.html` (DE) und `en/index.html` (EN, Asset-Pfade mit `../`). Jede Änderung an Markup, IDs, `data-*` oder Assets in **beiden** machen, nur der Text unterscheidet sich.
3. **Cache-Busting:** Bei Änderungen an `style.css` oder `main.js` das `?v=` in **beiden** HTML-Dateien erhöhen.
4. **JS-Hooks laufen über `data-*`-Attribute**, nicht über Klassen oder Texte, zum Beispiel `data-nav`, `data-menu`, `data-demo`, `data-pane`, `data-trailer`, `data-section-video`. Nicht umbenennen oder entfernen.
5. **Demo-Texte in JS:** Das Objekt `T` in `main.js` wählt die Sprache über `<html lang>`. Die Szenario-Logik nutzt `data-script="annual"` und `data-random`, nie deutsche Strings.
6. **`[hidden]{display:none !important}`** in `style.css` bleibt. Ohne diese Regel erscheinen versteckte Videos und Demo-Schritte doppelt.
7. **Videos:**
   - `preload="none"`, `muted`, `playsinline`.
   - `data-src-lg` und `data-src-sm` wählen die Auflösung.
   - Abgespielt wird nur sichtbar (IntersectionObserver).
   - Der Trailer lädt erst beim Klick und hat Ton.
   - Der Server muss Range-Requests beantworten.
8. **Farbkorrektur ist in die Bild- und Videodateien eingebacken.** Keine CSS-`filter` auf Bilder oder Videos legen, sie kosten Performance und verfälschen den Look.
9. **Logo:** `ibk-ai-logo-color.svg` mit eigenem Verlauf (`id="ibk-mark"`, Cyan→Blau). Nicht durch PNG ersetzen und den Verlauf nicht ändern.
10. **Design-Tokens** in `:root` verwenden (`--ink`, `--blue`, `--blue-2`, `--f-head`, `--f-body`, `--f-mono`, `--sec-pad`), keine losen Farbwerte.
    - Schriften: Space Grotesk für Überschriften, Geist für Text, Geist Mono für Labels.
    - Keine Serifenschriften.
11. **Mobile (≤640 px):** Zeilenumbrüche sind gezielt gesetzt (`text-wrap: balance/pretty`, `.dotline`, Footer zweizeilig, Portal als Wisch-Karussell, IBK-AI-VR als kompakte Liste). Neue Inhalte genauso behandeln: keine einzelnen Wörter am Zeilenende, kein „·" am Zeilenanfang.
12. **Barrierefreiheit:** `alt`, `aria-label`, `aria-pressed` bei Auswahl-Buttons, `prefers-reduced-motion` (zeigt das Poster statt Video). Nicht entfernen.

13. **Keine externen Requests:** keine CDNs, keine Google Fonts, keine Tracking-Skripte ohne Rücksprache (DSGVO). Schriften liegen in `assets/fonts/`.
14. **Domain** `https://kommunikationstrainer.de` steht in canonical, hreflang, og:*, twitter:image, `sitemap.xml` und `robots.txt`. Neue Seiten bekommen dieselben Metadaten und einen Eintrag in der Sitemap. App-Links bleiben auf `kommunikationstrainer.ai`.
15. **Kontakt ohne Formular** (mailto). Kein Formular hinzufügen.
16. `404.html` nutzt absolute Pfade und muss dieselbe `style.css`-Version wie die Seiten laden.

## Inhaltliche Regeln (vom Kunden festgelegt)
- Ansprache in Deutsch durchgehend **„du"**.
- Claim: **„Souverän sprechen. Mit KI trainiert."**
- **Keine „Erfolgsrate 80 %"** verwenden (ohne Quelle).
- Keine Gedankenstriche (—) im sichtbaren Text.
- Keine Zahlen, Namen oder Zitate erfinden. Fehlende Inhalte als `[[TBD]]` markieren und nachfragen.
