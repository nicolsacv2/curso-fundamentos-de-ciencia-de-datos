#!/usr/bin/env python3
"""Extract the class dataset the course works on, shared by sessions 3, 4 and 6.

Reads the .xlsx produced by the session 2 form and writes src/data/salon.js: the
raw answers in the columns that can be published, plus every figure the three
sessions quote on screen, computed here instead of typed into a panel.

Thirty-one of the form's 34 columns are published. Three are left out — the
timestamp, the age bracket and the exact name of the degree — and each carries its
reason in EXCLUIDAS below.

It used to be twenty-seven. The weight, the height, the shirt size and the year of
birth were excluded as re-identifying, and the course owner decided to publish them:
this is a public site and a class of twenty-seven, so that decision is a real one
and it is recorded here rather than left to be inferred from the output. What it buys
is the only pair of variables in the table that go together, and the only ordinal
whose levels are labels instead of numbers — both of which session 6 needs to teach
what it is teaching. What it costs is in src/data/PROCEDENCIA.txt.

The year of birth is not published raw: what is published is the age derived from it
(see DERIVADAS). The age bracket stays out because it would be the same fact twice.

Values are copied verbatim: the trailing spaces, the missing accents and the
typographic minus in «O−» are the material of the class, not noise to be tidied
away before publishing. The derived columns are the declared exception, and an
assertion in main() checks that every other column still matches the .xlsx cell for
cell — with one exception in the file, the golden rule has to be verified rather
than trusted. What IS derived — means, quartiles, counts — is derived here, so that
regenerating this file drags every figure on screen with it.

Columns are named by their variable, never by the letter they carry in the
spreadsheet: a letter says where a value came from, which is the one thing about it
that teaches nothing. The order of session 3's ten is kept anyway, so the table it
audits still reads left to right the way that session walks it.

No dependencies: an .xlsx is a zip with XML inside, and the stdlib reads that.
Session 6's cleaning chain is the one script that needs feature-engine, and it is
a different file (scripts/clean_salon.py).

    python3 scripts/extract_salon.py [path/to/file.xlsx]
"""

import html
import json
import os
import re
import statistics as st
import sys
import zipfile
from decimal import Decimal, ROUND_HALF_UP

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
XLSX = os.path.join(RAIZ, 'src', 'data', 'Dataset del salón · Sesión 2 (respuestas).xlsx')
SALIDA = os.path.join(RAIZ, 'src', 'data', 'salon.js')

# column in the .xlsx → variable name, short header, type.
# The short header is what the class sees: the full questions do not fit in a
# table this wide, and they already know them — they wrote them.
# 'cat' / 'ord' / 'num' is what tells session 6 what may be done to a column.
#   num  a real quantity: it can be summed, averaged, and its spread measured.
#   ord  a rank dressed up as a number. «Balanceada 1–5» is the case session 4
#        already argued about: the 5 is not five times the 1, so the mean sums
#        labels. It follows that the interquartile rule must not be used on it to
#        call values outliers either — the ends of a bounded scale are valid
#        answers by construction, not anomalies. Order and count are the only
#        things it admits, which is what session 4 concluded.
#   cat  a name. No order at all.
COLUMNAS = [
    ('B', 'codigo',     'código',            'cat'),
    ('E', 'depto',      'departamento',      'cat'),
    ('F', 'municipio',  'municipio',         'cat'),
    ('G', 'area',       'área de pregrado',  'cat'),
    ('M', 'pantalla',   'pantalla h/día',    'num'),
    ('N', 'minutos',    'minutos ayer',      'num'),
    ('Q', 'porciones',  'porciones',         'num'),
    ('R', 'balanceada', 'balanceada 1–5',    'ord'),
    ('V', 'sangre',     'sangre',            'cat'),
    ('AH', 'libro',      'último libro',      'cat'),
    # ── from here on, the columns session 6 needed and session 3 never used ──
    ('C', 'edad',       'edad',              'num'),
    ('I', 'sector',     'sector económico',  'cat'),
    ('J', 'espera',     'espera usar CD',    'cat'),
    ('K', 'empleos',    'empleos',           'num'),
    ('L', 'estudio',    'estudio h/semana',  'num'),
    ('O', 'diasAf',     'días act. física',  'num'),
    ('P', 'semanasAf',  'semanas act. fís.', 'num'),
    ('S', 'peso',       'peso kg',           'num'),
    ('T', 'estatura',   'estatura cm',       'num'),
    ('U', 'tallaCamiseta', 'talla camiseta', 'ord'),
    ('W', 'cafes',      'cafés ayer',        'num'),
    ('X', 'formaCafe',  'cómo toma el café', 'cat'),
    ('Y', 'mascotas',   'mascotas',          'num'),
    ('Z', 'exotico',    'animal exótico',    'cat'),
    ('AA', 'viajes',     'viajes 12 meses',   'num'),
    ('AB', 'organiza',   'cómo se organiza',  'cat'),
    ('AC', 'python',     'usa Python',        'cat'),
    ('AD', 'erre',       'usa R',             'cat'),
    ('AE', 'js',         'usa JavaScript',    'cat'),
    ('AF', 'julia',      'usa Julia',         'cat'),
    ('AG', 'musica',     'género musical',    'cat'),
]

# Corrections made by hand, because no rule finds them.
#
# The standardising of session 6 catches everything that is the same string written
# differently. It cannot catch a value that is a DIFFERENT string and still the same
# place: knowing that Fontibón is part of Bogotá is not in the data, it is in the
# head of somebody who lives there.
#
# These do NOT touch ROWS. The table is published exactly as it arrived — that is
# session 3's golden rule and the reason salon_v1_crudo is marked INTOCABLE. What
# they change is the derived counts, and they are declared here so the correction is
# auditable: a hand-made decision that is not written down is the one thing session 3
# says never to do.
CORRECCIONES = {
    'municipio': {
        'Fontibon': ('Bogotá',
                     'Fontibón es una localidad de Bogotá desde 1954, no un municipio. '
                     'Quien lo escribió vive en Bogotá; ninguna regla lo deduce.'),
    },
}


def corregido(clave, valor):
    """El valor con su corrección manual aplicada, si tiene una."""
    return CORRECCIONES.get(clave, {}).get(valor, (valor,))[0]


# The year the form was answered. Fixed, not datetime.now(): an age computed from
# today would change the generated file every January, and regenerating this file has
# to give the same file. Same reason the imputer's seed is pinned.
ANIO_CAPTURA = 2026

# The columns that are NOT copied from the form but computed from it. Everything else
# in ROWS is verbatim — that is session 3's golden rule — so an exception has to be
# declared here, with the rule that produces it, or it is not auditable.
#
# `de` is the column it comes from, and that column is not published raw.
DERIVADAS = {
    'edad': {
        'de': 'C',
        'pregunta': '¿En qué año naciste?',
        'regla': f'{ANIO_CAPTURA} − año de nacimiento',
        'motivo': 'la edad es lo que el curso analiza; el año de nacimiento, además, '
                  'es un dato de registro civil y la edad no lo es',
    },
}


def derivado(clave, valor):
    """El valor derivado de una celda cruda, para las columnas de DERIVADAS."""
    if clave != 'edad':
        return valor
    return '' if valor == '' else str(ANIO_CAPTURA - int(float(valor)))


# How a variable is written when a person reads it, for the columns whose key is not the
# name of the thing.
#
# A key has to be a plain identifier and must not look like a spreadsheet letter — the
# assertion in main() enforces that, and it is why column AD is `erre` and not `R`: column
# R of the sheet is `balanceada`, so a variable named `R` would make ambiguous exactly what
# the rule protects. But the figures print the variable's NAME, because the course teaches
# pointing at a column by its name, and «erre» projected on a wall reads as a typo.
#
# So: the key stays inside the code, and this is what gets written wherever a person reads
# it — figures, tables and the .xlsx handed to the class. Only the columns that need it
# appear here; where the key already is the name of the thing (`municipio`, `sangre`) there
# is nothing to declare and nothing is declared.
NOMBRES = {
    'erre': 'R',
    'js': 'JavaScript',
    'python': 'Python',
    'julia': 'Julia',
}


def nombre(clave):
    """El nombre con el que esta variable se escribe para una persona."""
    return NOMBRES.get(clave, clave)


# The order of the levels of an ordinal column, where sorting them does not give it.
# «balanceada 1–5» does not need an entry: its levels are numbers. A shirt size is the
# first one that does — alphabetically S · M · L · XL comes out L · M · S · XL, which
# is not an order, and treating a rank in the wrong order is worse than not having one.
ORDEN_NIVELES = {
    'tallaCamiseta': ['S', 'M', 'L', 'XL'],
}


# The three that stay out, and why.
#
# It used to be seven. The weight, the height, the shirt size and the year of birth
# were excluded as re-identifying, and the course owner decided to publish them: the
# first three as they arrived, the year of birth as a derived age (see DERIVADAS).
# What was accepted in exchange is written in src/data/PROCEDENCIA.txt — this is a
# public site and a class of twenty-seven.
#
# What is left out is what identifies on its own, or what would publish the same
# thing twice.
EXCLUIDAS = [
    ('A',  'Marca temporal',
     'orden exacto de envío: quien recuerde a qué hora respondió se reconoce, y reconoce a sus vecinos de fila'),
    ('D',  '¿En cuál de estos grupos de edad te ubicas?',
     'dice lo mismo que la edad publicada, con menos detalle: publicar las dos sería '
     'publicar dos veces el mismo dato'),
    ('H',  '¿Cómo se llama exactamente tu programa de pregrado?',
     'el nombre exacto del programa es casi un identificador en una clase de este tamaño'),
]


def redondear(x, n=1):
    """Round half up, the way a spreadsheet does.

    Python rounds halves to even, so round(7.25, 1) gives 7.2 and the quartile
    that has been on the wall since session 4 is 7.3. The published figure is
    right and the default is what is wrong here.
    """
    q = Decimal(1).scaleb(-n)
    d = Decimal(repr(float(x))).quantize(q, rounding=ROUND_HALF_UP)
    # A whole number comes out whole: the file used to be written by hand and said
    # `mediana: 120`, not `120.0`, and it still has to read like something a person
    # would have typed.
    return int(d) if n == 0 or d == d.to_integral_value() else float(d)


def exportado(texto, nombre):
    """El valor de `export const <nombre> = …;` de un módulo generado, como objeto.

    The generated files are JSON with `export const` in front, which is the whole
    reason they are written that way: a script with no dependencies can read them
    back, and so can a person. Lives here rather than in whoever needed it first
    because check_salon.py and export_xlsx.py both do.
    """
    m = re.search(rf'export const {nombre} = (.*?);\n(?=\n|export|$)', texto, re.S)
    if not m:
        raise KeyError(f'no encuentro el export {nombre}')
    cuerpo = re.sub(r'/\*.*?\*/', '', m.group(1), flags=re.S)             # comments
    cuerpo = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', cuerpo)   # bare keys
    cuerpo = re.sub(r',(\s*[}\]])', r'\1', cuerpo)                        # trailing commas
    return json.loads(cuerpo)


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
    justamente la materia prima de la sesión 3.
    """
    if re.fullmatch(r'-?\d+\.0', v):
        return v[:-2]
    return v


def cuantil(valores, p):
    """El cuantil por interpolación, que es el que usa una hoja de cálculo."""
    v = sorted(valores)
    h = (len(v) - 1) * p
    i = int(h)
    return v[i] + (h - i) * (v[min(i + 1, len(v) - 1)] - v[i])


def desviacion_mediana(valores):
    """La mediana de las distancias a la mediana.

    No es la media de esas distancias: la sesión 4 la usa como pareja robusta de
    la desviación típica, y promediarlas volvería a dejarla a merced del atípico
    que el ejemplo entero quiere esquivar.
    """
    m = st.median(valores)
    return st.median([abs(x - m) for x in valores])


def resumen(valores):
    """La caja de medidas de la sesión 4, sobre una columna cuantitativa."""
    v = sorted(valores)
    media = st.mean(v)
    sd = st.stdev(v) if len(v) > 1 else 0.0
    q1, q3 = cuantil(v, 0.25), cuantil(v, 0.75)
    modas = st.multimode(v)
    return {
        'n': len(v),
        # Sorted, because every figure that draws this column draws it in order:
        # the strip of answers, the quartile cuts, the box.
        'valores': [redondear(x, 2) for x in v],
        'media': redondear(media),
        'mediana': redondear(st.median(v)),
        'modas': sorted(redondear(m, 2) for m in modas),
        'modaVeces': max(v.count(m) for m in modas),
        'min': redondear(min(v), 2),
        'max': redondear(max(v), 2),
        'rango': redondear(max(v) - min(v), 2),
        'q1': redondear(q1),
        'q3': redondear(q3),
        'iqr': redondear(q3 - q1),
        'desviacion': redondear(sd),
        'cv': redondear(sd / media, 2) if media else 0,
        'desvMediana': redondear(desviacion_mediana(v), 0),
    }


def medias_de_limpieza(valores):
    """Las cuatro medias de la columna de minutos, una por decisión.

    Son cuatro respuestas a la misma pregunta sobre la misma columna. El bloque 2
    de la sesión 3 se sostiene en que ninguna es la correcta.
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


def recuentos(tabla, idx):
    """Lo que las sesiones 3 y 4 afirman en prosa, contado aquí.

    Cada entrada de aquí es una cifra que antes estaba escrita a mano dentro de
    un párrafo o rotulada dentro de una figura. Vive aquí para que regenerar la
    tabla la arrastre, en vez de dejar un «trece de veintitrés» sobre datos que
    ya son otros.
    """
    col = lambda clave: [f[idx[clave]] for f in tabla]
    # Counts run over the corrected values; ROWS keeps the originals.
    muni = [corregido('municipio', v) for v in col('municipio')]
    crudo_muni = col('municipio')
    depto = col('depto')
    pantalla, minutos, area = col('pantalla'), col('minutos'), col('area')

    # A row counts as Bogotá when its municipality names Bogotá, however it is
    # spelled — plus the ones a hand correction put there.
    bogota = [i for i, v in enumerate(muni, 1) if 'ogot' in v]

    # Every spelling of Bogotá with how many times it was written, commonest first.
    # The intro figure draws one row per spelling: it used to carry the six counts
    # typed in by hand, which is how «13» survived four new answers.
    #
    # Only real spellings go here — a corrected value is not a way of writing
    # «Bogotá», it is a different problem, and the figure keeps the two apart.
    escrituras = sorted(
        {v for v in crudo_muni if 'ogot' in v},
        key=lambda v: (-crudo_muni.count(v), v))

    return {
        'filas': len(tabla),
        'bogota': len(bogota),
        'bogotaFormas': [[v, crudo_muni.count(v)] for v in escrituras],
        # [value as written, how many, why it was corrected]
        'bogotaCorregidos': [
            [v, crudo_muni.count(v), CORRECCIONES['municipio'][v][1]]
            for v in sorted({v for v in crudo_muni if v in CORRECCIONES['municipio']})
        ],
        'filasBogota': bogota,
        # Of those, the ones whose department says Cundinamarca — Bogotá is not
        # in Cundinamarca, and that is the point of the block.
        'bogotaEnCundinamarca': sum(1 for i in bogota if 'undinamarca' in depto[i - 1]),
        'deptoVariantes': len({v for v in depto if v}),
        'muniVariantes': len({v for v in muni if 'ogot' in v}),
        'pantallaVacias': sum(1 for v in pantalla if v == ''),
        'pantallaFilasVacias': [i for i, v in enumerate(pantalla, 1) if v == ''],
        'pantallaImposibles': [i for i, v in enumerate(pantalla, 1) if v and float(v) > 16],
        'minutosVacias': sum(1 for v in minutos if v == ''),
        'minutosRespondidas': sum(1 for v in minutos if v != ''),
        'minutosEnHoras': [i for i, v in enumerate(minutos, 1) if v and float(v) <= 16],
        'minutosAtipico': [i for i, v in enumerate(minutos, 1) if v and float(v) == 960],
        'areaVacias': [i for i, v in enumerate(area, 1) if v == ''],
        'areaMultiple': [i for i, v in enumerate(area, 1) if ',' in v],
        'codigosRepetidos': sorted(
            {v for v in col('codigo') if col('codigo').count(v) > 1}),
    }


def emitir(tabla, m, s04, rec):
    """El módulo generado, con todo lo que las tres sesiones interpolan."""
    j = lambda o: json.dumps(o, ensure_ascii=False)
    L = [
        '/* Generated by scripts/extract_salon.py — do not edit by hand.',
        '',
        f'   The {len(tabla)} answers from the session 2 form, in the {len(COLUMNAS)} columns that can',
        '   be published. Shared by sessions 3, 4 and 6: it used to be copied into each',
        '   one, and the copies drifted the moment the form got four more answers.',
        '',
        '   Values are exactly as they arrived — the trailing spaces and the missing',
        '   accents are the material of session 3. Everything derived from them is',
        '   computed by the script, so regenerating this file moves every figure the',
        '   sessions show on screen.',
        '',
        '   The source .xlsx is not in the repository. See src/data/PROCEDENCIA.txt. */',
        '',
        '/* [variable, header, type] — a column is named by its variable, never by the',
        '   letter it had in the spreadsheet it came from. */',
        'export const COLS = [',
    ]
    for _, clave, rotulo, tipo in COLUMNAS:
        L.append(f'  [{j(clave)}, {j(rotulo)}, {j(tipo)}],')
    L += [
        '];',
        '',
        '/* The ten columns session 3 audits. Passed as `pick` so that session keeps',
        '   showing its own table and not the seventeen columns it never used. */',
        'export const COLS_S03 = ' + j([c[1] for c in COLUMNAS[:10]]) + ';',
        '',
        '/* Letters by type, for the session that has to know which columns a PCA can',
        '   even look at. */',
        'export const CUANTITATIVAS = ' + j([c[1] for c in COLUMNAS if c[3] == 'num']) + ';',
        'export const ORDINALES = ' + j([c[1] for c in COLUMNAS if c[3] == 'ord']) + ';',
        'export const CATEGORICAS = ' + j([c[1] for c in COLUMNAS if c[3] == 'cat']) + ';',
        '',
        '/* The levels of an ordinal column, in their order, where sorting them does not',
        '   give it. A rank read in the wrong order is worse than one with no order. */',
        'export const ORDEN_NIVELES = ' + j(ORDEN_NIVELES) + ';',
        '',
        '/* How each variable is written for a person to read, where that is not its key.',
        '   Resolve it through nombre() in src/data/nombres.js — never by reaching in here,',
        '   or the next figure will invent its own answer. */',
        'export const NOMBRES = ' + j(NOMBRES) + ';',
        '',
        '/* The columns computed from the form instead of copied from it, with the rule',
        '   that produces each one. Everything else in ROWS is verbatim, so an exception',
        '   only counts as auditable if it is declared here. */',
        'export const DERIVADAS = ' + j(DERIVADAS) + ';',
        '',
        '/* What is NOT published, and why. */',
        'export const EXCLUIDAS = ' + j([[e[0], e[1], e[2]] for e in EXCLUIDAS]) + ';',
        '',
        '/* How many columns the source form has, so a panel can say «31 de 34» without',
        '   either number being typed into a sentence. */',
        'export const COLS_FORMULARIO = ' + j(len(COLUMNAS) + len(EXCLUIDAS)) + ';',
        '',
        'export const ROWS = [',
    ]
    for fila in tabla:
        L.append('  [' + ', '.join(j(v) for v in fila) + '],')
    L += [
        '];',
        '',
        '/* The four means of column F, one per cleaning decision. Session 3, block 2. */',
        'export const MEDIAS = {',
    ]
    for clave, valor in m.items():
        L.append(f'  {clave}: {redondear(valor)},')
    L += ['};', '']

    for nombre, comentario, datos in s04:
        L.append(comentario)
        L.append(f'export const {nombre} = {{')
        for clave, valor in datos.items():
            L.append(f'  {clave}: {j(valor)},')
        L += ['};', '']

    L += [
        '/* What sessions 3 and 4 used to state in prose or label inside a figure.',
        '   Counted here so that a regenerated table cannot leave a stale «13 of 23». */',
        'export const RECUENTOS = {',
    ]
    for clave, valor in rec.items():
        L.append(f'  {clave}: {j(valor)},')
    L += ['};', '']
    return '\n'.join(L)


def main():
    ruta = sys.argv[1] if len(sys.argv) > 1 else XLSX
    if not os.path.exists(ruta):
        sys.exit(f'no encuentro el .xlsx en {ruta}')

    hoja = celdas(ruta)
    filas_xlsx = sorted({f for f, _ in hoja})[1:]          # row 1 is the headers
    tabla = [[derivado(clave, limpio(hoja.get((f, col), '')))
              for col, clave, _, _ in COLUMNAS]
             for f in filas_xlsx]
    idx = {clave: n for n, (_, clave, _, _) in enumerate(COLUMNAS)}
    col = lambda clave: [f[idx[clave]] for f in tabla]

    num = lambda clave: [float(x) for x in col(clave) if x != '']
    minutos = num('minutos')
    m = medias_de_limpieza(col('minutos'))
    rec = recuentos(tabla, idx)

    s04 = [
        ('MINUTOS',
         '/* Column F — minutos de celular ayer, on the answers that are not empty. */',
         resumen(minutos)),
        ('MINUTOS_SIN',
         '/* Column F again, with the 960 set aside. The pair MINUTOS / MINUTOS_SIN is\n'
         '   the robustness demo: the mean moves, the median does not. */',
         resumen([x for x in minutos if x != max(minutos)])),
        ('BALANCEADA',
         '/* Column H — «alimentación balanceada, 1–5». Ordinal, and typed as such: session 4\n'
         '   shows these figures in order to argue that the mean of them means nothing. It is\n'
         '   also why session 6 runs neither the boxplot rule nor a PCA over this column. */',
         resumen(num('balanceada'))),
        ('PORCIONES',
         '/* Column G — porciones de fruta y verdura. Small honest counts. */',
         resumen(num('porciones'))),
    ]

    # What the panels claim on screen. If the .xlsx changes, this fails here and
    # not in front of the class.
    codigos = col('codigo')
    assert len(tabla) == 27, f'esperaba 27 respuestas, hay {len(tabla)}'
    assert len(COLUMNAS) == 31, f'esperaba 31 columnas publicadas, hay {len(COLUMNAS)}'
    assert len(EXCLUIDAS) == 3, f'esperaba 3 columnas excluidas, hay {len(EXCLUIDAS)}'
    # Every letter of the form accounted for exactly once. Stronger than comparing the
    # two lengths against 34: that would still pass if a letter were published AND
    # excluded, or if one were dropped and another duplicated.
    letras = [c[0] for c in COLUMNAS] + [e[0] for e in EXCLUIDAS]
    assert len(letras) == 34, f'las 34 columnas del formulario no cuadran: {len(letras)}'
    assert len(set(letras)) == 34, 'hay una columna del formulario contada dos veces'
    # A derived column occupies the letter it derives from, so that letter is not
    # published raw and is not free for anything else.
    for clave, d in DERIVADAS.items():
        assert any(c[0] == d['de'] and c[1] == clave for c in COLUMNAS), \
            f'{clave} dice derivarse de {d["de"]}, pero no ocupa esa columna'
    # Everything that is NOT declared derived is verbatim. This is session 3's golden
    # rule, and now that there is one exception it has to be checked rather than trusted.
    for n, (letra, clave, _, _) in enumerate(COLUMNAS):
        if clave in DERIVADAS:
            continue
        for f, fila in zip(filas_xlsx, tabla):
            assert fila[n] == limpio(hoja.get((f, letra), '')), \
                f'{clave} no coincide con el .xlsx en la fila {f}'
    assert set(NOMBRES) <= {c[1] for c in COLUMNAS}, \
        'se declaró el nombre de pantalla de una columna que no se publica'
    assert not any(k == v for k, v in NOMBRES.items()), \
        'una columna declara un nombre de pantalla igual a su clave: sobra'
    assert set(ORDEN_NIVELES) <= {c[1] for c in COLUMNAS if c[3] == 'ord'}, \
        'se declaró el orden de una columna que no es ordinal'
    for clave, orden in ORDEN_NIVELES.items():
        assert set(orden) >= {v for v in col(clave) if v != ''}, \
            f'el orden declarado de {clave} no cubre todos sus niveles'
    assert len({c[1] for c in COLUMNAS}) == len(COLUMNAS), 'hay un nombre repetido'
    assert not any(re.fullmatch(r'[A-Z]{1,2}', c[1]) for c in COLUMNAS), \
        'una columna se sigue llamando como en la hoja de cálculo'
    assert codigos.count('9999') == 2, 'el código 9999 debería estar repetido'
    assert '1234' in codigos, 'falta el código 1234'
    assert rec['pantallaImposibles'] == [1], 'el imposible de pantalla es la fila 1'
    assert rec['minutosAtipico'] == [16], 'el 960 debería seguir en la fila 16'
    assert len(rec['minutosEnHoras']) == 7, 'esperaba 7 respuestas en horas'
    assert any('−' in s for s in col('sangre')), 'falta el O− con menos tipográfico'
    assert sum(1 for c in COLUMNAS if c[3] == 'num') >= 4, 'hacen falta 4 cuantitativas'
    assert sum(1 for c in COLUMNAS if c[3] == 'cat') >= 4, 'hacen falta 4 categóricas'
    assert {c[3] for c in COLUMNAS} <= {'num', 'ord', 'cat'}, 'tipo desconocido'

    with open(SALIDA, 'w', encoding='utf-8') as fh:
        fh.write(emitir(tabla, m, s04, rec))

    tipos = {t: sum(1 for c in COLUMNAS if c[3] == t) for t in ('num', 'ord', 'cat')}
    print(f'{len(tabla)} filas × {len(COLUMNAS)} columnas '
          f'({tipos["num"]} cuantitativas, {tipos["ord"]} ordinales, '
          f'{tipos["cat"]} categóricas) → {os.path.relpath(SALIDA, RAIZ)}')
    print(f'{len(EXCLUIDAS)} columnas excluidas por reidentificación: '
          + ', '.join(c[0] for c in EXCLUIDAS))
    for clave, valor in m.items():
        print(f'  {clave:16} {valor:7.1f} min')
    print(f'  Bogotá {rec["bogota"]}/{rec["filas"]} · '
          f'pantalla {rec["pantallaVacias"]} vacías · '
          f'minutos {rec["minutosVacias"]} vacías')


if __name__ == '__main__':
    main()
