#!/usr/bin/env python3
"""Generate the rain example session 7 opens with, and the CA of its table.

Declares — it does not measure — a year of invented days, crossed by the sky of one day
against the sky of the next, and writes src/sessions/s07/data/lluvia.js with:

  ESTADOS     the three states of the sky, in the order the wall reads them.
  TABLA       the cross table «hoy × mañana»: counts, margins, total.
  PERFILES    row and column profiles — the conditional probabilities, P(mañana | hoy)
              and P(hoy | mañana).
  ESPERADAS   the table the two days would give if they were independent.
  CHI2        the chi-square cell by cell, its total, φ² = χ²/n and Cramér's V.
  CA          the simple correspondence analysis of that table: masses, eigenvalues,
              row and column coordinates on every axis, contributions, cos², the
              transition formula verified on the first row, and the chi-square
              distance between the first two rows.
  SIMPSON     the paradox session 4 left planted, as a 2 × 2 × 2 table of declared
              constants: a drug, two age groups, a high or low dose, better or not.

The table is invented and the entrada says so. It is built to tell one story — the
sky tends to repeat itself, so a rainy day makes rain tomorrow more likely than the
year's average — and the story is asserted here, so that editing a count cannot leave
the prose saying something the table no longer shows.

Everything the blocks state is asserted BEFORE anything is written: the margins add up
to the total, the expected table keeps the margins, the cell contributions add up to
χ², Σλ = φ², the transition formula holds for every row and every column, Σctr = 1 per
axis, Σcos² = 1 per point, K = min(r, c) − 1 non-null axes, the story holds, and the
Simpson reversal happens. If any of it fails, nothing is published.

No dependencies and no data file: a 3 × 3 table is diagonalised with the Jacobi rotation
of scripts/extract_gapminder.py, like the eight-person example. Two runs give the same
file.

Rounding: four decimals in λ, χ² and V; three in profiles and coordinates; two in
percentages and contributions (in percent).

    python3 scripts/ejemplo_lluvia.py
"""

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from extract_gapminder import jacobi          # noqa: E402  (needs sys.path first)
from extract_salon import redondear           # noqa: E402

OUT = os.path.join(ROOT, 'src', 'sessions', 's07', 'data', 'lluvia.js')

NULO = 1e-9
EXACTO = 1e-9

# ── The year, declared ──────────────────────────────────────────────────────
# Rows: the sky today. Columns: the sky tomorrow. 365 days. The diagonal is heavy on
# purpose — the sky repeats itself — and rain follows rain more often than it follows
# sun; that is the whole story, and it is asserted below.
ESTADOS = ['sol', 'nublado', 'lluvia']
DIAS = [
    [110, 40, 20],   # hoy sol
    [35, 60, 40],    # hoy nublado
    [10, 25, 25],    # hoy lluvia
]
DIAS_DEL_ANIO = 365
RELATO = 'un año inventado de 365 días: el cielo de hoy contra el cielo de mañana'

# ── Simpson: the story session 4 told, as counts ─────────────────────────────
# A drug, two age groups. Inside each group the high dose helps more; the young
# mostly got the low dose and mostly got better anyway, the old mostly got the high
# dose and mostly did not — so the total says the opposite. Declared, not measured,
# and the script asserts the reversal below.
SIMPSON = {
    'relato': 'un medicamento, dos grupos de edad, dosis alta o baja, mejora o no',
    'grupos': [
        {'grupo': 'jóvenes', 'alta': {'mejora': 9, 'total': 10}, 'baja': {'mejora': 72, 'total': 90}},
        {'grupo': 'mayores', 'alta': {'mejora': 27, 'total': 90}, 'baja': {'mejora': 2, 'total': 10}},
    ],
}


def cerca(a, b, tol=EXACTO):
    return abs(a - b) <= tol


def r4(x): return redondear(x, 4)
def r3(x): return redondear(x, 3)
def r2(x): return redondear(x, 2)


def chi2_de(N):
    n = sum(map(sum, N))
    filas = [sum(f) for f in N]
    cols = [sum(N[i][j] for i in range(len(N))) for j in range(len(N[0]))]
    E = [[filas[i] * cols[j] / n for j in range(len(cols))] for i in range(len(filas))]
    celdas = [[(N[i][j] - E[i][j]) ** 2 / E[i][j] for j in range(len(cols))] for i in range(len(filas))]
    chi2 = sum(map(sum, celdas))
    k = min(len(filas), len(cols)) - 1
    return n, filas, cols, E, celdas, chi2, math.sqrt(chi2 / (n * k)) if k else 0.0


def ca_de(N):
    """The simple correspondence analysis of a count table, checked as it goes."""
    n = sum(map(sum, N))
    I, J = len(N), len(N[0])
    P = [[N[i][j] / n for j in range(J)] for i in range(I)]
    r = [sum(P[i]) for i in range(I)]
    c = [sum(P[i][j] for i in range(I)) for j in range(J)]
    S = [[(P[i][j] - r[i] * c[j]) / math.sqrt(r[i] * c[j]) for j in range(J)] for i in range(I)]
    StS = [[sum(S[i][a] * S[i][b] for i in range(I)) for b in range(J)] for a in range(J)]
    vals, vecs = jacobi(StS)
    ejes = [k for k, v in enumerate(vals) if v > NULO]
    K = min(I, J) - 1
    assert len(ejes) == K, f'esperaba {K} ejes no triviales, hay {len(ejes)}'
    lam = [vals[k] for k in ejes]
    V = [vecs[k] for k in ejes]
    # column coordinates G = D_c^{-1/2} V Σ, sign by the largest coordinate
    g = [[V[k][j] * math.sqrt(lam[k]) / math.sqrt(c[j]) for k in range(K)] for j in range(J)]
    for k in range(K):
        mayor = max(range(J), key=lambda j: abs(g[j][k]))
        if g[mayor][k] < 0:
            V[k] = [-x for x in V[k]]
            for j in range(J):
                g[j][k] = -g[j][k]
    # rows two ways: from S, and by the transition formula (row profile × column coords)
    f_directo = [[sum(S[i][j] * V[k][j] for j in range(J)) / math.sqrt(r[i]) for k in range(K)] for i in range(I)]
    perfil_fila = [[P[i][j] / r[i] for j in range(J)] for i in range(I)]
    perfil_col = [[P[i][j] / c[j] for i in range(I)] for j in range(J)]
    f = [[sum(perfil_fila[i][j] * g[j][k] for j in range(J)) / math.sqrt(lam[k]) for k in range(K)] for i in range(I)]
    for i in range(I):
        for k in range(K):
            assert cerca(f[i][k], f_directo[i][k]), f'la transición falla para la fila {i}, eje {k + 1}'
    for j in range(J):
        for k in range(K):
            vuelta = sum(perfil_col[j][i] * f[i][k] for i in range(I)) / math.sqrt(lam[k])
            assert cerca(vuelta, g[j][k]), f'la transición inversa falla para la columna {j}'
    ctr_f = [[r[i] * f[i][k] ** 2 / lam[k] for k in range(K)] for i in range(I)]
    ctr_g = [[c[j] * g[j][k] ** 2 / lam[k] for k in range(K)] for j in range(J)]
    for k in range(K):
        assert cerca(sum(ctr_f[i][k] for i in range(I)), 1), 'Σctr de filas ≠ 1'
        assert cerca(sum(ctr_g[j][k] for j in range(J)), 1), 'Σctr de columnas ≠ 1'
    d2_f = [sum(f[i][k] ** 2 for k in range(K)) for i in range(I)]
    d2_g = [sum(g[j][k] ** 2 for k in range(K)) for j in range(J)]
    cos2_f = [[f[i][k] ** 2 / d2_f[i] for k in range(K)] for i in range(I)]
    cos2_g = [[g[j][k] ** 2 / d2_g[j] for k in range(K)] for j in range(J)]
    for i in range(I):
        assert cerca(sum(cos2_f[i]), 1), 'Σcos² de una fila ≠ 1'
        # the squared chi-square distance of a row profile to the centroid is Σ_k f²
        assert cerca(d2_f[i], sum((perfil_fila[i][j] - c[j]) ** 2 / c[j] for j in range(J))), \
            'd² al centroide ≠ Σf²'
    for j in range(J):
        assert cerca(sum(cos2_g[j]), 1), 'Σcos² de una columna ≠ 1'
    # the chi-square distance between the first two rows, the formula the block shows
    d2_12 = sum((perfil_fila[0][j] - perfil_fila[1][j]) ** 2 / c[j] for j in range(J))
    return {
        'lam': lam, 'f': f, 'g': g, 'r': r, 'c': c, 'ctr_f': ctr_f, 'ctr_g': ctr_g,
        'cos2_f': cos2_f, 'cos2_g': cos2_g, 'perfil_fila': perfil_fila, 'K': K, 'd2_12': d2_12,
    }


def main():
    fa = fb = ESTADOS
    N = DIAS

    # ── the table, its margins, profiles, expected counts and chi-square ──
    n, filas, cols, Esp, celdas, chi2, v = chi2_de(N)
    assert n == DIAS_DEL_ANIO, f'el año tiene {n} días, no {DIAS_DEL_ANIO}'
    assert sum(filas) == n and sum(cols) == n, 'los marginales no cuadran'
    for i in range(len(fa)):
        assert cerca(sum(Esp[i]), filas[i]), 'las esperadas no conservan el marginal de fila'
    for j in range(len(fb)):
        assert cerca(sum(Esp[i][j] for i in range(len(fa))), cols[j]), 'ni el de columna'
    assert cerca(sum(map(sum, celdas)), chi2)
    perfil_fila = [[N[i][j] / filas[i] for j in range(len(fb))] for i in range(len(fa))]
    perfil_col = [[N[i][j] / cols[j] for i in range(len(fa))] for j in range(len(fb))]
    marginal_fila = [x / n for x in filas]
    marginal_col = [x / n for x in cols]
    phi2 = chi2 / n

    # ── the story: the sky repeats itself ──
    ll, so = ESTADOS.index('lluvia'), ESTADOS.index('sol')
    assert perfil_fila[ll][ll] > marginal_col[ll], \
        'llover hoy no hace más probable llover mañana: el ejemplo no cuenta su historia'
    assert perfil_fila[so][so] > marginal_col[so], \
        'un día de sol no hace más probable el sol mañana: el ejemplo no cuenta su historia'
    for i in range(len(fa)):
        assert N[i][i] == max(N[i]), f'la fila «{fa[i]}» no tiene su máximo en la diagonal'

    # ── the CA ──
    ca = ca_de(N)
    assert cerca(sum(ca['lam']), phi2), f'Σλ = {sum(ca["lam"])} ≠ χ²/n = {phi2}'
    K = ca['K']
    assert K == 2, f'una tabla 3 × 3 tiene dos ejes, no {K}'

    # ── Simpson ──
    for g in SIMPSON['grupos']:
        pa = g['alta']['mejora'] / g['alta']['total']
        pb = g['baja']['mejora'] / g['baja']['total']
        assert pa > pb, f'en {g["grupo"]} la dosis alta no mejora más: no hay paradoja'
    tot = {d: {'mejora': sum(g[d]['mejora'] for g in SIMPSON['grupos']),
               'total': sum(g[d]['total'] for g in SIMPSON['grupos'])} for d in ('alta', 'baja')}
    assert tot['alta']['mejora'] / tot['alta']['total'] < tot['baja']['mejora'] / tot['baja']['total'], \
        'en el total la dosis alta sigue mejorando más: no hay inversión'
    p = lambda d: r3(d['mejora'] / d['total'])
    simpson = {
        'relato': SIMPSON['relato'],
        'grupos': [{'grupo': g['grupo'],
                    'alta': dict(g['alta'], pMejora=p(g['alta']), noMejora=g['alta']['total'] - g['alta']['mejora']),
                    'baja': dict(g['baja'], pMejora=p(g['baja']), noMejora=g['baja']['total'] - g['baja']['mejora']),
                    'personas': g['alta']['total'] + g['baja']['total'],
                    'pAlta': r3(g['alta']['total'] / (g['alta']['total'] + g['baja']['total'])),
                    'pMejora': r3((g['alta']['mejora'] + g['baja']['mejora']) / (g['alta']['total'] + g['baja']['total']))}
                   for g in SIMPSON['grupos']],
        'total': {'alta': dict(tot['alta'], pMejora=p(tot['alta']), noMejora=tot['alta']['total'] - tot['alta']['mejora']),
                  'baja': dict(tot['baja'], pMejora=p(tot['baja']), noMejora=tot['baja']['total'] - tot['baja']['mejora']),
                  'personas': tot['alta']['total'] + tot['baja']['total']},
    }

    # ── write ──
    j = lambda o: json.dumps(o, ensure_ascii=False)
    L = [
        '/* generated by scripts/ejemplo_lluvia.py — do not edit by hand.',
        '   The rain example session 7 opens with: a year of INVENTED days, the sky of one day',
        '   against the sky of the next. Declared as constants in the script, checked there',
        '   — margins, expected table, Σλ = χ²/n, transition, Σctr, Σcos², the story the',
        '   example tells, the Simpson reversal — and only then written here. */',
        '',
        '/* The three states of the sky, in the order the wall reads them. Rows and columns of',
        '   TABLA share this order; a block that needs one cell finds it by name here. */',
        'export const ESTADOS = ' + j(ESTADOS) + ';',
        '',
        '/* Counts of days, with the margins and the total. `filas` is today, `columnas` is',
        '   tomorrow. */',
        'export const TABLA = ' + j({'relato': RELATO, 'n': n, 'unidad': 'días', 'celdas': N,
                                     'filas': filas, 'columnas': cols,
                                     'marginalFila': [r3(x) for x in marginal_fila],
                                     'marginalColumna': [r3(x) for x in marginal_col]}) + ';',
        '',
        '/* Row profiles (each row over its margin: P(mañana | hoy)) and column profiles',
        '   (P(hoy | mañana)). Each one adds up to one. */',
        'export const PERFILES = ' + j({'fila': [[r3(x) for x in p_] for p_ in perfil_fila],
                                        'columna': [[r3(x) for x in p_] for p_ in perfil_col]}) + ';',
        '',
        '/* What the table would be if today said nothing about tomorrow: fila · columna / n.',
        '   Same margins as the observed one. */',
        'export const ESPERADAS = ' + j([[r2(x) for x in fila] for fila in Esp]) + ';',
        '',
        '/* The chi-square, cell by cell, and the two summaries that live in [0, 1]. On invented',
        '   days it is a measure of association, not a test, and the entrada says so. */',
        'export const CHI2 = ' + j({'celdas': [[r3(x) for x in fila] for fila in celdas],
                                    'total': r4(chi2), 'phi2': r4(phi2), 'v': r4(v),
                                    'gradosLibertad': (len(fa) - 1) * (len(fb) - 1)}) + ';',
        '',
        '/* The simple correspondence analysis of TABLA. `filas[i].coord` and',
        '   `columnas[j].coord` on every axis; contributions in percent; cos² over all axes.',
        '   Σλ = phi2; K = min(filas, columnas) − 1 = 2 axes, so the plane keeps everything.',
        '   Signs by the largest coordinate. */',
        'export const CA = ' + j({
            'ejes': K,
            'inerciaTotal': r4(sum(ca['lam'])),
            'autovalores': [r4(l) for l in ca['lam']],
            'porcentajes': [r2(100 * l / sum(ca['lam'])) for l in ca['lam']],
            'acumulado': [r2(100 * sum(ca['lam'][:k + 1]) / sum(ca['lam'])) for k in range(K)],
            'filas': [{'nivel': fa[i], 'n': filas[i], 'masa': r3(ca['r'][i]),
                       'perfil': [r3(x) for x in ca['perfil_fila'][i]],
                       'coord': [r3(x) for x in ca['f'][i]],
                       'ctr': [r2(100 * x) for x in ca['ctr_f'][i]],
                       'cos2': [r3(x) for x in ca['cos2_f'][i]]} for i in range(len(fa))],
            'columnas': [{'nivel': fb[jx], 'n': cols[jx], 'masa': r3(ca['c'][jx]),
                          'coord': [r3(x) for x in ca['g'][jx]],
                          'ctr': [r2(100 * x) for x in ca['ctr_g'][jx]],
                          'cos2': [r3(x) for x in ca['cos2_g'][jx]]} for jx in range(len(fb))],
            'centroide': [r3(x) for x in ca['c']],
            'aportePromedioFilas': r2(100 / len(fa)),
            'aportePromedioColumnas': r2(100 / len(fb)),
            'transicion': {
                'fila': fa[0], 'eje': 1,
                'sumandos': [{'nivel': fb[jx], 'perfil': r3(ca['perfil_fila'][0][jx]), 'coord': r3(ca['g'][jx][0])}
                             for jx in range(len(fb))],
                'promedioPonderado': r4(sum(ca['perfil_fila'][0][jx] * ca['g'][jx][0] for jx in range(len(fb)))),
                'raizLambda': r4(math.sqrt(ca['lam'][0])),
                'dilatado': r4(sum(ca['perfil_fila'][0][jx] * ca['g'][jx][0] for jx in range(len(fb))) / math.sqrt(ca['lam'][0])),
                'coordPublicada': r3(ca['f'][0][0]),
            },
            'distancia': {'filas': [fa[0], fa[1]], 'd2': r4(ca['d2_12']), 'd': r3(math.sqrt(ca['d2_12']))},
        }) + ';',
        '',
        '/* The Simpson paradox of session 4, as counts. In each age group the high dose',
        '   helps more; in the total, less. The reversal is asserted before writing. */',
        'export const SIMPSON = ' + j(simpson) + ';',
        '',
    ]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(L))

    print(f'{RELATO} → {os.path.relpath(OUT, ROOT)}')
    for i, fila in enumerate(N):
        print(f'  hoy {fa[i]:<8} ' + ' '.join(f'{x:>5}' for x in fila) + f'  | {filas[i]}')
    print(f'  {"suma":<12} ' + ' '.join(f'{x:>5}' for x in cols) + f'  | {n}')
    print(f'  P(lluvia | lluvia hoy) = {r3(perfil_fila[ll][ll])} > P(lluvia) = {r3(marginal_col[ll])}')
    print(f'  χ² = {r4(chi2)} · φ² = {r4(phi2)} · V = {r4(v)} · CA: λ = {[r4(l) for l in ca["lam"]]} · '
          f'{[r2(100 * l / sum(ca["lam"])) for l in ca["lam"]]} %')
    t = simpson['total']
    print('  Simpson: ' + ' · '.join(f'{g["grupo"]} alta {g["alta"]["pMejora"]} > baja {g["baja"]["pMejora"]}' for g in simpson['grupos'])
          + f' · total alta {t["alta"]["pMejora"]} < baja {t["baja"]["pMejora"]}')


if __name__ == '__main__':
    main()
