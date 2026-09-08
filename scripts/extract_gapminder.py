#!/usr/bin/env python3
"""Extract the four country indicators session 5 works on.

Reads Gapminder's DDF csv files and writes src/sessions/s05/data/paises.js: one
row per country with GDP per capita, life expectancy, fertility and child
mortality for a single year.

The year is 2015, the last one the source covers. Coverage has been flat since
2005 -- 183 countries with all four indicators every year -- so taking the most
recent one costs nothing. Before 2005 there are 187, but the four extra are
Aruba, Hong Kong, Macao and Puerto Rico, which are not sovereign states.

A country is kept only when it has all four values. Dropping it is not a
judgement about the country: a hole in any of the four would put a point of the
3D cloud somewhere it does not belong, and the class reads that cloud as if
every point were a country.

The csv files are not in the repository -- they are 2.4 MB of the same thing
repeated for two centuries. They live next to it, in ../gapminder-data, with
their PROCEDENCIA.txt. Column order differs between the four files, so every
one is read by header, never by position.

No dependencies: csv and json are stdlib. Same as scripts/extract_salon.py.

    python3 scripts/extract_gapminder.py [path/to/gapminder-data]
"""

import csv
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(os.path.dirname(ROOT), 'gapminder-data')
OUT = os.path.join(ROOT, 'src', 'sessions', 's05', 'data', 'paises.js')

YEAR = 2015

# key, csv slug, on-screen name, unit, and what it measures. The last three are
# course content and stay in Spanish: RF-61 asks for them on screen, before the
# first chart is drawn.
INDICATORS = [
    ('pib', 'income_per_person_gdppercapita_ppp_inflation_adjusted',
     'PIB per cápita', 'dólares internacionales',
     'lo que produce un país en un año, repartido entre sus habitantes y ajustado para que un dólar compre lo mismo en todas partes'),
    ('vida', 'life_expectancy_years',
     'Esperanza de vida', 'años',
     'los años que viviría un recién nacido si le tocaran las tasas de mortalidad de este año durante toda su vida'),
    ('fertilidad', 'children_per_woman_total_fertility',
     'Hijos por mujer', 'hijos',
     'los hijos que tendría una mujer a lo largo de su vida con las tasas de natalidad de este año'),
    ('mortalidad', 'child_mortality_0_5_year_olds_dying_per_1000_born',
     'Mortalidad infantil', 'por cada 1000 nacidos',
     'de cada mil niños que nacen, cuántos mueren antes de cumplir cinco años'),
]

# Gapminder's world_4region, on screen.
REGIONS = {
    'africa': 'África', 'americas': 'América', 'asia': 'Asia', 'europe': 'Europa',
}

# Country names as the wall reads them (principle 6). Only the ones that differ
# from Gapminder's English are listed; the rest are identical in both languages.
# Any country missing from here keeps its English name, and main() says how many
# did, so the hole is visible instead of silently projected.
ES = {
    'Afghanistan': 'Afganistán', 'Algeria': 'Argelia',
    'Antigua and Barbuda': 'Antigua y Barbuda', 'Azerbaijan': 'Azerbaiyán',
    'Bahrain': 'Baréin', 'Belarus': 'Bielorrusia', 'Belgium': 'Bélgica',
    'Belize': 'Belice', 'Benin': 'Benín', 'Bhutan': 'Bután',
    'Bosnia and Herzegovina': 'Bosnia y Herzegovina', 'Botswana': 'Botsuana',
    'Brazil': 'Brasil', 'Brunei': 'Brunéi', 'Cambodia': 'Camboya',
    'Comoros': 'Comoras',
    'Cameroon': 'Camerún', 'Canada': 'Canadá', 'Cape Verde': 'Cabo Verde',
    'Central African Republic': 'República Centroafricana',
    'Congo, Dem. Rep.': 'Rep. Dem. del Congo', 'Congo, Rep.': 'Rep. del Congo',
    "Cote d'Ivoire": 'Costa de Marfil', 'Croatia': 'Croacia', 'Cyprus': 'Chipre',
    'Czech Republic': 'Chequia', 'Denmark': 'Dinamarca', 'Djibouti': 'Yibuti',
    'Dominican Republic': 'República Dominicana', 'Egypt': 'Egipto',
    'Equatorial Guinea': 'Guinea Ecuatorial', 'Ethiopia': 'Etiopía',
    'Fiji': 'Fiyi', 'Finland': 'Finlandia', 'France': 'Francia',
    'Gabon': 'Gabón', 'Germany': 'Alemania', 'Greece': 'Grecia',
    'Grenada': 'Granada', 'Haiti': 'Haití', 'Hungary': 'Hungría',
    'Iceland': 'Islandia', 'Iran': 'Irán', 'Iraq': 'Irak', 'Ireland': 'Irlanda',
    'Italy': 'Italia', 'Japan': 'Japón', 'Jordan': 'Jordania',
    'Kazakhstan': 'Kazajistán', 'Kenya': 'Kenia', 'Kyrgyz Republic': 'Kirguistán',
    'Lao': 'Laos', 'Latvia': 'Letonia', 'Lebanon': 'Líbano', 'Libya': 'Libia',
    'Lithuania': 'Lituania', 'Luxembourg': 'Luxemburgo',
    'Macedonia, FYR': 'Macedonia del Norte', 'Malawi': 'Malaui',
    'Malaysia': 'Malasia', 'Maldives': 'Maldivas', 'Mali': 'Malí',
    'Marshall Islands': 'Islas Marshall', 'Mauritius': 'Mauricio',
    'Mexico': 'México', 'Micronesia, Fed. Sts.': 'Micronesia',
    'Moldova': 'Moldavia', 'Monaco': 'Mónaco', 'Morocco': 'Marruecos',
    'Netherlands': 'Países Bajos', 'New Zealand': 'Nueva Zelanda',
    'Niger': 'Níger', 'North Korea': 'Corea del Norte', 'Norway': 'Noruega',
    'Oman': 'Omán', 'Pakistan': 'Pakistán', 'Panama': 'Panamá',
    'Papua New Guinea': 'Papúa Nueva Guinea', 'Peru': 'Perú',
    'Philippines': 'Filipinas', 'Poland': 'Polonia', 'Qatar': 'Catar',
    'Romania': 'Rumanía', 'Russia': 'Rusia', 'Rwanda': 'Ruanda',
    'Sao Tome and Principe': 'Santo Tomé y Príncipe',
    'Saudi Arabia': 'Arabia Saudí', 'Sierra Leone': 'Sierra Leona',
    'Singapore': 'Singapur', 'Slovak Republic': 'Eslovaquia',
    'Slovenia': 'Eslovenia', 'Solomon Islands': 'Islas Salomón',
    'South Africa': 'Sudáfrica', 'South Korea': 'Corea del Sur',
    'South Sudan': 'Sudán del Sur', 'Spain': 'España',
    'St. Kitts and Nevis': 'San Cristóbal y Nieves', 'St. Lucia': 'Santa Lucía',
    'St. Vincent and the Grenadines': 'San Vicente y las Granadinas',
    'Sudan': 'Sudán', 'Suriname': 'Surinam', 'Swaziland': 'Esuatini',
    'Sweden': 'Suecia', 'Switzerland': 'Suiza', 'Syria': 'Siria',
    'Tajikistan': 'Tayikistán', 'Thailand': 'Tailandia',
    'Timor-Leste': 'Timor Oriental',
    'Trinidad and Tobago': 'Trinidad y Tobago', 'Tunisia': 'Túnez',
    'Turkey': 'Turquía', 'Turkmenistan': 'Turkmenistán', 'Ukraine': 'Ucrania',
    'United Arab Emirates': 'Emiratos Árabes Unidos',
    'United Kingdom': 'Reino Unido', 'United States': 'Estados Unidos',
    'Uzbekistan': 'Uzbekistán', 'West Bank and Gaza': 'Cisjordania y Gaza',
    'Zimbabwe': 'Zimbabue',
}

# GDP is read as an integer, the other three keep the decimals the source gives.
ROUNDING = {'pib': 0, 'vida': 1, 'fertilidad': 2, 'mortalidad': 1}


# The three indicators the 3D cloud is drawn with (RF-59). Child mortality is
# the one left out, for two reasons: it is nearly the mirror of life expectancy,
# so a fourth axis would repeat what the second already says; and it is the
# variable block 3 brings back, when four no longer fit in three axes and the
# table has to be transposed. What the cloud cannot show is the point.
CLOUD = ('pib', 'vida', 'fertilidad')


def moments(values):
    """Mean and sample standard deviation (n−1), as session 4 computes them."""
    n = len(values)
    mean = sum(values) / n
    var = sum((v - mean) ** 2 for v in values) / (n - 1)
    return mean, var ** 0.5


def standardize(columns):
    """Each column to z scores.

    PCA on standardized data is PCA on the correlation matrix, and that is what
    the circle of variables needs: in raw units GDP runs in the thousands and
    fertility between one and seven, so the first component would be "GDP" and
    nothing else -- an artefact of the units, not a finding about the world.
    """
    out = []
    for col in columns:
        mean, sd = moments(col)
        out.append([(v - mean) / sd for v in col])
    return out


def correlation(z):
    """Correlation matrix of already standardized columns."""
    n = len(z[0])
    return [[sum(a * b for a, b in zip(zi, zj)) / (n - 1) for zj in z] for zi in z]


def jacobi(matrix):
    """Eigenvalues and eigenvectors of a symmetric matrix, by Jacobi rotations.

    Forty lines instead of NumPy. Principle 1 allows four dependencies and this
    matrix is 4×4: rotating away the largest off-diagonal entry until none is
    left is enough, and it keeps the script readable by whoever teaches this.

    Returns (eigenvalues, eigenvectors) sorted from largest to smallest, each
    eigenvector as a list.
    """
    n = len(matrix)
    a = [row[:] for row in matrix]
    v = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]

    for _ in range(100):
        size, p, q = max((abs(a[i][j]), i, j)
                         for i in range(n) for j in range(i + 1, n))
        if size < 1e-14:
            break
        theta = (a[q][q] - a[p][p]) / (2 * a[p][q])
        t = (1 if theta >= 0 else -1) / (abs(theta) + (theta * theta + 1) ** 0.5)
        c = 1 / (t * t + 1) ** 0.5
        s = t * c
        for k in range(n):                       # columns: A J
            akp, akq = a[k][p], a[k][q]
            a[k][p], a[k][q] = c * akp - s * akq, s * akp + c * akq
        for k in range(n):                       # rows: Jᵀ (A J)
            apk, aqk = a[p][k], a[q][k]
            a[p][k], a[q][k] = c * apk - s * aqk, s * apk + c * aqk
        for k in range(n):                       # accumulate V J
            vkp, vkq = v[k][p], v[k][q]
            v[k][p], v[k][q] = c * vkp - s * vkq, s * vkp + c * vkq

    values = [a[i][i] for i in range(n)]
    vectors = [[v[i][j] for i in range(n)] for j in range(n)]
    order = sorted(range(n), key=lambda j: -values[j])
    return [values[j] for j in order], [vectors[j] for j in order]


def pca(rows, keys, field):
    """The whole analysis for a set of indicators, ready to be drawn.

    `cargas` are the loadings: eigenvector times the square root of its
    eigenvalue. Starting from the correlation matrix they *are* the correlation
    between a variable and a component, which is why the circle has radius one
    and why the cosine of the angle between two arrows reads as a correlation
    (RF-42). The length of an arrow in the first two components is how well the
    plane represents that variable (RF-46).
    """
    z = standardize([[row[field[k]] for row in rows] for k in keys])
    values, vectors = jacobi(correlation(z))

    # The sign of a component is arbitrary: the same data drawn by two programs
    # can come out mirrored (edge case 4). Fixing the largest loading positive
    # makes this repository's figures reproducible, not the mathematics less so.
    for i, vec in enumerate(vectors):
        biggest = max(range(len(vec)), key=lambda k: abs(vec[k]))
        if vec[biggest] < 0:
            vectors[i] = [-x for x in vec]

    total = sum(values)
    loadings = [[vectors[j][i] * values[j] ** 0.5 for j in range(len(values))]
                for i in range(len(keys))]
    return {
        'vars': list(keys),
        'valores': [round(v, 4) for v in values],
        'porcentajes': [round(100 * v / total, 2) for v in values],
        'vectores': [[round(x, 4) for x in vec] for vec in vectors],
        'cargas': [[round(x, 4) for x in row] for row in loadings],
        '_raw': (values, vectors, correlation(z)),
    }


def read_countries(path):
    """{geo code: (English name, region key)} for sovereign countries only."""
    out = {}
    with open(path, encoding='utf-8') as fh:
        for row in csv.DictReader(fh):
            if (row.get('is--country') or '').strip().upper() != 'TRUE':
                continue
            out[row['country']] = (row['name'], row.get('world_4region', ''))
    return out


def read_series(path, slug, year):
    """{geo code: value} for one indicator in one year.

    The four files do not agree on column order, so the header decides.
    """
    out = {}
    with open(path, encoding='utf-8') as fh:
        for row in csv.DictReader(fh):
            if int(row['time']) != year or row[slug] == '':
                continue
            out[row['geo']] = float(row[slug])
    return out


def main():
    data = sys.argv[1] if len(sys.argv) > 1 else DATA
    if not os.path.isdir(data):
        sys.exit(f'no encuentro los csv en {data}')

    countries = read_countries(os.path.join(data, 'geo.csv'))
    series = {}
    for key, slug, _, _, _ in INDICATORS:
        path = os.path.join(data, slug + '.csv')
        if not os.path.exists(path):
            sys.exit(f'falta {os.path.basename(path)} en {data}')
        series[key] = read_series(path, slug, YEAR)

    complete = set(countries)
    for key in series:
        complete &= set(series[key])
    dropped = len(countries) - len(complete)

    rows, same_in_both = [], []
    for geo in complete:
        name, region = countries[geo]
        values = []
        for key, _, _, _, _ in INDICATORS:
            v = round(series[key][geo], ROUNDING[key])
            values.append(int(v) if ROUNDING[key] == 0 else v)
        rows.append([geo, ES.get(name, name), region] + values)
        if name not in ES:
            same_in_both.append(name)
    rows.sort(key=lambda r: r[1])

    unknown_region = sorted({r[2] for r in rows} - set(REGIONS))

    # What the panels will claim on screen. If the source changes, this fails
    # here and not in front of the class.
    assert len(rows) == 183, f'esperaba 183 países, hay {len(rows)}'
    assert not unknown_region, f'región sin nombre en pantalla: {unknown_region}'
    names = [r[1] for r in rows]
    assert 'Colombia' in names, 'falta Colombia'
    assert len(set(names)) == len(names), 'hay un nombre repetido'

    field = {k: 3 + i for i, (k, _, _, _, _) in enumerate(INDICATORS)}
    keys = [k for k, _, _, _, _ in INDICATORS]
    pca3 = pca(rows, CLOUD, field)
    pca4 = pca(rows, keys, field)
    stats = {}
    for k in keys:
        col = [row[field[k]] for row in rows]
        mean, sd = moments(col)
        stats[k] = (round(mean, 2), round(sd, 2), min(col), max(col))
    corr = pca4['_raw'][2]

    # The numbers above are the ones the wall will show, so they get checked
    # here rather than believed. Av = λv is the definition of an eigenvector:
    # if Jacobi drifted, this is where it stops.
    for analysis in (pca3, pca4):
        values, vectors, matrix = analysis.pop('_raw')
        n = len(values)
        for lam, vec in zip(values, vectors):
            for i in range(n):
                av = sum(matrix[i][k] * vec[k] for k in range(n))
                assert abs(av - lam * vec[i]) < 1e-9, 'Av ≠ λv'
        assert values == sorted(values, reverse=True), 'autovalores sin ordenar'
        assert abs(sum(values) - n) < 1e-9, 'la traza debería ser el nº de variables'
        assert abs(sum(analysis['porcentajes']) - 100) < 0.01, analysis['porcentajes']

    j = lambda o: json.dumps(o, ensure_ascii=False)
    out = [
        '/* Generated by scripts/extract_gapminder.py — do not edit by hand.',
        '',
        f'   The four Gapminder indicators for {YEAR}, the last year the source covers:',
        '   one row per country, and only the countries that have all four. A hole in',
        '   any of them would put a point of the 3D cloud where no country is. */',
        '',
        f'export const ANIO = {YEAR};',
        '',
        '/* The credit every figure carries. */',
        'export const FUENTE = {',
        '  nombre: ' + j('Gapminder World') + ',',
        '  licencia: ' + j('CC BY 4.0') + ',',
        '  url: ' + j('https://www.gapminder.org/data/') + ',',
        '};',
        '',
        '/* [key, on-screen name, unit, what it measures] — RF-61 asks for the last one',
        '   before anything is plotted. */',
        'export const VARS = [',
    ]
    for key, _, label, unit, what in INDICATORS:
        out.append(f'  [{j(key)}, {j(label)}, {j(unit)}, {j(what)}],')
    out += ['];', '', '/* [key, on-screen name] */', 'export const REGIONES = [']
    for key, label in REGIONS.items():
        out.append(f'  [{j(key)}, {j(label)}],')
    out += [
        '];',
        '',
        '/* The order of every row below. */',
        'export const CAMPOS = ' + j(['codigo', 'nombre', 'region']
                                     + [k for k, _, _, _, _ in INDICATORS]) + ';',
        '',
        f'/* {len(rows)} countries, alphabetical. */',
        'export const PAISES = [',
    ]
    for row in rows:
        out.append('  [' + ', '.join(j(v) for v in row) + '],')
    out += [
        '];',
        '',
        '/* Per indicator: mean, standard deviation (n−1), minimum and maximum.',
        '   The figures standardize with these instead of shipping a second copy',
        '   of the table, and the entry block quotes them beside the formulas. */',
        'export const ESTAD = {',
    ]
    for k in keys:
        mean, sd, lo, hi = stats[k]
        out.append(f'  {k}: {{ media: {mean}, desv: {sd}, min: {lo}, max: {hi} }},')
    out += [
        '};',
        '',
        '/* Correlation matrix, in the order of VARS. The entry reads one cell of it',
        '   off a scatter plot; the circle of variables is this matrix, drawn. */',
        'export const CORR = [',
    ]
    for row in corr:
        out.append('  [' + ', '.join(str(round(x, 4)) for x in row) + '],')
    out += ['];', '']

    for name, analysis, note in (
        ('PCA3', pca3, 'The three indicators the cloud is drawn with.'),
        ('PCA4', pca4, 'All four: the circle of variables in block 3.')):
        out += [
            f'/* {note}',
            '   vectores[j] is the j-th component in the space of vars; cargas[i] is',
            '   variable i seen from every component — its arrow in the circle. */',
            f'export const {name} = {{',
            '  vars: ' + j(analysis['vars']) + ',',
            '  valores: ' + j(analysis['valores']) + ',',
            '  porcentajes: ' + j(analysis['porcentajes']) + ',',
            '  vectores: [',
        ]
        for vec in analysis['vectores']:
            out.append('    ' + j(vec) + ',')
        out += ['  ],', '  cargas: [']
        for row in analysis['cargas']:
            out.append('    ' + j(row) + ',')
        out += ['  ],', '};', '']

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(out))

    print(f'{len(rows)} países × {len(INDICATORS)} indicadores, año {YEAR} '
          f'→ {os.path.relpath(OUT, ROOT)}')
    print(f'  {dropped} descartados por faltarles alguno de los cuatro')
    print(f'  {len(same_in_both)} se escriben igual en los dos idiomas '
          f'y se proyectan tal cual')
    print('   ', ', '.join(sorted(same_in_both)[:10]) + ' …')
    for name, analysis in (('PCA3', pca3), ('PCA4', pca4)):
        pct = ' · '.join(f'{x:.1f}%' for x in analysis['porcentajes'])
        print(f'  {name} ({len(analysis["vars"])} vars) varianza explicada: {pct}')


if __name__ == '__main__':
    main()
