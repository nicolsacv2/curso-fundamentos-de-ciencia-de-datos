# Análisis de Correspondencias Múltiples (MCA) y Análisis Factorial de Datos Mixtos (FAMD)

*Guía completa: teoría matemática, ejemplos numéricos paso a paso, interpretación y gráficos.*

---

## Parte 1 — La matemática del MCA

### 1.1 El punto de partida: la tabla disyuntiva completa

Tenemos $n$ individuos y $Q$ variables categóricas. La variable $q$ tiene $J_q$ categorías, con un total de $J = \sum_q J_q$ categorías.

El objeto central es la **matriz indicadora** $Z$ (tabla disyuntiva completa), de dimensión $n \times J$: cada fila es un individuo, cada columna una categoría, con $z_{ij} = 1$ si el individuo $i$ tiene la categoría $j$, y $0$ si no. Cada fila suma exactamente $Q$; la columna $j$ suma $n_j$; la suma total es $nQ$.

### 1.2 MCA como Análisis de Correspondencias de Z

- **Matriz de correspondencias:** $P = \frac{1}{nQ} Z$
- **Masas de fila:** $r_i = 1/n$ (todos los individuos pesan igual)
- **Masas de columna:** $c_j = \frac{n_j}{nQ}$ (cada categoría pesa según su frecuencia)
- **Residuos estandarizados:**

$$S = D_r^{-1/2}\,(P - rc^\top)\,D_c^{-1/2}, \qquad s_{ij} = \frac{p_{ij} - r_i c_j}{\sqrt{r_i c_j}}$$

Esta es la raíz del estadístico chi-cuadrado descompuesto celda por celda: MCA analiza la dependencia entre individuos y categorías más allá de lo esperado bajo independencia.

### 1.3 Descomposición en valores singulares (SVD)

$$S = U \Sigma V^\top$$

Los valores propios (inercias principales) son $\lambda_k = \sigma_k^2$. Las coordenadas principales:

- **Individuos (filas):** $F = D_r^{-1/2}\, U \Sigma$
- **Categorías (columnas):** $G = D_c^{-1/2}\, V \Sigma$

### 1.4 La métrica chi-cuadrado

Entre dos individuos:

$$d^2(i, i') = \frac{n}{Q}\sum_j \frac{(z_{ij} - z_{i'j})^2}{n_j}$$

Las diferencias en **categorías raras** ($n_j$ pequeño) pesan más: compartir una característica infrecuente acerca mucho más que compartir una común.

Distancia de una categoría al centroide (fórmula cerrada, clave para la Parte 3):

$$d^2(j, \text{centroide}) = \frac{n}{n_j} - 1$$

### 1.5 Fórmulas de transición (relaciones baricéntricas)

$$f_{ik} = \frac{1}{\sqrt{\lambda_k}} \cdot \frac{1}{Q}\sum_{j} z_{ij}\, g_{jk} \qquad\qquad g_{jk} = \frac{1}{\sqrt{\lambda_k}} \cdot \frac{1}{n_j}\sum_{i} z_{ij}\, f_{ik}$$

Salvo la dilatación $1/\sqrt{\lambda_k}$: **un individuo está en el baricentro de sus categorías, y una categoría en el baricentro de sus individuos**.

### 1.6 Inercia total y corrección de porcentajes

$$\mathcal{I} = \sum_k \lambda_k = \frac{J - Q}{Q}$$

Depende solo de $J$ y $Q$, no de los datos. Hay $J - Q$ ejes no triviales y el valor propio promedio es $1/Q$. Los porcentajes crudos son artificialmente pesimistas; la **corrección de Benzécri** re-escala solo los que superan el promedio:

$$\lambda_k^{adj} = \left(\frac{Q}{Q-1}\right)^2 \left(\lambda_k - \frac{1}{Q}\right)^2, \qquad \text{solo si } \lambda_k > \frac{1}{Q}$$

(Greenacre propone una variante menos optimista ajustando también el denominador.)

### 1.7 La matriz de Burt

$B = Z^\top Z$ contiene todas las tablas de contingencia cruzadas. Aplicar CA a $B$ da las mismas coordenadas estandarizadas de categorías, con valores propios al cuadrado: $\lambda_k^{Burt} = (\lambda_k^{Z})^2$.

### 1.8 Herramientas de interpretación

- **Contribución** de la categoría $j$ al eje $k$: $\text{ctr}_{jk} = \dfrac{c_j \, g_{jk}^2}{\lambda_k}$ (suman 1 por eje; las altas *definen* el eje)
- **Coseno cuadrado** (calidad de representación): $\cos^2_{jk} = \dfrac{g_{jk}^2}{d^2(j, \text{centroide})}$ (qué tan fiel es la posición del punto en ese eje/plano)

---

## Parte 2 — Ejemplo numérico completo

**Datos:** $n = 8$ personas, $Q = 3$ variables binarias — Bebida (Café/Té), Horario (Mañana/Noche), Azúcar (Sí/No). $J = 6$.

### 2.1 Matriz indicadora Z

| Individuo | Café | Té | Mañana | Noche | Sí | No |
|---|---|---|---|---|---|---|
| 1 | 1 | 0 | 1 | 0 | 1 | 0 |
| 2 | 1 | 0 | 1 | 0 | 1 | 0 |
| 3 | 1 | 0 | 1 | 0 | 0 | 1 |
| 4 | 1 | 0 | 0 | 1 | 1 | 0 |
| 5 | 0 | 1 | 0 | 1 | 0 | 1 |
| 6 | 0 | 1 | 0 | 1 | 0 | 1 |
| 7 | 0 | 1 | 1 | 0 | 0 | 1 |
| 8 | 0 | 1 | 0 | 1 | 1 | 0 |

Patrón sembrado: cafeteros → mañaneros y azucarados; teteros → nocturnos sin azúcar, con excepciones (individuos 3, 4, 7, 8). Todas las categorías con $n_j = 4$ (balanceadas).

### 2.2 Resultados

- Masas: $r_i = 1/8$, $c_j = 4/24 = 0.1667$
- Valores propios: $\lambda = (0.5690,\ 0.3333,\ 0.0976)$; suma $= 1 = (J-Q)/Q$ ✓; exactamente $J - Q = 3$ ejes ✓

**Coordenadas principales de categorías:**

| Categoría | Eje 1 | Eje 2 |
|---|---|---|
| Café | −0.924 | 0 |
| Té | +0.924 | 0 |
| Mañana | −0.653 | +0.707 |
| Noche | +0.653 | −0.707 |
| Sí (azúcar) | −0.653 | −0.707 |
| No | +0.653 | +0.707 |

**Individuos:** los perfiles puros 1, 2 en −0.986 y 5, 6 en +0.986 (eje 1); los mixtos 3, 4, 7, 8 en ±0.408, distinguidos por el eje 2 (±0.816).

### 2.3 Verificación de la fórmula de transición

Individuo 1 (Café, Mañana, Sí), eje 1: baricentro $= \frac{-0.924 - 0.653 - 0.653}{3} = -0.7435$; dilatado: $-0.7435 / \sqrt{0.5690} = -0.9856 = f_{11}$ ✓

### 2.4 Contribuciones y calidad (eje 1)

| Categoría | Contribución | cos² eje 1 | cos² eje 2 |
|---|---|---|---|
| Café / Té | 25% c/u | 0.854 | 0 |
| Mañana / Noche | 12.5% c/u | 0.427 | 0.427 |
| Sí / No | 12.5% c/u | 0.427 | 0.427 |

Con 6 categorías el aporte promedio es 1/6 ≈ 16.7%: solo Café/Té lo superan → el eje 1 se nombra "bebida".

### 2.5 Corrección de Benzécri

Umbral $1/Q = 0.333$. Solo $\lambda_1 = 0.569$ lo supera: $\lambda_1^{adj} = (3/2)^2(0.569 - 0.333)^2 = 0.125$. Porcentaje crudo del eje 1: 56.9%; ajustado: 100% (con datos tan pequeños Benzécri exagera — la crítica de Greenacre).

### 2.6 Verificación con Burt

$\lambda^{Burt} = (0.3238, 0.1111, 0.0095) = (\lambda^{Z})^2$ ✓

### 2.7 Mapa factorial (ejes 1 y 2)

<svg viewBox="0 0 680 500" xmlns="http://www.w3.org/2000/svg" role="img">
<line x1="60" y1="240" x2="620" y2="240" stroke="#B4B2A9" stroke-width="1"/>
<line x1="340" y1="30" x2="340" y2="450" stroke="#B4B2A9" stroke-width="1"/>
<text x="616" y="228" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">Eje 1 (56.9%)</text>
<text x="350" y="42" fill="#8a8a85" font-size="12" font-family="sans-serif">Eje 2 (33.3%)</text>
<circle cx="110" cy="240" r="6" fill="#888780"/>
<text x="110" y="262" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 1, 2</text>
<circle cx="570" cy="240" r="6" fill="#888780"/>
<text x="570" y="262" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 5, 6</text>
<circle cx="245" cy="77" r="5" fill="#888780"/>
<text x="245" y="63" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 3</text>
<circle cx="435" cy="77" r="5" fill="#888780"/>
<text x="435" y="63" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 7</text>
<circle cx="245" cy="403" r="5" fill="#888780"/>
<text x="245" y="425" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 4</text>
<circle cx="435" cy="403" r="5" fill="#888780"/>
<text x="435" y="425" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 8</text>
<rect x="117" y="232" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="125" y="222" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Café</text>
<rect x="547" y="232" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="555" y="222" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Té</text>
<rect x="180" y="91" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="188" y="82" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Mañana</text>
<rect x="484" y="373" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="492" y="364" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Noche</text>
<rect x="180" y="373" width="16" height="16" rx="4" fill="#D85A30"/>
<text x="188" y="364" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Azúcar: Sí</text>
<rect x="484" y="91" width="16" height="16" rx="4" fill="#D85A30"/>
<text x="492" y="82" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Azúcar: No</text>
<text x="76" y="475" fill="#8a8a85" font-size="12" font-family="sans-serif">Cuadros = categorías (morado: bebida, verde: horario, coral: azúcar) · círculos grises = individuos</text>
</svg>

### 2.8 Interpretación

**Eje 1 (56.9%):** gradiente "cafeteros mañaneros dulces" vs "teteros nocturnos amargos". Café/Té más lejos del origen (±0.924) que las demás (±0.653): la bebida es el esqueleto del gradiente; horario y azúcar lo siguen con excepciones.

**Eje 2 (33.3%):** las excepciones al patrón. Café y Té en cero (no participan); opone {Mañana, No} contra {Noche, Sí} — los discordantes 3, 7 arriba y 4, 8 abajo.

**Reglas de proximidad:**
1. Categoría–categoría de variables distintas: asociación válida (las eligen los mismos individuos).
2. Categorías de la misma variable: opuestas por construcción; su distancia no es hallazgo (pero la separación indica cuánto discrimina la variable).
3. Individuo–categoría: válido por la relación baricéntrica, cualitativamente (recordar la dilatación $1/\sqrt{\lambda_k}$).

**Filtro de calidad:** antes de interpretar un punto, verificar su cos². Regla práctica: cos² < 0.2 en el plano → no se interpreta.

---

## Parte 3 — La patología de las categorías raras

**Modificación:** la tercera variable pasa a ser Endulzante con tres categorías: Azúcar ($n_j=4$), Nada ($n_j=3$), **Stevia ($n_j=1$**, solo el individuo 7). Ahora $J = 7$, inercia total $= 4/3$, 4 ejes.

### 3.1 La distancia explota con exactitud matemática

$$d^2(j, \text{centroide}) = \frac{n}{n_j} - 1 \quad\Rightarrow\quad d^2_{Stevia} = \frac{8}{1} - 1 = 7 \;\; (d \approx 2.65)$$

mientras todo lo demás vive dentro del radio 1.3. No depende de los datos: cualquier categoría rara se dispara; si $n_j \to 0$, la distancia diverge. Es consecuencia pura de la métrica chi-cuadrado ($1/n_j$ en cada columna).

### 3.2 Una sola persona fabricó un eje entero

Eje 2 ($\lambda_2 = 0.449$, el 33.7% de la inercia):

| Categoría | Coord. eje 2 | Contribución | cos² eje 2 |
|---|---|---|---|
| **Stevia** | **−2.534** | **59.6%** | **0.917** |
| Mañana / Noche | ∓0.576 | 12.3% c/u | 0.332 |
| Azúcar | +0.435 | 7.0% | 0.189 |
| Café / Té | ±0.301 | 3.4% c/u | 0.091 |

Detrás de un eje que se lleva un tercio de la inercia hay **un solo individuo entre ocho**. Stevia acapara además el 21.9% de la inercia total. Efectos colaterales: el individuo 7 es "secuestrado" hacia ella (de (0.41, 0.82) a (0.19, −1.70)); el eje 1 se diluye de 56.9% a 42.9%; asimetrías espurias en cascada.

**El falso positivo clásico del MCA:** en la periferia del mapa conviven categorías *discriminantes* (lejos porque separan grupos reales) y categorías *raras* (lejos porque casi nadie las tiene). Solo las contribuciones, los cos² y las frecuencias marginales las distinguen; el mapa solo, nunca.

### 3.3 Remedios estándar

1. **Fusionar** con una categoría afín (Stevia + Nada → "Sin azúcar")
2. **Ventilación:** reasignar aleatoriamente los casos bajo un umbral (típicamente $n_j < 2\%$ de $n$)
3. **Proyección suplementaria** (siguiente sección)
4. **MCA específico** (Le Roux y Rouanet): excluye categorías de la métrica manteniendo individuos completos

### 3.4 Mapa con la categoría rara (activa)

<svg viewBox="0 0 680 560" xmlns="http://www.w3.org/2000/svg" role="img">
<line x1="60" y1="200" x2="620" y2="200" stroke="#B4B2A9" stroke-width="1"/>
<line x1="340" y1="30" x2="340" y2="530" stroke="#B4B2A9" stroke-width="1"/>
<text x="616" y="188" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">Eje 1 (42.9%)</text>
<text x="350" y="42" fill="#8a8a85" font-size="12" font-family="sans-serif">Eje 2 (33.7%)</text>
<circle cx="149" cy="190" r="6" fill="#888780"/>
<text x="149" y="178" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 1, 2</text>
<circle cx="267" cy="201" r="5" fill="#888780"/>
<text x="252" y="192" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">ind 3</text>
<circle cx="271" cy="121" r="5" fill="#888780"/>
<text x="271" y="109" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 4</text>
<circle cx="541" cy="168" r="6" fill="#888780"/>
<text x="541" y="156" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 5, 6</text>
<circle cx="424" cy="158" r="5" fill="#888780"/>
<text x="424" y="146" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 8</text>
<circle cx="377" cy="404" r="5" fill="#888780"/>
<text x="392" y="408" fill="#8a8a85" font-size="12" font-family="sans-serif">ind 7</text>
<rect x="159" y="156" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="167" y="148" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Café</text>
<rect x="505" y="228" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="513" y="260" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Té</text>
<rect x="194" y="261" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="202" y="293" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Mañana</text>
<rect x="469" y="123" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="477" y="115" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Noche</text>
<rect x="212" y="140" width="16" height="16" rx="4" fill="#D85A30"/>
<text x="220" y="132" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Azúcar</text>
<rect x="479" y="156" width="16" height="16" rx="4" fill="#D85A30"/>
<text x="487" y="188" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Nada</text>
<rect x="380" y="522" width="16" height="16" rx="4" fill="#D85A30"/>
<text x="410" y="536" fill="#3d3d3a" font-size="13" font-family="sans-serif">Stevia (n=1)</text>
<line x1="388" y1="518" x2="381" y2="412" stroke="#D85A30" stroke-width="1" stroke-dasharray="4 3"/>
<text x="76" y="70" fill="#8a8a85" font-size="12" font-family="sans-serif">Todo el resto queda arriba,</text>
<text x="76" y="86" fill="#8a8a85" font-size="12" font-family="sans-serif">en la franja |coord| &lt; 0.9</text>
</svg>

---

## Parte 4 — Categorías suplementarias

**Montaje:** análisis activo = codificación gruesa (Bebida, Horario, Azúcar Sí/No); las categorías finas Nada ($n_j=3$) y Stevia ($n_j=1$) se proyectan a posteriori.

### 4.1 La fórmula

La fórmula de transición aplicada hacia afuera del análisis:

$$g_{jk}^{sup} = \frac{1}{\sqrt{\lambda_k}} \cdot \frac{1}{n_j}\sum_{i \in j} f_{ik}$$

Para Stevia (único portador: individuo 7, $f_7 = (0.408, 0.816, -0.408)$):

$$g^{sup}_{Stevia} = (0.541,\ 1.414,\ -1.307)$$

Para Nada (baricentro de los individuos 3, 5, 6): $g^{sup}_{Nada} = (0.691, 0.471, 0.796)$. Verificado también por la vía dual (perfil columna × coordenadas estándar de individuos): idéntico.

### 4.2 Los dos destinos de Stevia

| | Como categoría **activa** | Como **suplementaria** |
|---|---|---|
| Posición en el plano | (0.25, −2.53) | (0.54, 1.41) |
| Efecto sobre los ejes | Fabricó el eje 2 (60% ctr) | Contribución = 0 por definición |
| % del eje 1 | Diluido a 42.9% | Intacto en 56.9% |
| Individuo 7 | Secuestrado | En su lugar del gradiente |
| cos² en el plano | 0.92 (circular: el eje se hizo para ella) | 0.33 (diagnóstico honesto) |

La clave: como activa, el análisis giró la cámara para enfocarla — claro que salía "bien representada". Como suplementaria, su cos² bajo dice la verdad: está lejos, en una dirección que este plano no captura.

### 4.3 La asimetría conceptual

- **Elementos activos:** definen la métrica y la geometría (participan en S, en la SVD, en los valores propios).
- **Elementos suplementarios:** observadores; reciben coordenadas sobre una geometría ya cerrada, sin ejercer fuerza.

Usos canónicos de suplementarias: categorías raras, variables sociodemográficas cuando el análisis es de actitudes, individuos atípicos, variables de resultado.

### 4.4 Mapa con suplementarias

<svg viewBox="0 0 680 540" xmlns="http://www.w3.org/2000/svg" role="img">
<line x1="60" y1="317" x2="620" y2="317" stroke="#B4B2A9" stroke-width="1"/>
<line x1="340" y1="30" x2="340" y2="510" stroke="#B4B2A9" stroke-width="1"/>
<text x="616" y="305" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">Eje 1 (56.9%)</text>
<text x="350" y="42" fill="#8a8a85" font-size="12" font-family="sans-serif">Eje 2 (33.3%)</text>
<circle cx="110" cy="317" r="6" fill="#888780"/>
<text x="110" y="339" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 1, 2</text>
<circle cx="570" cy="317" r="6" fill="#888780"/>
<text x="570" y="339" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 5, 6</text>
<circle cx="245" cy="176" r="5" fill="#888780"/>
<text x="245" y="164" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 3</text>
<circle cx="435" cy="176" r="5" fill="#888780"/>
<text x="424" y="164" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">ind 7</text>
<circle cx="245" cy="458" r="5" fill="#888780"/>
<text x="245" y="480" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 4</text>
<circle cx="435" cy="458" r="5" fill="#888780"/>
<text x="435" y="480" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">ind 8</text>
<rect x="117" y="309" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="125" y="299" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Café</text>
<rect x="547" y="309" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="555" y="299" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Té</text>
<rect x="180" y="187" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="188" y="178" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Mañana</text>
<rect x="484" y="431" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="492" y="422" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Noche</text>
<rect x="180" y="431" width="16" height="16" rx="4" fill="#D85A30"/>
<text x="188" y="422" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Azúcar: Sí</text>
<rect x="484" y="187" width="16" height="16" rx="4" fill="#D85A30"/>
<text x="492" y="178" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Azúcar: No</text>
<circle cx="466" cy="72" r="9" fill="none" stroke="#D85A30" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="480" y="66" fill="#3d3d3a" font-size="13" font-family="sans-serif">Stevia (supl., n=1)</text>
<circle cx="501" cy="235" r="9" fill="none" stroke="#D85A30" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="514" y="230" fill="#3d3d3a" font-size="13" font-family="sans-serif">Nada (supl., n=3)</text>
<line x1="459" y1="78" x2="441" y2="169" stroke="#B4B2A9" stroke-width="1" stroke-dasharray="3 3"/>
<text x="76" y="70" fill="#8a8a85" font-size="12" font-family="sans-serif">Círculos punteados = suplementarias:</text>
<text x="76" y="86" fill="#8a8a85" font-size="12" font-family="sans-serif">se dibujan pero no deformaron los ejes</text>
</svg>

---

## Parte 5 — Los conceptos en versión humana

**Baricentro = el punto medio de un grupo.** En una fiesta, "dónde está el grupo del colegio" es el medio de donde están parados. En el mapa: cada persona se para en el medio de sus respuestas, y cada categoría cuelga su letrero en el medio de su gente. Por eso lo que va junto en la vida real termina junto en el dibujo.

**Inercia = cuánta historia hay en los datos.** Si todos respondieran igual, el mapa sería un punto: cero historia. "El eje 1 explica el 57%" significa: más de la mitad de toda la historia se cuenta con una sola frase ("hay dos tribus"). El MCA es un resumen ejecutivo: te dice cuáles son las 2–3 frases que capturan casi todo y qué porcentaje cubre cada una.

**Contribución = quién construyó cada frase del resumen.** Como una vaca colectiva: qué porcentaje de la frase puso cada categoría (suman 100% por eje). Café/Té pusieron el 50% del eje 1 → el eje se llama "bebida". Regla: solo nombran el eje las categorías que superan el aporte promedio ($1/J$). El escándalo de Stevia: 60% de un eje puesto por una sola persona.

**cos² = qué tan en serio tomarse la posición de un punto en el dibujo.** El salón real tiene más dimensiones que la hoja: dos personas pueden verse juntas en la foto y estar en pisos distintos. El cos² (0 a 1) mide qué tan fiel es la foto para cada punto. Café: 0.854 en el eje 1 → léelo con confianza. Mañana: 0.427 + 0.427 → júzgala en el plano completo, no en un eje. La lección de Stevia: como activa tenía cos² = 0.92 (trampa circular: la cámara giró para enfocarla); como suplementaria, 0.33 (diagnóstico honesto).

**El protocolo de lectura profesional, en orden:**
1. Inercia por eje → ¿cuántas frases tiene el resumen y qué peso tiene cada una?
2. Contribuciones → ¿quién escribió cada frase? (nombra los ejes)
3. cos² → ¿de qué puntos me puedo fiar en este dibujo?
4. Posiciones/baricentros → solo al final, y solo para los puntos que pasaron el filtro.

El error de principiante es saltar directo al paso 4.

---

## Parte 6 — FAMD: mezclar variables numéricas y categóricas

### 6.1 El problema y el truco

No se pueden mezclar variables crudas: la de mayor varianza numérica dominaría por aritmética. FAMD (Escofier y Pagès) construye una matriz $X$ con dos bloques re-escalados:

- **Numéricas:** estandarizadas como en PCA: $x \mapsto \frac{x - \bar{x}}{s_x}$ → cada una aporta inercia 1.
- **Categóricas:** cada indicadora dividida por $\sqrt{p_j}$ y centrada: $z_j \mapsto \frac{z_j}{\sqrt{p_j}} - \sqrt{p_j}$ (la ponderación chi-cuadrado del MCA disfrazada de estandarización) → varianza por columna $1 - p_j$; cada variable aporta $J_q - 1$.

Luego, PCA ordinario (SVD) de $X$. Inercia total: $\mathcal{I} = p_{num} + \sum_q (J_q - 1)$.

### 6.2 La propiedad de equilibrio

El primer eje maximiza:

$$\sum_{\text{numéricas}} r^2(F_1, x) + \sum_{\text{categóricas}} \eta^2(F_1, q)$$

Ambos indicadores viven en $[0,1]$: **una numérica puede aportar como máximo 1 por eje, y una categórica también**. Si todo es numérico, FAMD = PCA; si todo es categórico, FAMD = MCA (salvo constante).

### 6.3 Ejemplo numérico

Mismas 8 personas: Bebida y Horario (categóricas) + tazas/día = (4,5,3,4,1,0,2,1) y horas de sueño = (6, 5.5, 6.5, 7, 8, 8.5, 7, 7.5).

- Inercia total = 4 = 2 numéricas + (2−1) + (2−1) ✓
- Varianzas por columna: numéricas 1 c/u; indicadoras $1 - p_j = 0.5$ c/u ✓
- $\lambda = (3.2883,\ 0.5703,\ 0.1414)$ → ejes: **82.2%**, 14.3%, 3.5%

**Verificación del teorema (eje 1):**

$$\underbrace{0.9146}_{r^2(tazas)} + \underbrace{0.9538}_{r^2(sueño)} + \underbrace{0.7969}_{\eta^2(bebida)} + \underbrace{0.6230}_{\eta^2(horario)} = 3.2883 = \lambda_1 \checkmark$$

**Interpretación.** Eje 1 (82.2%): gradiente de estilo de vida completo — cafeteros mañaneros que toman mucho y duermen poco vs teteros nocturnos que toman poco y duermen mucho; las numéricas confirmaron y reforzaron la estructura categórica. Eje 2 (14.3%): esencialmente categórico ($\eta^2_{horario} = 0.36$; las numéricas con $r^2 \approx 0.05$); separa a los discordantes 4 y 7. Las numéricas gradúan a los individuos *dentro* de cada tribu (el 2, con 5 tazas y 5.5h, más extremo que el 1 y el 3).

### 6.4 Advertencias y alternativas

- Una categórica de muchas categorías aporta $J_q - 1$ de inercia total (revisar contribuciones por grupo con cardinalidades dispares), aunque su influencia por eje siga acotada por 1.
- La patología de categorías raras del MCA se hereda intacta ($1/\sqrt{p_j}$ sigue ahí).
- Alternativas: discretizar numéricas + MCA (pierde información, captura no linealidades); PCA ingenuo de dummies (distorsiona, evitar); PCAmix (≈ FAMD); escalamiento óptimo (CATPCA); Gower + PCoA (para clustering).
- Software: `FactoMineR::FAMD()` en R; `prince.FAMD` en Python.

---

## Parte 7 — Cómo se calculan r², η² y los porcentajes

### 7.1 El porcentaje de un eje

$$\% \text{ eje 1} = \frac{\lambda_1}{\mathcal{I}_{total}} = \frac{3.2883}{4} = 82.2\%$$

De las 4 "unidades de historia", el eje 1 se quedó con 3.29.

### 7.2 r²: Pearson al cuadrado entre el eje y la variable

Las puntuaciones del eje son una variable más: $F_1 = (-1.98, -2.59, -1.37, -0.53, 1.98, 2.59, 0.22, 1.69)$. Dato útil: $\text{var}(F_1) = \lambda_1$ — el valor propio ES la varianza de las puntuaciones.

$$r = \frac{\text{cov}(F_1, tazas)}{s_{F_1} \cdot s_{tazas}} = \frac{-2.876}{\sqrt{3.2883}\cdot\sqrt{2.75}} = -0.9564 \quad\Rightarrow\quad r^2 = 0.9146$$

Sabiendo dónde está alguien en el eje, predices el 91% de la variación en tazas.

### 7.3 η²: la descomposición ANOVA

Se parten las puntuaciones $F_1$ por grupos. Bebida: cafeteros con media −1.6188, teteros con media +1.6188.

$$\underbrace{SC_{total} = 26.31}_{\text{dispersión de todos}} = \underbrace{SC_{entre} = 20.96}_{\text{separación entre medias de grupo}} + \underbrace{SC_{dentro} = 5.34}_{\text{dispersión interna de cada grupo}}$$

$$\eta^2 = \frac{SC_{entre}}{SC_{total}} = \frac{20.96}{26.31} = 0.797$$

El 80% de la dispersión en el eje se explica solo sabiendo qué toma cada quien. $\eta^2 = 1$: grupos = dos puntos sin mezcla; $\eta^2 = 0$: saber la bebida no sirve de nada.

### 7.4 SC_dentro en detalle

Es la suma de cuadrados de cada persona respecto a la media de SU grupo:

**Grupo café** (media −1.6188):

| Ind | $F_1$ | Desvío de su media | Cuadrado |
|---|---|---|---|
| 1 | −1.9803 | −0.3615 | 0.1307 |
| 2 | −2.5863 | −0.9675 | 0.9361 |
| 3 | −1.3744 | +0.2444 | 0.0597 |
| 4 | −0.5341 | +1.0847 | 1.1766 |

Subtotal: 2.3031.

**Grupo té** (media +1.6188):

| Ind | $F_1$ | Desvío de su media | Cuadrado |
|---|---|---|---|
| 5 | 1.9803 | +0.3615 | 0.1307 |
| 6 | 2.5863 | +0.9675 | 0.9361 |
| 7 | 0.2160 | −1.4028 | 1.9678 |
| 8 | 1.6925 | +0.0737 | 0.0054 |

Subtotal: 3.0400. **Total: $SC_{dentro} = 5.3429$**, y $20.9636 + 5.3429 = 26.3065 = SC_{total}$ exacto (teorema: los términos cruzados se cancelan).

Lectura: $SC_{dentro}$ mide cuán "impuras" son las tribus. El individuo 7 (tetero mañanero) aporta él solo 1.97 de los 5.34 (37%): los desvíos dentro del grupo son el rastro de las otras variables actuando.

**Identidades que conectan todo:** $\eta^2$ también se obtiene desde los baricentros: $\sum_j p_j \cdot \bar{g}_j^2 / \lambda_1 = 0.797$. El $\eta^2$ del FAMD, la contribución del MCA y la relación baricéntrica son la misma cantidad vista desde tres ángulos.

---

## Parte 8 — Los gráficos del FAMD

Tres vistas complementarias que comparten los mismos ejes:

### 8.1 Mapa de individuos con baricentros de categorías

Cada persona en $(F_1, F_2)$; cada categoría en el baricentro de su gente. Las numéricas no aparecen como puntos, pero ordenaron a la gente.

<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" role="img">
<line x1="40" y1="200" x2="640" y2="200" stroke="#B4B2A9" stroke-width="1"/>
<line x1="340" y1="30" x2="340" y2="395" stroke="#B4B2A9" stroke-width="1"/>
<text x="636" y="188" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">Eje 1 (82.2%)</text>
<text x="350" y="42" fill="#8a8a85" font-size="12" font-family="sans-serif">Eje 2 (14.3%)</text>
<circle cx="142" cy="187" r="5" fill="#888780"/><text x="142" y="175" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">1</text>
<circle cx="81" cy="198" r="5" fill="#888780"/><text x="81" y="186" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">2</text>
<circle cx="203" cy="175" r="5" fill="#888780"/><text x="203" y="163" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">3</text>
<circle cx="287" cy="350" r="5" fill="#888780"/><text x="287" y="372" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">4</text>
<circle cx="538" cy="213" r="5" fill="#888780"/><text x="538" y="233" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">5</text>
<circle cx="599" cy="202" r="5" fill="#888780"/><text x="599" y="190" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">6</text>
<circle cx="362" cy="67" r="5" fill="#888780"/><text x="362" y="55" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">7</text>
<circle cx="509" cy="208" r="5" fill="#888780"/><text x="509" y="228" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">8</text>
<rect x="170" y="220" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="178" y="252" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Café</text>
<rect x="494" y="164" width="16" height="16" rx="4" fill="#534AB7"/>
<text x="502" y="156" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Té</text>
<rect x="189" y="149" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="197" y="141" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Mañana</text>
<rect x="475" y="235" width="16" height="16" rx="4" fill="#1D9E75"/>
<text x="483" y="267" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">Noche</text>
<text x="52" y="405" fill="#8a8a85" font-size="12" font-family="sans-serif">Números = individuos · cuadros = baricentros (morado: bebida, verde: horario)</text>
</svg>

### 8.2 Círculo de correlaciones (numéricas)

Cada numérica es una flecha con coordenadas = sus correlaciones con cada eje: tazas en (−0.956, −0.23), sueño en (0.977, −0.09). Gramática de lectura: longitud = calidad de representación (su cuadrado es el cos² en el plano); ángulo entre flechas ≈ correlación mutua; proyección sobre cada eje = su $r$ con ese eje. La dirección de la flecha indica hacia dónde crece la variable en el mapa de individuos.

<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" role="img">
<defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#534AB7"/></marker></defs>
<circle cx="340" cy="190" r="150" fill="none" stroke="#B4B2A9" stroke-width="1"/>
<line x1="170" y1="190" x2="510" y2="190" stroke="#D3D1C7" stroke-width="1"/>
<line x1="340" y1="20" x2="340" y2="360" stroke="#D3D1C7" stroke-width="1"/>
<text x="516" y="178" fill="#8a8a85" font-size="12" font-family="sans-serif">Eje 1</text>
<text x="350" y="32" fill="#8a8a85" font-size="12" font-family="sans-serif">Eje 2</text>
<line x1="340" y1="190" x2="197" y2="225" stroke="#534AB7" stroke-width="2" marker-end="url(#ar2)"/>
<text x="188" y="248" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">tazas/día</text>
<text x="188" y="264" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">(−0.96, −0.23)</text>
<line x1="340" y1="190" x2="487" y2="204" stroke="#534AB7" stroke-width="2" marker-end="url(#ar2)"/>
<text x="500" y="228" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">horas de sueño</text>
<text x="500" y="244" fill="#8a8a85" font-size="11" text-anchor="middle" font-family="sans-serif">(0.98, −0.09)</text>
<text x="60" y="385" fill="#8a8a85" font-size="12" font-family="sans-serif">Flecha larga = bien representada · ángulo entre flechas ≈ correlación entre variables</text>
</svg>

### 8.3 Cuadrado de relaciones (todas las variables como iguales)

Cada variable completa es un punto: sus coordenadas son su vínculo con cada eje ($r^2$ si numérica, $\eta^2$ si categórica). Como ambos viven en $[0,1]$, todo cae en un cuadrado unitario. Esquina inferior derecha = "puro eje 1"; superior izquierda = "puro eje 2"; origen = "no participa del plano". Es el gráfico para nombrar dimensiones cuando hay muchas variables.

<svg viewBox="0 0 680 430" xmlns="http://www.w3.org/2000/svg" role="img">
<rect x="80" y="60" width="480" height="300" fill="none" stroke="#B4B2A9" stroke-width="1"/>
<text x="80" y="384" fill="#8a8a85" font-size="12" font-family="sans-serif">0</text>
<text x="556" y="384" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">1</text>
<text x="66" y="364" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">0</text>
<text x="66" y="70" fill="#8a8a85" font-size="12" text-anchor="end" font-family="sans-serif">1</text>
<text x="320" y="410" fill="#8a8a85" font-size="12" text-anchor="middle" font-family="sans-serif">vínculo con el eje 1 (r² o η²)</text>
<text x="30" y="215" fill="#8a8a85" font-size="12" transform="rotate(-90 30 215)" text-anchor="middle" font-family="sans-serif">vínculo con el eje 2</text>
<circle cx="519" cy="344" r="6" fill="#534AB7"/>
<text x="519" y="330" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">tazas</text>
<circle cx="538" cy="358" r="6" fill="#534AB7"/>
<text x="547" y="378" fill="#3d3d3a" font-size="13" font-family="sans-serif">sueño</text>
<circle cx="462" cy="316" r="6" fill="#1D9E75"/>
<text x="462" y="302" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">bebida</text>
<circle cx="379" cy="251" r="6" fill="#1D9E75"/>
<text x="379" y="237" fill="#3d3d3a" font-size="13" text-anchor="middle" font-family="sans-serif">horario</text>
<text x="96" y="88" fill="#8a8a85" font-size="12" font-family="sans-serif">morado = numéricas (r²) · verde = categóricas (η²)</text>
</svg>

### 8.4 Protocolo gráfico y software

Orden de lectura: **cuadrado de relaciones** (nombra las dimensiones) → **círculo de correlaciones** (detalle de numéricas) → **mapa de individuos con baricentros** (detalle de categóricas y tipología). En datasets grandes: colorear individuos por variable y etiquetar solo los de mayor cos²/contribución.

```r
library(FactoMineR)
res <- FAMD(datos, graph = FALSE)
plot(res, choix = "ind")     # mapa de individuos + baricentros
plot(res, choix = "quanti")  # círculo de correlaciones
plot(res, choix = "var")     # cuadrado de relaciones
```

(O `factoextra::fviz_famd_*` en R; `prince.FAMD(...).plot()` en Python.)

---

## Síntesis final

PCA (numéricas, métrica euclidiana estandarizada) y MCA (categóricas, métrica chi-cuadrado) son **el mismo algoritmo** — SVD de una matriz apropiadamente escalada — con dos escalados distintos, y FAMD los mezcla columna a columna. El circuito completo: codificación disyuntiva → métrica chi-cuadrado y sus consecuencias ($d^2 = n/n_j - 1$) → SVD → fórmulas de transición (individuo→categorías, categoría→individuos, suplementaria→espacio cerrado) → diagnósticos (contribución, cos²) → corrección de inercias → equivalencia con Burt → patología de categorías raras y sus remedios → extensión a datos mixtos con el criterio $\sum r^2 + \sum \eta^2$.
