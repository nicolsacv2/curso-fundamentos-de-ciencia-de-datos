#!/usr/bin/env python3
"""Compare the visible text of the original course with that of the React components.

Checks that porting panels.html + figuras.js to JSX lost or changed no content. The
comparison is by MULTISET OF WORDS, not by sentence: the HTML and the JSX wrap lines in
different places and split the same text between children and props, so any sentence
boundary would be a false positive. At the word level, by contrast, an omission or a
rewording shows up immediately.
"""
import html
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

ORIG = Path("/Users/niacevedo/Documents/unal/fundamentos_ciencia_de_datos/sesiones")
REACT = Path("/Users/niacevedo/Documents/unal/curso-fundamentos-de-ciencia-de-datos/src/sessions")

# component props that carry visible content
CONTENT_PROPS = ("label", "big", "k", "t", "alt", "num", "place")


def words(text):
    text = html.unescape(text)
    text = text.replace(" ", " ")
    text = unicodedata.normalize("NFC", text)
    text = text.lower()
    # letters, digits and the internal hyphen are kept; the rest is punctuation
    toks = re.findall(r"[0-9a-záéíóúüñç]+(?:[-–][0-9a-záéíóúüñç]+)*", text)
    return Counter(toks)


def from_html(path):
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"<!--.*?-->", " ", s, flags=re.S)
    alts = re.findall(r'\balt="([^"]*)"', s)          # alt = visible content
    s = re.sub(r"\{\{IMG:[^}]+\}\}", " ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    return words(s + " " + " ".join(alts))


def from_figures_js(path):
    """Text drawn inside the SVGs: strings and aria-labels."""
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"^\s*import .*?;\s*$", " ", s, flags=re.M)
    s = re.sub(r"/\*.*?\*/", " ", s, flags=re.S)
    s = re.sub(r"//[^\n]*", " ", s)
    lit = re.findall(r"'([^'\n]*)'", s) + re.findall(r'"([^"\n]*)"', s)
    lit += re.findall(r"`([^`]*)`", s, flags=re.S)
    return words(" ".join(lit))


def from_jsx(path):
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"^\s*import .*?;\s*$", " ", s, flags=re.M)
    s = re.sub(r"\{/\*.*?\*/\}", " ", s, flags=re.S)
    # the component's scaffolding: signature, return and closing. Removed explicitly
    # because its opening brace and the final one form a pair that, if deleted as a
    # JSX expression, would take the whole body with it.
    s = re.sub(r"export default function \w+\([^)]*\)\s*\{", " ", s)
    s = re.sub(r"\breturn \(", " ", s)
    s = re.sub(r"\);\s*\}\s*$", " ", s)

    # 1) props holding text: quoted, or as a JSX fragment  big={<>…</>}
    #    The \b is essential: without it, t=" matches inside alt=" and variant=",
    #    and those texts would be counted twice.
    props = []
    for name in CONTENT_PROPS:
        props += re.findall(r"\b" + name + r'="([^"]*)"', s)
        for frag in re.findall(r"\b" + name + r"=\{<>(.*?)</>\}", s, flags=re.S):
            props.append(re.sub(r"<[^>]+>", " ", frag))

    # items={['Magia', 'Una bola de cristal', …]} on <Nots> is content too
    for arr in re.findall(r"\bitems=\{\[(.*?)\]\}", s, flags=re.S):
        props += re.findall(r"'([^']*)'", arr)

    # 2) text between tags
    s = re.sub(r"style=\{\{.*?\}\}", " ", s, flags=re.S)
    s = re.sub(r"\{' '\}", " ", s)
    s = re.sub(r"=\{[^{}]*\}", " ", s)          # ={fig} ={808} ={MILESTONES}
    s = re.sub(r"<[^>]+>", " ", s)
    # leftover stray braces do not matter: words() keeps only letters and digits
    return words(s + " " + " ".join(props))


# Tokens that differ for reasons of CODE, not of content. They are listed one by one
# on purpose: any word not here that turns up in the comparison is a real content
# change and must fail the check.
CODE_NOISE = {
    # module scaffolding
    "export", "default", "function", "return", "const", "true", "false", "null",
    "id", "tabid", "classname", "import", "from", "components", "content",
    "index", "jsx", "js",
    # names of the content components
    "panel", "task", "options", "diagram", "plate", "source", "pair", "prose",
    "cards", "card", "nots", "idea", "story", "storyhead", "milestones", "list",
    "commonslink",
    # identifiers renamed when porting figuras.js  (original -> English)
    "cierre", "closes", "foco", "focus", "curva", "curve", "brecha", "gap",
    "proy", "projection", "fila", "row", "dentro", "inside",
    "anchotabla", "tablew", "altotabla", "tableh", "borde", "stroke",
    "fondo", "fill", "marcador", "marker", "cx", "cy", "gx", "gy", "y", "t", "d",
    # SVG marker ids, renamed along with the rest
    "ar-s1-ciclo", "ar-s1-cycle", "ar-s1-vuelta", "ar-s1-loop",
    "ar-s1-esc", "ar-s1-ladder", "ar-s2-tipos", "ar-s2-types",
    # the markup figuras.js hand-built for the timeline, now emitted by the
    # <Milestones> component
    "div", "class", "hito",
    # ids pintar('s1-nube', …) consumed; gone now: each figure is an import
    "s1", "s2",
    "s1-nube", "s1-rastro", "s1-escalera", "s1-interseccion", "s1-ciclo",
    "s1-tiempo", "s1-mapasnow", "s1-flu", "s1-curva", "s1-hitos",
    "s2-tipos", "s2-cuadrantes", "s2-tabla", "s2-falsos", "s2-estructura",
    "s2-poblacion", "s2-digest", "s2-metadatos", "s2-dataset",
}

fail = 0
for nn, sdir in (("01", "s01"), ("02", "s02")):
    original = from_html(ORIG / nn / "panels.html")
    original += from_figures_js(ORIG / nn / "figuras.js")

    ported = Counter()
    for jsx in sorted((REACT / sdir / "blocks").glob("*.jsx")):
        ported += from_jsx(jsx)
    for fig in sorted((REACT / sdir / "figures").glob("*.js")):
        ported += from_figures_js(fig)

    for w in CODE_NOISE:
        original.pop(w, None)
        ported.pop(w, None)

    missing = original - ported
    extra = ported - original

    print(f"\n{'=' * 70}")
    print(f"SESION {nn}  ·  {sum(original.values())} palabras en el original  ·  "
          f"{sum(ported.values())} en React")

    if missing:
        fail = 1
        print(f"\n  FALTAN o CAMBIARON ({sum(missing.values())} apariciones):")
        for w, n in missing.most_common():
            print(f"    [{n}x] {w}")
    else:
        print("  OK — no falta ninguna palabra del original")

    if extra:
        print(f"\n  Solo en React ({sum(extra.values())} apariciones):")
        for w, n in extra.most_common():
            print(f"    [{n}x] {w}")
    else:
        print("  OK — no sobra ninguna palabra")

print()
sys.exit(fail)
