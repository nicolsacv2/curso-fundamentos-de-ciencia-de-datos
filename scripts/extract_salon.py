#!/usr/bin/env python3
"""Extract the snapshot of the class dataset for session 3.

Reads the .xlsx produced by the session 2 form, keeps the ten columns the class
works on, and writes src/sessions/s03/data/salon.js.

Only ten of the form's 34 columns are published. With 23 people, department +
programme + year of birth re-identifies almost everyone, and the site is public:
weight, height, year of birth, age group, clothing size and the exact programme
name are all left out. This is not a defensive trim. The ten that remain contain
the ten defects the session teaches, and none of the discarded ones adds a new
one.

Values are copied verbatim: the trailing spaces, the missing accents and the
typographic minus in «O−» are the material of the class, not noise to be tidied
away before publishing.

No dependencies: an .xlsx is a zip with XML inside, and the stdlib reads that.
Same as scripts/check_content.py.

    python3 scripts/extract_salon.py [path/to/file.xlsx]
"""

import html
import json
import os
import re
import sys
import zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
XLSX = os.path.expanduser('~/Downloads/Dataset del salón · Sesión 2 (respuestas).xlsx')
SALIDA = os.path.join(RAIZ, 'src', 'sessions', 's03', 'data', 'salon.js')

# column in the .xlsx → on-screen letter, key, short header.
# The short header is what the class sees: the full questions do not fit in a
# ten-column table, and they already know them — they wrote them.
COLUMNAS = [
    ('B',  'A', 'codigo',     'código'),
    ('E',  'B', 'depto',      'departamento'),
    ('F',  'C', 'municipio',  'municipio'),
    ('G',  'D', 'area',       'área de pregrado'),
    ('M',  'E', 'pantalla',   'pantalla h/día'),
    ('N',  'F', 'minutos',    'minutos ayer'),
    ('Q',  'G', 'porciones',  'porciones'),
    ('R',  'H', 'balanceada', 'balanceada 1–5'),
    ('V',  'I', 'sangre',     'sangre'),
    ('AH', 'J', 'libro',      'último libro'),
]


def celdas(ruta):
    """{(fila, 'AH'): 'texto'} para toda la hoja."""
    z = zipfile.ZipFile(ruta)
    try:
        crudo = z.read('xl/sharedStrings.xml').decode('utf-8')
        compartidas = [
            html.unescape(re.sub(r'<[^>]+>', '', m))
            for m in re.findall(r'<si>(.*?)</si>', crudo, re.S)
        ]
    except KeyError:
        compartidas = []

    hoja = z.read('xl/worksheets/sheet1.xml').decode('utf-8')
    out = {}
    for n, fila in re.findall(r'<row[^>]*r="(\d+)"[^>]*>(.*?)</row>', hoja, re.S):
        for ref, attrs, cuerpo in re.findall(
                r'<c [^>]*?r="([A-Z]+)\d+"([^>]*)>(.*?)</c>', fila, re.S):
            v = re.search(r'<v>(.*?)</v>', cuerpo, re.S)
            t = re.search(r'<t[^>]*>(.*?)</t>', cuerpo, re.S)
            val = v.group(1) if v else (html.unescape(t.group(1)) if t else '')
            if 't="s"' in attrs and val.isdigit():
                val = compartidas[int(val)]
            out[(int(n), ref)] = val
    return out


def limpio(v):
    """Quita el .0 que el .xlsx le pone a los enteros, sin tocar los decimales.

    Ojo con lo que NO hace: no recorta espacios ni normaliza nada. Esa es
    justamente la materia prima de la sesión.
    """
    if re.fullmatch(r'-?\d+\.0', v):
        return v[:-2]
    return v


def medias(valores):
    """Las cuatro medias de la columna de minutos, una por decisión.

    Son cuatro respuestas a la misma pregunta sobre la misma columna. El bloque
    2 se sostiene en que ninguna es la correcta.
    """
    nums = [float(x) for x in valores if x != '']
    vacias = len(valores) - len(nums)
    horas = [x for x in nums if x <= 16]      # the ones who answered in hours
    return {
        'ignorarVacias':  sum(nums) / len(nums),
        'vaciasComoCero': sum(nums) / (len(nums) + vacias),
        'sinAtipico':     (sum(nums) - max(nums)) / (len(nums) - 1),
        'horasAMinutos':  (sum(nums) - sum(horas) + sum(h * 60 for h in horas)) / len(nums),
    }


def main():
    ruta = sys.argv[1] if len(sys.argv) > 1 else XLSX
    if not os.path.exists(ruta):
        sys.exit(f'no encuentro el .xlsx en {ruta}')

    hoja = celdas(ruta)
    filas_xlsx = sorted({f for f, _ in hoja})[1:]          # row 1 is the headers
    tabla = [[limpio(hoja.get((f, col), '')) for col, _, _, _ in COLUMNAS]
             for f in filas_xlsx]

    minutos = [fila[5] for fila in tabla]
    m = medias(minutos)

    # What the panel claims on screen. If the .xlsx changes, this fails here and
    # not in front of the class.
    codigos = [fila[0] for fila in tabla]
    pantalla = [fila[4] for fila in tabla]
    sangre = [fila[8] for fila in tabla]
    assert len(tabla) == 23, f'esperaba 23 respuestas, hay {len(tabla)}'
    assert codigos.count('9999') == 2, 'el código 9999 debería estar repetido'
    assert '1234' in codigos, 'falta el código 1234'
    assert pantalla.count('') == 7, 'pantalla debería tener 7 vacías'
    assert max(float(x) for x in pantalla if x) == 30, 'el atípico de pantalla es 30'
    assert minutos.count('') == 3, 'minutos debería tener 3 vacías'
    assert any('−' in s for s in sangre), 'falta el O− con menos tipográfico'
    assert sum('ogot' in fila[2] for fila in tabla) == 13, 'esperaba 13 en Bogotá'
    assert round(m['ignorarVacias'], 1) == 152.6, m['ignorarVacias']
    assert round(m['vaciasComoCero'], 1) == 132.7, m['vaciasComoCero']
    assert round(m['sinAtipico'], 1) == 110.1, m['sinAtipico']
    assert round(m['horasAMinutos'], 1) == 261.8, m['horasAMinutos']

    j = lambda o: json.dumps(o, ensure_ascii=False)
    lineas = [
        '/* Generated by scripts/extract_salon.py — do not edit by hand.',
        '',
        '   The 23 answers from the session 2 form, in the ten columns session 3',
        '   works on. Values are exactly as they arrived: the trailing spaces and the',
        '   missing accents are the material of the class. */',
        '',
        '/* [on-screen letter, key, header] */',
        'export const COLS = [',
    ]
    for _, letra, clave, rotulo in COLUMNAS:
        lineas.append(f'  [{j(letra)}, {j(clave)}, {j(rotulo)}],')
    lineas += ['];', '', 'export const ROWS = [']
    for fila in tabla:
        lineas.append('  [' + ', '.join(j(v) for v in fila) + '],')
    lineas += [
        '];',
        '',
        '/* The four means of column F, one per cleaning decision.',
        '   Recomputed by the script on every run. */',
        'export const MEDIAS = {',
    ]
    for clave, valor in m.items():
        lineas.append(f'  {clave}: {round(valor, 1)},')
    lineas += ['};', '']

    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    with open(SALIDA, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lineas))

    print(f'{len(tabla)} filas × {len(COLUMNAS)} columnas → {os.path.relpath(SALIDA, RAIZ)}')
    for clave, valor in m.items():
        print(f'  {clave:16} {valor:7.1f} min')


if __name__ == '__main__':
    main()
