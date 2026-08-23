/* The eight sessions of the course. Ones without a module under sessions/ render
   dimmed. When a session is built its own meta wins, so titles live in one place:
   the entries here only cover the sessions that do not exist yet.
   Titles and goals are course content — they stay in Spanish. */

export const SYLLABUS = [
  [1, 'El mundo corre sobre datos', 'Entender qué es y qué no es la ciencia de datos, descubrir que ya tomamos decisiones con datos todos los días, y ver de dónde salió todo esto.'],
  [2, 'La materia prima: ¿qué es un dato?', 'Distinguir tipos de datos, entender la anatomía de una tabla y comprender que los datos se fabrican, no se encuentran.'],
  [3, 'Datos sucios: el trabajo invisible', 'Entender que la limpieza es la mayor parte del trabajo, y que cada decisión de limpieza tiene consecuencias sobre la conclusión.'],
  [4, 'Estadística sin miedo: describir la realidad', 'Leer con criterio promedios, dispersión y distribuciones, y detectar cuándo un resumen esconde más de lo que muestra.'],
  [5, 'Ver para entender: visualización y narrativa', 'Elegir el gráfico correcto, detectar gráficos mentirosos y contar una historia con datos.'],
  [6, 'Correlación, causalidad y el arte de concluir', 'Desarrollar el músculo del pensamiento crítico: correlación frente a causalidad, azar, muestreo y experimentos.'],
  [7, 'Cómo aprende una máquina', 'Desmitificar el aprendizaje automático y la IA: qué tipos hay, cómo se entrenan, cómo se evalúan y por qué fallan.'],
  [8, 'Fundamentos de Inteligencia Artificial', 'Skills más populares, MCP, RAG, LangChain y SDD.']
];

export const pad2 = n => String(n).padStart(2, '0');
