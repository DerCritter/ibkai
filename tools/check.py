#!/usr/bin/env python3
"""Integritätsprüfung der Website (ohne Abhängigkeiten).

    python3 tools/check.py

Prüft:
  1. Alle lokalen Verweise (src, href, srcset, poster, data-src-*) in DE und EN zeigen auf existierende Dateien.
  2. DE und EN laden style.css und main.js in derselben ?v=-Version.
  3. DE und EN haben dieselben IDs, Sektionen in derselben Reihenfolge und dieselben data-*-Hooks.
  4. Jeder data-*-Hook, den main.js abfragt, existiert in DE und EN.
  5. <html lang> ist "de" bzw. "en".
  6. Keine Datei über 95 MB (GitHub-Limit 100 MB).
  7. Domain: canonical, hreflang, og:url, og:image, sitemap.xml und robots.txt nutzen dieselbe Domain (SITE);
     og:image-Dateien existieren; keine externen Schrift-CDNs (DSGVO).
  8. 404.html: Verweise gültig, gleiche Cache-Versionen wie die Seiten.
Exit-Code 1 bei Fehlern.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = {'de': 'index.html', 'en': 'en/index.html'}
SITE = 'https://kommunikationstrainer.ai'   # bei Domainwechsel hier und in HTML, sitemap.xml, robots.txt ersetzen
errors = []


def read(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()


def local_refs(html):
    refs = re.findall(r'\b(?:src|href|poster|data-src-[a-z]+)="([^"]+)"', html)
    for srcset in re.findall(r'\bsrcset="([^"]+)"', html):
        refs += [part.strip().split(' ')[0] for part in srcset.split(',')]
    return [r for r in refs if not re.match(r'^(https?:|mailto:|tel:|#|data:)', r)]


html = {lang: read(p) for lang, p in PAGES.items()}

# 1. lokale Verweise
for lang, p in PAGES.items():
    base = os.path.dirname(os.path.join(ROOT, p))
    for ref in local_refs(html[lang]):
        path = ref.split('#')[0].split('?')[0]
        target = os.path.normpath(os.path.join(base, path))
        if path.endswith('/') or path in ('', './'):
            target = os.path.join(target, 'index.html')
        if not os.path.exists(target):
            errors.append(f'[{lang}] Verweis ohne Datei: {ref}')

# 2. gleiche Cache-Versionen
ver = lambda h: sorted(re.findall(r'(style\.css|main\.js)\?v=(\d+)', h))
if ver(html['de']) != ver(html['en']):
    errors.append(f'Cache-Versionen unterschiedlich: DE {ver(html["de"])} / EN {ver(html["en"])}')

# 3. gleiche Struktur
ids = lambda h: re.findall(r'\bid="([^"]+)"', h)
if ids(html['de']) != ids(html['en']):
    errors.append(f'IDs/Reihenfolge unterschiedlich:\n  DE {ids(html["de"])}\n  EN {ids(html["en"])}')
hooks = lambda h: sorted(a for tag in re.findall(r'<[a-z][^>]*>', h) for a in re.findall(r'\s(data-[a-z-]+)(?==|[\s>])', tag))
if hooks(html['de']) != hooks(html['en']):
    errors.append('data-*-Hooks unterschiedlich zwischen DE und EN')

# 4. Hooks aus main.js
js = read('assets/js/main.js')
for hook in sorted(set(re.findall(r'\[(data-[a-z-]+)', js))):
    for lang in PAGES:
        if not re.search(r'\s' + hook + r'(?=[=\s>])', html[lang]):
            errors.append(f'[{lang}] main.js erwartet {hook}, fehlt im HTML')

# 5. Sprache
for lang in PAGES:
    if not re.search(rf'<html lang="{lang}"', html[lang]):
        errors.append(f'[{lang}] <html lang="{lang}"> fehlt')

# 6. Dateigröße
for d, _, files in os.walk(ROOT):
    if '/.git' in d:
        continue
    for f in files:
        p = os.path.join(d, f)
        if os.path.getsize(p) > 95 * 1024 * 1024:
            errors.append(f'Datei über 95 MB: {os.path.relpath(p, ROOT)}')

# 7. Domain und SEO
for lang, p in PAGES.items():
    h = html[lang]
    for tag in ('rel="canonical"', 'hreflang="de"', 'hreflang="en"', 'hreflang="x-default"'):
        m = re.search(r'<link[^>]*' + re.escape(tag) + r'[^>]*href="([^"]+)"', h)
        if not m or not m.group(1).startswith(SITE + '/'):
            errors.append(f'[{lang}] {tag} fehlt oder nicht auf {SITE}')
    for prop in ('og:url', 'og:image', 'twitter:image'):
        m = re.search(r'(?:property|name)="' + prop + r'" content="([^"]+)"', h)
        if not m or not m.group(1).startswith(SITE + '/'):
            errors.append(f'[{lang}] {prop} fehlt oder nicht auf {SITE}')
        elif prop == 'og:image' and not os.path.exists(os.path.join(ROOT, m.group(1)[len(SITE) + 1:])):
            errors.append(f'[{lang}] og:image-Datei fehlt: {m.group(1)}')
    if re.search(r'fonts\.(googleapis|gstatic)\.com', h):
        errors.append(f'[{lang}] externe Google Fonts eingebunden (DSGVO): lokal unter assets/fonts/ einbinden')
for f in ('sitemap.xml', 'robots.txt'):
    doms = set(re.findall(r'https?://[^/<"\s]+', read(f))) - {'http://www.sitemaps.org', 'http://www.w3.org'}
    if doms != {SITE}:
        errors.append(f'{f}: Domain {sorted(doms)} statt {SITE}')

# 8. 404-Seite (absolute Pfade ab Webroot)
nf = read('404.html')
for ref in local_refs(nf):
    path = ref.split('#')[0].split('?')[0].lstrip('/')
    if path and not os.path.exists(os.path.join(ROOT, path)):
        errors.append(f'[404] Verweis ohne Datei: {ref}')
if [v for v in ver(nf) if v[0] == 'style.css'] != [v for v in ver(html['de']) if v[0] == 'style.css']:
    errors.append('[404] style.css-Version weicht von index.html ab')

if errors:
    print('FEHLER:\n- ' + '\n- '.join(errors))
    sys.exit(1)
print('OK: Verweise, DE/EN-Struktur, JS-Hooks, Cache-Versionen, Domain/SEO und 404 stimmen.')
