# Tareas — Sesión 7: el ejemplo de la lluvia

Derivadas de `specs/` y de `design.md`. En orden de dependencia: los datos primero, la
tabla compartida, la entrada y el bloque 1, los puentes y las ideas, la documentación, y la
verificación. Cada grupo deja el sitio compilando. Las comprobaciones: `pnpm build`,
`scripts/ejemplo_lluvia.py` dos veces con `diff`, `node scripts/check_figuras.mjs`, y la
lectura a 390 px.

## 1. El año inventado, generado

- [x] 1.1 Escribir `scripts/ejemplo_lluvia.py` (stdlib pura, docstring con qué hace y cómo se
      invoca) con la tabla del diseño D1 como constante, sus marginales, los perfiles de fila
      y de columna, las esperadas, la contribución de cada celda al χ², φ² y V, y los `assert`
      de marginales, esperadas, Σ = χ² y la historia (P(lluvia | lluvia) > P(lluvia),
      P(sol | sol) > P(sol)).
      **Hecho cuando:** imprime la tabla con su total de 365 y χ², φ² y V; cambiar una celda
      de modo que la historia deje de cumplirse lo hace fallar sin escribir.
- [x] 1.2 Añadir el **CA** de la tabla con el `jacobi` de `extract_gapminder.py`, con la misma
      forma que hoy publica `tablas.js` (`filas` y `columnas` con `coord`, `ctr`, `cos2`, la
      transición sobre la primera fila, la distancia entre las dos primeras) y sus `assert`:
      Σλ = φ², transición en las dos direcciones, Σctr = 1, Σcos² = 1, K = 2 ejes.
      **Hecho cuando:** el script pasa y los dos ejes acumulan el 100 % de la inercia.
- [x] 1.3 Mover **Simpson** desde `tablas_salon.py` con su `assert` de inversión, y emitir
      `src/sessions/s07/data/lluvia.js` con la cabecera «generated — do not edit by hand» y las
      exportaciones `ESTADOS`, `TABLA`, `PERFILES`, `ESPERADAS`, `CHI2`, `CA` y `SIMPSON`.
      **Hecho cuando:** dos ejecuciones seguidas dejan el archivo idéntico según `diff`, y
      `node -e "import('./src/sessions/s07/data/lluvia.js')"` lo carga sin error.
- [x] 1.4 Borrar `scripts/tablas_salon.py` y `src/sessions/s07/data/tablas.js` con `git rm`.
      **Hecho cuando:** `grep -rn "tablas.js\|tablas_salon" src scripts` no devuelve nada
      (el README se corrige en 6.2).

## 2. Una tabla numérica compartida, con la esquina fija

- [x] 2.1 Añadir `NumTable` a `src/components/content/index.jsx` —cabecera, filas con nombre,
      pie opcional, `marca(i, j)`, markup `dtable`— con la celda de esquina con `className="n"`,
      y reemplazar las cinco copias de `Tabla` en `src/sessions/s07/blocks/*.jsx` por ella.
      **Hecho cuando:** `grep -c "function Tabla" src/sessions/s07/blocks/*.jsx` es cero en
      los cinco, `pnpm build` compila, y al desplazar una tabla en horizontal en el navegador
      la esquina se queda fija y la primera columna sigue visible.

## 3. La entrada, sobre la lluvia

- [x] 3.1 Reescribir `s07/figures/intro.js` sobre `lluvia.js`: la rejilla observado contra
      esperado con los estados como rótulos y «días» como unidad; los perfiles de fila al 100 %
      con el margen como referencia; las seis barras de Simpson; y las fórmulas con la celda
      lluvia → lluvia como ejemplo. Sin `abrevia()`, sin `salon`.
      **Hecho cuando:** `node scripts/check_figuras.mjs` no reporta recortes y cada figura
      declara que cuenta días de un año inventado.
- [x] 3.2 Reescribir `s07/blocks/Intro.jsx` en el orden de la spec: el puente desde «¿qué
      falta?» (sin cifras del salón, diciendo que el salón vuelve en el cierre); la tabla del
      año inventado con sus sumas; los perfiles y P(lluvia mañana | lluvia hoy) leída sobre su
      celda; marginal contra condicional; la tabla esperada; el χ² celda por celda, φ² y V con
      la advertencia de medida y no prueba; la paradoja de Simpson. Sin `<Idea>`.
      **Hecho cuando:** todos los requisitos de `specs/sesion-07-tablas-de-contingencia`
      están, `grep -n "salon\|Idea\|CANDIDATOS" src/sessions/s07/blocks/Intro.jsx` no devuelve
      nada, `grep -nE "[0-9]+[.,][0-9]+" src/sessions/s07/blocks/Intro.jsx` no encuentra cifras
      tecleadas, y el bloque se recorre sin error de consola.

## 4. El bloque 1, sobre la misma tabla

- [x] 4.1 Reescribir `s07/figures/block1.js` sobre `lluvia.js`: las fórmulas del CA con los
      días del ejemplo, y el mapa con los tres estados de hoy como círculos y los tres de
      mañana como cuadrados, cada eje con su número y su porcentaje.
      **Hecho cuando:** ninguna coordenada está escrita en el módulo y `check_figuras` pasa.
- [x] 4.2 Reescribir `s07/blocks/Block1.jsx` en el orden de la spec sobre la tabla del
      ejemplo: perfiles, centroide y masas en días; la distancia entre dos estados de hoy; la
      inercia como χ²/n y los dos ejes que retienen todo; el mapa; la transición verificada
      sobre una fila; contribuciones y cos² del eje 1 con el aporte promedio; las reglas de
      lectura aplicadas a una celda del cielo; el puente al MCA. Sin `<Idea>`.
      **Hecho cuando:** todos los requisitos de `specs/sesion-07-correspondencias-simples`
      están, `grep -n "salon\|Idea" src/sessions/s07/blocks/Block1.jsx` no devuelve nada, no
      hay cifras tecleadas, y el bloque se recorre sin error de consola.

## 5. El salón solo en el cierre, y sin ideas

- [x] 5.1 En `s07/blocks/Block2.jsx`, abrir sin la cuenta de columnas y explicar «fusionar» con
      Stevia + Nada, sin citar el agrupamiento del salón, y quitar los imports de `salon.js` y
      `salon_limpio.js`; en `Block3.jsx`, «en el cierre habrá muchas más» sin `columnasCierre`
      y sin import de `salon_limpio.js`.
      **Hecho cuando:** `grep -ln "data/salon" src/sessions/s07/blocks/*.jsx
      src/sessions/s07/figures/*.js` devuelve solo `Closing.jsx` y `closing.js`.
- [x] 5.2 Quitar los ocho `<Idea>` de los cinco bloques de la sesión 7 y su import donde quede
      sin uso.
      **Hecho cuando:** `grep -c "<Idea" src/sessions/s07/blocks/*.jsx` es cero en los cinco y
      `pnpm build` compila.

## 6. Specs y documentación

- [x] 6.1 Corregir el Purpose de `openspec/specs/sesion-07-tablas-de-contingencia/spec.md` y
      de `openspec/specs/sesion-07-correspondencias-simples/spec.md`: el ejemplo propio del
      cielo, no la tabla del salón.
      **Hecho cuando:** ninguno de los dos Purpose menciona el salón y `openspec validate
      --specs` pasa.
- [x] 6.2 Actualizar `README.md`: `ejemplo_lluvia.py` entre los scripts sin dependencias en
      lugar de `tablas_salon.py`, `lluvia.js` en `s07/data/`, y la verificación.
      **Hecho cuando:** `grep -n "tablas_salon\|tablas.js" README.md` no devuelve nada.

## 7. Verificación final

- [x] 7.1 Ejecutar `pnpm build`, `scripts/ejemplo_lluvia.py` dos veces con `diff`, y
      `node scripts/check_figuras.mjs`.
      **Hecho cuando:** los tres pasan y el build no emite ningún chunk de `tablas.js`.
- [x] 7.2 Recorrer los cinco bloques de la sesión 7 con `pnpm preview` a ancho completo y a
      390 px: sin error de consola, ninguna figura provoca scroll horizontal, **Ampliar** abre,
      Esc cierra y devuelve el foco, y ninguna tabla tapa su primera columna al desplazarse.
      **Hecho cuando:** las cuatro comprobaciones pasan en los cinco bloques.
- [x] 7.3 Desplegar en local y compartir la URL para la comprobación manual.
      **Hecho cuando:** `pnpm preview` sirve el build y la respuesta trae la dirección.
