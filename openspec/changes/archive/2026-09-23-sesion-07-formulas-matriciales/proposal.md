## Why

El bloque 1 de la sesión 7 explica ya de dónde salen los valores propios y qué son f_ik y
g_jk, pero lo dice pieza a pieza —«la proyección del perfil sobre el eje», «de los vectores
propios salen las coordenadas»— y nunca escribe la fórmula que las produce. El bloque 2 hace
lo mismo con el MCA. La guía de la que salió la sesión sí las trae, en una línea cada una:
la descomposición de los residuos S = U Σ Vᵀ, y las coordenadas F = D_r^{−1/2} U Σ para las
filas y G = D_c^{−1/2} V Σ para las columnas. Sin esas líneas, quien quiera reproducir el
mapa con un programa no tiene a qué agarrarse, y quien ya conoce la SVD no reconoce en la
sesión lo que sabe.

## What Changes

- **El bloque 1 escribe las coordenadas en forma matricial**, como cierre de «De las
  distancias al mapa»: la descomposición S = U Σ Vᵀ de los residuos estandarizados —U las
  direcciones de la nube de filas, V las de la nube de columnas, Σ la diagonal de los valores
  singulares σ_k = √λ_k—, atada a lo anterior con SᵀS = V Λ Vᵀ (la matriz que se diagonalizó)
  y SSᵀ = U Λ Uᵀ (la de la otra nube, con los mismos λ); las coordenadas de las filas
  F = D_r^{−1/2} U Σ, es decir f_ik = u_ik σ_k / √r_i; las de las columnas G = D_c^{−1/2} V Σ,
  es decir g_jk = v_jk σ_k / √c_j; y las fórmulas de transición en la misma notación,
  F = D_r^{−1} P G Σ^{−1} y G = D_c^{−1} Pᵀ F Σ^{−1}, que son las dos líneas que la sección
  siguiente ya verifica con números. Cada línea va seguida de su cifra en el ejemplo: una fila
  y una columna recalculadas desde U, V, σ y las masas, coincidiendo con su coordenada
  publicada.
- **El bloque 2 escribe las mismas líneas para el MCA**, sobre la tabla disyuntiva, con lo
  que cambia: P = Z/(nQ), D_r = I/n y D_c = diag(n_j/(nQ)), de modo que F = √n U Σ. Verificado
  sobre una persona y una categoría del ejemplo.
- **El bloque 1 deduce las dos herramientas de lectura.** La contribución: la inercia de un
  eje es la suma, pesada por las masas, de las coordenadas al cuadrado, λ_k = Σ_i m_i f_ik²,
  y sale en una línea de F = D_r^{−1/2} U Σ con las columnas de U de norma uno; la
  contribución de una fila es su sumando sobre ese total, y por eso las contribuciones suman
  uno por eje. El coseno cuadrado: la distancia chi-cuadrado de una fila al centroide es la
  norma de su fila en D_r^{−1/2} S, y las f_ik son las coordenadas de esa misma fila sobre
  los ejes, perpendiculares entre sí, así que por Pitágoras d²(i, centroide) = Σ_k f_ik²; el
  cos² es la parte de ese cuadrado que un eje muestra, y por eso suman uno por punto.
  Verificado con el ejemplo: Σ_i m_i f_i1² igual a λ_1, y para «observado sol», Σ_k f_ik²
  igual a su distancia al centroide calculada desde el perfil. El bloque 2 remite a esta
  deducción, que vale igual sobre la tabla disyuntiva.
- **Los scripts publican la descomposición.** `ejemplo_lluvia.py` y `ejemplo_mca_famd.py`
  emiten U, V, σ y las masas, y comprueban antes de escribir que U Σ Vᵀ reconstruye S entrada
  por entrada, que D_r^{−1/2} U Σ da las coordenadas de fila publicadas y D_c^{−1/2} V Σ las de
  columna, y que σ_k² = λ_k. El de la lluvia publica además las dos cifras de la deducción,
  Σ_i m_i f_i1² y Σ_k f_ik² de la primera fila, con sus asertos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `sesion-07-correspondencias-simples`: el bloque 1 muestra las coordenadas en forma
  matricial, con la descomposición de los residuos, las dos fórmulas de coordenadas y las de
  transición en matrices, cada una verificada con las cifras publicadas; y deduce de ellas
  la contribución y el coseno cuadrado, con sus dos identidades.
- `sesion-06-mca`: el bloque del MCA muestra las mismas fórmulas matriciales sobre la tabla
  disyuntiva, verificadas con el ejemplo de ocho personas.

## Impact

- **Scripts**: `scripts/ejemplo_lluvia.py` (publica `CA.svd`), `scripts/ejemplo_mca_famd.py`
  (publica `MCA.svd`); `src/sessions/s07/data/lluvia.js` y `src/sessions/s07/data/ejemplo.js`
  regenerados.
- **Código que cambia**: `src/sessions/s07/blocks/Block1.jsx` y `figures/block1.js` (la
  sección y la figura `fMatricial`, y la figura `fDeduccion` con su prosa); `src/sessions/s07/blocks/Block2.jsx` y
  `figures/block2.js` (ídem para el MCA).
- **Sin cambios**: la entrada, el bloque 3, el cierre, el tipógrafo (las piezas que hacen
  falta, un subíndice y un superíndice en la misma letra, ya existen), dependencias,
  arquitectura.
