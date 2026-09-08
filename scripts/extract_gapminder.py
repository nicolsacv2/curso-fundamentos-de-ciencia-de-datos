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
    out += ['];', '']

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(out))

    print(f'{len(rows)} países × {len(INDICATORS)} indicadores, año {YEAR} '
          f'→ {os.path.relpath(OUT, ROOT)}')
    print(f'  {dropped} descartados por faltarles alguno de los cuatro')
    print(f'  {len(same_in_both)} se escriben igual en los dos idiomas '
          f'y se proyectan tal cual')
    print('   ', ', '.join(sorted(same_in_both)[:10]) + ' …')


if __name__ == '__main__':
    main()
