## Context

`ca_de()` en `scripts/ejemplo_lluvia.py` diagonaliza SᵀS con Jacobi, obtiene λ y V, y calcula
G = D_c^{−1/2} V Σ como `g[j][k] = V[k][j]·√λ_k/√c_j` y F por transición, comprobando que
coincide con `f_directo = S V / √r_i` (que es D_r^{−1/2} S V = D_r^{−1/2} U Σ, porque
S V = U Σ). `mca()` en `scripts/ejemplo_mca_famd.py` hace lo mismo sobre la tabla disyuntiva
con `f_directo = √n · S V`. Ninguno publica U ni V. El bloque 1 termina «De las distancias al
mapa» con la figura del salto de cinco secciones; el bloque 2 presenta los valores propios en
«Parte 1 · Los valores propios, y sus dos identidades». El tipógrafo de `s07/figures/shared.js`
compone piezas con subíndice y superíndice a la vez, con `raiz`, y letras griegas en su
familia. Ver `proposal.md`.

## Goals / Non-Goals

**Goals:** que las fórmulas matriciales de la guía —S = U Σ Vᵀ, F, G y la transición en
matrices— estén en los dos análisis de correspondencias, atadas a lo que cada bloque ya
enseñó y verificadas con una cifra publicada.

**Non-Goals:** no se enseña qué es una SVD en general ni cómo se calcula; no se publican
matrices completas en pantalla (solo las entradas que la verificación usa); no se cambia el
FAMD; no se toca el tipógrafo.

## Decisions

### D1 · Dónde y qué se escribe

**Bloque 1.** Nueva sección `<h3>En una sola línea: las matrices</h3>` después de la figura
del salto y antes de «Filas y columnas en el mismo plano». Una `Prose` de tres párrafos y la
figura `fMatricial()` en `figures/block1.js` con cuatro secciones:

1. LA DESCOMPOSICIÓN — `S = U Σ Vᵀ`, con la gloss: U tiene una columna por eje y una fila
   por fila de la tabla (las direcciones de la nube de filas), V una fila por columna (las de
   la nube de columnas), y Σ es diagonal con σ_k = √λ_k; `SᵀS = V Λ Vᵀ` es la matriz M que se
   diagonalizó y `SSᵀ = U Λ Uᵀ` la de la otra nube, con Λ = Σ². Ejemplo: σ del ejemplo y su
   cuadrado igual a λ.
2. LAS FILAS — `F = D_r^{−1/2} U Σ`, y entrada por entrada `f_ik = u_ik σ_k / √r_i`. Ejemplo:
   «observado sol» en el eje 1 con u, σ y r publicados, igual a su coordenada.
3. LAS COLUMNAS — `G = D_c^{−1/2} V Σ`, `g_jk = v_jk σ_k / √c_j`. Ejemplo: «siguiente sol».
4. LA TRANSICIÓN, EN MATRICES — `F = D_r^{−1} P G Σ^{−1}` y `G = D_c^{−1} Pᵀ F Σ^{−1}`, con la
   gloss «D_r^{−1} P son los perfiles de fila: es la fórmula de la sección siguiente».

Σ como nombre de matriz se distingue del Σ de sumatorio por el tamaño (cuerpo normal, no
26 px) y porque la gloss lo define; Λ se usa para la diagonal de λ.

**Bloque 2.** Nueva `Prose` + figura `fMatricial()` en `figures/block2.js` al final de
«Parte 1 · Los valores propios, y sus dos identidades», con tres secciones —descomposición,
personas, categorías— y lo que cambia en la tabla disyuntiva: P = Z/(nQ), D_r = I/n (todas
las masas 1/n, así que D_r^{−1/2} = √n · I), D_c = diag(n_j/(nQ)). Ejemplo: persona 1 y Café
en el eje 1. La transición en matrices no se repite: remite al bloque 1.

### D2 · Lo que publican los scripts

`ca_de()` calcula `U = S V Σ^{−1}` (I × K) y devuelve `U`, `V` (J × K, ya con los signos
fijados) y `sigma = [√λ_k]`. Antes de escribir: `S ≈ U Σ Vᵀ` entrada por entrada (1e-9);
`D_r^{−1/2} U Σ` igual a `f`; `D_c^{−1/2} V Σ` igual a `g`; `σ_k² = λ_k`. Publica
`CA.svd = { U, V, sigma, r, c }` a cuatro decimales, y `CA.matricial` con la verificación
lista para interpolar: para la primera fila y la primera columna en el eje 1, `u`, `v`,
`sigma`, `raizMasa`, `producto` y `coordPublicada`. `mca()` hace lo mismo y publica
`MCA.svd` y `MCA.matricial` (persona 1 y la primera categoría). El oráculo de la guía no se
toca y ninguna cifra existente cambia: `git diff` de los dos `.js` solo añade claves.

*Alternativa:* verificar en el navegador multiplicando las matrices publicadas. Rechazada:
nada se calcula en el navegador; el script publica el producto ya hecho.

### D3 · Composición

Las piezas necesarias existen: `{ t: 'D', sub: 'r', sup: '−1/2' }`, `{ t: 'V', sup: 'T' }`,
`{ t: 'Σ', sup: '−1' }`. Cada figura sigue el patrón `seccion()` del módulo, y
`check_figuras.mjs` la recoge sola con su chequeo de solapes: «−1/2» es el superíndice más
ancho de la sesión y es justo lo que el avance medido resuelve.

### D4 · La deducción de la contribución y del cos², donde se definen

En `Block1.jsx`, en la sección «Contribución y coseno cuadrado», entre la `Prose` que define
las dos herramientas y la `NumTable` de contribuciones, entra una `Prose` de dos párrafos
—**De dónde sale la contribución.** y **De dónde sale el cos².**— y la figura
`fDeduccion()` en `figures/block1.js` con dos secciones:

1. LA INERCIA DE UN EJE — `λ_k = Σ_i m_i f_ik²`, con la gloss: sustituyendo
   f_ik = u_ik σ_k / √r_i queda σ_k² Σ_i u_ik², y las columnas de U tienen norma uno; la
   contribución `ctr_ik = m_i f_ik² / λ_k` es la parte de esa suma que pone la fila i, y por
   eso suman uno. Ejemplo: Σ_i m_i f_i1² con los tres sumandos del ejemplo, igual a λ_1.
2. LA DISTANCIA AL CENTROIDE — `d²(i, centroide) = Σ_j (r_ij − c_j)²/c_j = Σ_k f_ik²`, con la
   gloss: (s_ij/√r_i)² es (r_ij − c_j)²/c_j, así que la distancia es la norma de la fila i de
   D_r^{−1/2} S; F = D_r^{−1/2} S V son las coordenadas de esa fila en la base ortonormal V,
   y una norma no cambia de base (Pitágoras); `cos²_ik = f_ik² / d²(i, centroide)` es la parte
   que muestra el eje k, y por eso suman uno. Ejemplo: «observado sol», Σ_k f_ik² con sus dos
   sumandos, igual a d² desde el perfil.

`ejemplo_lluvia.py` publica `CA.deduccion = { eje: 1, sumandosInercia: [m_i·f_i1²],
suma, lambda, fila, sumandosDistancia: [f_ik²], sumaF2, d2Perfil }`, y `assert`a
Σ_i m_i f_ik² = λ_k para todo k y Σ_k f_ik² = d²(i, centroide) para toda fila (esta segunda
ya existe en `ca_de()`; la primera se añade).

El bloque 2 no deduce: al final de su sección de contribución y cos² remite con una frase al
bloque 1, «la deducción es la misma sobre la tabla disyuntiva: cambian D_r y D_c, no el
argumento».

## Risks / Trade-offs

- **Σ como matriz y Σ como sumatorio en la misma sesión.** → Tamaño distinto, gloss que lo
  define, y Λ para los valores propios; la guía usa la misma convención.
- **U tiene tantas filas como filas la tabla; en el MCA son ocho personas.** → No se dibuja
  la matriz; se cita una entrada. La verificación es una línea por fórmula.
- **La deducción del cos² pide «una norma no cambia de base».** → Se dice como Pitágoras:
  ejes perpendiculares, el cuadrado de la longitud es la suma de los cuadrados de las
  coordenadas; la sesión 6 ya usó la misma imagen con la sombra de un vector.
- **La transición en matrices repite lo que la sección siguiente verifica.** → Es a
  propósito: aquí está la línea, allí el número; el bloque 1 lo dice.

## Migration Plan

Regenerar `lluvia.js` y `ejemplo.js` (dos veces, `diff` vacío), `pnpm build`,
`check_figuras.mjs`, bloques 1 y 2 a 390 px y ampliados. Vuelta atrás: revertir el commit.
