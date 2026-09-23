#!/usr/bin/env python3
"""Generate the eight-person example session 7 teaches MCA and FAMD on.

Writes src/sessions/s07/data/ejemplo.js with the four set-ups of mca_famd_guia.md:

  MCA       eight people, three binary variables (Bebida, Horario, Azúcar): the
            indicator matrix, masses, residuals, eigenvalues, category and individual
            coordinates, contributions, cos², Benzécri's correction and the Burt check.
  MCA_RARA  the same people with the third variable opened into Endulzante
            {Azúcar 4, Nada 3, Stevia 1}: one person manufactures an axis.
  SUPL      Nada and Stevia projected onto the base MCA as supplementary categories,
            by the transition formula and, as a check, by the dual road.
  FAMD      Bebida, Horario, cups a day and hours of sleep: the mixed analysis, with
            r² and η² per axis, the two within-group tables and the three plots' data.

Nothing here touches the class table. The example does not depend on it, so it must
not need the virtualenv either: the matrices are 6×6 and 7×7 and the Jacobi rotation
of scripts/extract_gapminder.py diagonalises them in stdlib — the MCA on SᵀS instead
of an SVD of S (same λ, same category coordinates; individuals then come out of the
transition formula, which is what the block teaches), the FAMD on XᵀX/n.

Every identity the blocks state is asserted BEFORE anything is written: Σλ = (J−Q)/Q,
the transition formula for all eight, λ_Burt = λ², Σctr = 1 per axis, Σλ_FAMD = 4,
Σr² + Ση² = λ_k, SC_entre + SC_dentro = SC_total, var(F₁) = λ₁, and supplementary by
transition = supplementary by the dual road. If any of them fails, nothing is
published. The guide's figures are the acceptance oracle, not the source: the last
assert compares against them and fails if this drifts from what the guide verified by
hand.

Signs. An eigenvector's sign is arbitrary and the prose says «los cafeteros a la
izquierda», so each axis is pinned by a NAMED category rather than by the largest
loading: Café < 0 on axis 1 and Mañana > 0 on axis 2 of the base MCA, Stevia < 0 on
axis 2 of the rare set-up, cups < 0 on axis 1 and person 7 > 0 on axis 2 of the FAMD.
The drawn maps are then the guide's, and the prose does not depend on luck. If the
data change and a named category vanishes, this fails with a message instead of
publishing a mirrored map.

Rounding: eigenvalues, r², η² and sums of squares to four decimals; coordinates and
cos² to three; percentages and contributions (in percent) to one, as the guide prints
them.

No dependencies.

    python3 scripts/ejemplo_mca_famd.py
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

OUT = os.path.join(ROOT, 'src', 'sessions', 's07', 'data', 'ejemplo.js')

# ── the example ─────────────────────────────────────────────────────────────
# Eight people, seeded pattern: coffee drinkers are morning people who take sugar,
# tea drinkers are night people who do not — with 3, 4, 7 and 8 as the exceptions.
BEBIDA = ['Café', 'Café', 'Café', 'Café', 'Té', 'Té', 'Té', 'Té']
HORARIO = ['Mañana', 'Mañana', 'Mañana', 'Noche', 'Noche', 'Noche', 'Mañana', 'Noche']
AZUCAR = ['Sí', 'Sí', 'No', 'Sí', 'No', 'No', 'No', 'Sí']
# The third variable opened up: whoever said «No» to sugar takes nothing — except
# person 7, who takes stevia. One person, one category.
ENDULZANTE = ['Azúcar', 'Azúcar', 'Nada', 'Azúcar', 'Nada', 'Nada', 'Stevia', 'Azúcar']
# The two quantities the FAMD adds.
TAZAS = [4, 5, 3, 4, 1, 0, 2, 1]
SUENO = [6, 5.5, 6.5, 7, 8, 8.5, 7, 7.5]

BASE = [('Bebida', ['Café', 'Té'], BEBIDA),
        ('Horario', ['Mañana', 'Noche'], HORARIO),
        ('Azúcar', ['Sí', 'No'], AZUCAR)]
RARA = [BASE[0], BASE[1], ('Endulzante', ['Azúcar', 'Nada', 'Stevia'], ENDULZANTE)]
NUMERICAS = [('tazas', 'tazas/día', TAZAS), ('sueno', 'horas de sueño', SUENO)]

# axis → (variable, level, sign). Axes not listed fall back to the largest
# coordinate positive, the PCA rule, because no sentence depends on them.
SIGNOS_BASE = {0: ('Bebida', 'Café', -1), 1: ('Horario', 'Mañana', +1),
               # pinned so person 7's third coordinate is the guide's −0.408
               2: ('Bebida', 'Café', +1)}
SIGNOS_RARA = {0: ('Bebida', 'Café', -1), 1: ('Endulzante', 'Stevia', -1)}

# The threshold below which an eigenvalue is a trivial one of the centring.
NULO = 1e-9
# How close two roads to the same number have to be. Jacobi on these matrices stops
# at 1e-14 off the diagonal; anything looser than this would be hiding a bug.
EXACTO = 1e-9

N = len(BEBIDA)


def sgn(x):
    return -1 if x < 0 else 1


def cerca(a, b, tol=EXACTO):
    return abs(a - b) <= tol


def primero_no_nulo(coords):
    """Index of the first coordinate that is not a rounding zero.

    The sign of an eigenvector is arbitrary and has to be pinned by SOMETHING that does
    not depend on the machine. «The largest coordinate in absolute value» does: in these
    small examples two coordinates tie exactly (the two indicators of a binary variable
    are mirror images), and which of the two Jacobi leaves a hair larger changed between
    two computers, flipping an axis that no figure draws but the file records. The first
    non-null coordinate, by index, cannot tie with itself."""
    return next(j for j, x in enumerate(coords) if abs(x) > NULO)


def fijar_signo(k, coords, cats, reglas):
    """Whether axis k has to be flipped: for the named category to have its sign when
    there is a rule, and otherwise for the first non-null coordinate to be positive."""
    regla = reglas.get(k)
    if regla:
        var, nivel, signo = regla
        if (var, nivel) not in cats:
            sys.exit(f'la categoría {var}={nivel} que fija el signo del eje {k + 1} '
                     f'no existe: revisa SIGNOS')
        return sgn(coords[cats.index((var, nivel))]) != signo
    return coords[primero_no_nulo(coords)] < 0


def ca_de(S, n_ejes):
    """Eigenvalues and eigenvectors of SᵀS, the non-trivial ones, largest first."""
    m = len(S[0])
    StS = [[sum(fila[a] * fila[b] for fila in S) for b in range(m)] for a in range(m)]
    vals, vecs = jacobi(StS)
    ejes = [k for k, v in enumerate(vals) if v > NULO]
    assert len(ejes) == n_ejes, f'esperaba {n_ejes} ejes no triviales, hay {len(ejes)}'
    return [vals[k] for k in ejes], [vecs[k] for k in ejes]


def mca(variables, reglas):
    """The whole MCA of a set of categorical variables, checked as it goes."""
    n, Q = N, len(variables)
    cats = [(var, lvl) for var, lvls, _ in variables for lvl in lvls]
    J = len(cats)
    Z = [[1 if vals[i] == lvl else 0 for var, lvls, vals in variables for lvl in lvls]
         for i in range(n)]
    nj = [sum(Z[i][j] for i in range(n)) for j in range(J)]
    assert all(sum(fila) == Q for fila in Z), 'cada fila de Z debe sumar Q'
    assert sum(nj) == n * Q

    # 1.2 · masses and standardised residuals
    r = 1.0 / n
    c = [nj[j] / (n * Q) for j in range(J)]
    S = [[(Z[i][j] / (n * Q) - r * c[j]) / math.sqrt(r * c[j]) for j in range(J)]
         for i in range(n)]

    # 1.3 · eigenvalues via SᵀS; category coordinates G = D_c^{-1/2} V Σ
    lam, V = ca_de(S, J - Q)
    K = len(lam)
    g = [[V[k][j] * math.sqrt(lam[k]) / math.sqrt(c[j]) for k in range(K)] for j in range(J)]
    for k in range(K):
        if fijar_signo(k, [g[j][k] for j in range(J)], cats, reglas):
            V[k] = [-x for x in V[k]]
            for j in range(J):
                g[j][k] = -g[j][k]

    # individuals two ways: straight from S (F = D_r^{-1/2} U Σ, with U = S V Σ⁻¹)…
    f_directo = [[math.sqrt(n) * sum(S[i][j] * V[k][j] for j in range(J)) for k in range(K)]
                 for i in range(n)]
    # …and by the transition formula, which is what the block teaches
    f = [[(1 / math.sqrt(lam[k])) * (1 / Q) * sum(Z[i][j] * g[j][k] for j in range(J))
          for k in range(K)] for i in range(n)]
    for i in range(n):
        for k in range(K):
            assert cerca(f[i][k], f_directo[i][k]), \
                f'la fórmula de transición falla para el individuo {i + 1}, eje {k + 1}'
    # and back: a category is the barycentre of its individuals, dilated
    for j in range(J):
        for k in range(K):
            vuelta = (1 / math.sqrt(lam[k])) * (1 / nj[j]) * sum(Z[i][j] * f[i][k] for i in range(n))
            assert cerca(vuelta, g[j][k]), f'la transición inversa falla en {cats[j]}'

    # 1.6 · inertia
    inercia = (J - Q) / Q
    assert cerca(sum(lam), inercia), f'Σλ = {sum(lam)} ≠ (J−Q)/Q = {inercia}'

    # 1.8 · contributions and cos²
    d2 = [n / nj[j] - 1 for j in range(J)]
    ctr = [[c[j] * g[j][k] ** 2 / lam[k] for k in range(K)] for j in range(J)]
    cos2 = [[g[j][k] ** 2 / d2[j] for k in range(K)] for j in range(J)]
    for k in range(K):
        assert cerca(sum(ctr[j][k] for j in range(J)), 1), f'Σctr ≠ 1 en el eje {k + 1}'
    for j in range(J):
        assert cerca(sum(cos2[j]), 1), f'Σcos² ≠ 1 para {cats[j]} con todos los ejes'
        assert cerca(sum(g[j][k] ** 2 for k in range(K)), d2[j]), 'd² ≠ Σg² en ' + str(cats[j])
    ctr_ind = [[r * f[i][k] ** 2 / lam[k] for k in range(K)] for i in range(n)]
    dist_ind = [sum(f[i][k] ** 2 for k in range(K)) for i in range(n)]
    cos2_ind = [[f[i][k] ** 2 / dist_ind[i] for k in range(K)] for i in range(n)]
    for k in range(K):
        assert cerca(sum(ctr_ind[i][k] for i in range(n)), 1), 'Σctr de individuos ≠ 1'

    # 1.6 · Benzécri: only the eigenvalues above 1/Q get re-scaled
    umbral = 1 / Q
    ajustados = [((Q / (Q - 1)) ** 2) * (l - umbral) ** 2 if l > umbral else 0 for l in lam]
    total_adj = sum(ajustados)

    # 1.7 · Burt: CA of B = ZᵀZ gives singular values λ and inertias λ²
    B = [[sum(Z[i][a] * Z[i][b] for i in range(n)) for b in range(J)] for a in range(J)]
    SB = [[(B[a][b] / (n * Q * Q) - c[a] * c[b]) / math.sqrt(c[a] * c[b]) for b in range(J)]
          for a in range(J)]
    vals_b, _ = jacobi(SB)
    sing_b = [v for v in vals_b if v > NULO]
    assert len(sing_b) == K, 'Burt no tiene los mismos ejes'
    for k in range(K):
        assert cerca(sing_b[k], lam[k], 1e-8), 'los valores singulares de Burt no son λ'
    lam_burt = [v * v for v in sing_b]

    total = sum(lam)

    # The matrix form the block writes: S = U Σ Vᵀ, F = D_r^{-1/2} U Σ = √n U Σ (every mass
    # is 1/n), G = D_c^{-1/2} V Σ. U is recovered from F and the identities asserted.
    sigma = [math.sqrt(l) for l in lam]
    U = [[f[i][k] * math.sqrt(r) / sigma[k] for k in range(K)] for i in range(n)]
    for i in range(n):
        for j in range(J):
            assert cerca(S[i][j], sum(U[i][k] * sigma[k] * V[k][j] for k in range(K)), 1e-8), \
                'U Σ Vᵀ no reconstruye S'
    for k in range(K):
        assert cerca(sum(U[i][k] ** 2 for i in range(n)), 1, 1e-8), f'la columna {k + 1} de U no es unitaria'
        for j in range(J):
            assert cerca(g[j][k], V[k][j] * sigma[k] / math.sqrt(c[j])), 'G ≠ D_c^{-1/2} V Σ'
    svd = {
        'U': [[redondear(U[i][k], 4) for k in range(K)] for i in range(n)],
        'V': [[redondear(V[k][j], 4) for k in range(K)] for j in range(J)],
        'sigma': [redondear(x, 4) for x in sigma],
        'r': redondear(r, 4), 'c': [redondear(x, 4) for x in c],
    }
    matricial = {
        'persona': {'i': 1, 'eje': 1, 'u': redondear(U[0][0], 4), 'sigma': redondear(sigma[0], 4),
                    'raizN': redondear(math.sqrt(n), 4),
                    'producto': redondear(U[0][0] * sigma[0] * math.sqrt(n), 3),
                    'coordPublicada': redondear(f[0][0], 3)},
        'categoria': {'variable': cats[0][0], 'nivel': cats[0][1], 'eje': 1,
                      'v': redondear(V[0][0], 4), 'sigma': redondear(sigma[0], 4),
                      'raizMasa': redondear(math.sqrt(c[0]), 4),
                      'producto': redondear(V[0][0] * sigma[0] / math.sqrt(c[0]), 3),
                      'coordPublicada': redondear(g[0][0], 3)},
    }

    # The jump from distances to the map, on the farthest pair of people: the chi-square
    # distance straight from Z (the formula the block shows), the distance between their
    # coordinates over all K axes — equal by construction, and asserted — and over the two
    # axes of the map, which is smaller by exactly what the plane does not keep.
    def d_z(a, b):
        return math.sqrt(n / Q * sum((Z[a][j] - Z[b][j]) ** 2 / nj[j] for j in range(J)))

    def d_f(a, b, ejes):
        return math.sqrt(sum((f[a][k] - f[b][k]) ** 2 for k in range(ejes)))

    par = max(((a, b) for a in range(n) for b in range(a + 1, n)),
              key=lambda p_: (round(d_z(*p_), 9), -p_[0], -p_[1]))
    assert cerca(d_z(*par), d_f(*par, K), 1e-8), \
        'la distancia chi-cuadrado por Z no es la distancia entre coordenadas con todos los ejes'
    assert d_f(*par, 2) <= d_f(*par, K) + EXACTO, 'el mapa no puede alargar una distancia'
    salto = {
        'personas': [par[0] + 1, par[1] + 1],
        'dZ': redondear(d_z(*par), 3),
        'dTodosLosEjes': redondear(d_f(*par, K), 3),
        'dMapa': redondear(d_f(*par, 2), 3),
        'ejes': K, 'ejesMapa': 2,
        'retenido': redondear(100 * sum(lam[:2]) / total, 1),
    }
    return {
        'n': n, 'Q': Q, 'J': J, 'ejes': K,
        'inerciaTotal': redondear(inercia, 4),
        'masaFila': redondear(r, 4),
        'variables': [{'variable': var, 'niveles': list(lvls)} for var, lvls, _ in variables],
        'categorias': [{
            'variable': cats[j][0], 'nivel': cats[j][1], 'n': nj[j],
            'masa': redondear(c[j], 4),
            'd2': redondear(d2[j], 4),
            'coord': [redondear(g[j][k], 3) for k in range(K)],
            'ctr': [redondear(100 * ctr[j][k], 1) for k in range(K)],
            'cos2': [redondear(cos2[j][k], 3) for k in range(K)],
        } for j in range(J)],
        'Z': Z,
        'sumasFila': [sum(fila) for fila in Z],
        'sumasColumna': nj,
        'residuos': [[redondear(x, 3) for x in fila] for fila in S],
        'autovalores': [redondear(l, 4) for l in lam],
        'porcentajes': [redondear(100 * l / total, 1) for l in lam],
        'acumulado': [redondear(100 * sum(lam[:k + 1]) / total, 1) for k in range(K)],
        'individuos': [{
            'coord': [redondear(f[i][k], 3) for k in range(K)],
            'ctr': [redondear(100 * ctr_ind[i][k], 1) for k in range(K)],
            'cos2': [redondear(cos2_ind[i][k], 3) for k in range(K)],
        } for i in range(n)],
        'aportePromedio': redondear(100 / J, 1),
        'benzecri': {
            'umbral': redondear(umbral, 4),
            'superan': [k + 1 for k in range(K) if lam[k] > umbral],
            'ajustados': [redondear(a, 4) for a in ajustados],
            'porcentajesAjustados': [redondear(100 * a / total_adj, 1) if total_adj else 0
                                     for a in ajustados],
        },
        'burt': {
            'autovalores': [redondear(l, 4) for l in lam_burt],
            'cuadrados': [redondear(l * l, 4) for l in lam],
        },
        # the farthest pair of people, three ways: by Z, by every axis, by the map's two
        'salto': salto,
        # the matrix form, and one person and one category recomputed from it
        'svd': svd,
        'matricial': matricial,
        # unrounded, for the other set-ups; stripped before writing
        '_raw': {'lam': lam, 'V': V, 'g': g, 'f': f, 'S': S, 'Z': Z, 'nj': nj, 'c': c,
                 'cats': cats, 'd2': d2, 'ctr': ctr, 'cos2': cos2},
    }


def transicion(base):
    """The formula verified on person 1, axis 1, the way the block writes it out."""
    raw = base['_raw']
    Z, g, lam, f, cats = raw['Z'], raw['g'], raw['lam'], raw['f'], raw['cats']
    Q = base['Q']
    suyas = [j for j in range(len(cats)) if Z[0][j]]
    bari = sum(g[j][0] for j in suyas) / Q
    dilatado = bari / math.sqrt(lam[0])
    assert cerca(dilatado, f[0][0])
    return {
        'individuo': 1,
        'categorias': [{'variable': cats[j][0], 'nivel': cats[j][1],
                        'coord': redondear(g[j][0], 3)} for j in suyas],
        'baricentro': redondear(bari, 4),
        'raizLambda': redondear(math.sqrt(lam[0]), 4),
        'dilatado': redondear(dilatado, 4),
        'coordPublicada': redondear(f[0][0], 3),
    }


def rara(base, montaje):
    """What the rare category did, compared against the analysis without it."""
    raw = montaje['_raw']
    cats, nj, c, d2, lam, ctr = raw['cats'], raw['nj'], raw['c'], raw['d2'], raw['lam'], raw['ctr']
    j = cats.index(('Endulzante', 'Stevia'))
    portador = [i + 1 for i in range(N) if ENDULZANTE[i] == 'Stevia']
    assert portador == [7] and nj[j] == 1
    assert cerca(d2[j], N / 1 - 1)
    # the axis Stevia dominates is the one where its contribution is largest
    eje = max(range(len(lam)), key=lambda k: ctr[j][k])
    resto = max(math.sqrt(d2[a]) for a in range(len(cats)) if a != j)
    inercia_stevia = c[j] * d2[j] / sum(lam)
    return {
        'variable': 'Endulzante', 'nivel': 'Stevia', 'n': nj[j], 'portador': portador[0],
        'd2': redondear(d2[j], 4), 'd': redondear(math.sqrt(d2[j]), 2),
        'radioResto': redondear(resto, 2),
        'ejeFabricado': eje + 1,
        'inerciaTotalPct': redondear(100 * inercia_stevia, 1),
        'individuo7': {
            'antes': [redondear(x, 2) for x in base['_raw']['f'][6][:2]],
            'despues': [redondear(x, 2) for x in raw['f'][6][:2]],
        },
        'pctEje1': {'antes': base['porcentajes'][0], 'despues': montaje['porcentajes'][0]},
    }


def suplementarias(base):
    """Nada and Stevia projected onto the base MCA, by two roads that must agree.

    Transition: the barycentre of the category's individuals, dilated by 1/√λ.
    Dual: the category's column profile times the STANDARD coordinates of the
    individuals, with U obtained on its own from SSᵀ — an independent diagonalisation,
    so agreeing is a check and not a restatement.
    """
    raw = base['_raw']
    lam, f, S, Z, cats = raw['lam'], raw['f'], raw['S'], raw['Z'], raw['cats']
    K = len(lam)
    n, Q = N, base['Q']

    # the dual road: U from SSᵀ
    SSt = [[sum(S[i][j] * S[l][j] for j in range(len(S[0]))) for l in range(n)] for i in range(n)]
    vals_u, U = jacobi(SSt)
    ejes = [k for k, v in enumerate(vals_u) if v > NULO]
    assert len(ejes) == K
    for k in range(K):
        assert cerca(vals_u[ejes[k]], lam[k], 1e-8), 'SSᵀ y SᵀS no dan los mismos λ'
    U = [U[k] for k in ejes]
    f_dual = [[math.sqrt(n) * U[k][i] * math.sqrt(lam[k]) for k in range(K)] for i in range(n)]
    # same sign convention, applied through the categories these individuals imply
    for k in range(K):
        g_k = [(1 / math.sqrt(lam[k])) * (1 / raw['nj'][j]) * sum(Z[i][j] * f_dual[i][k] for i in range(n))
               for j in range(len(cats))]
        if fijar_signo(k, g_k, cats, SIGNOS_BASE):
            for i in range(n):
                f_dual[i][k] = -f_dual[i][k]
    for i in range(n):
        for k in range(K):
            assert cerca(f_dual[i][k], f[i][k], 1e-8), 'la vía dual no reproduce a los individuos'
    phi = [[f_dual[i][k] / math.sqrt(lam[k]) for k in range(K)] for i in range(n)]

    out = []
    for nivel in ('Nada', 'Stevia'):
        miembros = [i for i in range(n) if ENDULZANTE[i] == nivel]
        nj = len(miembros)
        por_transicion = [(1 / math.sqrt(lam[k])) * sum(f[i][k] for i in miembros) / nj
                          for k in range(K)]
        por_dual = [sum(phi[i][k] for i in miembros) / nj for k in range(K)]
        for k in range(K):
            assert cerca(por_transicion[k], por_dual[k], 1e-8), \
                f'{nivel}: transición y vía dual no coinciden en el eje {k + 1}'
        d2 = n / nj - 1
        out.append({
            'variable': 'Endulzante', 'nivel': nivel, 'n': nj,
            'individuos': [i + 1 for i in miembros],
            'd2': redondear(d2, 4),
            'coord': [redondear(x, 3) for x in por_transicion],
            'coordDual': [redondear(x, 3) for x in por_dual],
            'cos2Plano': redondear((por_transicion[0] ** 2 + por_transicion[1] ** 2) / d2, 3),
        })
    return out


def destinos(base, montaje, supl):
    """Stevia active against Stevia supplementary, the five comparisons side by side."""
    raw = montaje['_raw']
    j = raw['cats'].index(('Endulzante', 'Stevia'))
    eje = max(range(len(raw['lam'])), key=lambda k: raw['ctr'][j][k])
    stevia = next(s for s in supl if s['nivel'] == 'Stevia')
    g = raw['g'][j]
    return {
        'ejeFabricado': eje + 1,
        'activa': {
            'posicion': [redondear(g[0], 2), redondear(g[1], 2)],
            'ctrEje': redondear(100 * raw['ctr'][j][eje], 1),
            'pctEje1': montaje['porcentajes'][0],
            'individuo7': [redondear(x, 2) for x in raw['f'][6][:2]],
            'cos2Plano': redondear((g[0] ** 2 + g[1] ** 2) / raw['d2'][j], 2),
        },
        'suplementaria': {
            'posicion': [redondear(x, 2) for x in stevia['coord'][:2]],
            'ctrEje': 0,
            'pctEje1': base['porcentajes'][0],
            'individuo7': [redondear(x, 2) for x in base['_raw']['f'][6][:2]],
            'cos2Plano': redondear(stevia['cos2Plano'], 2),
        },
    }


def famd(numericas, categoricas):
    """The mixed analysis of the same eight people, checked as it goes."""
    n = N
    columnas = []       # (tipo, variable, nivel, valores transformados)
    for clave, rotulo, vals in numericas:
        media = sum(vals) / n
        sd = math.sqrt(sum((v - media) ** 2 for v in vals) / n)      # population
        columnas.append(('num', clave, None, [(v - media) / sd for v in vals]))
    niveles = {}
    for var, lvls, vals in categoricas:
        niveles[var] = list(lvls)
        for lvl in lvls:
            p = sum(1 for v in vals if v == lvl) / n
            columnas.append(('cat', var, lvl,
                             [(1 if v == lvl else 0) / math.sqrt(p) - math.sqrt(p) for v in vals]))
    m = len(columnas)
    X = [[columnas[a][3][i] for a in range(m)] for i in range(n)]

    # 6.1 · variances: 1 for a numeric, 1 − p for an indicator; total p_num + Σ(J_q − 1)
    varianzas = [sum(x * x for x in col[3]) / n for col in columnas]
    inercia = len(numericas) + sum(len(lvls) - 1 for _, lvls, _ in categoricas)
    assert cerca(sum(varianzas), inercia), 'la inercia total no es p_num + Σ(J_q − 1)'

    C = [[sum(X[i][a] * X[i][b] for i in range(n)) / n for b in range(m)] for a in range(m)]
    vals, vecs = jacobi(C)
    ejes = [k for k, v in enumerate(vals) if v > NULO]
    lam = [vals[k] for k in ejes]
    V = [vecs[k] for k in ejes]
    K = len(lam)
    assert cerca(sum(lam), inercia), f'Σλ = {sum(lam)} ≠ {inercia}'
    F = [[sum(X[i][a] * V[k][a] for a in range(m)) for k in range(K)] for i in range(n)]

    # signs: cups negative on axis 1, person 7 positive on axis 2, and on every other
    # axis the first person with a non-null score positive — not «the largest loading»,
    # which ties between the two mirror-image indicators of a binary variable and made
    # axis 3 come out flipped on another machine (see primero_no_nulo)
    i_tazas = next(a for a, col in enumerate(columnas) if col[1] == 'tazas')
    for k in range(K):
        if k == 0:
            cov = sum(F[i][0] * X[i][i_tazas] for i in range(n)) / n
            flip = cov > 0
        elif k == 1:
            flip = F[6][1] < 0
        else:
            flip = F[primero_no_nulo([F[i][k] for i in range(n)])][k] < 0
        if flip:
            V[k] = [-x for x in V[k]]
            for i in range(n):
                F[i][k] = -F[i][k]

    # var(F_k) = λ_k, cov(F_k, F_l) = 0
    for k in range(K):
        assert cerca(sum(F[i][k] ** 2 for i in range(n)) / n, lam[k]), 'var(F_k) ≠ λ_k'
        for l in range(k + 1, K):
            assert cerca(sum(F[i][k] * F[i][l] for i in range(n)) / n, 0), 'los ejes no son ortogonales'

    # 7.2 · r² per numeric, 7.3 · η² per categorical, and the balance property
    def r2_de(clave):
        a = next(a for a, col in enumerate(columnas) if col[1] == clave)
        out = []
        for k in range(K):
            cov = sum(F[i][k] * X[i][a] for i in range(n)) / n
            out.append(cov / math.sqrt(lam[k]))          # var(x) = 1 already
        return out                                        # the correlations r
    correl = {clave: r2_de(clave) for clave, _, _ in numericas}
    r2 = {clave: [r * r for r in rs] for clave, rs in correl.items()}

    def anova(var, k):
        vals = next(v for vv, _, v in categoricas if vv == var)
        grupos = {}
        for i in range(n):
            grupos.setdefault(vals[i], []).append(i)
        medias = {lvl: sum(F[i][k] for i in idx) / len(idx) for lvl, idx in grupos.items()}
        sc_total = sum(F[i][k] ** 2 for i in range(n))    # F is centred
        sc_entre = sum(len(idx) * medias[lvl] ** 2 for lvl, idx in grupos.items())
        sc_dentro = sum((F[i][k] - medias[lvl]) ** 2 for lvl, idx in grupos.items() for i in idx)
        assert cerca(sc_entre + sc_dentro, sc_total), 'SC_entre + SC_dentro ≠ SC_total'
        return grupos, medias, sc_total, sc_entre, sc_dentro
    eta2 = {}
    for var, _, _ in categoricas:
        eta2[var] = []
        for k in range(K):
            _, _, sc_total, sc_entre, _ = anova(var, k)
            eta2[var].append(sc_entre / sc_total)
    for k in range(K):
        suma = sum(r2[c][k] for c in r2) + sum(eta2[v][k] for v in eta2)
        assert cerca(suma, lam[k]), f'Σr² + Ση² = {suma} ≠ λ_{k + 1} = {lam[k]}'

    # 7.2 in full, for cups on axis 1
    a = i_tazas
    media_t = sum(TAZAS) / n
    cov_t = sum(F[i][0] * (TAZAS[i] - media_t) for i in range(n)) / n
    var_t = sum((t - media_t) ** 2 for t in TAZAS) / n
    r_t = cov_t / (math.sqrt(lam[0]) * math.sqrt(var_t))
    assert cerca(r_t * r_t, r2['tazas'][0])

    # 7.3 and 7.4 in full, for Bebida on axis 1
    grupos, medias, sc_total, sc_entre, sc_dentro = anova('Bebida', 0)
    tablas = []
    for lvl in niveles['Bebida']:
        filas = []
        for i in grupos[lvl]:
            desvio = F[i][0] - medias[lvl]
            filas.append({'individuo': i + 1, 'f': redondear(F[i][0], 4),
                          'desvio': redondear(desvio, 4), 'cuadrado': redondear(desvio ** 2, 4)})
        tablas.append({'nivel': lvl, 'n': len(grupos[lvl]), 'media': redondear(medias[lvl], 4),
                       'filas': filas,
                       'subtotal': redondear(sum((F[i][0] - medias[lvl]) ** 2 for i in grupos[lvl]), 4)})
    aportes = [(i, (F[i][0] - medias[BEBIDA[i]]) ** 2) for i in range(n)]
    i_max, cuad_max = max(aportes, key=lambda t: t[1])
    p_de = {lvl: len(idx) / n for lvl, idx in grupos.items()}
    por_baricentros = sum(p_de[lvl] * medias[lvl] ** 2 for lvl in grupos) / lam[0]
    assert cerca(por_baricentros, eta2['Bebida'][0]), 'η² por baricentros ≠ η² por ANOVA'

    # 8 · the three plots' data
    baricentros = {}
    for var, lvls, vals in categoricas:
        baricentros[var] = {}
        for lvl in lvls:
            idx = [i for i in range(n) if vals[i] == lvl]
            baricentros[var][lvl] = {'n': len(idx),
                                     'coord': [redondear(sum(F[i][k] for i in idx) / len(idx), 3)
                                               for k in range(K)]}

    total = sum(lam)
    return {
        'n': n,
        'numericas': [{'clave': clave, 'rotulo': rotulo, 'valores': vals}
                      for clave, rotulo, vals in numericas],
        'categoricas': [{'variable': var, 'niveles': list(lvls)} for var, lvls, _ in categoricas],
        'inerciaTotal': inercia,
        'columnas': [{'tipo': t, 'variable': v, 'nivel': l, 'varianza': redondear(var, 4)}
                     for (t, v, l, _), var in zip(columnas, varianzas)],
        'ejes': K,
        'autovalores': [redondear(l, 4) for l in lam],
        'porcentajes': [redondear(100 * l / total, 1) for l in lam],
        'acumulado': [redondear(100 * sum(lam[:k + 1]) / total, 1) for k in range(K)],
        'puntuaciones': [[redondear(F[i][k], 4) for k in range(K)] for i in range(n)],
        'varianzaPuntuaciones': [redondear(sum(F[i][k] ** 2 for i in range(n)) / n, 4)
                                 for k in range(K)],
        'r2': {c: [redondear(x, 4) for x in xs] for c, xs in r2.items()},
        'eta2': {v: [redondear(x, 4) for x in xs] for v, xs in eta2.items()},
        'correlaciones': {c: [redondear(x, 3) for x in xs] for c, xs in correl.items()},
        'baricentros': baricentros,
        'pearson': {
            'variable': 'tazas', 'eje': 1,
            'cov': redondear(cov_t, 4), 'varTazas': redondear(var_t, 4),
            'sTazas': redondear(math.sqrt(var_t), 4), 'sF': redondear(math.sqrt(lam[0]), 4),
            'r': redondear(r_t, 4), 'r2': redondear(r_t * r_t, 4),
        },
        'anova': {
            'variable': 'Bebida', 'eje': 1,
            'scTotal': redondear(sc_total, 4), 'scEntre': redondear(sc_entre, 4),
            'scDentro': redondear(sc_dentro, 4),
            'eta2': redondear(sc_entre / sc_total, 4),
            'grupos': tablas,
            'mayorAporte': {'individuo': i_max + 1, 'cuadrado': redondear(cuad_max, 4),
                            'fraccion': redondear(100 * cuad_max / sc_dentro, 0)},
            'porBaricentros': redondear(por_baricentros, 4),
        },
    }


# ── the guide as oracle ─────────────────────────────────────────────────────
# (name, value here, value the guide prints[, tolerance]). The default tolerance is
# half a unit of the guide's last decimal, never tighter than 5e-4: the guide rounds,
# this does not.
#
# Three figures of the guide are NOT compared as printed, because the guide slipped
# and numpy agrees with this script on all three (checked by hand before deciding):
#   · Mañana's cos² on axis 2 is 0.707² = 0.500, not the 0.427 the table repeats
#     from axis 1; only axis 1 is compared.
#   · Stevia's cos² in the plane as an active category is 0.9265; the guide's 0.92
#     comes from squaring the coordinates it had already rounded to two decimals, so
#     it is compared with a tolerance of 0.01.
#   · The FAMD has FOUR non-null eigenvalues — the matrix has rank 4 — and the guide
#     prints three, folding 0.1174 and 0.0240 into a single «0.1414» so that the sum
#     stays 4. The first two are compared as printed; the tail is compared as a sum.
def oraculo(base, montaje, supl, dest, mixto):
    cat = lambda m, var, lvl: next(c for c in m['categorias'] if c['variable'] == var and c['nivel'] == lvl)
    checks = [
        ('MCA.λ', base['_raw']['lam'], [0.5690, 0.3333, 0.0976]),
        ('MCA.Café.eje1', cat(base, 'Bebida', 'Café')['coord'][0], -0.924),
        ('MCA.Mañana', cat(base, 'Horario', 'Mañana')['coord'][:2], [-0.653, 0.707]),
        ('MCA.ind1.eje1', base['individuos'][0]['coord'][0], -0.986),
        ('MCA.ind7', base['individuos'][6]['coord'], [0.408, 0.816, -0.408]),
        ('MCA.Café.ctr1', cat(base, 'Bebida', 'Café')['ctr'][0], 25.0),
        ('MCA.Café.cos2', cat(base, 'Bebida', 'Café')['cos2'][:2], [0.854, 0]),
        ('MCA.Mañana.cos2.eje1', cat(base, 'Horario', 'Mañana')['cos2'][0], 0.427),
        ('MCA.transicion', [base['transicion']['baricentro'], base['transicion']['dilatado']],
         [-0.7435, -0.9856]),
        ('MCA.benzecri', base['benzecri']['ajustados'][0], 0.125),
        ('MCA.burt', base['burt']['autovalores'], [0.3238, 0.1111, 0.0095]),
        ('RARA.d2', montaje['rara']['d2'], 7),
        ('RARA.λ2', montaje['autovalores'][1], 0.449),
        ('RARA.pct', montaje['porcentajes'][:2], [42.9, 33.7]),
        ('RARA.Stevia', [cat(montaje, 'Endulzante', 'Stevia')['coord'][1],
                         cat(montaje, 'Endulzante', 'Stevia')['ctr'][1],
                         cat(montaje, 'Endulzante', 'Stevia')['cos2'][1]], [-2.534, 59.6, 0.917]),
        ('RARA.Mañana.eje2', cat(montaje, 'Horario', 'Mañana')['coord'][1], -0.576),
        ('RARA.ind7', montaje['rara']['individuo7']['antes'] + montaje['rara']['individuo7']['despues'],
         [0.41, 0.82, 0.19, -1.70]),
        ('RARA.inerciaStevia', montaje['rara']['inerciaTotalPct'], 21.9),
        ('SUPL.Stevia', next(s for s in supl if s['nivel'] == 'Stevia')['coord'], [0.541, 1.414, -1.307]),
        ('SUPL.Nada', next(s for s in supl if s['nivel'] == 'Nada')['coord'], [0.691, 0.471, 0.796]),
        ('SUPL.cos2.suplementaria', dest['suplementaria']['cos2Plano'], 0.33),
        ('SUPL.cos2.activa', dest['activa']['cos2Plano'], 0.92, 0.01),
        ('FAMD.varianzas', [c['varianza'] for c in mixto['columnas']], [1, 1, 0.5, 0.5, 0.5, 0.5]),
        ('FAMD.λ', mixto['autovalores'][:2], [3.2883, 0.5703]),
        ('FAMD.λ.cola', sum(mixto['autovalores'][2:]), 0.1414),
        ('FAMD.r2', [mixto['r2']['tazas'][0], mixto['r2']['sueno'][0]], [0.9146, 0.9538]),
        ('FAMD.eta2', [mixto['eta2']['Bebida'][0], mixto['eta2']['Horario'][0]], [0.7969, 0.6230]),
        ('FAMD.SC', [mixto['anova']['scTotal'], mixto['anova']['scEntre'], mixto['anova']['scDentro']],
         [26.31, 20.96, 5.34]),
        ('FAMD.subtotales', [g['subtotal'] for g in mixto['anova']['grupos']], [2.3031, 3.0400]),
        ('FAMD.circulo', mixto['correlaciones']['tazas'][:2] + mixto['correlaciones']['sueno'][:2],
         [-0.956, -0.23, 0.977, -0.09]),
        ('FAMD.pearson', [mixto['pearson']['cov'], mixto['pearson']['r']], [-2.876, -0.9564]),
    ]
    fallos = []
    for nombre, got, want, *tol in checks:
        got = got if isinstance(got, list) else [got]
        want = want if isinstance(want, list) else [want]
        for g, w in zip(got, want):
            decimales = len(str(w).split('.')[1]) if '.' in str(w) else 0
            tol_w = tol[0] if tol else max(5e-4, 0.5 * 10 ** -decimales)
            if abs(g - w) > tol_w + 1e-12:
                fallos.append(f'{nombre}: sale {g}, la guía dice {w}')
    assert not fallos, 'el ejemplo se aleja de la guía:\n  ' + '\n  '.join(fallos)
    return len(checks)


def main():
    base = mca(BASE, SIGNOS_BASE)
    base['transicion'] = transicion(base)
    montaje = mca(RARA, SIGNOS_RARA)
    montaje['rara'] = rara(base, montaje)
    supl = suplementarias(base)
    dest = destinos(base, montaje, supl)
    mixto = famd(NUMERICAS, [BASE[0], BASE[1]])
    comprobadas = oraculo(base, montaje, supl, dest, mixto)

    for m in (base, montaje):
        m.pop('_raw')

    j = lambda o: json.dumps(o, ensure_ascii=False)
    L = [
        '/* Generated by scripts/ejemplo_mca_famd.py — do not edit by hand.',
        '',
        '   The eight-person example session 7 teaches MCA and FAMD on, in the four set-ups',
        '   of mca_famd_guia.md. Every identity the blocks state was asserted before this was',
        '   written, and every figure was compared against the guide, which is the oracle.',
        '',
        '   Nothing is computed in the browser: the blocks interpolate what is here. */',
        '',
        f'export const PERSONAS = {N};',
        '',
        '/* The three tables the blocks show, one row per person. */',
        'export const TABLA = ' + j({'columnas': ['Bebida', 'Horario', 'Azúcar'],
                                    'filas': [[BEBIDA[i], HORARIO[i], AZUCAR[i]] for i in range(N)]}) + ';',
        'export const TABLA_RARA = ' + j({'columnas': ['Bebida', 'Horario', 'Endulzante'],
                                         'filas': [[BEBIDA[i], HORARIO[i], ENDULZANTE[i]] for i in range(N)]}) + ';',
        'export const TABLA_MIXTA = ' + j({'columnas': ['Bebida', 'Horario', 'tazas/día', 'horas de sueño'],
                                          'filas': [[BEBIDA[i], HORARIO[i], TAZAS[i], SUENO[i]] for i in range(N)]}) + ';',
        '',
        '/* MCA of Bebida, Horario, Azúcar. Coordinates are principal; `ctr` in percent;',
        '   `cos2` per axis. `Z` is the indicator matrix, `residuos` the standardised',
        '   residuals S. Signs: Café < 0 on axis 1, Mañana > 0 on axis 2. */',
        'export const MCA = ' + j(base) + ';',
        '',
        '/* The same people with Endulzante {Azúcar 4, Nada 3, Stevia 1} active. Signs:',
        '   Café < 0 on axis 1, Stevia < 0 on axis 2 — the map the guide draws. */',
        'export const MCA_RARA = ' + j(montaje) + ';',
        '',
        '/* Nada and Stevia projected onto MCA as supplementary categories, by the',
        '   transition formula (`coord`) and by the dual road (`coordDual`), which agree;',
        '   and the two fates of Stevia side by side. */',
        'export const SUPL = ' + j({'categorias': supl, 'destinos': dest}) + ';',
        '',
        '/* FAMD of Bebida, Horario, cups a day and hours of sleep. Numerics standardised',
        '   with the population deviation; indicators z/√p − √p; individuals weigh 1/n, so',
        '   var(F_k) = λ_k. Signs: cups < 0 on axis 1, person 7 > 0 on axis 2. */',
        'export const FAMD = ' + j(mixto) + ';',
        '',
    ]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(L))

    fmt = lambda xs: ', '.join(f'{x}' for x in xs)
    print(f'{N} personas → {os.path.relpath(OUT, ROOT)}')
    print(f'  MCA       λ = ({fmt(base["autovalores"])}) · {fmt(base["porcentajes"])} % · '
          f'Burt = ({fmt(base["burt"]["autovalores"])}) · Benzécri eje 1 = {base["benzecri"]["ajustados"][0]}')
    print(f'  MCA_RARA  λ = ({fmt(montaje["autovalores"])}) · {fmt(montaje["porcentajes"])} % · '
          f'Stevia d² = {montaje["rara"]["d2"]}, {montaje["rara"]["inerciaTotalPct"]} % de la inercia')
    print(f'  SUPL      ' + ' · '.join(f'{s["nivel"]} en ({fmt(s["coord"])})' for s in supl))
    print(f'  FAMD      λ = ({fmt(mixto["autovalores"])}) · {fmt(mixto["porcentajes"])} % · '
          f'SC = {mixto["anova"]["scTotal"]} = {mixto["anova"]["scEntre"]} + {mixto["anova"]["scDentro"]}')
    print(f'  {comprobadas} comparaciones con la guía, todas dentro de tolerancia')


if __name__ == '__main__':
    main()
