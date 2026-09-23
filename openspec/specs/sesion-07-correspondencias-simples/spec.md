# sesion-07-correspondencias-simples Specification

## Purpose

Cubre el bloque 1 de la sesión 7: el análisis de correspondencias simples de la tabla de
contingencia de la entrada —el ejemplo inventado del cielo del día observado contra el del día
siguiente; del perfil a la nube, de la nube al plano—, con la distancia
chi-cuadrado, la inercia como χ²/n, las coordenadas de filas y columnas, las fórmulas de
transición, la contribución y el cos², y su papel de puente hacia el análisis de
correspondencias múltiples.

## Requirements

### Requirement: El bloque parte de la tabla que la entrada acaba de leer
EL SISTEMA SHALL abrir el bloque 1 con la misma tabla de contingencia de la entrada y enunciar
que el análisis de correspondencias simples es la manera de dibujarla: cada fila y cada
columna como un punto en un plano.

#### Scenario: La misma tabla, ahora como dibujo
- **WHEN** alguien abre el bloque 1 de la sesión 7
- **THEN** ve la misma tabla de contingencia de la entrada
- **AND** se enuncia que el bloque la convierte en un plano con un punto por fila y por columna

### Requirement: Los perfiles son la nube
EL SISTEMA SHALL enunciar que cada perfil de fila es un punto con tantas coordenadas como
columnas, que el perfil promedio es el centroide, y que las masas de las filas son sus
marginales sobre el total.

#### Scenario: Perfil, centroide y masa
- **WHEN** alguien lee cómo se construye la nube
- **THEN** ve que cada perfil de fila es un punto
- **AND** ve el perfil promedio como centroide, con sus cifras
- **AND** ve la masa de cada fila, que es su marginal sobre el total

### Requirement: La distancia chi-cuadrado entre perfiles
EL SISTEMA SHALL mostrar la distancia chi-cuadrado entre dos perfiles —cada diferencia al
cuadrado dividida por el perfil promedio de esa columna— calculada sobre dos filas de la tabla
del ejemplo, definir en la misma figura el símbolo de ese perfil promedio, c_j, como el margen
de la columna sobre el total, y enunciar que las columnas raras pesan más.

#### Scenario: Dos filas, una distancia
- **WHEN** alguien lee la distancia chi-cuadrado
- **THEN** ve la fórmula
- **AND** ve escrito qué es c_j —el margen de la columna sobre n— y su valor en el ejemplo
- **AND** ve su valor entre dos estados del día observado concretos de la tabla del ejemplo
- **AND** se enuncia que las diferencias en columnas poco frecuentes pesan más

### Requirement: La inercia total es el chi-cuadrado sobre n
EL SISTEMA SHALL enunciar que la inercia total de la nube es el estadístico chi-cuadrado de la
entrada dividido por el número de días, mostrarlo con las cifras del ejemplo, y que se
reparte en tantos ejes como el menor de filas o columnas menos uno.

#### Scenario: La inercia cuadra con el chi-cuadrado
- **WHEN** alguien lee la inercia total
- **THEN** ve χ²/n calculado con las cifras de la entrada
- **AND** ve que los valores propios la suman
- **AND** ve cuántos ejes hay y por qué

### Requirement: Filas y columnas en el mismo plano
EL SISTEMA SHALL dibujar el plano de los dos primeros ejes con los niveles de las dos
variables como puntos, distinguidos por su marca según la variable, con cada eje rotulado con
su número y su porcentaje de inercia, y con las coordenadas salidas de los datos generados.

#### Scenario: Un punto por nivel, dos marcas
- **WHEN** alguien mira el mapa del bloque 1
- **THEN** cada nivel de las dos variables está en el plano
- **AND** los niveles de una variable se distinguen de los de la otra por su marca
- **AND** cada eje lleva escrito su número y su porcentaje

#### Scenario: Las posiciones salen de los datos generados
- **WHEN** se comparan las posiciones dibujadas con las coordenadas publicadas
- **THEN** coinciden

### Requirement: Las fórmulas de transición
EL SISTEMA SHALL mostrar que la coordenada de una fila es el promedio ponderado de las
coordenadas de las columnas según su perfil, dilatado por 1/√λ, y viceversa, definir en la
misma figura el perfil de columna c_ji que la segunda dirección usa, y verificarlo sobre un
estado del día observado de la tabla del ejemplo con sus cifras.

#### Scenario: La transición se verifica sobre una fila
- **WHEN** alguien lee las fórmulas de transición
- **THEN** ve la fórmula en las dos direcciones
- **AND** ve escrito qué es c_ji, el perfil de columna, y en qué se distingue de c_j
- **AND** ve el promedio ponderado de una fila concreta, dilatado, coincidiendo con su coordenada publicada

### Requirement: Contribución y coseno cuadrado
EL SISTEMA SHALL definir la contribución de un punto a un eje y su coseno cuadrado, mostrar las
dos para las filas y las columnas en el eje 1, y nombrar el eje solo con los puntos que
superan el aporte promedio.

#### Scenario: El eje 1 se nombra con lo que lo construyó
- **WHEN** alguien mira la tabla de contribuciones del bloque 1
- **THEN** ve la contribución y el cos² de cada fila y cada columna en el eje 1
- **AND** ve el aporte promedio
- **AND** el eje se nombra únicamente con los puntos que lo superan

### Requirement: La lectura del mapa
EL SISTEMA SHALL enunciar las reglas de lectura del mapa —una fila cerca de una columna
significa que esa fila tiene esa columna más de lo esperado; dos filas cercanas tienen
perfiles parecidos y reparten el día siguiente de forma parecida; dos columnas cercanas
vienen de días observados parecidos; la distancia entre una fila y una columna se lee por la
relación baricéntrica y no como una distancia euclídea— y aplicar cada regla a un caso
concreto del mapa del ejemplo, elegido desde los datos y con sus cifras:

- cada estado con su homónimo: las tres parejas «observado X» / «siguiente X», con la celda
  de la diagonal observada contra esperada;
- el par de filas más cercano y el par más lejano, con su distancia chi-cuadrado y sus
  perfiles;
- el par de columnas más cercano, con su distancia;
- una fila junto a la columna de otro estado, leída por dirección, con su celda observada
  contra esperada;
- el punto más cercano al centro, con su perfil frente al margen.

#### Scenario: Las reglas están escritas y aplicadas
- **WHEN** alguien lee la interpretación del mapa
- **THEN** ve las cuatro reglas de lectura
- **AND** cada regla remite a un caso concreto del mapa con sus cifras

#### Scenario: Cada fila con su columna
- **WHEN** alguien lee el caso de las parejas homónimas
- **THEN** ve las tres parejas
- **AND** para cada una ve los pares observados y los esperados de su celda de la diagonal

#### Scenario: Filas con filas
- **WHEN** alguien lee el caso de las filas
- **THEN** ve qué dos estados observados están más cerca y qué dos más lejos
- **AND** ve la distancia chi-cuadrado y los perfiles de cada par
- **AND** los dos pares son los que las distancias publicadas señalan

#### Scenario: Una fila junto a la columna de otro estado
- **WHEN** alguien lee ese caso
- **THEN** se dice que se lee por dirección y no con regla
- **AND** ve la celda observada contra la esperada de esa fila y esa columna

#### Scenario: El punto más cercano al centro
- **WHEN** alguien lee ese caso
- **THEN** ve cuál es el punto más cercano al centro
- **AND** ve su perfil junto al margen
- **AND** no se afirma que haya puntos «cerca del centro» si ninguno lo está

#### Scenario: Los casos siguen a los datos
- **WHEN** se regenera el año y cambia qué par es el más cercano o qué punto está más cerca del centro
- **THEN** los casos que la prosa cita cambian con él

### Requirement: El puente al MCA
EL SISTEMA SHALL cerrar el bloque enunciando que el análisis de correspondencias múltiples del
bloque siguiente es este mismo análisis aplicado a la tabla indicadora de varias variables a la
vez, y que todo lo visto —perfiles, distancia chi-cuadrado, inercia, transición, contribución,
cos²— se conserva.

#### Scenario: Una frase que anuncia el bloque 2
- **WHEN** alguien llega al final del bloque 1
- **THEN** se enuncia que el MCA es el mismo análisis sobre la tabla indicadora
- **AND** se enumeran las piezas que se conservan

### Requirement: Las cifras del análisis se generan y se comprueban
EL SISTEMA SHALL producir los valores propios, las coordenadas, las contribuciones y los cos²
con el mismo proceso repetible que produce la tabla de la entrada, comprobar antes de
publicar que Σλ = χ²/n, que la fórmula de transición se cumple para todas las filas y
columnas y que las contribuciones suman uno por eje, y no escribir ninguna a mano.

#### Scenario: Una identidad rota detiene la publicación
- **WHEN** Σλ no coincide con χ²/n, la transición falla o las contribuciones no suman uno
- **THEN** el proceso falla y no publica

#### Scenario: Nada se calcula en el navegador
- **WHEN** alguien abre el bloque 1
- **THEN** los resultados ya están calculados

### Requirement: Las fórmulas se ven escritas en la pared
EL SISTEMA SHALL mostrar las fórmulas del bloque de forma legible proyectadas, sin pedir nada a
un servidor externo para dibujarlas, y sin código ni nombres de lenguajes de programación;
compuestas de modo que ningún subíndice ni superíndice se monte sobre el símbolo que le
sigue, que toda raíz cuadrada lleve su barra encima de todo el radicando y a su altura, y
que cada letra griega se lea como la letra que es.

#### Scenario: Las fórmulas no dependen de la red ni de un lenguaje
- **WHEN** alguien abre el bloque 1 sin conexión, con la página ya cargada
- **THEN** todas las fórmulas se ven
- **AND** no hay código ni nombres de lenguajes en pantalla

#### Scenario: Un índice no pisa lo que sigue
- **WHEN** una fórmula del bloque 1 lleva un subíndice o un superíndice de más de una letra
- **THEN** el símbolo que sigue empieza después del índice, sin tocarlo

#### Scenario: La raíz cubre su radicando
- **WHEN** una fórmula del bloque 1 lleva una raíz cuadrada
- **THEN** la barra de la raíz cubre todo el radicando
- **AND** el signo de la raíz tiene la altura del radicando

#### Scenario: La ji es una ji
- **WHEN** una fórmula del bloque 1 escribe χ
- **THEN** se lee como la letra griega y no como una equis

### Requirement: El mapa y la prosa nombran el día observado y el día siguiente
EL SISTEMA SHALL nombrar en el bloque 1 las filas como estados del día observado y las
columnas como estados del día siguiente —en la tabla, en los rótulos del mapa, en las tablas
de contribuciones y en la prosa—, y no como «hoy» y «mañana».

#### Scenario: Ni hoy ni mañana en el bloque 1
- **WHEN** alguien recorre el bloque 1 de la sesión 7
- **THEN** cada fila se nombra como estado del día observado y cada columna como estado del día siguiente
- **AND** ningún rótulo ni frase llama «hoy» o «mañana» a las variables de la tabla

### Requirement: La prosa del bloque 1 sigue a las cifras del recuento
EL SISTEMA SHALL sostener toda afirmación del bloque 1 sobre el resultado —qué puntos nombran
el eje 1, cuánto retiene, qué fila y qué columna están más lejos del centro, si la tabla es
casi una línea— sobre las cifras publicadas del análisis de la tabla contada, no sobre una
afirmación escrita para la tabla anterior.

#### Scenario: Regenerar arrastra la prosa
- **WHEN** se regenera el año y cambia una cifra del análisis
- **THEN** las cifras en pantalla cambian con él
- **AND** ninguna afirmación del bloque queda contradicha por las cifras publicadas

### Requirement: Las distancias entre perfiles se publican y se comprueban
EL SISTEMA SHALL publicar la distancia chi-cuadrado entre cada par de filas y entre cada
par de columnas de la tabla del ejemplo, producidas por el mismo proceso repetible que
produce el análisis, y comprobar antes de publicar que cada una coincide con la distancia
euclídea entre las coordenadas principales de los dos puntos sobre todos los ejes.

#### Scenario: Todos los pares están
- **WHEN** alguien toma las distancias publicadas
- **THEN** encuentra una por cada par de filas y una por cada par de columnas
- **AND** cada una lleva los dos estados que separa

#### Scenario: Cerca en el mapa significa perfiles parecidos
- **WHEN** una distancia publicada no coincide con la distancia entre las coordenadas de sus dos puntos
- **THEN** el proceso falla y no publica

### Requirement: El mapa muestra la celda de cada pareja homónima
EL SISTEMA SHALL mostrar en el mapa, junto a los rótulos de cada pareja formada por un
estado como día observado y el mismo estado como día siguiente, la celda de la diagonal
que esa pareja dibuja: los pares observados y los esperados bajo independencia, con una
leyenda que diga qué es esa línea.

#### Scenario: Tres celdas en el mapa
- **WHEN** alguien mira el mapa del bloque 1
- **THEN** cada pareja «observado X» / «siguiente X» lleva junto a sus rótulos los pares observados y los esperados de su celda
- **AND** hay dónde aprender qué significa esa línea

#### Scenario: Las cifras salen de la tabla
- **WHEN** se comparan las cifras rotuladas con la tabla observada y la esperada
- **THEN** coinciden

### Requirement: De las distancias al mapa
EL SISTEMA SHALL explicar, entre la distancia chi-cuadrado y el mapa, cómo se pasa de una a
otro en tres pasos: que cada perfil es un punto con una masa medido con esa distancia; que
los ejes son las direcciones que más inercia conservan, lo mismo que hizo el análisis de
componentes principales de la sesión 6 con la nube de personas, ahora pesando cada punto por
su masa y midiendo con chi-cuadrado, con tantos ejes como la tabla admite; y que las
coordenadas son las proyecciones sobre esos ejes, de modo que la distancia entre dos puntos
del mismo tipo en el mapa aproxima su distancia chi-cuadrado y con todos los ejes es exacta.

#### Scenario: Los tres pasos están escritos y en orden
- **WHEN** alguien lee el bloque 1 entre la distancia chi-cuadrado y el mapa
- **THEN** ve los tres pasos —la nube, los ejes, las coordenadas— en ese orden
- **AND** se remite al análisis de componentes principales de la sesión 6 como el mismo gesto
- **AND** se enuncia que la distancia en el mapa aproxima la chi-cuadrado y es exacta con todos los ejes

#### Scenario: El salto se verifica sobre un par de filas
- **WHEN** alguien lee la verificación del salto
- **THEN** ve dos estados observados con su distancia calculada desde los perfiles y desde las coordenadas
- **AND** las dos coinciden
- **AND** se dice por qué coinciden exactamente en este ejemplo: el plano retiene toda la inercia

#### Scenario: Las cifras del salto se generan
- **WHEN** se comparan las distancias citadas en el salto con las publicadas
- **THEN** coinciden y ninguna está escrita a mano

#### Scenario: La notación se define donde se usa
- **WHEN** alguien lee el paso de las coordenadas
- **THEN** ve escrito que f_ik es la coordenada de la fila i en el eje k y g_jk la de la columna j
- **AND** lo ve antes de la fórmula que las usa

### Requirement: Por qué filas y columnas caben en el mismo plano
EL SISTEMA SHALL explicar en el bloque 1, antes del mapa, por qué las filas y las columnas se
dibujan sobre los mismos ejes, en tres pasos: que hay dos nubes —los perfiles de fila en el
espacio de las columnas y los perfiles de columna en el espacio de las filas—, cada una con
sus masas y la distancia chi-cuadrado; que las dos nubes tienen los mismos ejes con la misma
inercia, de modo que analizar una o la otra da los mismos valores propios; y que las
fórmulas de transición ponen cada fila en el baricentro de las columnas y cada columna en el
de las filas, dilatados por el mismo factor, y por eso se superponen. Y enunciar el precio:
entre dos filas y entre dos columnas la distancia del mapa es la chi-cuadrado, entre una fila
y una columna no es una distancia sino una dirección.

#### Scenario: Los tres pasos están escritos y en orden
- **WHEN** alguien lee el bloque 1 bajo «Filas y columnas en el mismo plano», antes del mapa
- **THEN** ve las dos nubes, los ejes compartidos y la transición, en ese orden
- **AND** se enuncia que las dos nubes tienen los mismos valores propios

#### Scenario: La transición se verifica en las dos direcciones
- **WHEN** alguien lee la verificación
- **THEN** ve una fila calculada desde las columnas y una columna calculada desde las filas, cada una coincidiendo con su coordenada publicada
- **AND** las cifras salen del proceso que genera el ejemplo y no están escritas a mano

#### Scenario: El precio está enunciado
- **WHEN** alguien termina de leer por qué caben en el mismo plano
- **THEN** se enuncia que la distancia entre una fila y una columna no es una distancia sino una dirección

### Requirement: Cómo se obtienen los valores propios
EL SISTEMA SHALL explicar en el bloque 1, dentro del paso de los ejes, de dónde salen los
valores propios, en tres pasos: los residuos estandarizados de cada celda —la diferencia
entre lo observado y lo esperado, sobre la raíz de lo esperado, en proporciones—, que son
el chi-cuadrado de la entrada con signo y sobre n; la matriz de residuos cruzados, columnas
contra columnas, cuya traza es χ²/n; y diagonalizarla como el análisis de componentes
principales de la sesión 6 diagonalizó la matriz de correlaciones, de modo que el mayor
valor propio es la inercia de la dirección que más conserva, el siguiente es perpendicular,
y el último vale cero por el centrado; y enunciar que de los vectores salen las coordenadas
de las columnas y, por transición, las de las filas.

#### Scenario: Los tres pasos están escritos y en orden
- **WHEN** alguien lee cómo se obtienen los valores propios
- **THEN** ve los residuos, la matriz y la diagonalización, en ese orden
- **AND** se remite al análisis de componentes principales de la sesión 6 como el mismo gesto

#### Scenario: Los residuos del ejemplo están a la vista
- **WHEN** alguien lee el paso de los residuos
- **THEN** ve la fórmula del residuo estandarizado
- **AND** ve la tabla de residuos del ejemplo, con signo, y que sus cuadrados suman χ²/n

#### Scenario: La traza es la inercia
- **WHEN** alguien lee el paso de la matriz
- **THEN** ve que la traza de la matriz de residuos cruzados es χ²/n con las cifras del ejemplo
- **AND** ve que los valores propios la suman

#### Scenario: El valor propio nulo se explica
- **WHEN** alguien lee la diagonalización
- **THEN** ve todos los valores propios del ejemplo, incluido el que vale cero
- **AND** se enuncia que vale cero por el centrado, y que por eso hay un eje menos que columnas

#### Scenario: Las cifras se generan y se comprueban
- **WHEN** se comparan los residuos, la matriz, la traza y los valores propios citados con los publicados
- **THEN** coinciden y ninguno está escrito a mano
- **AND** el proceso que los genera falla si los valores propios no suman la traza

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
