#!/usr/bin/env python3
"""Download from Wikimedia Commons the copies that go into the backup bucket.

The plates for sessions 1 and 2 are no longer versioned: the page requests them from
Commons, which is where they came from. The bucket exists for the day Commons does not
answer -- a renamed file, a classroom with no access -- and for that it has to hold
exactly the widths the browser is going to ask for.

That calculation lives in src/assets/sources.js, not here: the width ladder derives from
the .plate max-widths in panel.css and must exist in one place only. This script reads
the same ladder from there, so uploading one file too many or too few is impossible.

Commons does the resizing, via ?width=. There is no Pillow and nothing to install: the
stdlib is enough, as in check_content.py and extract_salon.py.

    python3 scripts/mirror_assets.py

Leaves the files in .assets-cache/, to be uploaded with scripts/upload_assets.sh.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
MANIFIESTO = os.path.join(RAIZ, 'src', 'assets', 'manifest.json')
FUENTES = os.path.join(RAIZ, 'src', 'assets', 'sources.js')
SALIDA = os.path.join(RAIZ, '.assets-cache')

COMMONS = 'https://commons.wikimedia.org/wiki/Special:FilePath'

# Wikimedia's API policy asks for a User-Agent that identifies the caller.
UA = ('curso-fundamentos-de-ciencia-de-datos/1.0 '
      '(https://github.com/nicolasacevedo/curso-fundamentos-de-ciencia-de-datos)')

# The <Plate> variants the course uses, and whose ladders are read.
VARIANTES = ('portrait', 'medium', 'default')


def escalera_de_sources_js():
    """Read LADDER out of sources.js. A two-level object literal, nothing deeper."""
    js = open(FUENTES, encoding='utf-8').read()
    bloque = re.search(r'const LADDER = \{(.*?)\n\};', js, re.S)
    if not bloque:
        sys.exit('Cannot find LADDER in src/assets/sources.js')
    escalera = {}
    for nombre, nums in re.findall(r'(\w+):\s*\[([\d,\s]+)\]', bloque.group(1)):
        escalera[nombre] = [int(n) for n in nums.split(',') if n.strip()]
    faltan = [v for v in VARIANTES if v not in escalera]
    if faltan:
        sys.exit(f'Missing variants in LADDER: {", ".join(faltan)}')
    return escalera


def anchos(lamina, escalera):
    """Every width the browser could ask for, across all variants.

    A plate does not know which variant it will be mounted in, so the backup keeps the
    union of the three. That is three or four files per plate, not hundreds.

    Clamping to the original's width is what widthsFor() does too: asking for 1840px of
    a 326px original returns the same 326 pixels under another name.
    """
    todos = set()
    for variante in VARIANTES:
        todos.update(min(w, lamina['w']) for w in escalera[variante])
    return sorted(todos)


def ancho_real(datos):
    """Pixel width of a JPEG or PNG, read from its own header.

    This exists because Special:FilePath quietly snaps every request to one of its
    thumbnail buckets: ?width=620, 840 and 920 all return the same 960px file. A srcset
    built on the requested widths would then be advertising sizes that do not exist, and
    the browser would pick by them. So the widths are not trusted, they are measured.
    """
    if datos[:8] == b'\x89PNG\r\n\x1a\n':
        return int.from_bytes(datos[16:20], 'big')
    if datos[:2] != b'\xff\xd8':                 # not a JPEG either: nothing to check
        return None
    i = 2
    while i < len(datos) - 9:
        if datos[i] != 0xFF:
            i += 1
            continue
        marca = datos[i + 1]
        # SOFn carries the dimensions; C4/C8/CC are tables and restarts, not frames.
        if 0xC0 <= marca <= 0xCF and marca not in (0xC4, 0xC8, 0xCC):
            return int.from_bytes(datos[i + 7:i + 9], 'big')
        i += 2 + int.from_bytes(datos[i + 2:i + 4], 'big')
    return None


def bajar(url, destino, esperado):
    peticion = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(peticion, timeout=120) as r:
        datos = r.read()
    real = ancho_real(datos) if esperado else None
    if real is not None and real != esperado:
        raise ValueError(f'asked for {esperado}px, got {real}px')
    with open(destino, 'wb') as f:
        f.write(datos)
    return len(datos)


def main():
    manifiesto = json.load(open(MANIFIESTO, encoding='utf-8'))
    escalera = escalera_de_sources_js()
    os.makedirs(SALIDA, exist_ok=True)

    total = 0
    fallos = []
    for clave, lamina in manifiesto.items():
        if clave.startswith('_'):          # the manifest's comment block
            continue
        archivo = urllib.parse.quote(lamina['commons'])

        if lamina.get('vector'):
            # An SVG with ?width= comes back rasterised to PNG. Without the parameter
            # the vector arrives, which serves any width — and nothing to measure.
            pedidos = [(f'{COMMONS}/{archivo}', f'{clave}.{lamina["ext"]}', None)]
        else:
            pedidos = [(f'{COMMONS}/{archivo}?width={w}', f'{clave}-{w}.{lamina["ext"]}', w)
                       for w in anchos(lamina, escalera)]

        for url, nombre, esperado in pedidos:
            destino = os.path.join(SALIDA, nombre)
            try:
                n = bajar(url, destino, esperado)
            except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as e:
                fallos.append((nombre, e))
                print(f'  ✗ {nombre}: {e}')
                continue
            total += n
            print(f'  · {nombre}  {n // 1024} kB')
            # Commons is free and serves a lot of people: it does not get whipped with
            # thirty back-to-back requests to save two seconds.
            time.sleep(0.4)

    print(f'\n{total // 1024} kB in {SALIDA}')
    if fallos:
        print(f'{len(fallos)} failure(s). A 404 usually means a file was renamed on '
              f'Commons: find the new name and fix it in manifest.json. A width '
              f'mismatch means LADDER in sources.js has drifted off the buckets '
              f'Special:FilePath actually serves.')
        return 1
    print('Next: scripts/upload_assets.sh')
    return 0


if __name__ == '__main__':
    sys.exit(main())
