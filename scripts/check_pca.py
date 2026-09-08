#!/usr/bin/env python3
"""Check that src/sessions/s05/data/paises.js still says what the source says.

The percentages of explained variance end up projected on a wall, and nobody in
the room can audit them by looking. This does it in two independent ways:

  1. Reads the csv files again and recomputes everything, comparing value by
     value. Catches a hand-edited file and a file left behind by a change in
     the source or in the extractor.

  2. Checks the published numbers on their own terms, without recomputing:
     CORR·v = λv for every eigenvector, eigenvectors orthonormal, loadings
     equal to eigenvector times the square root of its eigenvalue, percentages
     adding to a hundred. Catches an error in the algebra itself -- which (1)
     cannot, because it would repeat it.

No dependencies, no network: it reads two files off the disk. Exits 1 on the
first difference so it can sit in front of a commit.

    python3 scripts/check_pca.py [path/to/gapminder-data]
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import extract_gapminder as src          # noqa: E402  (needs sys.path first)

# Comparing the file against a fresh run is exact: both sides round the same way,
# so any difference is an edit or a drift, never arithmetic. A percentage edited
# from 77.23 to 77.24 moves by exactly 0.01, and a tolerance of 0.01 let it
# through -- which is how this number stopped being a matter of taste.
EXACT = 1e-9
# Checking the published numbers against each other is not: they are stored
# rounded to four decimals, and that rounding propagates through v·√λ.
TOL = 1e-3
# Percentages are stored to two decimals and rebuilt from eigenvalues stored to
# four, so half a step of the coarser rounding is expected and means nothing.
# The exact comparison above is what catches an edited percentage.
PCT = 0.006
GENERATED = os.path.join(ROOT, 'src', 'sessions', 's05', 'data', 'paises.js')


def round_as_published(value, key):
    """A value rounded the way the generated file shows it.

    The analysis runs on these, not on the raw csv figures, and that is the
    point: the percentages on the wall have to be recomputable from the numbers
    the file publishes. Rounding afterwards would leave a table nobody can
    check against its own components.
    """
    v = round(value, src.ROUNDING[key])
    return int(v) if src.ROUNDING[key] == 0 else v


def load_module(path):
    """The exports of the generated file, as Python values.

    It is JavaScript, so json cannot read it directly: block comments, unquoted
    keys and trailing commas have to go first. The file is written by
    extract_gapminder.py and its shape is known, which is what makes this
    twenty lines instead of a parser.
    """
    text = open(path, encoding='utf-8').read()
    out = {}
    for name, body in re.findall(r'export const (\w+) = (.*?);\n', text, re.S):
        body = re.sub(r'/\*.*?\*/', '', body, flags=re.S)
        body = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', body)
        body = re.sub(r',(\s*[}\]])', r'\1', body)
        out[name] = json.loads(body)
    return out


def close(a, b, tol=EXACT):
    return abs(a - b) <= tol


def compare(label, got, want, problems, tol=EXACT):
    """Compares two nested structures of numbers, reporting the first mismatch."""
    if isinstance(want, list):
        if len(got) != len(want):
            problems.append(f'{label}: {len(got)} elementos, esperaba {len(want)}')
            return
        for i, (g, w) in enumerate(zip(got, want)):
            compare(f'{label}[{i}]', g, w, problems, tol)
    elif isinstance(want, (int, float)) and not isinstance(want, bool):
        if not close(float(got), float(want), tol):
            problems.append(f'{label}: {got} ≠ {want} (Δ {abs(float(got) - float(want)):.4f})')
    elif got != want:
        problems.append(f'{label}: {got!r} ≠ {want!r}')


def main():
    data = sys.argv[1] if len(sys.argv) > 1 else src.DATA
    if not os.path.isdir(data):
        sys.exit(f'no encuentro los csv en {data}')
    if not os.path.exists(GENERATED):
        sys.exit('falta paises.js — ejecuta antes scripts/extract_gapminder.py')

    mod = load_module(GENERATED)
    problems = []
    keys = [k for k, _, _, _, _ in src.INDICATORS]

    # ── 1. Recompute from the csv files ──────────────────────────────
    countries = src.read_countries(os.path.join(data, 'geo.csv'))
    series = {k: src.read_series(os.path.join(data, slug + '.csv'), slug, src.YEAR)
              for k, slug, _, _, _ in src.INDICATORS}
    complete = set(countries)
    for k in keys:
        complete &= set(series[k])

    published = {row[0]: row for row in mod['PAISES']}
    if set(published) != complete:
        only_file = sorted(set(published) - complete)
        only_csv = sorted(complete - set(published))
        problems.append(f'países: {len(only_file)} solo en el archivo {only_file[:5]}, '
                        f'{len(only_csv)} solo en los csv {only_csv[:5]}')

    for geo in sorted(complete & set(published)):
        for i, k in enumerate(keys):
            want = round(series[k][geo], src.ROUNDING[k])
            want = int(want) if src.ROUNDING[k] == 0 else want
            got = published[geo][3 + i]
            if not close(float(got), float(want), 0.001):
                problems.append(f'{geo}.{k}: {got} ≠ {want}')

    # Same rows, in the same order, as the extractor built them. Jacobi sums the
    # covariance entries in whatever order the rows come, and floating point is
    # not associative: reading the countries by code instead of by name moved the
    # fourth decimal of several eigenvectors. The numbers were not wrong, but a
    # check that has to allow for that noise can no longer see a small edit.
    rows = [[geo, src.ES.get(countries[geo][0], countries[geo][0]), countries[geo][1]]
            + [round_as_published(series[k][geo], k) for k in keys]
            for geo in complete]
    rows.sort(key=lambda r: r[1])
    field = {k: 3 + i for i, k in enumerate(keys)}

    for k in keys:
        col = [r[field[k]] for r in rows]
        mean, sd = src.moments(col)
        compare(f'ESTAD.{k}.media', mod['ESTAD'][k]['media'], round(mean, 2), problems)
        compare(f'ESTAD.{k}.desv', mod['ESTAD'][k]['desv'], round(sd, 2), problems)

    z = src.standardize([[r[field[k]] for r in rows] for k in keys])
    again_corr = [[round(x, 4) for x in row] for row in src.correlation(z)]
    compare('CORR', mod['CORR'], again_corr, problems)

    for name, subset in (('PCA3', src.CLOUD), ('PCA4', tuple(keys))):
        again = src.pca(rows, subset, field)
        again.pop('_raw', None)
        for part in ('vars', 'valores', 'porcentajes', 'vectores', 'cargas'):
            compare(f'{name}.{part}', mod[name][part], again[part], problems)

    # ── 2. Check the published numbers on their own terms ─────────────
    corr = mod['CORR']
    for name in ('PCA3', 'PCA4'):
        a = mod[name]
        idx = [keys.index(v) for v in a['vars']]
        sub = [[corr[i][j] for j in idx] for i in idx]
        n = len(idx)

        for lam, vec in zip(a['valores'], a['vectores']):
            for i in range(n):
                av = sum(sub[i][k] * vec[k] for k in range(n))
                if not close(av, lam * vec[i], 1e-3):
                    problems.append(f'{name}: Av ≠ λv en la fila {i} ({av:.4f} vs {lam * vec[i]:.4f})')
        for i, vi in enumerate(a['vectores']):
            for j, vj in enumerate(a['vectores']):
                dot = sum(x * y for x, y in zip(vi, vj))
                if not close(dot, 1.0 if i == j else 0.0, 1e-3):
                    problems.append(f'{name}: vectores {i} y {j} no ortonormales ({dot:.4f})')
        for i in range(n):
            for j in range(n):
                want = a['vectores'][j][i] * a['valores'][j] ** 0.5
                if not close(a['cargas'][i][j], want, 1e-3):
                    problems.append(f'{name}: carga [{i}][{j}] no es v·√λ')
        total = sum(a['valores'])
        for j, lam in enumerate(a['valores']):
            if not close(a['porcentajes'][j], 100 * lam / total, PCT):
                problems.append(f'{name}: porcentaje {j} no cuadra con su autovalor')
        if not close(sum(a['porcentajes']), 100, 4 * PCT):
            problems.append(f'{name}: los porcentajes suman {sum(a["porcentajes"])}')

    # ── Report ───────────────────────────────────────────────────────
    print(f'paises.js contra {os.path.relpath(data, ROOT)} · año {mod["ANIO"]}')
    print(f'  {len(published)} países, {len(keys)} indicadores')
    if problems:
        print(f'\n  {len(problems)} DIFERENCIAS:')
        for p in problems[:20]:
            print(f'    {p}')
        if len(problems) > 20:
            print(f'    … y {len(problems) - 20} más')
        return 1
    print('  valores, ESTAD y CORR idénticos al recálculo')
    print('  PCA3 y PCA4: autovalores, porcentajes, vectores y cargas idénticos')
    print('  álgebra del archivo: Av = λv, vectores ortonormales, cargas = v·√λ')
    print('OK')
    return 0


if __name__ == '__main__':
    sys.exit(main())
