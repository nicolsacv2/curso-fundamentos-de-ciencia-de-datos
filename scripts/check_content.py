#!/usr/bin/env python3
"""Compara el texto visible del curso original con el de los componentes React.

Comprueba que la traduccion de panels.html + figuras.js a JSX no perdio ni cambio
contenido. La comparacion es por MULTICONJUNTO DE PALABRAS, no por frases: el HTML y
el JSX envuelven las lineas en sitios distintos y reparten el mismo texto entre hijos
y props, asi que cualquier frontera de frase seria un falso positivo. A nivel de
palabra, en cambio, una omision o un cambio de redaccion salta de inmediato.
"""
import html
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

ORIG = Path("/Users/niacevedo/Documents/unal/fundamentos_ciencia_de_datos/sesiones")
REACT = Path("/Users/niacevedo/Documents/unal/curso-fundamentos-de-ciencia-de-datos/src/sessions")

# props de los componentes que llevan contenido visible
CONTENT_PROPS = ("label", "big", "k", "t", "alt", "num", "place")


def words(text):
    text = html.unescape(text)
    text = text.replace(" ", " ")
    text = unicodedata.normalize("NFC", text)
    text = text.lower()
    # se conservan letras, digitos y el guion interno; el resto es puntuacion
    toks = re.findall(r"[0-9a-záéíóúüñç]+(?:[-–][0-9a-záéíóúüñç]+)*", text)
    return Counter(toks)


def from_html(path):
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"<!--.*?-->", " ", s, flags=re.S)
    alts = re.findall(r'\balt="([^"]*)"', s)          # alt = contenido visible
    s = re.sub(r"\{\{IMG:[^}]+\}\}", " ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    return words(s + " " + " ".join(alts))


def from_figures_js(path):
    """Texto dibujado dentro de los SVG: cadenas y aria-labels."""
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
    # el andamiaje del componente: firma, return y cierre. Se quita explicitamente
    # porque su llave de apertura y la final forman un par que, si se borrara como
    # expresion JSX, se llevaria por delante todo el cuerpo.
    s = re.sub(r"export default function \w+\([^)]*\)\s*\{", " ", s)
    s = re.sub(r"\breturn \(", " ", s)
    s = re.sub(r"\);\s*\}\s*$", " ", s)

    # 1) props con texto: en comillas, o como fragmento JSX  big={<>…</>}
    #    El \b es imprescindible: sin el, t=" casa dentro de alt=" y de variant=",
    #    y esos textos se contarian dos veces.
    props = []
    for name in CONTENT_PROPS:
        props += re.findall(r"\b" + name + r'="([^"]*)"', s)
        for frag in re.findall(r"\b" + name + r"=\{<>(.*?)</>\}", s, flags=re.S):
            props.append(re.sub(r"<[^>]+>", " ", frag))

    # items={['Magia', 'Una bola de cristal', …]} de <Nots> tambien es contenido
    for arr in re.findall(r"\bitems=\{\[(.*?)\]\}", s, flags=re.S):
        props += re.findall(r"'([^']*)'", arr)

    # 2) texto entre etiquetas
    s = re.sub(r"style=\{\{.*?\}\}", " ", s, flags=re.S)
    s = re.sub(r"\{' '\}", " ", s)
    s = re.sub(r"=\{[^{}]*\}", " ", s)          # ={fig} ={808} ={MILESTONES}
    s = re.sub(r"<[^>]+>", " ", s)
    # las llaves sueltas que queden no importan: words() solo conserva letras y digitos
    return words(s + " " + " ".join(props))


# Tokens que difieren por razones de CODIGO, no de contenido. Se listan uno a uno
# a proposito: cualquier palabra que no este aqui y aparezca en la comparacion es un
# cambio real de contenido y debe hacer fallar la comprobacion.
CODE_NOISE = {
    # andamiaje del modulo
    "export", "default", "function", "return", "const", "true", "false", "null",
    "id", "tabid", "classname", "import", "from", "components", "content",
    "index", "jsx", "js",
    # nombres de los componentes de contenido
    "panel", "task", "options", "diagram", "plate", "source", "pair", "prose",
    "cards", "card", "nots", "idea", "story", "storyhead", "milestones", "list",
    # identificadores renombrados al traducir figuras.js  (original -> ingles)
    "cierre", "closes", "foco", "focus", "curva", "curve", "brecha", "gap",
    "proy", "projection", "fila", "row", "dentro", "inside",
    "anchotabla", "tablew", "altotabla", "tableh", "borde", "stroke",
    "fondo", "fill", "marcador", "marker", "cx", "cy", "gx", "gy", "y", "t", "d",
    # ids de marcador SVG, renombrados con el resto
    "ar-s1-ciclo", "ar-s1-cycle", "ar-s1-vuelta", "ar-s1-loop",
    "ar-s1-esc", "ar-s1-ladder", "ar-s2-tipos", "ar-s2-types",
    # el markup que figuras.js generaba a mano para la linea de tiempo y que ahora
    # emite el componente <Milestones>
    "div", "class", "hito",
    # ids que consumia pintar('s1-nube', …); ya no existen: cada figura es un import
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
