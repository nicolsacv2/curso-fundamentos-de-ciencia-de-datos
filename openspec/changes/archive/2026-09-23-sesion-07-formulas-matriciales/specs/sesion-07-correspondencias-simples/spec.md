## ADDED Requirements

### Requirement: Las coordenadas en forma matricial
EL SISTEMA SHALL mostrar en el bloque 1, al cerrar el paso de las distancias al mapa, las
fórmulas matriciales que producen las coordenadas: la descomposición de los residuos
estandarizados S = U Σ Vᵀ, con U las direcciones de la nube de filas, V las de la nube de
columnas y Σ la diagonal de los valores singulares σ_k = √λ_k; su relación con la matriz
que se diagonalizó, SᵀS = V Λ Vᵀ, y con la de la otra nube, SSᵀ = U Λ Uᵀ, con los mismos
valores propios; las coordenadas de las filas F = D_r^{−1/2} U Σ y de las columnas
G = D_c^{−1/2} V Σ, escritas también entrada por entrada; y las fórmulas de transición en
la misma notación, F = D_r^{−1} P G Σ^{−1} y G = D_c^{−1} Pᵀ F Σ^{−1}.

#### Scenario: Las líneas están escritas con sus símbolos definidos
- **WHEN** alguien lee las coordenadas en forma matricial
- **THEN** ve la descomposición de S, las dos fórmulas de coordenadas y las dos de transición
- **AND** cada símbolo —U, V, Σ, Λ, D_r, D_c, P— está definido donde aparece

#### Scenario: La descomposición se ata a los valores propios
- **WHEN** alguien lee la descomposición de S
- **THEN** ve que σ_k² = λ_k
- **AND** ve que SᵀS = V Λ Vᵀ es la matriz que se diagonalizó, y que SSᵀ tiene los mismos λ

#### Scenario: Cada fórmula se verifica con el ejemplo
- **WHEN** alguien lee las fórmulas de coordenadas
- **THEN** ve una fila y una columna del ejemplo recalculadas desde U, V, σ y sus masas
- **AND** cada una coincide con su coordenada publicada

#### Scenario: La descomposición se publica y se comprueba
- **WHEN** se generan las cifras del ejemplo
- **THEN** el proceso publica U, V, σ y las masas
- **AND** falla si U Σ Vᵀ no reconstruye S, si D_r^{−1/2} U Σ no da las coordenadas de fila publicadas, si D_c^{−1/2} V Σ no da las de columna, o si σ_k² no es λ_k

#### Scenario: Nada se calcula en el navegador
- **WHEN** alguien abre el bloque 1
- **THEN** las cifras de la verificación ya están calculadas

### Requirement: La contribución y el coseno cuadrado se deducen
EL SISTEMA SHALL deducir en el bloque 1, en la sección de contribución y coseno cuadrado,
las dos fórmulas a partir de las coordenadas: que la inercia de un eje es la suma, pesada por
las masas, de las coordenadas al cuadrado, λ_k = Σ_i m_i f_ik², porque las columnas de U
tienen norma uno; que la contribución de una fila es su sumando sobre ese total, y por eso
las contribuciones suman uno por eje; que la distancia chi-cuadrado de una fila al centroide
es la norma de su fila en D_r^{−1/2} S y las coordenadas f_ik son las de esa misma fila sobre
ejes perpendiculares, de modo que d²(i, centroide) = Σ_k f_ik²; y que el coseno cuadrado es
la parte de ese cuadrado que un eje muestra, y por eso suman uno por punto.

#### Scenario: Las dos deducciones están escritas y en orden
- **WHEN** alguien lee la sección de contribución y coseno cuadrado
- **THEN** ve primero de dónde sale λ_k = Σ_i m_i f_ik² y después de dónde sale d²(i, centroide) = Σ_k f_ik²
- **AND** cada una remite a las fórmulas matriciales del bloque

#### Scenario: Las identidades son consecuencia
- **WHEN** alguien lee las deducciones
- **THEN** se enuncia que las contribuciones suman uno por eje porque son partes de λ_k
- **AND** que los cosenos cuadrados suman uno por punto porque son partes de su distancia al centroide

#### Scenario: Cada deducción se verifica con el ejemplo
- **WHEN** alguien lee las deducciones
- **THEN** ve Σ_i m_i f_i1² calculada con las cifras del ejemplo, igual a λ_1
- **AND** ve, para una fila del ejemplo, Σ_k f_ik² igual a su distancia al centroide calculada desde el perfil

#### Scenario: Las cifras se publican y se comprueban
- **WHEN** se generan las cifras del ejemplo
- **THEN** el proceso publica las dos sumas y sus contrapartes
- **AND** falla si Σ_i m_i f_ik² no es λ_k para algún eje, o si Σ_k f_ik² no es la distancia al centroide para alguna fila
