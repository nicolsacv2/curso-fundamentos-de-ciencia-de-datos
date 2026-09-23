#!/usr/bin/env python3
"""Generate the rain example session 7 opens with, and the CA of its table.

Simulates — it does not measure — a year of invented days, one state of the sky per
day, and COUNTS the pairs of consecutive days: the sky of the observed day against the
sky of the day after. Writes src/sessions/s07/data/lluvia.js with:

  ESTADOS     the three states of the sky, in the order the wall reads them.
  ANIO        the 365 simulated days, in order, with the first and the last one named.
  TABLA       the cross table «día observado × día siguiente»: counts of PAIRS (364 of
              them), margins, total, and for every state its two sums side by side with
              the difference and what explains it.
  PERFILES    row and column profiles — the conditional probabilities,
              P(siguiente | observado) and P(observado | siguiente).
  ESPERADAS   the table the two days would give if they were independent.
  CHI2        the chi-square cell by cell, its total, φ² = χ²/n and Cramér's V.
  CA          the simple correspondence analysis of that table: masses, eigenvalues,
              row and column coordinates on every axis, contributions, cos², the
              transition formula verified on the first row, and the chi-square
              distance between the first two rows.
  SIMPSON     the paradox session 4 left planted, as a 2 × 2 × 2 table of declared
              constants: a drug, two age groups, a high or low dose, better or not.

WHY THE TABLE IS COUNTED AND NOT DECLARED. The first version declared the nine cells by
hand, and its margins were impossible: 170 days of sun as the observed day against 155
as the day after. In a table of consecutive days every day is «observed» once and
«next» once — except the first day of the year, which is never «next», and the last,
which is never «observed» — so the two sums of a state can differ by one at most. A
declared table has no year behind it that guarantees that; a counted one does, by
construction, and the script asserts it: filas[k] − columnas[k] == [day 1 is k] −
[day 365 is k], for every state.

What IS declared, and nothing else about the table: the transition rule (from each
state, the probability of each state the next day — the diagonal high, because the sky
repeats itself), the seed, the first day and the number of days. The rule is the story
and it is not published: the entrada teaches how to read a table, not how to simulate
one, and printing the probabilities the year was drawn from would be giving the answer
before the question. The story is asserted on the COUNTED table anyway — a rainy day
makes rain the next day more likely than the year's average, the diagonal is the
maximum of every row — so a seed that happens not to tell it cannot be published.

Everything the blocks state is asserted BEFORE anything is written: 365 days and 364
pairs, the margins add up to the total, the two sums of every state agree with the
first and last day, the expected table keeps the margins, the cell contributions add up
to χ², Σλ = φ², the transition formula holds for every row and every column, Σctr = 1
per axis, Σcos² = 1 per point, K = min(r, c) − 1 non-null axes, the story holds, and
the Simpson reversal happens. If any of it fails, nothing is published.

No dependencies and no data file: the year comes from random.Random with the seed
pinned, and a 3 × 3 table is diagonalised with the Jacobi rotation of
scripts/extract_gapminder.py, like the eight-person example. Two runs give the same
file.

Rounding: four decimals in λ, χ² and V; three in profiles and coordinates; two in
percentages and contributions (in percent).

    python3 scripts/ejemplo_lluvia.py
"""

import json
import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from extract_gapminder import jacobi          # noqa: E402  (needs sys.path first)
from extract_salon import redondear           # noqa: E402

OUT = os.path.join(ROOT, 'src', 'sessions', 's07', 'data', 'lluvia.js')

NULO = 1e-9
EXACTO = 1e-9

# ── The year: a rule, a seed, a first day, and how many days ────────────────
# Rows: the state of the observed day. Columns: the probability of each state the day
# after. The diagonal is high on purpose — the sky repeats itself — and rain follows
# rain more often than the year's average has rain: that is the whole story, and it is
# asserted on the counted table below, not assumed from these numbers.
ESTADOS = ['sol', 'nublado', 'lluvia']
TRANSICION = [
    [0.65, 0.25, 0.10],   # observado sol
    [0.25, 0.45, 0.30],   # observado nublado
    [0.15, 0.35, 0.50],   # observado lluvia
]
ESTADO_INICIAL = 'sol'
DIAS_DEL_ANIO = 365
# Pinned, and the reason is the same the entrada of session 6 gives for its imputer:
# without it every run would draw another year, and the class on Tuesday would not see
# the class on Thursday's table. The value was chosen once: the first seed under which
# the counted table tells the story the asserts below demand AND the year starts and
# ends under different skies — so that the two sums of a state visibly differ by one,
# which is the lesson the entrada draws from the margins.
SEMILLA = 2
RELATO = 'un año inventado de 365 días: el cielo de cada día contra el del día siguiente'

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


def simular_anio(semilla, dias=DIAS_DEL_ANIO):
    """One state per day, drawn from TRANSICION with the seed pinned.

    The draw is spelled out — a uniform against the cumulative row — instead of
    random.choices, so that what the seed produces depends on nothing but random()."""
    rng = random.Random(semilla)
    anio = [ESTADO_INICIAL]
    for _ in range(dias - 1):
        fila = TRANSICION[ESTADOS.index(anio[-1])]
        u = rng.random()
        acumulado = 0.0
        for estado, p in zip(ESTADOS, fila):
            acumulado += p
            if u < acumulado:
                anio.append(estado)
                break
        else:
            anio.append(ESTADOS[-1])
    return anio


def contar_pares(anio):
    """The cross table of consecutive days: the observed day in rows, the next in columns."""
    N = [[0] * len(ESTADOS) for _ in ESTADOS]
    for observado, siguiente in zip(anio, anio[1:]):
        N[ESTADOS.index(observado)][ESTADOS.index(siguiente)] += 1
    return N


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
    # Every pair of rows and every pair of columns: the chi-square distance between their
    # profiles, and the Euclidean distance between their principal coordinates over ALL
    # the axes. The two have to agree — that identity is what lets «close on the map» be
    # read as «similar profiles» — and the block shows both, so both are published.
    def pares(perfiles, pesos, coords):
        out = []
        for a in range(len(perfiles)):
            for b in range(a + 1, len(perfiles)):
                d2 = sum((perfiles[a][j] - perfiles[b][j]) ** 2 / pesos[j] for j in range(len(pesos)))
                d_coord = math.sqrt(sum((coords[a][k] - coords[b][k]) ** 2 for k in range(K)))
                assert cerca(math.sqrt(d2), d_coord, 1e-7), \
                    f'la distancia chi-cuadrado ({math.sqrt(d2)}) no es la distancia en coordenadas ({d_coord})'
                out.append((a, b, d2, d_coord))
        return sorted(out, key=lambda t: t[2])
    dist_filas = pares(perfil_fila, c, f)
    dist_cols = pares(perfil_col, r, g)
    # Where the eigenvalues come from, published so the block can show it: the residuals,
    # their cross matrix, its trace, and EVERY eigenvalue including the trivial zero of the
    # centring that `ejes` drops — the block explains that zero, so it has to be there.
    traza = sum(StS[a][a] for a in range(J))
    assert cerca(traza, sum(S[i][j] ** 2 for i in range(I) for j in range(J))), 'la traza no es Σ s²'
    assert cerca(sum(vals), traza), f'los valores propios suman {sum(vals)} y la traza es {traza}'
    # The matrix form the block writes: S = U Σ Vᵀ with σ_k = √λ_k, F = D_r^{-1/2} U Σ and
    # G = D_c^{-1/2} V Σ. U is recovered from F (u_ik = f_ik √r_i / σ_k) and the three
    # identities are asserted, plus the two the derivation of ctr and cos² rests on:
    # λ_k = Σ_i m_i f_ik² (columns of U of norm one) and d²(i, centroide) = Σ_k f_ik².
    sigma = [math.sqrt(l) for l in lam]
    U = [[f[i][k] * math.sqrt(r[i]) / sigma[k] for k in range(K)] for i in range(I)]
    for i in range(I):
        for j in range(J):
            assert cerca(S[i][j], sum(U[i][k] * sigma[k] * V[k][j] for k in range(K)), 1e-8), \
                'U Σ Vᵀ no reconstruye S'
    for k in range(K):
        assert cerca(sum(U[i][k] ** 2 for i in range(I)), 1, 1e-8), f'la columna {k + 1} de U no es unitaria'
        assert cerca(sigma[k] ** 2, lam[k]), 'σ² ≠ λ'
        assert cerca(sum(r[i] * f[i][k] ** 2 for i in range(I)), lam[k]), \
            f'Σ m_i f_ik² ≠ λ_k en el eje {k + 1}: la deducción de la contribución no cuadra'
        for j in range(J):
            assert cerca(g[j][k], V[k][j] * sigma[k] / math.sqrt(c[j])), 'G ≠ D_c^{-1/2} V Σ'
    return {
        'lam': lam, 'f': f, 'g': g, 'r': r, 'c': c, 'ctr_f': ctr_f, 'ctr_g': ctr_g,
        'cos2_f': cos2_f, 'cos2_g': cos2_g, 'perfil_fila': perfil_fila, 'K': K, 'd2_12': d2_12,
        'dist_filas': dist_filas, 'dist_cols': dist_cols,
        'S': S, 'StS': StS, 'traza': traza,
        'vals_todos': [v if v > NULO else 0.0 for v in vals],
        'U': U, 'V': V, 'sigma': sigma, 'd2_f': d2_f,
    }


def main():
    fa = fb = ESTADOS

    # ── the year, and the pairs counted from it ──
    anio = simular_anio(SEMILLA)
    assert len(anio) == DIAS_DEL_ANIO, f'el año tiene {len(anio)} días, no {DIAS_DEL_ANIO}'
    assert all(e in ESTADOS for e in anio), 'un día tiene un estado que no existe'
    N = contar_pares(anio)

    # ── the table, its margins, profiles, expected counts and chi-square ──
    n, filas, cols, Esp, celdas, chi2, v = chi2_de(N)
    assert n == DIAS_DEL_ANIO - 1, f'{DIAS_DEL_ANIO} días dan {DIAS_DEL_ANIO - 1} pares, no {n}'
    assert sum(filas) == n and sum(cols) == n, 'los marginales no cuadran'
    # Every day is «observed» once and «next» once, except the first and the last of
    # the year. So the two sums of a state differ by exactly whether day 1 has it minus
    # whether day 365 has it — and never by more than one. This is the check the first
    # version did not have, and the one the entrada now puts on the wall.
    margenes = []
    for k, estado in enumerate(ESTADOS):
        primero, ultimo = anio[0] == estado, anio[-1] == estado
        diferencia = filas[k] - cols[k]
        assert diferencia == int(primero) - int(ultimo), \
            f'«{estado}»: {filas[k]} como observado y {cols[k]} como siguiente, y el año no lo explica'
        assert abs(diferencia) <= 1
        if primero and ultimo:
            explicacion = f'el primer y el último día del año son «{estado}» los dos'
        elif primero:
            explicacion = f'el primer día del año es «{estado}» y el último no'
        elif ultimo:
            explicacion = f'el último día del año es «{estado}» y el primero no'
        else:
            explicacion = f'ni el primer ni el último día del año es «{estado}»'
        margenes.append({'estado': estado, 'observado': filas[k], 'siguiente': cols[k],
                         'diferencia': diferencia, 'explicacion': explicacion})
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
        'llover un día no hace más probable llover el siguiente: el ejemplo no cuenta su historia'
    assert perfil_fila[so][so] > marginal_col[so], \
        'un día de sol no hace más probable el sol al día siguiente: el ejemplo no cuenta su historia'
    for i in range(len(fa)):
        assert N[i][i] == max(N[i]), f'la fila «{fa[i]}» no tiene su máximo en la diagonal'

    # ── the CA ──
    ca = ca_de(N)
    assert cerca(sum(ca['lam']), phi2), f'Σλ = {sum(ca["lam"])} ≠ χ²/n = {phi2}'
    assert cerca(ca['traza'], phi2), f'la traza de SᵀS = {ca["traza"]} ≠ χ²/n = {phi2}'
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
        '   The rain example session 7 opens with: a year of INVENTED days, simulated with the',
        '   seed pinned, and the pairs of consecutive days COUNTED from it — the sky of the',
        '   observed day against the sky of the day after. Checked in the script — 364 pairs,',
        '   margins that agree with the first and last day, expected table, Σλ = χ²/n,',
        '   transition, Σctr, Σcos², the story the example tells, the Simpson reversal — and',
        '   only then written here. */',
        '',
        '/* The three states of the sky, in the order the wall reads them. Rows and columns of',
        '   TABLA share this order; a block that needs one cell finds it by name here. */',
        'export const ESTADOS = ' + j(ESTADOS) + ';',
        '',
        '/* The year, day by day. 365 days give 364 pairs; the first day is never «siguiente»',
        '   and the last is never «observado», which is why the two sums of a state can differ',
        '   by one. */',
        'export const ANIO = ' + j({'dias': len(anio), 'pares': n, 'estados': anio,
                                    'primerDia': anio[0], 'ultimoDia': anio[-1],
                                    'semilla': SEMILLA}) + ';',
        '',
        '/* Counts of PAIRS of consecutive days, with the margins and the total. `filas` is the',
        '   observed day, `columnas` the day after. `margenes` puts the two sums of every state',
        '   side by side, with the difference and what explains it. */',
        'export const TABLA = ' + j({'relato': RELATO, 'n': n, 'unidad': 'pares de días consecutivos',
                                     'dias': len(anio), 'celdas': N,
                                     'filas': filas, 'columnas': cols, 'margenes': margenes,
                                     'marginalFila': [r3(x) for x in marginal_fila],
                                     'marginalColumna': [r3(x) for x in marginal_col]}) + ';',
        '',
        '/* Row profiles (each row over its margin: P(siguiente | observado)) and column',
        '   profiles (P(observado | siguiente)). Each one adds up to one. */',
        'export const PERFILES = ' + j({'fila': [[r3(x) for x in p_] for p_ in perfil_fila],
                                        'columna': [[r3(x) for x in p_] for p_ in perfil_col]}) + ';',
        '',
        '/* What the table would be if the observed day said nothing about the next: fila ·',
        '   columna / n.',
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
        '   `distancias`: every pair of rows and of columns, closest first, with the',
        '   chi-square distance between profiles (`d`) and the distance between principal',
        '   coordinates (`dCoord`), asserted equal. `salto`: the farthest pair of rows, for the',
        '   step from distances to the map. `transicion` and `transicionInversa`: the formula',
        '   verified in both directions, a row from the columns and a column from the rows.',
        '   `residuos`, `matriz`, `traza`, `autovaloresConTrivial`: where the eigenvalues come from',
        '   (the residuals, SᵀS, its trace, and every eigenvalue including the zero of the',
        '   centring). `svd`, `matricial`, `deduccion`: the matrix form S = U Σ Vᵀ with the',
        '   coordinates as D_r^{-1/2} U Σ and D_c^{-1/2} V Σ, one row and one column recomputed',
        '   from it, and the two sums behind contribution and cos². Signs by the largest',
        '   coordinate. */',
        'export const CA = ' + j({
            'ejes': K,
            # where the eigenvalues come from: the standardised residuals of every cell, their
            # cross matrix SᵀS (columns × columns), its trace = Σ s² = χ²/n, and every
            # eigenvalue of that matrix including the trivial zero of the centring
            'residuos': [[r3(x) for x in fila] for fila in ca['S']],
            'matriz': [[r4(x) for x in fila] for fila in ca['StS']],
            'traza': r4(ca['traza']),
            'autovaloresConTrivial': [r4(v) for v in ca['vals_todos']],
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
            # and the way back — a column as the barycentre of the rows, weighted by its
            # column profile, dilated the same — for the first column on axis 1; the block
            # shows both directions, which is what lets the two clouds share the axes
            'transicionInversa': {
                'columna': fb[0], 'eje': 1,
                'sumandos': [{'nivel': fa[i], 'perfil': r3(perfil_col[0][i]), 'coord': r3(ca['f'][i][0])}
                             for i in range(len(fa))],
                'promedioPonderado': r4(sum(perfil_col[0][i] * ca['f'][i][0] for i in range(len(fa)))),
                'raizLambda': r4(math.sqrt(ca['lam'][0])),
                'dilatado': r4(sum(perfil_col[0][i] * ca['f'][i][0] for i in range(len(fa))) / math.sqrt(ca['lam'][0])),
                'coordPublicada': r3(ca['g'][0][0]),
            },
            # the matrix form: S = U Σ Vᵀ, F = D_r^{-1/2} U Σ, G = D_c^{-1/2} V Σ. `svd.V[j][k]`
            # is column j on axis k, like `columnas[j].coord`; `matricial` is one row and one
            # column recomputed from these pieces, for the block to show next to the formula
            'svd': {
                'U': [[r4(ca['U'][i][k]) for k in range(K)] for i in range(len(fa))],
                'V': [[r4(ca['V'][k][j]) for k in range(K)] for j in range(len(fb))],
                'sigma': [r4(x) for x in ca['sigma']],
                'r': [r4(x) for x in ca['r']], 'c': [r4(x) for x in ca['c']],
            },
            'matricial': {
                'fila': {'nivel': fa[0], 'eje': 1, 'u': r4(ca['U'][0][0]), 'sigma': r4(ca['sigma'][0]),
                         'raizMasa': r4(math.sqrt(ca['r'][0])),
                         'producto': r3(ca['U'][0][0] * ca['sigma'][0] / math.sqrt(ca['r'][0])),
                         'coordPublicada': r3(ca['f'][0][0])},
                'columna': {'nivel': fb[0], 'eje': 1, 'v': r4(ca['V'][0][0]), 'sigma': r4(ca['sigma'][0]),
                            'raizMasa': r4(math.sqrt(ca['c'][0])),
                            'producto': r3(ca['V'][0][0] * ca['sigma'][0] / math.sqrt(ca['c'][0])),
                            'coordPublicada': r3(ca['g'][0][0])},
            },
            # the two sums the derivation of ctr and cos² rests on, with their terms
            'deduccion': {
                'eje': 1,
                'sumandosInercia': [r4(ca['r'][i] * ca['f'][i][0] ** 2) for i in range(len(fa))],
                'suma': r4(sum(ca['r'][i] * ca['f'][i][0] ** 2 for i in range(len(fa)))),
                'lambda': r4(ca['lam'][0]),
                'fila': fa[0],
                'sumandosDistancia': [r4(ca['f'][0][k] ** 2) for k in range(K)],
                'sumaF2': r4(ca['d2_f'][0]),
                'd2Perfil': r4(sum((ca['perfil_fila'][0][j] - ca['c'][j]) ** 2 / ca['c'][j] for j in range(len(fb)))),
            },
            'distancia': {'filas': [fa[0], fa[1]], 'd2': r4(ca['d2_12']), 'd': r3(math.sqrt(ca['d2_12']))},
            # every pair, closest first; `d` from the profiles, `dCoord` from the coordinates
            'distancias': {
                'filas': [{'a': fa[a], 'b': fa[b], 'd2': r4(d2), 'd': r3(math.sqrt(d2)), 'dCoord': r3(dc)}
                          for a, b, d2, dc in ca['dist_filas']],
                'columnas': [{'a': fb[a], 'b': fb[b], 'd2': r4(d2), 'd': r3(math.sqrt(d2)), 'dCoord': r3(dc)}
                             for a, b, d2, dc in ca['dist_cols']],
            },
            # the jump from distances to the map, verified on the farthest pair of rows:
            # the same number by the profiles and by the coordinates, because the two axes
            # keep all the inertia
            'salto': {
                'par': [fa[ca['dist_filas'][-1][0]], fa[ca['dist_filas'][-1][1]]],
                'dPerfiles': r3(math.sqrt(ca['dist_filas'][-1][2])),
                'dCoord': r3(ca['dist_filas'][-1][3]),
                'ejes': K, 'retenido': r2(100.0),
            },
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
    print(f'  semilla {SEMILLA} · {len(anio)} días, {n} pares · primer día {anio[0]}, último {anio[-1]}')
    for i, fila in enumerate(N):
        print(f'  observado {fa[i]:<8} ' + ' '.join(f'{x:>5}' for x in fila) + f'  | {filas[i]}')
    print(f'  {"suma":<18} ' + ' '.join(f'{x:>5}' for x in cols) + f'  | {n}')
    for m in margenes:
        print(f'  {m["estado"]:<8} observado {m["observado"]:>3} · siguiente {m["siguiente"]:>3} · '
              f'diferencia {m["diferencia"]:+d}: {m["explicacion"]}')
    print(f'  P(lluvia | lluvia el día observado) = {r3(perfil_fila[ll][ll])} > P(lluvia) = {r3(marginal_col[ll])}')
    print(f'  χ² = {r4(chi2)} · φ² = {r4(phi2)} · V = {r4(v)} · CA: λ = {[r4(l) for l in ca["lam"]]} · '
          f'{[r2(100 * l / sum(ca["lam"])) for l in ca["lam"]]} %')
    t = simpson['total']
    print('  Simpson: ' + ' · '.join(f'{g["grupo"]} alta {g["alta"]["pMejora"]} > baja {g["baja"]["pMejora"]}' for g in simpson['grupos'])
          + f' · total alta {t["alta"]["pMejora"]} < baja {t["baja"]["pMejora"]}')


if __name__ == '__main__':
    main()
