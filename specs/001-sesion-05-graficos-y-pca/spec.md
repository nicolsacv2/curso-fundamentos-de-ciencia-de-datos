# Spec 001 — Sesión 5: gráficos y reducción de dimensiones

## Contexto y objetivo

El curso son ocho sesiones de tres horas; hay cuatro construidas. La sesión 4 terminó
con una caja de resúmenes numéricos —centro, dispersión, asociación— y con el precio de
cada uno. La sesión 5 los vuelve dibujo: qué gráfico le corresponde a cada tipo de dato,
cómo se lee, y qué pasa cuando las variables son tantas que ningún plano las muestra a
la vez. Ahí entra el análisis de componentes principales, primero como nube que se mira
desde su mejor ángulo y después como círculo de correlaciones, donde el ángulo entre dos
flechas es la correlación que la entrada acaba de definir con fórmula. La sesión cierra
con el reverso: gráficos que estorban en vez de mostrar.

Dos decisiones tomadas en la entrevista, ambas deliberadas:

1. **Los ejemplos no salen de la tabla del salón**, sino de un conjunto célebre de
   indicadores socioeconómicos por país —elegido porque sus variables son las que este
   público ya sabe interpretar—.
   Rompe la continuidad que las sesiones 2 y 4 anunciaron en pantalla, así que esta spec
   incluye corregir esas dos promesas (RF-64 a RF-68).
2. **El nivel es geométrico con fórmulas nombradas**: se ven y se nombran matriz de
   covarianza, autovector, autovalor y varianza explicada, pero no se desarrolla el
   cálculo. El público es de ciencias sociales y económicas.

## Usuarios / actores

- **Profesor.** Proyecta la sesión en la pared del salón y avanza por los cinco bloques.
  Es quien controla el ritmo.
- **Estudiante en el salón.** Lee la pared; puede abrir la misma sesión en su teléfono.

La aplicación no distingue entre los dos: no hay cuentas ni roles. La distinción importa
solo para los requisitos de legibilidad (proyector) y de ancho (teléfono).

## Historias de usuario

- **H1**: Como estudiante quiero ver la fórmula de la covarianza y la de la correlación
  para entender que el número que usé en la sesión 4 no salió de la nada.
- **H2**: Como estudiante quiero saber qué gráfico admite cada tipo de dato para no
  elegir el que deforma lo que quiero mostrar.
- **H3**: Como estudiante quiero entender qué hace PCA con una nube de puntos para leer
  un plano de componentes sin creer que es un mapa geográfico.
- **H4**: Como estudiante quiero leer un círculo de correlaciones para deducir qué variables
  van juntas sin calcular ninguna correlación.
- **H5**: Como estudiante quiero reconocer un gráfico basura para no producirlo yo.
- **H6**: Como profesor quiero que la sesión 5 se recorra igual que las cuatro
  anteriores para no cambiar de manera de dar clase a mitad de curso.

## Requisitos funcionales (criterios de aceptación en EARS)

### Estructura de la sesión

- **RF-1**: EL SISTEMA ofrecerá la sesión 5 en el índice del curso junto a las cuatro
  existentes.
- **RF-2**: EL SISTEMA dividirá la sesión 5 en cinco bloques rotulados Entrada, Bloque 1,
  Bloque 2, Bloque 3 y Cierre, con las mismas etiquetas que las sesiones 1 a 4.
- **RF-3**: EL SISTEMA mostrará como título de la sesión 5 «Ver lo que no cabe en la
  hoja».
- **RF-4**: EL SISTEMA abrirá la sesión 5 con el gancho «Cuatro variables no caben en un
  papel de dos dimensiones; vamos a dibujarlas todas y a perder menos de lo que crees».
- **RF-5**: EL SISTEMA mostrará como objetivo de la sesión 5 «elegir el gráfico que
  corresponde a cada dato y a cada pregunta, y leer un plano factorial y un círculo de
  correlaciones
  para ver a la vez más variables de las que caben en dos ejes».
- **RF-6**: EL SISTEMA anunciará junto a cada bloque su franja de minutos: 0–35 la
  entrada, 35–75 el bloque 1, 83–120 el bloque 2, 128–166 el bloque 3 y 166–180 el
  cierre.

### Entrada — varianza, covarianza y correlación

- **RF-7**: EL SISTEMA mostrará en la entrada la fórmula de la varianza.
- **RF-8**: EL SISTEMA mostrará en la entrada la fórmula de la covarianza.
- **RF-9**: EL SISTEMA mostrará en la entrada la fórmula del coeficiente de correlación
  de Pearson.
- **RF-10**: EL SISTEMA explicará en la entrada que la covarianza de una variable consigo
  misma es su varianza.
- **RF-11**: EL SISTEMA explicará en la entrada que la desviación típica es la raíz
  cuadrada de la varianza.
- **RF-12**: EL SISTEMA explicará en la entrada que la correlación es la covarianza
  dividida por el producto de las desviaciones típicas.
- **RF-13**: EL SISTEMA enunciará en la entrada que la correlación no tiene unidades.
- **RF-14**: EL SISTEMA enunciará en la entrada que la correlación está acotada entre −1
  y +1.
- **RF-15**: EL SISTEMA mostrará en la entrada un diagrama de dispersión sobre el que se
  lee la correlación que acaba de definir.
- **RF-16**: EL SISTEMA nombrará ese diagrama de dispersión en la entrada sin desarrollar
  cómo se construye.

### Bloque 1 — los cinco gráficos

- **RF-17**: EL SISTEMA explicará en el bloque 1 cinco gráficos: barras, circular, caja,
  histograma y dispersión.
- **RF-18**: EL SISTEMA indicará, para cada uno de esos cinco gráficos, qué tipo de dato
  admite.
- **RF-19**: EL SISTEMA indicará, para cada uno de esos cinco gráficos, qué pregunta
  responde.
- **RF-20**: EL SISTEMA explicará, para cada uno de esos cinco gráficos, cómo se
  construye a partir de los datos.
- **RF-21**: EL SISTEMA mostrará al menos un ejemplo dibujado de cada uno de esos cinco
  gráficos.
- **RF-22**: EL SISTEMA mostrará en el bloque 1 una nube de puntos tridimensional que el
  usuario puede rotar.

### Bloque 2 — componentes principales y dimensionalidad

- **RF-23**: EL SISTEMA presentará el análisis de componentes principales como la
  búsqueda de las direcciones en las que la nube de puntos más se estira.
- **RF-24**: EL SISTEMA nombrará la matriz de covarianza, el autovector y el autovalor
  sin desarrollar su cálculo.
- **RF-25**: EL SISTEMA mostrará una misma nube de puntos antes y después de proyectarse
  sobre sus componentes principales.
- **RF-26**: EL SISTEMA indicará el porcentaje de varianza explicada de cada componente
  del ejemplo que use.
- **RF-27**: EL SISTEMA enunciará que un componente principal es una combinación de las
  variables originales, no una de ellas.
- **RF-28**: EL SISTEMA mostrará en el bloque 2 la misma nube tridimensional del bloque 1,
  rotable igual que allí.
- **RF-29**: EL SISTEMA dibujará dentro de esa nube el plano de las dos primeras
  componentes.
- **RF-30**: EL SISTEMA mostrará la proyección de cada punto de la nube sobre ese plano.
- **RF-31**: EL SISTEMA dibujará dentro de esa nube un vector por cada variable original.
- **RF-32**: EL SISTEMA mostrará la proyección de cada uno de esos vectores sobre el plano
  de las dos primeras componentes.
- **RF-33**: MIENTRAS el usuario rote esa figura, EL SISTEMA mantendrá el plano, las
  proyecciones y los vectores solidarios con la nube.
- **RF-34**: EL SISTEMA enunciará en el bloque 2 la maldición de la dimensionalidad.
- **RF-35**: EL SISTEMA presentará en el bloque 2 el análisis de componentes principales
  como una respuesta a la maldición de la dimensionalidad.
- **RF-80**: EL SISTEMA rotulará las dos primeras componentes del plano factorial como
  CP 1 y CP 2, sin darles nombre.
- **RF-81**: EL SISTEMA mostrará las cargas de cada una de esas dos componentes.
- **RF-82**: EL SISTEMA mostrará qué países quedan en cada extremo de cada una de esas dos
  componentes.
- **RF-83**: EL SISTEMA advertirá que ponerle nombre a una componente sería una
  interpretación y no un resultado del cálculo.
- **RF-84**: EL SISTEMA mostrará en el bloque 2 la construcción del plano factorial como
  una secuencia de pasos dibujados.
- **RF-85**: EL SISTEMA describirá con texto cada uno de los pasos de esa construcción.
- **RF-103**: EL SISTEMA mostrará la nube en sus unidades originales antes de
  estandarizarla.
- **RF-104**: EL SISTEMA mostrará el punto medio de la nube como un paso propio de la
  construcción.
- **RF-105**: EL SISTEMA enunciará que centrar forma parte de la definición del análisis de
  componentes principales.
- **RF-106**: EL SISTEMA enunciará que estandarizar es una decisión y no un requisito del
  método.
- **RF-107**: EL SISTEMA mostrará qué primera componente resulta cuando no se estandariza.
- **RF-108**: EL SISTEMA explicará que el análisis puede hacerse sobre la matriz de
  covarianzas o sobre la de correlaciones.
- **RF-109**: EL SISTEMA enunciará que el análisis sobre covarianzas parte de datos solo
  centrados.
- **RF-110**: EL SISTEMA enunciará que el análisis sobre correlaciones parte de datos
  además divididos por su desviación típica.
- **RF-111**: EL SISTEMA enunciará que en el análisis sobre covarianzas pesa más la
  variable de mayor varianza absoluta.
- **RF-112**: EL SISTEMA enunciará que el análisis sobre correlaciones no cambia si se
  cambian las unidades de una variable.
- **RF-113**: EL SISTEMA mostrará qué le ocurre al análisis sobre covarianzas cuando se
  cambia la unidad de una variable.
- **RF-114**: EL SISTEMA enunciará que la suma de los autovalores del análisis sobre
  correlaciones es el número de variables.
- **RF-115**: EL SISTEMA indicará en qué caso conviene cada uno de los dos análisis.

### Bloque 3 — círculo de correlaciones

- **RF-36**: EL SISTEMA mostrará en el bloque 3 la tabla del ejemplo junto a su
  transpuesta.
- **RF-37**: EL SISTEMA explicará que transponer la tabla convierte cada variable en un
  registro.
- **RF-38**: EL SISTEMA explicará que cada variable, convertida en registro, se representa
  como un vector.
- **RF-39**: EL SISTEMA enunciará que el ángulo entre dos de esos vectores es el que el
  círculo de correlaciones dibuja.
- **RF-40**: EL SISTEMA enunciará que el plano factorial de los individuos y el círculo de
  correlaciones de las
  variables son dos vistas del mismo análisis.
- **RF-41**: EL SISTEMA explicará el círculo de correlaciones como la representación de cada
  variable original mediante una flecha en el plano de los dos primeros componentes.
- **RF-42**: EL SISTEMA enunciará que el coseno del ángulo entre dos flechas del círculo de
  correlaciones
  aproxima la correlación entre esas dos variables.
- **RF-43**: EL SISTEMA mostrará dibujado el caso de dos flechas con ángulo próximo a 0°
  y su correlación próxima a +1.
- **RF-44**: EL SISTEMA mostrará dibujado el caso de dos flechas con ángulo próximo a 90°
  y su correlación próxima a 0.
- **RF-45**: EL SISTEMA mostrará dibujado el caso de dos flechas con ángulo próximo a
  180° y su correlación próxima a −1.
- **RF-46**: EL SISTEMA explicará que la longitud de una flecha indica cuán bien
  representada queda esa variable en el plano dibujado.
- **RF-47**: EL SISTEMA remitirá a la fórmula de correlación de la entrada al enunciar su
  equivalencia con el ángulo.
- **RF-86**: EL SISTEMA mostrará en el bloque 3 la construcción del círculo de
  correlaciones como una secuencia de pasos dibujados.
- **RF-87**: EL SISTEMA describirá con texto cada uno de los pasos de esa construcción.
- **RF-88**: EL SISTEMA presentará esa construcción en el orden transponer, centrar y
  normalizar.
- **RF-89**: EL SISTEMA explicará que centrar una variable consiste en restarle su propia
  media.
- **RF-90**: EL SISTEMA explicará que la escala se iguala dividiendo cada variable por su
  propia desviación típica.
- **RF-91**: EL SISTEMA mostrará los valores de un mismo país antes y después de centrarlos
  y dividirlos.
- **RF-92**: EL SISTEMA enunciará que, una vez centradas las variables, el origen del
  círculo de correlaciones corresponde a la media de cada una.
- **RF-93**: EL SISTEMA enunciará que la matriz que se diagonaliza después de ese paso es
  la de correlaciones.
- **RF-94**: SI las variables no se centraran ni se dividieran por su desviación típica,
  ENTONCES EL SISTEMA advertirá que la de mayor escala decidiría por sí sola el resultado.
- **RF-95**: EL SISTEMA enunciará que las cargas son correlaciones y que por eso ninguna
  flecha sale del círculo de radio 1.
- **RF-96**: EL SISTEMA explicará que, una vez transpuesta la tabla, centrar es restarle a
  cada fila su propia media.
- **RF-97**: EL SISTEMA explicará que, al transponer, cada variable pasa a ser un vector
  con un componente por país.
- **RF-98**: EL SISTEMA explicará que normalizar es llevar cada uno de esos vectores a
  longitud 1.
- **RF-99**: EL SISTEMA enunciará que el coseno del ángulo entre dos de esos vectores
  normalizados es exactamente su correlación.
- **RF-100**: EL SISTEMA enunciará que el radio 1 del círculo es consecuencia de esa
  normalización.
- **RF-101**: EL SISTEMA enunciará que la sombra de uno de esos vectores sobre el plano de
  las dos primeras componentes es su carga.
- **RF-102**: EL SISTEMA enunciará que la aproximación entre el coseno y la correlación
  nace de esa proyección y no del cálculo de la correlación.

### Cierre — gráficos basura

- **RF-48**: EL SISTEMA mostrará en el cierre al menos un gráfico tridimensional junto a
  la versión bidimensional del mismo dato.
- **RF-49**: EL SISTEMA enunciará en el cierre qué se pierde al añadir la tercera
  dimensión de ese ejemplo.
- **RF-50**: EL SISTEMA mostrará en el cierre un gráfico sin etiquetas en sus ejes.
- **RF-51**: EL SISTEMA mostrará en el cierre un gráfico sin ejes dibujados.
- **RF-52**: EL SISTEMA mostrará en el cierre un gráfico sobrecargado de información
  hasta impedir su lectura.
- **RF-53**: EL SISTEMA indicará, para cada gráfico basura del cierre, qué impide
  entender.
- **RF-54**: EL SISTEMA planteará en el cierre un ticket de salida, como en las sesiones
  1 a 4.
- **RF-55**: EL SISTEMA no pedirá en la sesión 5 ninguna tarea para la sesión 6.

### Datos de los ejemplos

- **RF-56**: EL SISTEMA usará como material de la sesión 5 cuatro indicadores por país
  tomados de Gapminder: PIB per cápita, esperanza de vida, fertilidad y mortalidad
  infantil.
- **RF-57**: EL SISTEMA usará esos cuatro indicadores referidos todos a un mismo año.
- **RF-58**: EL SISTEMA indicará en pantalla a qué año corresponden los datos.
- **RF-59**: EL SISTEMA dibujará la nube tridimensional con tres de esos cuatro
  indicadores.
- **RF-60**: EL SISTEMA usará ese mismo conjunto en la entrada y en los tres bloques.
- **RF-61**: EL SISTEMA describirá qué mide cada indicador antes de graficarlo.
- **RF-62**: EL SISTEMA no usará la tabla del salón como material de la sesión 5.
- **RF-63**: EL SISTEMA acreditará junto a cada ejemplo el nombre del conjunto de datos
  del que sale.

### Corrección del material ya publicado

- **RF-64**: EL SISTEMA no mostrará en la sesión 2 ninguna flecha que anuncie que la
  tabla del salón se grafica en la sesión 5.
- **RF-65**: EL SISTEMA conservará en esa figura de la sesión 2 los tres destinos que
  siguen siendo ciertos: se limpia en la 3, se describe en la 4 y se modela en la 7.
- **RF-66**: EL SISTEMA dejará constancia, junto a la figura corregida de la sesión 2, de
  que su texto ya no coincide con el del curso original y de por qué.
- **RF-67**: EL SISTEMA dejará de anunciar en el cierre de la sesión 4 que los resúmenes
  calculados allí se vuelven dibujo en la sesión siguiente.
- **RF-68**: EL SISTEMA anunciará en el cierre de la sesión 4 el contenido que la sesión
  5 sí trata.

### Comportamiento en pantalla y casos no deseados

- **RF-69**: SI una figura de la sesión 5 no cabe en el ancho de la ventana, ENTONCES EL
  SISTEMA la ajustará sin producir desplazamiento horizontal de la página.
- **RF-70**: CUANDO el usuario active «Ampliar» en una figura de la sesión 5, EL SISTEMA
  abrirá el diálogo de ampliación.
- **RF-71**: CUANDO el usuario pulse Esc con ese diálogo abierto, EL SISTEMA lo cerrará.
- **RF-72**: CUANDO ese diálogo se cierre, EL SISTEMA devolverá el foco al control que lo
  abrió.
- **RF-73**: EL SISTEMA no usará en la sesión 5 ninguna imagen alojada fuera del
  repositorio.
- **RF-74**: EL SISTEMA no almacenará nada en el navegador durante la sesión 5.
- **RF-75**: MIENTRAS no haya conexión a la red, EL SISTEMA mostrará todo el contenido de
  la sesión 5.
- **RF-76**: CUANDO el usuario arrastre sobre una figura tridimensional de la sesión 5,
  EL SISTEMA cambiará el ángulo desde el que se ve la escena.
- **RF-77**: MIENTRAS nadie haya rotado una figura tridimensional, EL SISTEMA la mostrará
  en un ángulo en el que el plano y las proyecciones ya son visibles.
- **RF-78**: CUANDO el usuario abandone el bloque, EL SISTEMA no conservará el ángulo al
  que se dejó la figura.
- **RF-79**: SI el puntero no está disponible, ENTONCES EL SISTEMA seguirá mostrando la
  figura tridimensional en su ángulo inicial.

## Requisitos no funcionales

- **Idioma.** Todo lo que se proyecta va en español; identificadores, comentarios y
  mensajes de commit, en inglés (constitución, principio 6).
- **Ancho.** La sesión se lee a 390 px sin desplazamiento horizontal.
- **Proyección.** El contenido se lee en una pared: ninguna figura debe depender de
  distinguir dos colores contiguos para entenderse, porque el proyector del salón no lo
  garantiza.
- **Dependencias.** La sesión 5 no añade ninguna dependencia al proyecto (constitución,
  principio 1). Cualquier biblioteca de gráficos, de álgebra o de 3D queda fuera por
  definición, incluidas las figuras rotables de RF-22 y RF-28.
- **Verificación sin red.** Comprobar la sesión no puede exigir red, contenedores ni base
  de datos (constitución, principio 4).
- **Peso.** Abrir un bloque de la sesión 5 no debe descargar el contenido de los otros
  cuatro, igual que en las sesiones 1 a 4.

## Casos límite

1. **La corrección hace divergir la sesión 2 del original.** Las sesiones 1 y 2 provienen
   del curso original y `check_content.py` compara su texto contra él, así que RF-64 hará
   que reporte una diferencia. Está decidido que se acepta y se anota (RF-66): el script se
   sigue ejecutando tal cual, y esa es la única diferencia esperada.
2. **La dispersión se nombra antes de explicarse.** La entrada apoya la correlación en un
   diagrama de dispersión (RF-15) que el bloque 1 solo desarrolla después. Está decidido
   que la entrada lo presente sin construirlo (RF-16) y que el bloque 1 lo retome; hay que
   cuidar que el bloque 1 no lo trate como si nadie lo hubiera visto.
3. **El cierre sigue siendo denso.** Aunque la dimensionalidad se fue al bloque 2, el
   cierre conserva cuatro gráficos basura, la explicación de qué impide entender cada uno
   y el ticket de salida, todo en catorce minutos.
4. **El signo de los componentes es arbitrario.** Dos programas pueden dibujar el mismo
   PCA en espejo. Si el círculo de correlaciones se compara con una imagen de otra fuente, la orientación
   puede no coincidir sin que ninguno de los dos esté mal.
5. **Flechas cortas en el círculo de correlaciones.** Una variable mal representada dibuja una
   flecha corta, cuyo ángulo ya no aproxima bien la correlación. Es exactamente el caso
   en que la regla de RF-42 falla, y el bloque 3 la enseña como regla.
6. **Correlación cero con relación perfecta.** La sesión 4 ya mostró la parábola con
   r ≈ 0. Si el bloque 3 presenta el ángulo como equivalente a la correlación, arrastra
   ese mismo punto ciego.
7. **Conjunto célebre con licencia restrictiva.** Si el conjunto elegido no permite
   reproducir sus datos o su gráfico original, RF-63 no basta y hay que sustituirlo.
8. **Construir un histograma obliga a decidir.** El ancho del intervalo no viene con
   los datos: elegirlo cambia la forma del dibujo sin que ningún dato cambie. RF-20
   pide explicar la construcción de los cinco gráficos, así que hay que decidir si
   esa elección se enseña como tal o se pasa por alto.
9. **El cierre condena lo que los bloques 1 y 2 usan.** El cierre presenta el 3D
   innecesario como gráfico basura (RF-48, RF-49), y esos dos bloques se apoyan en una
   figura tridimensional. Hay que decidir qué distingue al 3D que aporta —rotable, para
   ver de dónde sale una proyección— del que estorba, o el cierre desautoriza la mejor
   figura de la sesión.
10. **Rotar en una pared no es rotar en un teléfono.** La figura se proyecta con un ratón
   a tres metros del público, y se lee también en un móvil donde arrastrar es el gesto con
   el que se hace scroll. RF-76 y RF-79 tienen que convivir sin secuestrar el gesto.
11. **Números que no cuadran con el ejemplo.** Los porcentajes de varianza explicada de
   RF-26 tienen que salir del conjunto real; inventarlos rompería el principio de que los
   números en pantalla son comprobables.
12. **La tabla girada muestra valores crudos, y el círculo no se construye con ellos.**
   La figura de la transpuesta imprime los valores tal como vienen —Catar con 132900
   dólares— y el texto pasaba de «la variable es un registro» a «un registro es un vector»
   sin decir que antes hay que centrar y dividir por la desviación típica. Sin ese paso,
   el vector de Catar lo decide el PIB y el ángulo no significa nada.

   Lo destapó una pregunta sobre esa figura: «¿son las coordenadas de las componentes o
   los valores reales?». Son los reales, y el material no explicaba el puente. Cubierto
   ahora por RF-88 a RF-95, que exigen decir qué es centrar (restar la media), por qué se
   divide (igualar escalas), qué pasa si no se hace (manda la variable más grande), qué
   queda en el origen (la media de cada una) y qué matriz se acaba diagonalizando (la de
   correlaciones).
13. **La transpuesta no cabe en la pantalla.** Un conjunto célebre tiene decenas o
   cientos de filas, así que su transpuesta tiene decenas o cientos de columnas y no se
   proyecta entera. RF-36 exige mostrar ambas, de modo que hay que decidir qué recorte se
   enseña sin que deje de leerse como la misma tabla girada.

## Fuera de alcance

- **Actividades con marcador compartido.** La sesión 5 no llama a ningún servicio
  externo, no depende de verquo y no toca el contrato descrito en `docs/apis/`.
- **Cálculo en vivo.** No se calcula ningún PCA, correlación ni gráfico a partir de datos
  que el usuario introduzca en el momento: la rotación cambia el punto de vista, nunca los
  datos ni los componentes, que van calculados de antemano.
- **Interacción más allá de girar.** Las figuras tridimensionales se rotan; no hay zoom, ni
  selección de puntos, ni filtrado de variables, ni cambio del conjunto de datos.
- **Animación automática.** Ninguna figura gira sola: el ángulo lo cambia quien mira.
- **La tabla del salón.** No se grafica aquí (RF-62); si se decide graficarla, es otra
  sesión y otra spec.
- **Recolección de datos nuevos.** No hay formulario ni dato nuevo pedido a la clase.
- **Herramientas.** No se enseña a producir estos gráficos en Excel, Python ni R.
- **Imágenes externas.** Ninguna figura es una fotografía ni un gráfico publicado: se
  dibujan todas aquí, incluidos los gráficos basura del cierre.
- **La paradoja de Simpson.** Comprometida por la sesión 4 para la sesión 6; no entra
  aquí.
- **Modelado.** La sesión 7 es la de modelar; PCA aparece como descripción y reducción,
  no como predicción.
- **Otras técnicas de reducción.** Ni análisis factorial, ni t-SNE, ni UMAP, ni
  clustering sobre los componentes.
- **Exportar o imprimir.** No hay descarga de figuras, ni versión PDF, ni guía impresa.
- **Evaluación.** El ticket de salida no se califica ni se registra.

## Criterios de finalización

1. Cada RF verificado abriendo la sesión 5 en el navegador y comprobándolo en pantalla,
   uno por uno.
2. `pnpm build` compila.
3. `python3 scripts/check_content.py` ejecutado, y su única diferencia reportada es la de
   la figura de la sesión 2 (caso límite 1). Si el proyecto original no está al lado, se
   dice, no se omite en silencio.
4. Recorrido manual a 390 px de ancho: ninguna figura provoca desplazamiento horizontal.
5. En cada figura de la sesión 5: «Ampliar» abre el diálogo, Esc lo cierra y el foco
   vuelve al control que lo abrió.
6. `grep -rn "localStorage\|document.cookie" src/` sigue vacío (RF-74).
7. `package.json` sigue con cuatro dependencias.
8. Las sesiones 2 y 4 ya no prometen lo que la 5 no hace (RF-64 a RF-68).

## Dudas abiertas

Ninguna: las ocho que abrió la entrevista quedaron resueltas y aplicadas. Lo que sigue
pendiente no son huecos de la spec sino decisiones de redacción, y está recogido en
«Casos límite»: el recorte de la tabla transpuesta (12), la densidad del cierre (3) y la
frontera entre el 3D que aporta y el que estorba (9).


