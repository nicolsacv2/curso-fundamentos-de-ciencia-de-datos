#!/usr/bin/env python3
"""Run session 6's cleaning chain over the class table and publish its results.

Reads the same answers scripts/extract_salon.py publishes and writes
src/data/salon_limpio.js: the table standardised, described, its outliers found
with the boxplot rule, its holes filled by random sampling, described again, and
reduced with a PCA of what is left quantitative.

The chain, in the order session 6's entrada walks it:

  1. standardise the text   trim, strip accents, lowercase, drop stop words
  2. describe (before)      the session 4 box of measures, column by column
  3. find the outliers      the boxplot rule, at 1.5 and at 3 IQRs — over the
                            genuinely quantitative columns ONLY (see step 4)
  4. fold the rare levels   RareLabelEncoder over the ordinal columns
  5. drop one column        «pantalla h/día» — see DESCARTADAS
  6. impute                 RandomSampleImputer over holes AND flagged outliers
  7. describe (after)       the same measures, to see what the cleaning moved
  8. PCA                    of the quantitative columns that survived
  9. three pair matrices    quantity × quantity, quantity × name, name × name
 10. FAMD                   of EVERY column that came out clean — the twelve
                            quantities the PCA saw and the sixteen names and ranks
                            it could not — in two set-ups, plus the invented-cell
                            markers projected as supplementary categories

An ordinal scale does not go through step 3. The interquartile rule asks «how far
is this from the middle, in units of spread», and on a bounded rank there are no
units and no spread to speak of: the ends of «balanceada 1–5» are valid answers by
construction, not anomalies, and calling the two people who answered 1 outliers
would have the imputer invent replacements for them. What a rank admits is what
session 4 concluded it admits — order and count — so its thin levels are folded
together with RareLabelEncoder instead, which is the same job the box does for a
quantity. That also takes it out of the PCA: once its levels are labels, there is
nothing left to take a variance of. It comes back in block 1, with the MCA.

Nothing here runs in the browser. The class sees the results drawn; the draws
happen once, here, with the seed pinned, so the Tuesday class and the Thursday
class see the same table.

THE ONE SCRIPT WITH A DEPENDENCY. feature-engine, pinned in
scripts/requirements.txt. It never reaches the deploy: Hostinger builds with
`pnpm build`, which touches no Python. Regenerating the raw table
(extract_salon.py) and auditing these numbers (check_salon.py) need nothing
installed — that is deliberate.

    python3 -m venv .venv
    .venv/bin/pip install -r scripts/requirements.txt
    .venv/bin/python scripts/clean_salon.py
"""

import json
import os
import re
import statistics as st
import sys
import unicodedata

import numpy as np
import pandas as pd
from feature_engine.encoding import RareLabelEncoder
from feature_engine.imputation import AddMissingIndicator, RandomSampleImputer

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)

import extract_salon as src              # noqa: E402  (needs sys.path first)

SALIDA = os.path.join(RAIZ, 'src', 'data', 'salon_limpio.js')

# Pinned, and the reason is on screen in the block: without it every run would
# draw different values and the class on Tuesday would not see the class on
# Thursday's table. 20260915 is the date the chain was first run.
SEMILLA = 20260915

# The boxplot rule. 1.5 is the one everybody quotes; 3 is the one that shows the
# threshold was a decision. Both are computed, because the block shows both.
CORTES = (1.5, 3.0)

# A level with fewer than this share of the class is folded into one «raro» bucket.
# 0.05 of 27 answers is 1.35, so it catches the levels a single person chose. The
# next step up, 0.10, would fold «1» and «5» together — opposite ends of the scale
# in one bucket, which on a rank is worse than leaving them alone.
TOL_RAROS = 0.05
ETIQUETA_RARO = 'raro'

# How many variables each of the three matrices shows. Eight is what fits: at the 980 px
# the session's figures are drawn at, eight columns give panels of about 115 px, where a
# point, a box and a bar can still be told apart from the back of the room. Twelve would
# give 70 px, where only the texture reads and no single value does.
VARS_MATRIZ = 8

# How many bins a histogram on the diagonal of the scatter matrix gets. Small, because
# the panel is small: more bins on 27 answers is noise drawn at higher resolution.
BINS_DIAGONAL = 7

# What shape a non-numeric variable has, and therefore what it is good for. The
# three numbers are here, as constants, because the shapes end up on a wall as a
# classification and a classification with its thresholds hidden inside an `if` is
# an opinion wearing the clothes of a result.
#
#   único     more levels than people can fill: each level describes ONE person,
#             so it is an identifier or free text, not a category.
#   dominada  almost everybody answered the same. It separates nobody.
#   cola      a long tail of levels with a single person in them.
UMBRAL_UNICO = 0.70        # niveles / personas
UMBRAL_DOMINADA = 0.80     # el nivel mayor / personas
UMBRAL_COLA = 0.30         # proporción de niveles con una sola persona

# The shapes are a DIAGNOSIS, not a gate. Rare-level grouping runs over every
# non-numeric variable that is analysable at all: where there is nothing rare it
# changes nothing, and `balanceada` — a «sana» — was already being grouped before
# any of this existed. Gating the treatment on the shape would make a variable's
# treatment depend on which side of 0.30 it happened to land.

# Columns that do not enter the imputation or the PCA, and why. The reason is
# published: the block says it out loud rather than quietly dropping a column.
DESCARTADAS = {
    'pantalla': 'entre huecos y atípicos habría que imputarle más de la mitad de los '
                'valores, y el plano factorial estaría dibujando los sorteos del '
                'imputador y no a la clase',
}

# Stop words only make sense where somebody wrote a phrase. In a closed-option
# column they destroy meaning — «Negro, sin azúcar» without «sin» is a different
# answer — so the treatment is declared per column and not applied to everything.
CON_STOPWORDS = {'depto', 'municipio', 'area', 'libro', 'sector'}

PALABRAS_VACIAS = {
    'a', 'al', 'ante', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'lo',
    'los', 'o', 'por', 'para', 'que', 'se', 'su', 'sus', 'un', 'una', 'y',
    # the abbreviations that turn «Bogotá D.C.» into four spellings of one city
    'd', 'c', 'dc',
}


def sin_tildes(s):
    """«Bogotá» → «Bogota». Decomposes and drops the combining marks."""
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn')


def estandarizar(valor, con_stopwords, clave=None):
    """The four treatments, in the order the block shows them.

    `clave` lets a declared manual correction apply first. Those live in
    extract_salon.CORRECCIONES with their reason, and they have to hold here too:
    a correction declared once that only half the pipeline honours is worse than
    no correction, because the two halves then disagree about what the table says.
    """
    if clave is not None:
        valor = src.corregido(clave, valor)
    s = valor.strip()                                   # 1 · trim
    s = sin_tildes(s)                                   # 2 · accents
    s = s.lower()                                       # 3 · lowercase
    if con_stopwords:                                   # 4 · stop words
        s = ' '.join(p for p in re.split(r'[\s.,;]+', s)
                     if p and p not in PALABRAS_VACIAS)
    return s


def pasos_de_texto(valores, con_stopwords, clave=None):
    """The same column after each of the four treatments, for the before/after.

    What the block needs is not the final value but how many distinct categories
    survive each step: that is the number that makes «estandarizar» visible.
    """
    pasos, s = [], [src.corregido(clave, v) if clave else v for v in valores]
    s = [v.strip() for v in s];                      pasos.append(('recorte', list(s)))
    s = [sin_tildes(v) for v in s];                  pasos.append(('tildes', list(s)))
    s = [v.lower() for v in s];                      pasos.append(('minusculas', list(s)))
    if con_stopwords:
        s = [' '.join(p for p in re.split(r'[\s.,;]+', v)
                      if p and p not in PALABRAS_VACIAS) for v in s]
    pasos.append(('vacias', list(s)))
    return pasos


def forma_de(niveles, mayor, solos, personas):
    """En cuál de las cuatro formas cae una variable no numérica.

    Order matters: a variable can be both «casi todo único» and «cola larga», and
    the first is the one that decides what can be done with it.
    """
    if niveles >= personas * UMBRAL_UNICO:
        return 'unico'
    if mayor >= personas * UMBRAL_DOMINADA:
        return 'dominada'
    if niveles and solos / niveles >= UMBRAL_COLA:
        return 'cola'
    return 'sana'


MOTIVOS = {
    'unico': 'casi cada persona dio una respuesta distinta, así que un nivel suyo '
             'describe a una persona y no a un grupo: es un identificador o texto '
             'libre, no una categoría',
    'dominada': 'casi toda la clase respondió lo mismo, así que no sirve para '
                'distinguir a unas personas de otras',
    'cola': 'muchos de sus niveles los eligió una sola persona',
    'sana': 'pocos niveles y repartidos',
}


def diagnostico(valores, personas):
    """Las cifras con las que se clasifica una variable no numérica."""
    import collections
    llenos = [v for v in valores if v != '']
    cnt = collections.Counter(llenos)
    niveles = len(cnt)
    mayor = max(cnt.values()) if cnt else 0
    solos = sum(1 for n in cnt.values() if n < TOL_RAROS * personas)
    return {
        'niveles': niveles,
        # The sizes of the levels, biggest first. This is what makes the four shapes
        # a picture instead of a table: a «dominada» is one long block, a «cola» is
        # a block and then slivers, a «único» is nothing but slivers.
        'tamanos': sorted(cnt.values(), reverse=True),
        'mayor': mayor,
        'mayorValor': cnt.most_common(1)[0][0] if cnt else None,
        'solos': solos,
        'vacias': len(valores) - len(llenos),
        'forma': forma_de(niveles, mayor, solos, personas),
    }


def extremos_ordinales(clave, niveles):
    """El nivel más alto y el más bajo de una variable ordinal, ya estandarizados.

    El orden sale de extract_salon.ORDEN_NIVELES cuando los niveles son etiquetas
    («S · M · L · XL» no se ordena solo: alfabéticamente sale L · M · S · XL) y del
    propio número cuando son números, como «balanceada 1–5».
    """
    declarado = src.ORDEN_NIVELES.get(clave)
    if declarado:
        orden = [estandarizar(v, clave in CON_STOPWORDS, clave) for v in declarado]
        presentes = [v for v in orden if v in niveles]
    elif all(re.fullmatch(r'-?\d+(\.\d+)?', v) for v in niveles):
        presentes = sorted(niveles, key=float)
    else:
        return set()
    return {presentes[0], presentes[-1]} if presentes else set()


def correlacion(a, b):
    """Pearson entre dos columnas del mismo largo. Sin dependencias."""
    ma, mb = st.mean(a), st.mean(b)
    num = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    den = (sum((x - ma) ** 2 for x in a) * sum((y - mb) ** 2 for y in b)) ** 0.5
    return num / den if den else 0.0


def histograma(valores, bins=BINS_DIAGONAL):
    """Los recuentos por tramo, con los cortes, para la diagonal de la matriz."""
    lo, hi = min(valores), max(valores)
    paso = (hi - lo) / bins or 1
    cuenta = [0] * bins
    for v in valores:
        cuenta[min(bins - 1, int((v - lo) / paso))] += 1
    return {'lo': src.redondear(lo, 2), 'hi': src.redondear(hi, 2),
            'cuenta': cuenta}


def caja(valores, k):
    """Los cortes del diagrama de caja y qué queda fuera, con el umbral k."""
    v = sorted(valores)
    q1, q3 = src.cuantil(v, 0.25), src.cuantil(v, 0.75)
    iqr = q3 - q1
    lo, hi = q1 - k * iqr, q3 + k * iqr
    # The whiskers stop at the last real value inside the fence, not at the fence.
    dentro = [x for x in v if lo <= x <= hi]
    return {
        'q1': src.redondear(q1, 2),
        'q3': src.redondear(q3, 2),
        'iqr': src.redondear(iqr, 2),
        'corteBajo': src.redondear(lo, 2),
        'corteAlto': src.redondear(hi, 2),
        'bigoteBajo': src.redondear(min(dentro), 2) if dentro else None,
        'bigoteAlto': src.redondear(max(dentro), 2) if dentro else None,
        'atipicos': [src.redondear(x, 2) for x in v if x < lo or x > hi],
    }


def pca(matriz, nombres):
    """PCA sobre la matriz de correlaciones, con los datos ya estandarizados.

    Standardising is a decision, not a requirement of the method, and here it is
    forced: the columns are minutes, hours, servings and counts of pets. Without
    it «minutos ayer», whose variance is thousands of times the others', would be
    the first component on its own and the analysis would be about its units.
    """
    X = np.asarray(matriz, dtype=float)
    Z = (X - X.mean(axis=0)) / X.std(axis=0, ddof=1)
    R = np.corrcoef(Z, rowvar=False)
    lam, vec = np.linalg.eigh(R)
    orden = np.argsort(lam)[::-1]
    lam, vec = lam[orden], vec[:, orden]

    # Sign is arbitrary in an eigenvector; pinning it keeps the plot from flipping
    # between runs, which in a projected figure looks like a different result.
    for j in range(vec.shape[1]):
        if vec[np.argmax(np.abs(vec[:, j])), j] < 0:
            vec[:, j] *= -1

    total = lam.sum()
    cargas = vec * np.sqrt(np.maximum(lam, 0))
    puntos = Z @ vec
    return {
        'variables': nombres,
        'estandarizado': True,
        'autovalores': [src.redondear(x, 4) for x in lam],
        'porcentajes': [src.redondear(100 * x / total, 2) for x in lam],
        'acumulado': [src.redondear(100 * s / total, 2) for s in np.cumsum(lam)],
        'cargas': [[src.redondear(c, 4) for c in fila] for fila in cargas],
        'puntos': [[src.redondear(p, 3) for p in fila[:2]] for fila in puntos],
    }

# ── 10 · the FAMD of the whole clean table ──────────────────────────────────
# The closing of session 6 answers «¿qué falta?» by running the mixed analysis over
# the same imputed table the entrada showed, with every column that came out clean.
# It is computed here, with the same data and the same seed, because the class must
# see results and not a computation — and because the verifier has to be able to
# recompute its identities from what gets published.
#
# Weights, the FactoMineR convention: individuals 1/n; a quantity centred and divided
# by its POPULATION deviation (variance 1); an indicator z_j/√p_j − √p_j with
# p_j = n_j/n (variance 1 − p_j). Total inertia is then p_num + Σ_q Σ_{j∈q}(1 − p_j),
# which with every category active is p_num + Σ(J_q − 1). XᵀX/n is diagonalised;
# F = X·v; var_n(F_k) = λ_k. Every non-null axis is published, and every person's
# score on every one of them, so that a cos² can be checked and not believed.
#
# Two set-ups. `activo` has everything active, including the categories a single
# person holds — found by frequency, n_j = 1, never by name. `sinRaras` takes those
# columns out of X the way a specific MCA does (the person keeps the rest of their
# columns) and projects them as supplementary: their coordinate is their one person's.
# The invented-cell markers go in as supplementary too, in the active set-up only:
# they never enter X, which is what «no deformaron los ejes» means.
#
# η² is written as Σ_{j active} p_j·ḡ_jk²/λ_k. With every category active that IS the
# ANOVA η²; with a category set aside it is the between-groups sum over the categories
# that shaped the axes, which is the only version for which Σr² + Ση² = λ_k still
# holds — and that identity is what the verifier checks.
#
# Contributions are in percent and sum to 100 per axis: a category puts p_j·ḡ²/λ_k²,
# a quantity r²/λ_k, a person f²/(n·λ_k). cos² is coordinate² over the sum of squared
# coordinates across ALL axes, for categories and for people alike: it is the one
# definition that can be verified without a closed formula, and it is the classic one
# when every axis is kept.
NULO = 1e-9


def famd_salon(columna_limpia, numericas, categoricas, marcas, n):
    """The FAMD of the clean table, in its two set-ups. See the note above."""
    valores = {c: list(columna_limpia[c]) for c in numericas + categoricas}
    niveles = {c: sorted(set(valores[c])) for c in categoricas}
    conteo = {c: {v: valores[c].count(v) for v in niveles[c]} for c in categoricas}
    # the categories one person holds, by frequency
    raras = [(c, v) for c in categoricas for v in niveles[c] if conteo[c][v] == 1]

    def montaje(excluidas):
        cols = []                                # (tipo, variable, nivel, vector)
        for c in numericas:
            x = np.asarray(valores[c], dtype=float)
            cols.append(('num', c, None, (x - x.mean()) / x.std(ddof=0)))
        for c in categoricas:
            for v in niveles[c]:
                if (c, v) in excluidas:
                    continue
                z = np.asarray([1.0 if w == v else 0.0 for w in valores[c]])
                p = z.mean()
                cols.append(('cat', c, v, z / np.sqrt(p) - np.sqrt(p)))
        X = np.column_stack([col[3] for col in cols])
        activas = [(c, v) for t, c, v, _ in cols if t == 'cat']
        p_de = {(c, v): conteo[c][v] / n for c, v in activas}

        inercia_num = float(len(numericas))
        inercia_cat = sum(1 - p for p in p_de.values())
        inercia_var = {c: sum(1 - p_de[(cc, v)] for cc, v in activas if cc == c)
                       for c in categoricas}

        lam, vec = np.linalg.eigh(X.T @ X / n)
        orden = np.argsort(lam)[::-1]
        lam, vec = lam[orden], vec[:, orden]
        keep = lam > NULO
        lam, vec = lam[keep], vec[:, keep]
        # Sign by the largest loading, as the PCA does: no sentence of the closing
        # expects a category on a given side, and the prose says neither «left» nor
        # «right».
        for j in range(vec.shape[1]):
            if vec[np.argmax(np.abs(vec[:, j])), j] < 0:
                vec[:, j] *= -1
        F = X @ vec                              # n × K
        K = F.shape[1]
        total = float(lam.sum())
        assert abs(total - (inercia_num + inercia_cat)) < 1e-8, \
            f'Σλ = {total} ≠ p_num + Σ(1 − p_j) = {inercia_num + inercia_cat}'
        for k in range(K):
            assert abs(F[:, k].var(ddof=0) - lam[k]) < 1e-8, 'var(F_k) ≠ λ_k'

        # r² per quantity, correlations for the circle
        correl = {}
        for t, c, _, x in cols:
            if t == 'num':
                correl[c] = np.array([(F[:, k] * x).mean() / np.sqrt(lam[k]) for k in range(K)])
        r2 = {c: r * r for c, r in correl.items()}

        # barycentres and the partial η²
        bari = {}
        for c, v in activas:
            filas = [i for i, w in enumerate(valores[c]) if w == v]
            bari[(c, v)] = F[filas].mean(axis=0)
        eta2 = {c: np.array([sum(p_de[(cc, v)] * bari[(cc, v)][k] ** 2
                                 for cc, v in activas if cc == c) / lam[k]
                             for k in range(K)]) for c in categoricas}
        for k in range(K):
            suma = sum(r2[c][k] for c in numericas) + sum(eta2[c][k] for c in categoricas)
            assert abs(suma - lam[k]) < 1e-8, f'Σr² + Ση² = {suma} ≠ λ_{k + 1} = {lam[k]}'

        # contributions, in percent, and cos² over all axes
        ctr_cat = {cv: 100 * p_de[cv] * bari[cv] ** 2 / lam ** 2 for cv in activas}
        ctr_num = {c: 100 * r2[c] / lam for c in numericas}
        ctr_ind = 100 * F ** 2 / (n * lam)
        for k in range(K):
            total_k = (sum(ctr_cat[cv][k] for cv in activas) + sum(ctr_num[c][k] for c in numericas))
            assert abs(total_k - 100) < 1e-6, f'las contribuciones del eje {k + 1} suman {total_k}'
            assert abs(ctr_ind[:, k].sum() - 100) < 1e-6
        cos2_plano = lambda coords: float((coords[0] ** 2 + coords[1] ** 2) / (coords ** 2).sum())

        r2f = lambda x: src.redondear(float(x), 4)
        c3 = lambda xs: [src.redondear(float(x), 3) for x in xs]
        pct = lambda xs: [src.redondear(float(x), 2) for x in xs]
        salida = {
            'ejes': int(K),
            'categoriasActivas': len(activas),
            'inercia': {
                'total': r2f(total),
                'numericas': r2f(inercia_num),
                'categoricas': r2f(inercia_cat),
                'porVariable': {c: r2f(inercia_var[c]) for c in categoricas},
            },
            # the average share, which is the threshold the protocol uses
            'aportePromedio': src.redondear(100 / (len(activas) + len(numericas)), 2),
            'autovalores': [r2f(l) for l in lam],
            'porcentajes': pct(100 * lam / total),
            'acumulado': pct(100 * np.cumsum(lam) / total),
            'puntuaciones': [c3(F[i]) for i in range(n)],
            'r2': {c: [r2f(x) for x in r2[c]] for c in numericas},
            'eta2': {c: [r2f(x) for x in eta2[c]] for c in categoricas},
            'correlaciones': {c: c3(correl[c][:2]) for c in numericas},
            'variables': {
                **{c: {'tipo': 'num', 'ctr': pct(ctr_num[c][:2]),
                       'cos2': r2f(r2[c][0] + r2[c][1])} for c in numericas},
                **{c: {'tipo': 'cat',
                       'ctr': pct([sum(ctr_cat[cv][k] for cv in activas if cv[0] == c)
                                   for k in range(2)])} for c in categoricas},
            },
            'categorias': [{
                'variable': c, 'nivel': v, 'n': conteo[c][v],
                'coord': c3(bari[(c, v)][:2]),
                'ctr': pct(ctr_cat[(c, v)][:2]),
                'cos2': r2f(cos2_plano(bari[(c, v)])),
            } for c, v in activas],
            'personas': [{'ctr': pct(ctr_ind[i, :2]), 'cos2': r2f(cos2_plano(F[i]))}
                         for i in range(n)],
            'suplementarias': {},
        }
        return salida, F, cos2_plano, bari, ctr_cat, p_de

    # ── activo: everything in, and the two kinds of supplementary that only make
    #    sense here — the rare categories' diagnosis, and the markers ──
    activo, F, cos2_plano, bari, ctr_cat, _ = montaje(set())
    activo['raras'] = [{
        'variable': c, 'nivel': v, 'n': 1,
        'fila': valores[c].index(v) + 1,
        'd2': src.redondear(n / 1 - 1, 4),
        'coord': [src.redondear(float(x), 3) for x in bari[(c, v)][:2]],
        'ctr': [src.redondear(float(x), 2) for x in ctr_cat[(c, v)][:2]],
        'cos2': src.redondear(cos2_plano(bari[(c, v)]), 4),
        'superaPromedio': [bool(x > 100 / (activo['categoriasActivas'] + len(numericas)))
                           for x in ctr_cat[(c, v)][:2]],
    } for c, v in raras]
    marcas_sup = {}
    for c, m in marcas.items():
        if not m['total']:
            continue
        filas = [f - 1 for f in m['filas']]
        g = F[filas].mean(axis=0)
        marcas_sup[c] = {'n': m['total'], 'filas': list(m['filas']),
                         'coord': [src.redondear(float(x), 3) for x in g[:2]],
                         'cos2': src.redondear(cos2_plano(g), 4)}
    activo['suplementarias'] = {'marcas': marcas_sup}

    # ── sinRaras: the one-person categories out of X and projected ──
    sin, F2, cos2_plano2, _, _, _ = montaje(set(raras))
    sin['suplementarias'] = {'categorias': [{
        'variable': c, 'nivel': v, 'n': 1, 'fila': valores[c].index(v) + 1,
        'coord': [src.redondear(float(x), 3) for x in F2[valores[c].index(v)][:2]],
        'cos2': src.redondear(cos2_plano2(F2[valores[c].index(v)]), 4),
    } for c, v in raras]}

    return {
        'n': n,
        'numericas': list(numericas),
        'categoricas': list(categoricas),
        'niveles': niveles,
        'activo': activo,
        'sinRaras': sin,
    }


def bloque_famd(famd):
    """The lines that publish FAMD, shared by escribir() and by whoever regenerates
    the block alone."""
    j = lambda o: json.dumps(o, ensure_ascii=False)
    return [
        '/* The FAMD of the whole clean table — the closing of session 6. Every column',
        '   with destiny `limpia` enters: the quantities the PCA saw and the names and',
        '   ranks it could not. Two set-ups: `activo`, with everything active, and',
        '   `sinRaras`, with the one-person categories (found by n_j = 1) taken out of the',
        '   analysis and projected as supplementary. In `activo` the invented-cell markers',
        '   are projected as supplementary too — they never shaped an axis.',
        '',
        '   All non-null axes are published, and every person on all of them, so that the',
        '   identities — Σλ = inertia, Σr² + Ση² = λ_k, var(F_k) = λ_k, barycentre = mean of',
        '   its people, Σctr = 100 — can be recomputed by scripts/check_salon.py from LIMPIA',
        '   without repeating the analysis. Contributions are in percent; η² is the sum over',
        '   the ACTIVE categories, which is the ANOVA η² when every category is active. */',
        'export const FAMD = ' + j(famd) + ';',
    ]


def main():
    ruta = sys.argv[1] if len(sys.argv) > 1 else src.XLSX
    if not os.path.exists(ruta):
        sys.exit(f'no encuentro el .xlsx en {ruta}')

    hoja = src.celdas(ruta)
    filas = sorted({f for f, _ in hoja})[1:]
    # Through src.derivado, like the extractor: a derived column has to hold the same
    # value here as in the published table, or the chain would clean one table and the
    # entrada would show another.
    tabla = [[src.derivado(clave, src.limpio(hoja.get((f, c), '')))
              for c, clave, _, _ in src.COLUMNAS]
             for f in filas]
    orden = [clave for _, clave, _, _ in src.COLUMNAS]
    idx = {clave: n for n, clave in enumerate(orden)}
    meta = {clave: (rotulo, tipo) for _, clave, rotulo, tipo in src.COLUMNAS}
    col = lambda clave: [f[idx[clave]] for f in tabla]

    # A quantity, a rank and a name are three different things and get three
    # different treatments. Keeping them apart here is what stops the boxplot rule
    # from being pointed at a 1-to-5 scale.
    cuant = [c for c in orden if meta[c][1] == 'num']
    ordi = [c for c in orden if meta[c][1] == 'ord']
    cat = [c for c in orden if meta[c][1] == 'cat']

    no_num = [c for c in orden if meta[c][1] in ('cat', 'ord')]

    # Whether a column's answers are written as numbers. It decides two things: which
    # columns the text treatments apply to (a rank of numbers has no accents to strip),
    # and which ones admit a median and quartiles at all.
    numerico = lambda c: all(re.fullmatch(r'-?\d+(\.\d+)?', x)
                             for x in col(c) if x != '')

    # ── 1 · el texto ────────────────────────────────────────────────────────
    # Every non-numeric column whose answers are text — which includes an ordinal whose
    # levels are labels. «tallaCamiseta» belongs here and «balanceada 1–5» does not:
    # what decides it is whether there is text to treat, not what type the column is.
    texto_cols = [c for c in no_num if not numerico(c)]
    texto = {}
    for c in texto_cols:
        pasos = pasos_de_texto(col(c), c in CON_STOPWORDS, c)
        crudas = len({v for v in col(c) if v})
        texto[c] = {
            'rotulo': meta[c][0],
            'conStopwords': c in CON_STOPWORDS,
            'crudo': crudas,
            'pasos': [[nombre, len({v for v in vals if v})] for nombre, vals in pasos],
            'ejemplo': None,
        }
        # One real value that every treatment visibly touches — that is what the
        # block shows, not a made-up example.
        for v in col(c):
            if v and estandarizar(v, c in CON_STOPWORDS, c) != v:
                texto[c]['ejemplo'] = [v] + [vals[col(c).index(v)] for _, vals in pasos]
                break

    # ── 2 · describir antes ─────────────────────────────────────────────────
    # A rank written with numbers is described too, but the block only reads its
    # median and its modes off this: order and count, which is what a rank admits.
    #
    # A rank written with LABELS is not: «S · M · L · XL» has no median you can
    # compute by arithmetic, and forcing one would mean numbering the levels, which
    # is the very move session 4 argued against. It is described by how many people
    # chose each level, which is what RAROS already carries. So the absence of an
    # entry here is not an oversight — it is the same kind of deliberate absence as
    # an ordinal having no box.
    medibles = [c for c in cuant + ordi if numerico(c)]
    huecos = {c: sum(1 for x in col(c) if x == '') for c in cuant + ordi}
    valores = {c: [float(x) for x in col(c) if x != ''] for c in medibles}
    antes = {c: src.resumen(valores[c]) for c in medibles}

    # ── 3 · las cajas ───────────────────────────────────────────────────────
    # `cuant` ONLY. A rank does not get a box: see the note at the top of the file.
    cajas = {c: {str(k): caja(valores[c], k) for k in CORTES} for c in cuant}
    # Which ROW each flagged value sits in, so the block can point at the table.
    marcados = {}
    for c in cuant:
        fuera = set(cajas[c][str(CORTES[0])]['atipicos'])
        marcados[c] = [i for i, x in enumerate(col(c), 1)
                       if x != '' and float(x) in fuera]

    # ── 3b · el diagnóstico de lo que no es un número ───────────────────────
    # Every non-numeric variable, not just the ones a PCA could look at: the point
    # of the entrada is that seventeen of the twenty-seven columns never get near
    # the analysis, and that is not a reason to leave them unexamined.
    limpio_txt = {c: [estandarizar(v, c in CON_STOPWORDS, c) if v != '' else ''
                      for v in col(c)] for c in no_num}
    diag = {}
    for c in no_num:
        d = diagnostico(limpio_txt[c], len(tabla))
        d['nivelesCrudo'] = len({v for v in col(c) if v})
        d['rotulo'] = meta[c][0]
        d['tipo'] = meta[c][1]
        d['motivo'] = MOTIVOS[d['forma']]
        d['analizable'] = d['forma'] != 'unico'
        diag[c] = d

    # The ones that are not categories at all are set aside here, the way pantalla
    # was set aside for a different reason. Three kinds of discard in one session.
    no_analizables = {c: {'rotulo': meta[c][0], 'motivo': MOTIVOS['unico'],
                          'niveles': diag[c]['niveles'], 'personas': len(tabla)}
                      for c in no_num if not diag[c]['analizable']}

    # ── 4 · los niveles delgados de lo que no es un número ──────────────────
    # What the box does for a quantity, this does for a rank: it finds the values
    # too thin to stand on their own and folds them together, instead of calling
    # them anomalies and having them replaced.
    agrupables = [c for c in no_num if diag[c]['analizable']]
    raros = {}
    if agrupables:
        crudo_ord = pd.DataFrame({c: [v if v != '' else ETIQUETA_RARO
                                      for v in limpio_txt[c]]
                                  for c in agrupables}).astype(str)
        codificador = RareLabelEncoder(
            tol=TOL_RAROS, n_categories=2, replace_with=ETIQUETA_RARO,
            variables=list(agrupables), ignore_format=True)
        codificador.fit(crudo_ord)

        # The ends of a rank do not get folded, even when a single person chose them.
        #
        # This is the same argument the file already makes at TOL_RAROS about not
        # letting «1» and «5» end up in one bucket: on a rank the extremes are valid
        # answers BY CONSTRUCTION, not rarities. With 27 answers the 5 % threshold is
        # 1.35 people, so one person on «XL» would fold the top of the shirt-size
        # scale into «raro» — which would say that a large shirt is an anomaly, the
        # exact mistake the whole entrada teaches not to make.
        #
        # It is an exception to a rule, so it is declared here and said out loud on
        # screen, the same treatment the 1.5 of the boxplot rule gets.
        exentos = {}
        for c in agrupables:
            if meta[c][1] != 'ord':
                continue
            niveles_c = {v for v in limpio_txt[c] if v != ''}
            extremos = extremos_ordinales(c, niveles_c)
            devueltos = sorted(extremos - set(codificador.encoder_dict_[c]))
            if devueltos:
                codificador.encoder_dict_[c] = (
                    list(codificador.encoder_dict_[c]) + devueltos)
            exentos[c] = {'extremos': sorted(extremos), 'devueltos': devueltos}

        agrupado = codificador.transform(crudo_ord)
        for c in agrupables:
            frecuentes = sorted(codificador.encoder_dict_[c])
            niveles = sorted({v for v in limpio_txt[c] if v != ''})
            reparto = {v: limpio_txt[c].count(v) for v in niveles}
            raros[c] = {
                'rotulo': meta[c][0],
                'forma': diag[c]['forma'],
                'tol': TOL_RAROS,
                'minimo': int(-(-TOL_RAROS * len(tabla) // 1)),
                'etiqueta': ETIQUETA_RARO,
                'niveles': len(niveles),
                'reparto': reparto,
                'frecuentes': len(frecuentes),
                'nivelesFrecuentes': frecuentes,
                'agrupados': sorted(set(niveles) - set(frecuentes)),
                # Filled in after the imputation, below: what the column ends up
                # holding, rather than what it held with the holes still dressed as
                # «raro» by the encoder.
                'despues': None,
                'valores': list(agrupado[c]),
                # Empty for a categorical: only a rank has ends to protect.
                'extremosExentos': exentos.get(c, {}).get('extremos', []),
                'extremosDevueltos': exentos.get(c, {}).get('devueltos', []),
            }

    # ── 5 · la columna que se descarta ──────────────────────────────────────
    # Only genuine quantities reach the PCA: `ordi` is absent by construction, and
    # the block says why rather than leaving it to be noticed.
    analizadas = [c for c in cuant if c not in DESCARTADAS]
    descarte = {}
    for c, motivo in DESCARTADAS.items():
        n = len(col(c))
        descarte[c] = {
            'rotulo': meta[c][0], 'motivo': motivo,
            'huecos': huecos[c], 'atipicos': len(marcados[c]), 'filas': n,
            'perdidos': huecos[c] + len(marcados[c]),
            'porcentaje': src.redondear(100 * (huecos[c] + len(marcados[c])) / n),
        }

    # ── 6 · imputar ─────────────────────────────────────────────────────────
    # An outlier becomes a hole and is filled like one: the row keeps its other
    # twenty-six answers, which deleting it would throw away too.
    #
    # Both kinds of hole are punched in ONE step, and there is deliberately no variable
    # left holding the undepurated table. There used to be: it was built, copied, and
    # never read again — a DataFrame with the outliers still in it, one identifier away
    # from the imputer. Fitting on that by mistake would draw the 960 minutes to fill
    # somebody else's blank: a value the rule had just called unusable coming back as if
    # a person had answered it, in a row that is not theirs. Nothing about the output
    # would look wrong. The safeguard is that the table cannot be reached, because it
    # does not exist; check_salon.py checks the result on top of that.
    fuera = {c: {i - 1 for i in marcados[c]} for c in analizadas}
    con_huecos = pd.DataFrame(
        {c: [np.nan if (x == '' or i in fuera[c]) else float(x)
             for i, x in enumerate(col(c))]
         for c in analizadas})

    # Mark before filling, or the table forgets what it made up. Once the imputer has
    # run, an invented value and a measured one are the same number inside the column,
    # and the archivo that goes to the class would carry no trace of the difference.
    #
    # It runs on `con_huecos`, where the outlier is ALREADY a hole. So `<variable>_na`
    # means «this cell is invented», whichever of the two roads it came by — which is
    # what the analysis actually saw from here on, and what the cards on screen count.
    # The same treatment for what is not a quantity. A hole in «musica» is a hole just
    # as much as a hole in «minutos», and leaving it empty would mean the analyses that
    # come after the entrada silently drop that person from that variable.
    #
    # It runs over the GROUPED column, not the raw one: by this point «raro» is a level
    # like any other, so a drawn value is one of the levels the analysis will actually
    # use. And the hole is restored to NaN first — RareLabelEncoder had to be handed
    # something for an empty cell and got the «raro» label, which is not what a hole is.
    #
    # There is no boxplot rule here, so every invented cell in these columns is a cell
    # nobody answered; none of them was thrown out by a rule.
    rellenables = [c for c in no_num if c in raros]
    cat_con_huecos = pd.DataFrame(
        {c: [None if bruto == '' else v
             for v, bruto in zip(raros[c]['valores'], limpio_txt[c])]
         for c in rellenables},
        dtype=object)

    # One marker pass and one imputer pass per block. Two imputers rather than one over
    # everything: the draw for a quantity should not depend on how many text columns
    # happen to sit next to it in the frame.
    marcador = AddMissingIndicator(missing_only=True)
    marcas_df = marcador.fit_transform(con_huecos)
    marcas_cat_df = AddMissingIndicator(missing_only=True).fit_transform(cat_con_huecos)

    imputador = RandomSampleImputer(random_state=SEMILLA, seed='general')
    imputado = imputador.fit_transform(con_huecos)
    cat_imputado = RandomSampleImputer(
        random_state=SEMILLA, seed='general').fit_transform(cat_con_huecos)

    # Where each invented value went, and what it is. The table on screen marks
    # these cells, so the class can see what it is looking at.
    inventadas = {c: sorted(set([i for i, x in enumerate(col(c), 1) if x == '']
                                + marcados[c])) for c in analizadas}
    for c in rellenables:
        inventadas[c] = [i for i, v in enumerate(limpio_txt[c], 1) if v == '']

    # The indicators, kept in their own structure and NOT mixed into TABLA: they are
    # not quantities, nothing that walks the analysable columns should meet them by
    # accident, and they do not enter the PCA.
    marcas = {}
    for c, origen in [(c, marcas_df) for c in analizadas] + \
                     [(c, marcas_cat_df) for c in rellenables]:
        nombre = f'{c}_na'
        filas_na = ([i for i, v in enumerate(origen[nombre], 1) if v == 1]
                    if nombre in origen else [])
        marcas[c] = {'columna': nombre, 'filas': filas_na, 'total': len(filas_na),
                     'tipo': meta[c][1]}
        assert filas_na == inventadas[c], \
            f'la marca de {c} no coincide con las celdas inventadas'

    # ── 6b · la tabla limpia, entera ────────────────────────────────────────
    # The chain's own result, which until now existed only in pieces: the imputed
    # quantities here, the grouped levels there, and three columns with no clean
    # version at all. The entrada shows it before the analysis, so it has to be a
    # table and not something a React component recomposes at render time.
    #
    # What each column got depends on where the chain left it:
    #   limpia        standardised, grouped if non-numeric, imputed if quantitative
    #   descartada    `pantalla`: raw. Discarding it means NOT filling it.
    #   noAnalizable  `codigo`, `libro`: standardised — step 1 did reach them and the
    #                 entrada shows it — but neither grouped nor imputed.
    # A hole in a column that was not imputed stays a hole. That is the point.
    destino = {c: 'descartada' if c in DESCARTADAS
               else 'noAnalizable' if c in no_analizables
               else 'limpia' for c in orden}

    columna_limpia = {}
    for c in orden:
        if meta[c][1] == 'num':
            columna_limpia[c] = ([src.redondear(v, 2) for v in imputado[c]]
                                 if c in analizadas else list(col(c)))
        elif c in raros:
            columna_limpia[c] = list(cat_imputado[c])
        else:
            columna_limpia[c] = list(limpio_txt[c])

    for c in rellenables:
        finales = list(cat_imputado[c])
        raros[c]['despues'] = {v: finales.count(v) for v in sorted(set(finales))}

    limpia = [[columna_limpia[c][i] for c in orden] for i in range(len(tabla))]

    # ── 7 · describir después, y el contraste con la media ──────────────────
    despues = {c: src.resumen(list(imputado[c])) for c in analizadas}
    por_media = {}
    for c in analizadas:
        rellenado = con_huecos[c].fillna(con_huecos[c].mean())
        por_media[c] = src.resumen(list(rellenado))

    # ── 8 · el PCA ──────────────────────────────────────────────────────────
    resultado = pca(imputado[analizadas].to_numpy(),
                    [[c, meta[c][0]] for c in analizadas])

    # ── 9 · las tres matrices de pares ──────────────────────────────────────
    # Three ways of looking at two variables at once, one per combination of types.
    # Everything is computed here: three matrices of sixty-four panels each is not
    # something to work out while a page is opening in front of a class.
    #
    # Neither matrix shows every variable — eight is what stays legible — so the
    # criterion has to be a computed one and it has to be published WITH the list it
    # produced. A hand-picked set would be the session doing in a figure exactly what
    # it spends an hour telling the class not to do with data.
    num_limpias = {c: [float(v) for v in columna_limpia[c]] for c in analizadas}

    #   quantities · the eight whose strongest relationship with any other is strongest.
    #   If not even these form a cloud, none of them does — which is the argument the
    #   PCA step makes in prose and could not show.
    fuerza = {c: max(abs(correlacion(num_limpias[c], num_limpias[o]))
                     for o in analizadas if o != c) for c in analizadas}
    cuant_matriz = sorted(sorted(analizadas, key=lambda c: -fuerza[c])[:VARS_MATRIZ],
                          key=analizadas.index)

    #   names and ranks · the ones step 1b diagnosed «sana». It is the first real use of
    #   that diagnosis, and it justifies itself: a «casi todo único» would be twenty bars
    #   of height one, and a «dominada» a single block.
    cual_matriz = [c for c in no_num if diag[c]['forma'] == 'sana'][:VARS_MATRIZ]

    matrices = {
        'n': VARS_MATRIZ,
        'cuantitativas': [[c, meta[c][0]] for c in cuant_matriz],
        'cualitativas': [[c, meta[c][0]] for c in cual_matriz],
        'criterioCuant': 'las que más se relacionan con alguna otra',
        'criterioCual': 'las que el diagnóstico llamó «sanas»: pocos niveles y repartidos',
        'fuerza': {c: src.redondear(fuerza[c], 2) for c in analizadas},
        'dejadasFuera': {
            'cuantitativas': [c for c in analizadas if c not in cuant_matriz],
            'cualitativas': [c for c in no_num
                             if diag[c]['analizable'] and c not in cual_matriz],
        },
        # The strongest pair there actually is, published rather than written into a
        # sentence. It moves when the data moves — and it DID move: peso and estatura
        # correlate 0.56 before the imputation and 0.39 after, because each column is
        # filled on its own. The entrada says that happens; this is it happening.
        'parMasFuerte': max(
            ([a, b, src.redondear(correlacion(num_limpias[a], num_limpias[b]), 2)]
             for i, a in enumerate(analizadas) for b in analizadas[i + 1:]),
            key=lambda t: abs(t[2])),
        'valores': {c: [src.redondear(v, 2) for v in num_limpias[c]] for c in cuant_matriz},
        'correlaciones': {c: {o: src.redondear(correlacion(num_limpias[c], num_limpias[o]), 2)
                              for o in cuant_matriz} for c in cuant_matriz},
        'histogramas': {c: histograma(num_limpias[c]) for c in cuant_matriz},
        'niveles': {c: sorted(set(columna_limpia[c])) for c in cual_matriz},
        'barrasUna': {c: {n: list(columna_limpia[c]).count(n)
                          for n in sorted(set(columna_limpia[c]))} for c in cual_matriz},
        'cajasPorNivel': {},
        'barras': {},
    }

    #   a box per level, for every quantity against every name
    for q in cuant_matriz:
        matrices['cajasPorNivel'][q] = {}
        for c in cual_matriz:
            porNivel = {}
            for n in matrices['niveles'][c]:
                vs = [num_limpias[q][i] for i, v in enumerate(columna_limpia[c]) if v == n]
                if not vs:
                    continue
                d = caja(vs, CORTES[0])
                # `n` travels with the box: a box drawn over two or three answers is
                # not a summary of anything, and the panel has to be able to say so.
                porNivel[n] = {'n': len(vs), 'q1': d['q1'], 'q3': d['q3'],
                               'mediana': src.redondear(st.median(vs), 2),
                               'bigoteBajo': d['bigoteBajo'], 'bigoteAlto': d['bigoteAlto']}
            matrices['cajasPorNivel'][q][c] = porNivel

    #   and the joint counts, for every name against every other
    for a in cual_matriz:
        matrices['barras'][a] = {}
        for bq in cual_matriz:
            if a == bq:
                continue
            conteo = {}
            for va, vb in zip(columna_limpia[a], columna_limpia[bq]):
                conteo.setdefault(va, {}).setdefault(vb, 0)
                conteo[va][vb] += 1
            matrices['barras'][a][bq] = conteo

    # ── 10 · el FAMD de la tabla entera ─────────────────────────────────────
    # Over exactly the columns with destiny `limpia`: the analysed quantities and the
    # non-numeric columns that were grouped and imputed. `codigo` and `libro` are not
    # categories and `pantalla` was discarded — the same three the entrada set aside.
    famd = famd_salon(columna_limpia, analizadas,
                      [c for c in no_num if destino[c] == 'limpia'], marcas, len(tabla))

    escribir(texto, cuant, ordi, cat, analizadas, meta, huecos, antes, cajas,
             marcados, descarte, raros, inventadas, despues, por_media, resultado,
             imputado, len(tabla), no_num, diag, no_analizables,
             marcas, limpia, destino, orden, columna_limpia, matrices, famd)

    print(f'{len(tabla)} filas · {len(cuant)} cuantitativas '
          f'({len(analizadas)} al análisis, {len(DESCARTADAS)} descartada) · '
          f'{len(ordi)} ordinal → {os.path.relpath(SALIDA, RAIZ)}')
    for c in analizadas:
        if inventadas[c]:
            print(f'  {c:<12} {huecos[c]} huecos + {len(marcados[c])} atípicos '
                  f'= {len(inventadas[c])} imputados')
    for c, d in descarte.items():
        print(f'  {c:<12} DESCARTADA ({d["perdidos"]}/{d["filas"]} = {d["porcentaje"]} %)')
    print(f'  {len(no_num)} no numéricas diagnosticadas:')
    for f in ('sana', 'cola', 'dominada', 'unico'):
        cuales = [c for c in no_num if diag[c]['forma'] == f]
        if cuales:
            print(f'      {f:<9} {len(cuales):>2}: {", ".join(cuales)}')
    movidas = [c for c, r in raros.items() if r['agrupados']]
    print(f'      agrupadas {len(movidas)} de {len(raros)}: '
          + ', '.join(f'{c}(−{len(raros[c]["agrupados"])})' for c in movidas))
    print(f'  PCA: {resultado["porcentajes"][0]} % + {resultado["porcentajes"][1]} % '
          f'= {resultado["acumulado"][1]} % en dos componentes')
    imprimir_famd(famd)


def imprimir_famd(famd):
    """What step 10 prints, so a run says what the closing will claim."""
    a, s = famd['activo'], famd['sinRaras']
    jq = {c: len(v) for c, v in famd['niveles'].items()}
    print(f'  FAMD: {len(famd["numericas"])} cuantitativas + {len(famd["categoricas"])} '
          f'cualitativas ({a["categoriasActivas"]} categorías) · '
          f'Σλ = {a["inercia"]["total"]} = {a["inercia"]["numericas"]} + Σ(J_q − 1) = '
          f'{sum(j - 1 for j in jq.values())} · {a["ejes"]} ejes')
    print(f'      activo:   {a["porcentajes"][0]} % + {a["porcentajes"][1]} % '
          f'= {a["acumulado"][1]} % en dos ejes')
    print(f'      sinRaras: {s["porcentajes"][0]} % + {s["porcentajes"][1]} % '
          f'= {s["acumulado"][1]} % · suplementarias: '
          + ', '.join(f'{r["variable"]}={r["nivel"]}' for r in s['suplementarias']['categorias']))
    print(f'      marcas proyectadas: {len(a["suplementarias"]["marcas"])} '
          f'({", ".join(a["suplementarias"]["marcas"])})')


def escribir(texto, cuant, ordi, cat, analizadas, meta, huecos, antes, cajas,
             marcados, descarte, raros, inventadas, despues, por_media, resultado,
             imputado, filas, no_num, diag, no_analizables,
             marcas, limpia, destino, orden, columna_limpia, matrices, famd):
    """El módulo generado que la sesión 6 interpola."""
    j = lambda o: json.dumps(o, ensure_ascii=False)
    L = [
        '/* Generated by scripts/clean_salon.py — do not edit by hand.',
        '',
        "   Session 6's cleaning chain over the class table: the text standardised, the",
        '   measures before and after, the boxplot cuts, what the imputer invented and',
        '   the PCA of what stayed quantitative.',
        '',
        '   None of this is computed in the browser. The random draws happened once, with',
        '   the seed pinned, so every projection of this session shows the same table.',
        '',
        f'   Seed: {SEMILLA}. Source: src/data/salon.js (same {filas} answers). */',
        '',
        f'export const SEMILLA = {SEMILLA};',
        f'export const FILAS = {filas};',
        '',
        '/* Which stop words were dropped, and from which columns. Shown on screen: the',
        '   block puts the list in front of the class rather than describing it. */',
        'export const PALABRAS_VACIAS = ' + j(sorted(PALABRAS_VACIAS)) + ';',
        '',
        '/* Which columns are a quantity, which are a rank, which are a name. The block',
        '   needs the distinction: the boxplot rule and the PCA only ever touch the',
        '   first group. */',
        'export const CUANTITATIVAS = ' + j(list(cuant)) + ';',
        'export const NO_NUMERICAS = ' + j(list(no_num)) + ';',
        'export const ORDINALES = ' + j(list(ordi)) + ';',
        'export const ANALIZADAS = ' + j(list(analizadas)) + ';',
        '',
        '/* Per text column: how many distinct categories survive each of the four',
        "   treatments, and one real value carried through them. [crudo, recorte,",
        '   tildes, minúsculas, sin palabras vacías] */',
        'export const TEXTO = {',
    ]
    for c in texto:
        L.append(f'  {c}: {j(texto[c])},')
    L += ['};', '',
          '/* The session 4 box of measures, before touching anything. */',
          'export const ANTES = {']
    for c in cuant + ordi:
        if c not in antes:      # a rank of labels: see the note in main()
            continue
        L.append(f'  {c}: {j(dict(antes[c], rotulo=meta[c][0], tipo=meta[c][1], huecos=huecos[c]))},')
    L += ['};', '',
          '/* The boxplot, at both thresholds. `atipicos` are the values the rule leaves',
          '   out; `filas` are the rows they sit in, so a point can be pointed at.',
          '   Quantities only — an ordinal column has no entry here, and that absence is',
          '   the point. */',
          'export const CAJAS = {']
    for c in cuant:
        L.append(f'  {c}: {j(dict(cajas[c], rotulo=meta[c][0], filas=marcados[c]))},')
    L += ['};', '',
          '/* The column that does not enter the imputation or the PCA, with the numbers',
          '   that justify it. Discarding is the last link of the chain, not a gap. */',
          'export const DESCARTADA = ' + j(descarte) + ';',
          '',
          '/* The seventeen columns a PCA can never look at, diagnosed one by one: how',
          '   many levels each has before and after standardising, how many people are in',
          '   the biggest, how many levels only one person chose, and which of the four',
          '   shapes that puts it in. The thresholds travel with it, so the classification',
          '   can be recomputed instead of believed. */',
          'export const UMBRALES = ' + j({'unico': UMBRAL_UNICO, 'dominada': UMBRAL_DOMINADA,
                                          'cola': UMBRAL_COLA, 'raro': TOL_RAROS}) + ';',
          'export const FORMAS = ' + j(MOTIVOS) + ';',
          'export const DIAGNOSTICO = {'] + [
          f'  {c}: {j(diag[c])},' for c in no_num] + [
          '};',
          '',
          '/* Not categories at all — an identifier and free text. Set aside for a reason',
          '   different from the one that set pantalla aside, which is the point: three',
          '   kinds of discard in one session teach more than one kind. */',
          'export const NO_ANALIZABLES = ' + j(no_analizables) + ';',
          '',
          '/* The rare-level grouping over every non-numeric column that can be analysed at',
          '   all — the shapes are a diagnosis, not a gate. A column that had nothing rare',
          '   appears here unchanged, which is the honest way to show the treatment ran and',
          '   did nothing. For the ordinal one this is also where the boxplot rule would',
          '   have been: a rank has no outliers, it has levels nobody chose. */',
          'export const RAROS = ' + j(raros) + ';',
          '',
          '/* The same measures after imputing, and what filling with the mean would have',
          '   done instead — the contrast the block draws. */',
          'export const DESPUES = {']
    for c in analizadas:
        L.append(f'  {c}: {j(dict(despues[c], rotulo=meta[c][0], imputados=len(inventadas[c])))},')
    L += ['};', '', 'export const POR_MEDIA = {']
    for c in analizadas:
        L.append(f'  {c}: {j({k: por_media[c][k] for k in ("media", "desviacion", "cv")})},')
    L += ['};', '',
          '/* Which cells carry an invented value, and what went into them. The table on',
          '   screen marks these: the class has to be able to see what it is looking at. */',
          'export const IMPUTADAS = {']
    for c in marcas:
        vals = {i: columna_limpia[c][i - 1] for i in inventadas[c]}
        L.append(f'  {c}: {j({"filas": inventadas[c], "valores": vals, "tipo": marcas[c]["tipo"], "proporcion": src.redondear(100 * len(inventadas[c]) / filas)})},')
    L += ['};', '',
          '/* The whole imputed table, column by column, for the figures that draw a',
          '   distribution before and after. */',
          'export const TABLA = {']
    for c in analizadas:
        L.append(f'  {c}: {j([src.redondear(float(x), 2) for x in imputado[c]])},')
    L += ['};', '',
          '/* Which cells were invented, as one binary marker per variable — what',
          '   AddMissingIndicator produced. A marker is set for BOTH roads into an',
          '   invented value: nobody answered, or the boxplot rule threw the answer out.',
          '   Non-numeric columns only ever take the first road: they have no box.',
          '   Kept apart from TABLA on purpose: these are not quantities, they do not',
          '   enter the PCA, and nothing that walks the analysable columns should meet',
          '   them by accident. */',
          'export const MARCAS = {']
    for c in marcas:
        L.append(f'  {c}: {j(marcas[c])},')
    L += ['};', '',
          f'export const CELDAS_INVENTADAS = {j(sum(m["total"] for m in marcas.values()))};',
          '',
          '/* Where the chain left each column. `limpia` went all the way through;',
          '   `descartada` and `noAnalizable` are shown as they were left, unimputed, so',
          '   that what the chain dropped stays visible instead of disappearing. */',
          'export const DESTINO = ' + j(destino) + ';',
          '',
          '/* The clean table itself, one row per person, columns in the order of COLS.',
          '   A hole in a column that was never imputed is still a hole here. */',
          'export const ORDEN_COLS = ' + j(list(orden)) + ';',
          'export const LIMPIA = [']
    for fila in limpia:
        L.append('  [' + ', '.join(j(v) for v in fila) + '],')
    L += ['];', '',
          '/* PCA of the quantitative columns that survived, on standardised data.',
          '   `cargas[i][j]` is variable i on component j; `puntos` are the rows on the',
          '   first two components. */',
          'export const PCA = ' + j(resultado) + ';',
          '',
          '/* The three pair matrices the entrada shows before the analysis: quantity ×',
          '   quantity (scatter, histogram on the diagonal), quantity × name (a box per',
          '   level), name × name (grouped bars, bar chart on the diagonal).',
          '',
          '   Each shows `n` variables, not all of them, and the two criteria that chose',
          '   them are published with the lists they produced so the sentence on screen and',
          '   the figure cannot drift apart. Everything is computed here: three matrices of',
          '   sixty-four panels is not work to do while a page opens in front of a class. */',
          'export const MATRICES = ' + j(matrices) + ';',
          ''] + bloque_famd(famd) + ['']

    with open(SALIDA, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(L))


if __name__ == '__main__':
    main()
