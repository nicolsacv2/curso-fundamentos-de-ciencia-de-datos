#!/usr/bin/env python3
"""Check that the two generated salón files still say what the answers say.

The figures in src/data/salon.js and src/data/salon_limpio.js end up projected on
a wall, and nobody in the room can audit them by looking. This does it, and does
it WITHOUT feature-engine: the point of a verifier that needs the same library as
the thing it verifies is hard to state.

Five independent checks:

  1. Re-reads the .xlsx and recomputes everything src/data/salon.js publishes,
     comparing value by value. Catches a hand-edited file and a file left behind
     by a change in the form or in the extractor.

  2. Checks the imputation on its own terms, without repeating the draw. What
     defines RandomSampleImputer is that every value it puts in a column is a
     value that was already observed IN that column — that is checkable, and
     re-running the sampler would not check it, it would just do it again.

  3. Checks the arithmetic of the counts: imputed cells = holes + flagged
     outliers, and no column that is a rank has a box or an imputed cell at all.

  4. Checks the PCA against its own identities — R·v = λv, orthonormal
     eigenvectors, loadings = v·√λ, percentages adding to a hundred — the way
     check_pca.py does for session 5. Catches an error in the algebra itself,
     which (1) cannot, because it would repeat it.

  5. Checks the FAMD of the whole clean table the same way, in both of its
     set-ups, from LIMPIA and the published scores alone: the eigenvalues add up
     to p_num + Σ(1 − p_j); r² and η² recomputed from the table match the
     published ones and add up to λ_k on every axis; the scores have variance λ_k
     and are uncorrelated; every published barycentre — active, supplementary or
     an invented-cell marker — is the mean of its people; and the contributions
     of every axis add up to a hundred. Nothing is recomputed with numpy: the
     analysis is not repeated, its identities are checked.

No dependencies, no network: it reads the .xlsx and two files off the disk. Exits
1 on the first difference so it can sit in front of a commit.

    python3 scripts/check_salon.py [path/to/file.xlsx]
"""

import json
import math
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import extract_salon as src              # noqa: E402  (needs sys.path first)

CRUDO = os.path.join(ROOT, 'src', 'data', 'salon.js')
LIMPIO = os.path.join(ROOT, 'src', 'data', 'salon_limpio.js')

# Comparing a file against a fresh run is exact: both sides round the same way, so
# any difference is an edit or a drift, never arithmetic.
EXACTO = 1e-9
# Checking published numbers against each other is not: they are stored rounded to
# four decimals, and that rounding propagates through v·√λ.
TOL = 1e-3
# Percentages are stored to two decimals and rebuilt from eigenvalues stored to
# four, so half a step of the coarser rounding is expected and means nothing.
PCT = 0.006

fallos = []


def mal(msg):
    fallos.append(msg)
    print(f'  ✗ {msg}')


def bien(msg):
    print(f'  ✓ {msg}')


def exportado(texto, nombre):
    """El valor de `export const <nombre> = …;` como objeto de Python."""
    try:
        return src.exportado(texto, nombre)
    except KeyError as e:
        sys.exit(str(e))


def casi(a, b, tol=EXACTO):
    return abs(float(a) - float(b)) <= tol


def comprobar_crudo(ruta, texto):
    """1 · src/data/salon.js contra una lectura nueva del .xlsx."""
    print('1 · la tabla cruda, recomputada desde el .xlsx')

    hoja = src.celdas(ruta)
    filas = sorted({f for f, _ in hoja})[1:]
    tabla = [[src.derivado(clave, src.limpio(hoja.get((f, c), '')))
              for c, clave, _, _ in src.COLUMNAS]
             for f in filas]
    idx = {clave: n for n, (_, clave, _, _) in enumerate(src.COLUMNAS)}
    col = lambda c: [f[idx[c]] for f in tabla]

    cols = exportado(texto, 'COLS')
    rows = exportado(texto, 'ROWS')

    if [c[0] for c in cols] != [c[1] for c in src.COLUMNAS]:
        mal('las columnas publicadas no son las que el extractor declara')
    elif any(re.fullmatch(r'[A-Z]{1,2}', c[0]) for c in cols):
        mal('una columna se llama como en la hoja de cálculo')
    else:
        bien(f'{len(cols)} columnas, todas nombradas por su variable')

    if rows != tabla:
        mal(f'las filas publicadas no coinciden con el .xlsx '
            f'({len(rows)} publicadas, {len(tabla)} en el archivo)')
    else:
        bien(f'{len(rows)} filas idénticas al .xlsx, carácter por carácter')

    # A derived column is the one exception to «published exactly as it arrived», so
    # it gets checked against its declared rule instead of against the cell.
    for clave, d in src.DERIVADAS.items():
        crudas = [src.limpio(hoja.get((f, d['de']), '')) for f in filas]
        esperado = [src.derivado(clave, v) for v in crudas]
        if col(clave) != esperado:
            mal(f'{clave} no sale de {d["de"]} por la regla «{d["regla"]}»')
        elif any(v == c for v, c in zip(col(clave), crudas) if c != ''):
            mal(f'{clave} publica algún valor igual al de la columna de origen')
        else:
            bien(f'{clave}: sale de {d["de"]} por «{d["regla"]}», '
                 f'y la columna de origen no se publica')

    if any(c[0] == d['de'] for d in src.DERIVADAS.values()
           for c in cols if c[0] != 'edad' and c[0] == d['de']):
        mal('una columna de origen de una derivada aparece también publicada')

    m = src.medias_de_limpieza(col('minutos'))
    pub = exportado(texto, 'MEDIAS')
    for clave, valor in m.items():
        if not casi(pub[clave], src.redondear(valor)):
            mal(f'MEDIAS.{clave}: publica {pub[clave]}, sale {src.redondear(valor)}')
    else:
        bien('las cuatro medias de limpieza salen de las filas publicadas')

    for nombre, clave, quitar_max in [('MINUTOS', 'minutos', False),
                                      ('MINUTOS_SIN', 'minutos', True),
                                      ('BALANCEADA', 'balanceada', False),
                                      ('PORCIONES', 'porciones', False)]:
        vals = [float(x) for x in col(clave) if x != '']
        if quitar_max:
            vals = [x for x in vals if x != max(vals)]
        esperado = src.resumen(vals)
        pub = exportado(texto, nombre)
        for k, v in esperado.items():
            if json.dumps(pub.get(k)) != json.dumps(v):
                mal(f'{nombre}.{k}: publica {pub.get(k)}, sale {v}')
                break
        else:
            bien(f'{nombre}: las {len(esperado)} medidas salen de las filas publicadas')

    esperado = src.recuentos(tabla, idx)
    pub = exportado(texto, 'RECUENTOS')
    for k, v in esperado.items():
        if json.dumps(pub.get(k), ensure_ascii=False) != json.dumps(v, ensure_ascii=False):
            mal(f'RECUENTOS.{k}: publica {pub.get(k)}, sale {v}')
            break
    else:
        bien(f'los {len(esperado)} recuentos que las sesiones 3 y 4 interpolan')

    return tabla, idx, col


def comprobar_imputacion(texto_crudo, texto, col):
    """2 y 3 · la imputación, sin repetir el sorteo."""
    print('\n2 · la imputación, por lo que la define')

    imputadas = exportado(texto, 'IMPUTADAS')
    analizadas = exportado(texto, 'ANALIZADAS')
    cajas = exportado(texto, 'CAJAS')
    tabla = exportado(texto, 'TABLA')
    filas = exportado(texto, 'FILAS')

    for c in analizadas:
        # The bag is what SURVIVED the boxplot rule, not everything the column ever held.
        #
        # This used to compare against every observed value, outliers included, which made
        # it blind to the one mistake that matters here: if the imputer were fitted on the
        # table before the outliers became holes, the 960 minutes could be drawn to fill
        # somebody else's blank — a value the rule had just declared unusable coming back
        # as if a person had answered it, in a row that is not even theirs. That would have
        # passed, because 960 is undeniably «a value that appears in the column».
        marcados = set(cajas[c]['1.5']['atipicos'])
        enPie = {float(x) for x in col(c) if x != ''} - marcados
        inventados = imputadas[c]['valores']
        fuera = [v for v in inventados.values() if float(v) not in enPie]
        if fuera:
            devuelto = float(fuera[0]) in marcados
            mal(f'{c}: se imputó {fuera[0]}, que '
                + ('la regla había descartado — el imputador se está ajustando sobre la '
                   'tabla sin depurar' if devuelto else 'no aparece en la columna'))
        # A cell the imputer did NOT touch has to still hold what it held.
        for i, v in enumerate(tabla[c], 1):
            if str(i) not in inventados and col(c)[i - 1] != '':
                if not casi(v, float(col(c)[i - 1]), 1e-6):
                    mal(f'{c}, fila {i}: la tabla imputada cambió un valor observado')
                    break
    else:
        bien('todo valor imputado sobrevivió a la regla de la caja: ningún atípico '
             'descartado volvió a entrar')
        bien('ninguna celda que el imputador no tocó cambió de valor')

    # The same contract for what is not a quantity. The draw happens on the GROUPED
    # column, so the level that lands has to be one of the levels that column ended up
    # with — not one of the thin ones that were folded away just before.
    raros = exportado(texto, 'RAROS')
    no_num_imputadas = [c for c in imputadas if c in raros]
    for c in no_num_imputadas:
        posibles = set(raros[c]['nivelesFrecuentes']) | {raros[c]['etiqueta']}
        fuera = [v for v in imputadas[c]['valores'].values() if v not in posibles]
        if fuera:
            mal(f'{c}: se imputó «{fuera[0]}», que no es un nivel de la columna limpia')
            break
        huecos_c = [i for i, v in enumerate(col(c), 1) if v == '']
        if imputadas[c]['filas'] != huecos_c:
            mal(f'{c}: las celdas inventadas no son exactamente sus huecos')
            break
    else:
        bien(f'las {len(no_num_imputadas)} columnas no numéricas: se rellenaron solo sus '
             f'huecos, con niveles que la columna tiene')

    print('\n3 · la aritmética de los recuentos')
    for c in analizadas:
        huecos = sum(1 for x in col(c) if x == '')
        marcados = len(cajas[c]['filas'])
        if len(imputadas[c]['filas']) != huecos + marcados:
            mal(f'{c}: {len(imputadas[c]["filas"])} imputadas, pero hay '
                f'{huecos} huecos + {marcados} atípicos')
            break
        if not casi(imputadas[c]['proporcion'],
                    src.redondear(100 * len(imputadas[c]['filas']) / filas)):
            mal(f'{c}: la proporción de imputadas no cuadra')
            break
    else:
        bien('imputadas = huecos + atípicos marcados, en todas las columnas')

    ordinales = exportado(texto, 'ORDINALES')
    for c in ordinales:
        if c in cajas:
            mal(f'{c} es un orden y tiene diagrama de caja')
        # An ordinal has no box, so nothing of it can have been imputed because a rule
        # threw it out. Its holes are filled like any other hole — what must not exist
        # is an invented cell that had an answer in it.
        if c in imputadas:
            huecos_c = [i for i, v in enumerate(col(c), 1) if v == '']
            if imputadas[c]['filas'] != huecos_c:
                mal(f'{c} es un orden y tiene celdas inventadas que no eran huecos: '
                    f'{sorted(set(imputadas[c]["filas"]) - set(huecos_c))}')
        if c in analizadas:
            mal(f'{c} es un orden y entró al análisis de componentes principales')
        r = raros.get(c)
        if not r:
            mal(f'{c} es un orden y no pasó por el agrupamiento de niveles')
            continue
        # Every level the encoder kept has to clear the threshold, and every level
        # it folded has to fail it — EXCEPT the ends of the rank, which are exempt by
        # declaration: on a bounded order the extremes are valid answers by
        # construction, not rarities. The exemption is only worth anything if it is
        # checked, so the contract here is the one with the exception in it, and a
        # level exempted without being an extreme fails just as loudly.
        exentos = set(r.get('extremosExentos', []))
        devueltos = set(r.get('extremosDevueltos', []))
        if not devueltos <= exentos:
            mal(f'{c}: devuelve niveles que no son extremos: '
                f'{sorted(devueltos - exentos)}')
            continue
        for nivel, n in r['reparto'].items():
            frecuente = nivel in r['nivelesFrecuentes']
            esperado = n / filas >= r['tol'] or nivel in exentos
            if frecuente != esperado:
                mal(f'{c}, nivel {nivel}: {n}/{filas} y lo trata como '
                    f'{"frecuente" if frecuente else "raro"}')
                break
        else:
            extra = (f'; {len(devueltos)} extremo(s) exento(s): '
                     f'{", ".join(sorted(devueltos))}' if devueltos else '')
            bien(f'{c}: sin caja, sin imputar, fuera del PCA; '
                 f'{len(r["agrupados"])} nivel(es) agrupado(s) con tol={r["tol"]}{extra}')


def comprobar_pca(texto):
    """4 · el PCA contra sus propias identidades, sin recalcularlo."""
    print('\n4 · el PCA, contra su propia álgebra')
    pca = exportado(texto, 'PCA')
    tabla = exportado(texto, 'TABLA')
    analizadas = exportado(texto, 'ANALIZADAS')

    lam = pca['autovalores']
    cargas = pca['cargas']
    k = len(lam)

    if [v[0] for v in pca['variables']] != analizadas:
        mal('las variables del PCA no son las columnas analizadas')
    else:
        bien(f'{k} variables, las mismas que se imputaron')

    # Standardised data → the analysed matrix is the correlation matrix, so the
    # eigenvalues have to add up to the number of variables.
    if not casi(sum(lam), k, TOL * k):
        mal(f'los autovalores suman {sum(lam):.4f} y deberían sumar {k}')
    else:
        bien(f'los autovalores suman {k}, como pide una matriz de correlaciones')

    if not casi(sum(pca['porcentajes']), 100, PCT * k):
        mal(f'los porcentajes suman {sum(pca["porcentajes"])}')
    else:
        bien('los porcentajes suman cien')

    for j in range(k):
        esperado = src.redondear(100 * lam[j] / sum(lam), 2)
        if abs(pca['porcentajes'][j] - esperado) > PCT:
            mal(f'el porcentaje de la componente {j + 1} no sale de su autovalor')
            break
    else:
        bien('cada porcentaje sale de su propio autovalor')

    acum = 0
    for j in range(k):
        acum += pca['porcentajes'][j]
        if abs(pca['acumulado'][j] - acum) > PCT * (j + 1):
            mal(f'el acumulado de la componente {j + 1} no es la suma de los anteriores')
            break
    else:
        bien('el acumulado es la suma de los porcentajes')

    # loadings = v·√λ, so the column of loadings of a component, divided by √λ, has
    # to be a unit vector — which is the orthonormality of v, checked without
    # publishing v.
    for j in range(k):
        if lam[j] <= 0:
            continue
        v = [cargas[i][j] / math.sqrt(lam[j]) for i in range(k)]
        if not casi(sum(x * x for x in v), 1, TOL * 10):
            mal(f'el autovector {j + 1} no es unitario')
            break
    else:
        bien('cada autovector, recuperado de sus cargas, es unitario')

    for a in range(k):
        for b in range(a + 1, k):
            if lam[a] <= 0 or lam[b] <= 0:
                continue
            p = sum((cargas[i][a] / math.sqrt(lam[a])) * (cargas[i][b] / math.sqrt(lam[b]))
                    for i in range(k))
            if not casi(p, 0, TOL * 10):
                mal(f'los autovectores {a + 1} y {b + 1} no son ortogonales')
                break
        else:
            continue
        break
    else:
        bien('los autovectores son ortogonales dos a dos')

    # The sum of squared loadings of a VARIABLE across all components is its
    # communality, and with every component kept it has to be exactly 1.
    for i in range(k):
        if not casi(sum(cargas[i][j] ** 2 for j in range(k)), 1, TOL * 10):
            mal(f'la variable {pca["variables"][i][0]} no reparte toda su varianza')
            break
    else:
        bien('cada variable reparte exactamente toda su varianza')

    # And the points have to be the standardised rows projected on the first two.
    n = len(pca['puntos'])
    if n != len(tabla[analizadas[0]]):
        mal(f'{n} puntos para {len(tabla[analizadas[0]])} filas')
    else:
        for j in (0, 1):
            var = sum(p[j] ** 2 for p in pca['puntos']) / (n - 1)
            if not casi(var, lam[j], TOL * 20):
                mal(f'la varianza de los puntos en la componente {j + 1} '
                    f'es {var:.4f} y el autovalor dice {lam[j]}')
                break
        else:
            bien('la varianza de los puntos en cada eje es su autovalor')


# The FAMD publishes its scores to three decimals and the rest to four, and every
# check below recomputes from those. A score off by half a thousandth moves a
# variance by about twice that times the score, so the slack is a few thousandths —
# still an order of magnitude under the smallest edit a hand makes, which is one
# digit.
TOL_F = 6e-3        # variances and covariances rebuilt from rounded scores
TOL_G = 1.5e-3      # a barycentre: mean of rounded scores against a rounded value
TOL_R = 2e-3        # r² and η² rebuilt from rounded scores
TOL_CTR = 0.03      # a contribution in percent, rebuilt from rounded scores


def comprobar_famd(texto):
    """5 · el FAMD de la tabla entera, contra sus propias identidades."""
    print('\n5 · el FAMD de la tabla entera, contra su propia álgebra')
    famd = exportado(texto, 'FAMD')
    limpia = exportado(texto, 'LIMPIA')
    orden = exportado(texto, 'ORDEN_COLS')
    destino = exportado(texto, 'DESTINO')
    marcas = exportado(texto, 'MARCAS')
    analizadas = exportado(texto, 'ANALIZADAS')
    no_num = exportado(texto, 'NO_NUMERICAS')
    n = famd['n']
    col = {c: [f[i] for f in limpia] for i, c in enumerate(orden)}

    if n != len(limpia):
        mal(f'el FAMD dice {n} personas y la tabla limpia tiene {len(limpia)}')
    if famd['numericas'] != analizadas:
        mal('las cuantitativas del FAMD no son las columnas analizadas')
    elif famd['categoricas'] != [c for c in no_num if destino[c] == 'limpia']:
        mal('las cualitativas del FAMD no son las no numéricas que llegaron limpias')
    else:
        bien(f'entran {len(analizadas)} cuantitativas y {len(famd["categoricas"])} '
             f'cualitativas: exactamente las columnas con destino «limpia»')

    media = lambda xs: sum(xs) / len(xs)

    for nombre in ('activo', 'sinRaras'):
        m = famd[nombre]
        F = m['puntuaciones']
        K = m['ejes']
        lam = m['autovalores']
        sup = {(s['variable'], s['nivel']) for s in m['suplementarias'].get('categorias', [])}
        activas = [(c, v) for c in famd['categoricas'] for v in sorted(set(col[c]))
                   if (c, v) not in sup]
        p_de = {(c, v): col[c].count(v) / n for c, v in activas}
        print(f'  · montaje «{nombre}»: {K} ejes, {len(activas)} categorías activas'
              + (f', {len(sup)} suplementarias' if sup else ''))

        if len(F) != n or any(len(f) != K for f in F):
            mal(f'{nombre}: las puntuaciones no son {n} × {K}')
            continue
        Fk = lambda k: [f[k] for f in F]

        # 1 · Σλ = p_num + Σ(1 − p_j), the general formula, over the ACTIVE categories
        inercia = len(analizadas) + sum(1 - p for p in p_de.values())
        if m['categoriasActivas'] != len(activas):
            mal(f'{nombre}: publica {m["categoriasActivas"]} categorías activas, hay {len(activas)}')
        elif not casi(sum(lam), inercia, TOL * K) or not casi(m['inercia']['total'], inercia, TOL):
            mal(f'{nombre}: Σλ = {sum(lam):.4f}, la inercia de la tabla es {inercia:.4f}')
        else:
            bien(f'Σλ = {inercia:.4f} = {len(analizadas)} + Σ(1 − p_j) sobre las categorías activas')

        # 2 · r² and η² from LIMPIA and the scores, and Σr² + Ση² = λ_k
        roto = False
        for c in analizadas:
            x = [float(v) for v in col[c]]
            mx = media(x)
            sx = (sum((v - mx) ** 2 for v in x) / n) ** 0.5
            for k in range(K):
                f = Fk(k)
                cov = sum(a * (b - mx) for a, b in zip(f, x)) / n
                r2 = (cov / (sx * lam[k] ** 0.5)) ** 2
                if not casi(m['r2'][c][k], r2, TOL_R):
                    mal(f'{nombre}: r²({c}, eje {k + 1}) publica {m["r2"][c][k]}, sale {r2:.4f}')
                    roto = True
                    break
            if roto:
                break
        else:
            bien(f'los r² de las {len(analizadas)} cuantitativas salen de la tabla y las puntuaciones')
        roto = False
        for c in famd['categoricas']:
            for k in range(K):
                f = Fk(k)
                eta2 = sum(p_de[(cc, v)] * media([f[i] for i, w in enumerate(col[cc]) if w == v]) ** 2
                           for cc, v in activas if cc == c) / lam[k]
                if not casi(m['eta2'][c][k], eta2, TOL_R):
                    mal(f'{nombre}: η²({c}, eje {k + 1}) publica {m["eta2"][c][k]}, sale {eta2:.4f}')
                    roto = True
                    break
            if roto:
                break
        else:
            bien(f'los η² de las {len(famd["categoricas"])} cualitativas salen de sus baricentros')
        for k in range(K):
            suma = sum(m['r2'][c][k] for c in analizadas) + sum(m['eta2'][c][k] for c in famd['categoricas'])
            if not casi(suma, lam[k], TOL * (len(analizadas) + len(famd['categoricas']))):
                mal(f'{nombre}: Σr² + Ση² = {suma:.4f} en el eje {k + 1}, y λ = {lam[k]}')
                break
        else:
            bien('Σr² + Ση² = λ_k en cada uno de los ejes')

        # 3 · var(F_k) = λ_k, cov(F_k, F_l) = 0
        for k in range(K):
            f = Fk(k)
            if not casi(media(f), 0, TOL_G):
                mal(f'{nombre}: las puntuaciones del eje {k + 1} no están centradas')
                break
            if not casi(sum(v * v for v in f) / n, lam[k], TOL_F):
                mal(f'{nombre}: var(F_{k + 1}) = {sum(v * v for v in f) / n:.4f} y λ = {lam[k]}')
                break
            for l in range(k + 1, K):
                g = Fk(l)
                if not casi(sum(a * b for a, b in zip(f, g)) / n, 0, TOL_F):
                    mal(f'{nombre}: los ejes {k + 1} y {l + 1} no son ortogonales')
                    break
            else:
                continue
            break
        else:
            bien('la varianza de las puntuaciones en cada eje es su autovalor, y los ejes son ortogonales')

        # 4 · every published barycentre is the mean of its people
        def bari(filas):
            return [media([F[i][k] for i in filas]) for k in range(2)]
        roto = False
        for cat in m['categorias']:
            filas = [i for i, w in enumerate(col[cat['variable']]) if w == cat['nivel']]
            if cat['n'] != len(filas) or (cat['variable'], cat['nivel']) in sup:
                mal(f'{nombre}: {cat["variable"]}={cat["nivel"]} dice n={cat["n"]} y hay {len(filas)}')
                roto = True
                break
            g = bari(filas)
            if any(not casi(cat['coord'][k], g[k], TOL_G) for k in range(2)):
                mal(f'{nombre}: el baricentro de {cat["variable"]}={cat["nivel"]} no es la media '
                    f'de sus {len(filas)} personas')
                roto = True
                break
        if not roto:
            bien(f'los {len(m["categorias"])} baricentros activos son la media de sus personas')
        for s in m['suplementarias'].get('categorias', []):
            filas = [i for i, w in enumerate(col[s['variable']]) if w == s['nivel']]
            if len(filas) != 1 or s['fila'] != filas[0] + 1:
                mal(f'{nombre}: la suplementaria {s["variable"]}={s["nivel"]} no es de una persona')
                break
            if any(not casi(s['coord'][k], F[filas[0]][k], TOL_G) for k in range(2)):
                mal(f'{nombre}: la suplementaria {s["variable"]}={s["nivel"]} no está donde su persona')
                break
        else:
            if sup:
                bien(f'las {len(sup)} suplementarias están donde su única persona: '
                     + ', '.join(f'{c}={v}' for c, v in sorted(sup)))
        for c, s in m['suplementarias'].get('marcas', {}).items():
            filas = [f - 1 for f in marcas[c]['filas']]
            if s['n'] != marcas[c]['total'] or s['filas'] != marcas[c]['filas']:
                mal(f'{nombre}: la marca de {c} no señala las celdas inventadas de MARCAS')
                break
            g = bari(filas)
            if any(not casi(s['coord'][k], g[k], TOL_G) for k in range(2)):
                mal(f'{nombre}: la marca de {c} no está en el baricentro de sus {len(filas)} personas')
                break
        else:
            if m['suplementarias'].get('marcas'):
                esperadas = [c for c in marcas if marcas[c]['total']]
                if sorted(m['suplementarias']['marcas']) != sorted(esperadas):
                    mal(f'{nombre}: hay marcas proyectadas que no son las variables con celdas inventadas')
                else:
                    bien(f'las {len(esperadas)} marcas de celda inventada están en el baricentro '
                         f'de sus filas, y ninguna es una columna activa')

        # 5 · contributions add up to 100 per axis; percentages come from λ
        for k in range(2):
            total = (sum(cat['ctr'][k] for cat in m['categorias'])
                     + sum(m['variables'][c]['ctr'][k] for c in analizadas))
            cuantas = len(m['categorias']) + len(analizadas)
            if not casi(total, 100, 0.005 * cuantas + 0.01):
                mal(f'{nombre}: las contribuciones del eje {k + 1} suman {total:.2f}')
                break
            # and each one is what the scores say it is
            for cat in m['categorias']:
                filas = [i for i, w in enumerate(col[cat['variable']]) if w == cat['nivel']]
                g = media([F[i][k] for i in filas])
                ctr = 100 * (len(filas) / n) * g * g / lam[k] ** 2
                if not casi(cat['ctr'][k], ctr, TOL_CTR):
                    mal(f'{nombre}: la contribución de {cat["variable"]}={cat["nivel"]} al eje '
                        f'{k + 1} publica {cat["ctr"][k]} y sale {ctr:.2f}')
                    break
            else:
                continue
            break
        else:
            bien('las contribuciones de cada eje suman cien, y cada una sale de su baricentro')
        for k in range(K):
            if not casi(m['porcentajes'][k], 100 * lam[k] / sum(lam), PCT):
                mal(f'{nombre}: el porcentaje del eje {k + 1} no sale de su autovalor')
                break
        else:
            bien('cada porcentaje sale de su autovalor, y '
                 f'los dos primeros ejes retienen {m["acumulado"][1]} %')


def main():
    ruta = sys.argv[1] if len(sys.argv) > 1 else src.XLSX
    if not os.path.exists(ruta):
        sys.exit(f'no encuentro el .xlsx en {ruta}')

    crudo = open(CRUDO, encoding='utf-8').read()
    limpio = open(LIMPIO, encoding='utf-8').read()

    _, _, col = comprobar_crudo(ruta, crudo)
    comprobar_imputacion(crudo, limpio, col)
    comprobar_pca(limpio)
    comprobar_famd(limpio)

    print()
    if fallos:
        print(f'{len(fallos)} comprobación(es) fallida(s).')
        sys.exit(1)
    print('Todo cuadra.')


if __name__ == '__main__':
    main()
