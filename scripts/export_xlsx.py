#!/usr/bin/env python3
"""Publish the cleaned class table as a spreadsheet, with its log beside it.

Writes src/data/salon_limpio.xlsx with three sheets:

  crudo      the answers exactly as they arrived. Never edited, never reordered.
  limpio     the same table after session 6's chain: text standardised, one value
             corrected by hand, holes and flagged outliers filled.
  bitacora   one row per decision taken to get from the first sheet to the second.

The third sheet is the point of the file. Session 3's golden rule is that cleaning
is not correcting a table, it is writing another one beside it AND leaving a record
of how you got from one to the other — and a record that lives only in a Python
script is not a record the class can read. Every row says what was done, to which
variable, to which rows, what the value was before and after, and why.

Columns are named by their variable, here too. The letters across the top of a
spreadsheet are the spreadsheet's, not the data's.

No dependencies: an .xlsx is a zip with XML inside, and the stdlib writes that as
happily as it reads it. It does not need the virtualenv — it reads the two
generated modules, not the .xlsx the form produced, so anybody can rebuild this
file without installing feature-engine.

    python3 scripts/export_xlsx.py
"""

import os
import re
import sys
import zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)

import extract_salon as src              # noqa: E402  (needs sys.path first)

CRUDO = os.path.join(RAIZ, 'src', 'data', 'salon.js')
LIMPIO = os.path.join(RAIZ, 'src', 'data', 'salon_limpio.js')
SALIDA = os.path.join(RAIZ, 'src', 'data', 'salon_limpio.xlsx')


def esc(v):
    return (str(v).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            .replace('"', '&quot;'))


def letra(i):
    """0 → A, 25 → Z, 26 → AA. The spreadsheet's own column names."""
    s = ''
    while True:
        s = chr(ord('A') + i % 26) + s
        i = i // 26 - 1
        if i < 0:
            return s


def hoja(filas, negritas_primera=True):
    """Una hoja, con todo como texto en línea.

    Inline strings instead of a shared-strings table: it costs a few kilobytes and
    saves a whole file of indirection that nothing here needs.
    """
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
           '<sheetData>']
    for n, fila in enumerate(filas, 1):
        celdas = []
        for i, v in enumerate(fila):
            if v is None or v == '':
                continue                       # an empty cell is left EMPTY, not ""
            estilo = ' s="1"' if n == 1 and negritas_primera else ''
            celdas.append(
                f'<c r="{letra(i)}{n}" t="inlineStr"{estilo}>'
                f'<is><t xml:space="preserve">{esc(v)}</t></is></c>')
        out.append(f'<row r="{n}">' + ''.join(celdas) + '</row>')
    out += ['</sheetData>', '</worksheet>']
    return ''.join(out)


ESTILOS = '''<?xml version="1.0" encoding="UTF-8"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>
</styleSheet>'''


# A zip stores a modification time per entry, so writing the same content twice
# would produce two different files and every regeneration would show up as a diff
# in a versioned binary. Pinning it makes the bytes depend on the content and on
# nothing else, which is what the other two generated files already guarantee.
EPOCA = (1980, 1, 1, 0, 0, 0)


def escribir(ruta, hojas):
    """hojas: [(nombre, [fila, …]), …] → un .xlsx."""
    tipos = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
             '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
             '<Default Extension="xml" ContentType="application/xml"/>',
             '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
             '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>']
    libro = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
             ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
             '<sheets>']
    rels = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">']

    for i, (nombre, _) in enumerate(hojas, 1):
        tipos.append(f'<Override PartName="/xl/worksheets/sheet{i}.xml" '
                     'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
        libro.append(f'<sheet name="{esc(nombre)}" sheetId="{i}" r:id="rId{i}"/>')
        rels.append(f'<Relationship Id="rId{i}" '
                    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
                    f'Target="worksheets/sheet{i}.xml"/>')
    n = len(hojas) + 1
    rels.append(f'<Relationship Id="rId{n}" '
                'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" '
                'Target="styles.xml"/>')
    tipos.append('</Types>')
    libro += ['</sheets>', '</workbook>']
    rels.append('</Relationships>')

    partes = [
        ('[Content_Types].xml', ''.join(tipos)),
        ('_rels/.rels',
         '<?xml version="1.0" encoding="UTF-8"?>'
         '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
         '<Relationship Id="rId1" '
         'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
         'Target="xl/workbook.xml"/></Relationships>'),
        ('xl/workbook.xml', ''.join(libro)),
        ('xl/_rels/workbook.xml.rels', ''.join(rels)),
        ('xl/styles.xml', ESTILOS),
    ]
    for i, (_, filas) in enumerate(hojas, 1):
        partes.append((f'xl/worksheets/sheet{i}.xml', hoja(filas)))

    with zipfile.ZipFile(ruta, 'w', zipfile.ZIP_DEFLATED) as z:
        for nombre, contenido in partes:
            info = zipfile.ZipInfo(nombre, EPOCA)
            # A ZipInfo built by hand carries compress_type=ZIP_STORED, which quietly
            # overrides the archive's own ZIP_DEFLATED: without this line the file
            # comes out ten times bigger, and nothing complains.
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, contenido)


CABECERA = ['paso', 'operación', 'variable', 'filas', 'antes', 'después',
            'cuántas', 'por qué', '¿se puede deshacer?']


def bitacora(crudo, limpio):
    """Una fila por decisión, en el orden en que se tomaron.

    Written so that somebody who was not in the room can reconstruct what happened
    to every cell, and disagree with it: «por qué» is a column because a cleaning
    decision without its reason is the thing session 3 spends three hours arguing
    against.
    """
    E = lambda t, n: src.exportado(t, n)
    COLS = E(crudo, 'COLS')
    RECUENTOS = E(crudo, 'RECUENTOS')
    TEXTO, ANTES = E(limpio, 'TEXTO'), E(limpio, 'ANTES')
    DIAG, NO_ANALIZABLES = E(limpio, 'DIAGNOSTICO'), E(limpio, 'NO_ANALIZABLES')
    UMBRALES, FORMAS = E(limpio, 'UMBRALES'), E(limpio, 'FORMAS')
    ORDINALES = E(limpio, 'ORDINALES')
    CAJAS, RAROS = E(limpio, 'CAJAS'), E(limpio, 'RAROS')
    DESCARTADA, IMPUTADAS = E(limpio, 'DESCARTADA'), E(limpio, 'IMPUTADAS')
    ANALIZADAS = E(limpio, 'ANALIZADAS')
    PCA, SEMILLA = E(limpio, 'PCA'), E(limpio, 'SEMILLA')
    rotulo = {c[0]: c[1] for c in COLS}

    f = []

    # ── 0 · lo que se derivó antes de limpiar nada ──────────────────────────
    # The one column that is not a copy of a form cell. It goes first because it
    # happens before the chain, and it goes in at all because a value that is not
    # what somebody typed is exactly the kind of thing this log exists for.
    for clave, d in src.DERIVADAS.items():
        f.append(['0 · derivar', 'calcular la variable a partir de otra', src.nombre(clave), 'todas',
                  d['pregunta'], d['regla'], len(E(crudo, 'ROWS')), d['motivo'],
                  'sí: la regla está publicada y es reversible sabiendo el año de captura'])

    tratamientos = [
        ('recorte', 'recortar espacios de los extremos'),
        ('tildes', 'quitar tildes'),
        ('minusculas', 'pasar a minúsculas'),
        ('vacias', 'quitar palabras vacías'),
    ]

    # ── 1 · el texto ────────────────────────────────────────────────────────
    # Only the treatments that DID something get a row, plus the ones deliberately
    # not applied — that skip is a decision and belongs in a log. The four
    # treatments run over sixteen variables, and logging all sixty-four would bury
    # the dozen that matter under fifty rows saying «nothing happened».
    intactas = []
    for clave, t in TEXTO.items():
        previo, movio = t['crudo'], False
        for (nombre, descripcion), (_, cuantas) in zip(tratamientos, t['pasos']):
            if nombre == 'vacias' and not t['conStopwords']:
                f.append(['1 · texto', 'NO quitar las palabras vacías', src.nombre(clave), 'todas',
                          f'{previo} categorías', f'{previo} categorías', 0,
                          'es una opción cerrada, y quitarle una palabra le cambia el '
                          'sentido: «Negro, sin azúcar» sin el «sin» es otra respuesta',
                          'no procede'])
                movio = True
                continue
            if cuantas != previo:
                f.append(['1 · texto', descripcion, src.nombre(clave), 'todas', f'{previo} categorías',
                          f'{cuantas} categorías', previo - cuantas,
                          'dos escrituras del mismo valor dejaban de contarse juntas',
                          'sí: la hoja «crudo» conserva el valor original'])
                movio = True
            previo = cuantas
        if not movio:
            intactas.append(clave)
    if intactas:
        f.append(['1 · texto', 'los cuatro tratamientos, sin efecto',
                  ', '.join(intactas), 'todas', '—', 'sin cambios', 0,
                  'ya venían escritas de una sola manera: son opciones cerradas de un '
                  'formulario, no texto que alguien tecleara', 'no procede'])

    # ── 2 · la corrección a mano ────────────────────────────────────────────
    for valor, cuantas, motivo in RECUENTOS['bogotaCorregidos']:
        filas = [i for i, fila in enumerate(E(crudo, 'ROWS'), 1)
                 if fila[[c[0] for c in COLS].index('municipio')] == valor]
        f.append(['2 · a mano', 'corregir un valor que ninguna regla encuentra',
                  'municipio', ', '.join(map(str, filas)), valor, 'Bogotá', cuantas,
                  motivo, 'sí: la hoja «crudo» conserva el valor original'])

    # ── 3 · los atípicos ────────────────────────────────────────────────────
    for clave, caja in CAJAS.items():
        q = caja['1.5']
        f.append(['3 · atípicos', 'marcar con la regla del diagrama de caja', clave,
                  ', '.join(map(str, caja['filas'])) or '—',
                  f"corte en {q['corteBajo']} y {q['corteAlto']}",
                  ', '.join(map(str, q['atipicos'])) or 'ninguno',
                  len(q['atipicos']),
                  f"Q1−1,5·RIC y Q3+1,5·RIC. Con 3·RIC en vez de 1,5 serían "
                  f"{len(caja['3.0']['atipicos'])}: el umbral es una decisión, no un hecho",
                  'sí: marcar no borra nada'])

    # ── 3b · el diagnóstico de lo que no es un número ───────────────────────
    for clave, d in DIAG.items():
        f.append(['3b · no numéricas', 'diagnosticar la forma de su reparto', src.nombre(clave),
                  'todas',
                  f"{d['nivelesCrudo']} niveles",
                  f"{d['niveles']} niveles, forma «{d['forma']}»",
                  d['nivelesCrudo'] - d['niveles'],
                  f"el mayor lo eligieron {d['mayor']} personas y {d['solos']} niveles los "
                  f"eligió una sola; {FORMAS[d['forma']]}", 'no procede'])

    for clave, r in RAROS.items():
        # The reason a column skips the boxplot rule is not the same for a rank as
        # for a name, and writing «es un orden» over fourteen categories would be
        # a log that lies in fourteen rows.
        motivo = ('es un orden y no una cantidad: los extremos de una escala acotada son '
                  'respuestas válidas por construcción, no anomalías'
                  if clave in ORDINALES else
                  'es un nombre y no una cantidad: no hay distancia a una media que medir, '
                  'así que no hay nada que pueda quedar lejos')
        f.append(['3b · no numéricas', 'NO aplicar la regla del diagrama de caja', src.nombre(clave),
                  'todas', '—', '—', 0, motivo, 'no procede'])
        if r.get('extremosDevueltos'):
            f.append(['3b · no numéricas', 'NO agrupar los extremos del orden', clave,
                      'todas', ', '.join(r['extremosDevueltos']),
                      'se conservan como nivel propio', len(r['extremosDevueltos']),
                      'en un orden acotado los extremos son respuestas válidas por '
                      'construcción, no rarezas: agruparlos diría que el extremo de la '
                      'escala es una anomalía',
                      'no procede: es una excepción declarada, no una modificación'])
        f.append(['3b · no numéricas', 'agrupar los niveles poco frecuentes', src.nombre(clave), 'todas',
                  f"{r['niveles']} niveles",
                  f"{r['frecuentes']} + «{r['etiqueta']}»" if r['agrupados']
                  else f"{r['frecuentes']} niveles, sin cambios",
                  len(r['agrupados']),
                  (f"por debajo de {r['tol'] * 100:.0f} % de la clase ({r['minimo']} personas) "
                   f"un nivel no se sostiene solo; se agrupó {', '.join(r['agrupados'])}")
                  if r['agrupados'] else
                  (f"ningún nivel quedaba por debajo de {r['tol'] * 100:.0f} % de la clase "
                   f"({r['minimo']} personas): el tratamiento se aplicó y no cambió nada"),
                  'sí: la hoja «crudo» conserva el nivel original'])

    # ── 4 · las descartadas, por dos motivos distintos ──────────────────────
    for clave, d in NO_ANALIZABLES.items():
        f.append(['4 · descarte', 'dejar la variable fuera por no ser una categoría',
                  src.nombre(clave), 'todas', f"{d['niveles']} niveles", 'no entra', d['niveles'],
                  d['motivo'], 'sí: la variable sigue publicada en las dos hojas'])

    for clave, d in DESCARTADA.items():
        f.append(['4 · descarte', 'dejar la variable fuera del análisis', src.nombre(clave), 'todas',
                  f"{d['filas']} valores", 'no entra', d['perdidos'],
                  f"{d['huecos']} huecos + {d['atipicos']} atípicos = {d['perdidos']} de "
                  f"{d['filas']} ({d['porcentaje']} %). {d['motivo']}",
                  'sí: la variable sigue publicada en las dos hojas'])

    # ── 5 · la imputación ───────────────────────────────────────────────────
    ROWS = E(crudo, 'ROWS')
    orden = [c[0] for c in COLS]
    # Every column that went through the imputer, not just the quantities: a hole in
    # «musica» gets a genre somebody listens to, and that is as much an invented value
    # as a made-up number. The log would be lying by omission if it only kept the ones
    # that happen to be numbers.
    for clave in IMPUTADAS:
        imp = IMPUTADAS[clave]
        if not imp['filas']:
            continue
        for fila in imp['filas']:
            previo = ROWS[fila - 1][orden.index(clave)]
            f.append(['5 · relleno', 'rellenar muestreando la propia variable', clave,
                      str(fila), previo if previo != '' else '(vacía)',
                      imp['valores'][str(fila)], 1,
                      'sin respuesta' if previo == '' else
                      'marcada como atípica en el paso 3; se convierte en hueco y se '
                      'rellena igual, para no perder las otras respuestas de esa fila',
                      'sí: la hoja «crudo» conserva la celda como llegó'])
        respuestas = (f"{ANTES[clave]['n']} respuestas" if clave in ANTES
                      else f"{len(ROWS) - len(imp['filas'])} respuestas")
        f.append(['5 · relleno', 'resumen de la variable', clave,
                  ', '.join(map(str, imp['filas'])),
                  respuestas, f"{len(ROWS)} valores",
                  len(imp['filas']),
                  f"{imp['proporcion']} % de la variable quedó inventado. "
                  f"Azar fijado con la semilla {SEMILLA}: sin fijarlo, cada ejecución "
                  'daría valores distintos', 'sí'])

    # ── 6 · qué entró al análisis ───────────────────────────────────────────
    dentro = [v[0] for v in PCA['variables']]
    for clave, rot, tipo in COLS:
        if clave in dentro:
            continue
        motivo = ('es categórica: el análisis opera sobre varianzas y una categoría no tiene'
                  if tipo == 'cat' else
                  'es un orden: sus niveles se ordenan pero no se suman, y una varianza es una suma'
                  if tipo == 'ord' else
                  'descartada por la calidad del dato (ver paso 4)')
        f.append(['6 · análisis', 'dejar fuera del PCA', src.nombre(clave), 'todas', '—', 'no entra',
                  0, motivo, 'no procede'])
    MARCAS = E(limpio, 'MARCAS')
    con_marca = [c for c in ANALIZADAS if MARCAS[c]['total']]
    f.append(['5 · relleno', 'marcar las celdas antes de rellenarlas',
              ', '.join(src.nombre(c) for c in con_marca), 'todas', 'sin marca',
              'una columna «<variable>_na» por variable con celdas inventadas',
              sum(MARCAS[c]['total'] for c in con_marca),
              'una vez rellenada, dentro de la columna un valor inventado y uno medido '
              'son el mismo número: la marca es lo único que conserva la diferencia',
              'sí: las marcas son columnas aparte y se pueden ignorar'])
    f.append(['6 · análisis', 'analizar componentes principales', ', '.join(src.nombre(c) for c in dentro),
              'todas', f"{len(dentro)} variables",
              f"{PCA['acumulado'][1]} % en dos componentes", len(dentro),
              'estandarizando: una variable está en minutos y otra en mascotas, y sin '
              'estandarizar la primera componente sería la de mayor varianza absoluta',
              'no procede'])
    return f


def main():
    crudo = open(CRUDO, encoding='utf-8').read()
    limpio = open(LIMPIO, encoding='utf-8').read()
    E = lambda t, n: src.exportado(t, n)

    COLS, ROWS = E(crudo, 'COLS'), E(crudo, 'ROWS')
    RECUENTOS = E(crudo, 'RECUENTOS')
    TABLA, IMPUTADAS = E(limpio, 'TABLA'), E(limpio, 'IMPUTADAS')
    RAROS, DESCARTADA = E(limpio, 'RAROS'), E(limpio, 'DESCARTADA')
    orden = [c[0] for c in COLS]
    # The same name the wall shows. Otherwise a student opens the file, reads «erre» in the
    # header and has to work out that it is the R the class was talking about.
    escrito = [src.nombre(c) for c in orden]

    # ── hoja «crudo» ────────────────────────────────────────────────────────
    h_crudo = [['fila'] + escrito]
    for n, fila in enumerate(ROWS, 1):
        h_crudo.append([n] + list(fila))

    # ── hoja «limpio» ───────────────────────────────────────────────────────
    # Straight from LIMPIA, which the chain publishes. This sheet used to rebuild the
    # clean table here, column by column, from three different exports — which meant
    # the file handed to the class and the table shown on the wall were two
    # reconstructions of the same thing and could drift apart. Now there is one.
    #
    # Every column keeps its place: a variable that did not enter the analysis is
    # still here, with its values, so the two sheets line up cell for cell.
    LIMPIA, ORDEN_COLS = E(limpio, 'LIMPIA'), E(limpio, 'ORDEN_COLS')
    MARCAS, DESTINO = E(limpio, 'MARCAS'), E(limpio, 'DESTINO')
    assert ORDEN_COLS == orden, 'la tabla limpia no lleva el mismo orden que COLS'

    # The markers go at the END, all together, not interleaved with the variables:
    # they are a record of what the chain did, not more answers from the class.
    marcadas = [c for c in orden if c in MARCAS and MARCAS[c]['total']]
    h_limpio = [['fila'] + escrito
                + [f'{src.nombre(c)}_na' for c in marcadas]]
    for n, fila in enumerate(LIMPIA, 1):
        h_limpio.append([n] + list(fila)
                        + [1 if n in MARCAS[c]['filas'] else 0 for c in marcadas])

    filas_bit = bitacora(crudo, limpio)
    # No date here on purpose: it would change the file every day for no reason, and
    # this one is versioned. When the capture is from lives in src/data/PROCEDENCIA.txt.
    encabezado = [
        ['Dataset del salón · tabla limpia y bitácora'],
        ['Generado por scripts/export_xlsx.py. No se edita a mano. '
         'La fecha de la captura está en src/data/PROCEDENCIA.txt.'],
        ['La hoja «crudo» es intocable: es la única prueba de qué se preguntó y qué se contestó.'],
        [f'{len(ROWS)} respuestas · {len(COLS)} variables · '
         f'{sum(len(v["filas"]) for v in IMPUTADAS.values())} celdas imputadas · '
         f'{len(DESCARTADA)} variable descartada'],
        ['Las columnas «<variable>_na» de la hoja «limpio» valen 1 donde el valor '
         'no lo dio nadie: la celda estaba vacía, o la regla del diagrama de caja '
         'descartó lo que había. No son respuestas; son el registro de qué se inventó.'],
        [],
        CABECERA,
    ]

    escribir(SALIDA, [('crudo', h_crudo), ('limpio', h_limpio),
                      ('bitacora', encabezado + filas_bit)])

    print(f'{len(ROWS)} filas × {len(COLS)} variables → '
          f'{os.path.relpath(SALIDA, RAIZ)} ({os.path.getsize(SALIDA) // 1024} KB)')
    print(f'  hoja «crudo»     {len(h_crudo) - 1} filas, como llegaron')
    print(f'  hoja «limpio»    {len(h_limpio) - 1} filas, tras la cadena de la sesión 6')
    print(f'  hoja «bitacora»  {len(filas_bit)} decisiones registradas')
    pasos = {}
    for fila in filas_bit:
        pasos[fila[0]] = pasos.get(fila[0], 0) + 1
    for paso, n in pasos.items():
        print(f'      {paso:<14} {n}')


if __name__ == '__main__':
    main()
