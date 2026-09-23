## ADDED Requirements

### Requirement: Las coordenadas del MCA en forma matricial
EL SISTEMA SHALL mostrar en el bloque del MCA, junto a los valores propios, las fórmulas
matriciales que producen las coordenadas sobre la tabla disyuntiva: S = U Σ Vᵀ para los
residuos estandarizados, F = D_r^{−1/2} U Σ para las personas y G = D_c^{−1/2} V Σ para las
categorías, con lo que cambia respecto al análisis simple —P = Z/(nQ), D_r = I/n y
D_c = diag(n_j/(nQ)), de modo que F = √n U Σ—, y verificarlas sobre una persona y una
categoría del ejemplo con las cifras publicadas.

#### Scenario: Las líneas están escritas con lo que cambia
- **WHEN** alguien lee las coordenadas del MCA en forma matricial
- **THEN** ve la descomposición de S y las dos fórmulas de coordenadas
- **AND** ve escrito qué son P, D_r y D_c en la tabla disyuntiva
- **AND** se remite a las mismas líneas del bloque anterior

#### Scenario: Cada fórmula se verifica con el ejemplo
- **WHEN** alguien lee las fórmulas de coordenadas del MCA
- **THEN** ve una persona y una categoría recalculadas desde U, V, σ y las masas
- **AND** cada una coincide con su coordenada publicada

#### Scenario: La descomposición se publica y se comprueba
- **WHEN** se generan las cifras del ejemplo de ocho personas
- **THEN** el proceso publica U, V, σ y las masas del MCA
- **AND** falla si U Σ Vᵀ no reconstruye S, si las fórmulas no dan las coordenadas publicadas, o si σ_k² no es λ_k
- **AND** ninguna otra cifra del ejemplo cambia
