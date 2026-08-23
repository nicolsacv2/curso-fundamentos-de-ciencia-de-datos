import { C, svg, txt } from '../../../svg/kit.js';

/* ═══════════ Closing · the curve ═══════════ */
const CURVE = [[1850,0],[1900,0],[1950,0],[1986,0.0000026],[2000,0.002],
  [2005,0.13],[2010,2],[2013,4.4],[2015,15.5],[2018,33],[2020,64],[2022,101]];
const PROJECTION = [[2022,101],[2025,181]];

export function dataCurve() {
  const W=1040,H=520,L=70,R=30,T=34,B=132,brk=390,maxY=200;
  const x = y => y<=2000 ? L+(y-1850)/150*(brk-L) : brk+(y-2000)/26*(W-R-brk);
  const yv = v => (H-B) - (v/maxY)*((H-B)-T);
  const p = a => a.map((q,i)=>`${i?'L':'M'}${x(q[0]).toFixed(1)},${yv(q[1]).toFixed(1)}`).join(' ');
  let b = `<rect x="${L}" y="${T}" width="${brk-L}" height="${H-B-T}" fill="${C.ground2}"/>`;
  b += txt((L+brk)/2, H-B-16, 'EJE COMPRIMIDO · 150 AÑOS EN EL MISMO ESPACIO QUE 25',
    {fs:11,fill:C.ink3,ta:'middle',ls:1.8});
  [0,50,100,150,200].forEach(v=>{
    b += `<line x1="${L}" y1="${yv(v)}" x2="${W-R}" y2="${yv(v)}" stroke="${C.lineSoft}"/>`;
    b += txt(L-10, yv(v)+4, v, {fs:11.5,fill:C.ink3,ta:'end'});
  });
  b += `<line x1="${brk}" y1="${T}" x2="${brk}" y2="${H-B}" stroke="${C.line}" stroke-dasharray="4 4"/>`;
  [[1991,'La web'],[2007,'El teléfono'],[2012,'Redes profundas'],[2022,'IA generativa']]
    .forEach(([v,l],i)=>{
      const px2 = x(v), top = T+28+i*28;
      b += `<line x1="${px2}" y1="${top}" x2="${px2}" y2="${H-B}" stroke="${C.reveal}"
        stroke-width="1" stroke-dasharray="2 3" opacity=".5"/>`;
      b += `<circle cx="${px2}" cy="${top}" r="3" fill="${C.reveal}"/>`;
      b += txt(px2-10, top+4, `${l} · ${v}`, {fs:12,fill:C.reveal,ta:'end'});
    });
  b += `<path d="${p(PROJECTION)}" fill="none" stroke="${C.ink2}" stroke-width="2" stroke-dasharray="5 4" opacity=".6"/>`;
  b += `<path d="${p(CURVE)}" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
  b += `<circle cx="${x(2025)}" cy="${yv(181)}" r="4" fill="${C.reveal}"/>`;
  b += txt(x(2025)-8, yv(181)-10, '2025 · ~180 ZB', {fs:12.5,fill:C.reveal,ta:'end',fw:600});
  b += `<line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="${C.line}" stroke-width="1.5"/>`;
  b += `<line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" stroke="${C.line}" stroke-width="1.5"/>`;
  [1850,1900,1950,2000,2010,2020].forEach(v=>
    b += txt(x(v), H-B+22, v, {fs:11.5,fill:C.ink3,ta:'middle'}));
  b += txt(L, H-B+52, 'EJE X · TIEMPO', {fs:11,fill:C.ink3,ls:1.6});
  b += txt(L, T-14, 'EJE Y · ZETTABYTES DE DATOS PRODUCIDOS AL AÑO', {fs:11,fill:C.ink3,ls:1.6});
  return svg(W,H,'La cantidad de datos producidos en el mundo es plana desde 1850 hasta cerca de 2010, y desde ahí se dispara',b);
}

/* Timeline rows — rendered by the <Milestones> component, not by SVG. */
export const MILESTONES = [
  ['1854','Snow y el mapa del cólera','Los datos se dibujan en el espacio y aparece una respuesta que las listas no daban.'],
  ['1890','El censo con tarjetas perforadas','Hollerith mecaniza el conteo. Un censo que iba a tardar años se resuelve en meses.'],
  ['1943','Los aviones de Wald','La estadística decide bajo fuego, y descubre el sesgo de supervivencia.'],
  ['1946','Las primeras computadoras electrónicas','Calcular deja de ser un trabajo humano.'],
  ['1970','El modelo relacional de Codd','Nace la tabla como la conocemos: filas, columnas, consultas.'],
  ['1977','Tukey y el análisis exploratorio','Antes de probar hipótesis, mira los datos.'],
  ['1991','La web se abre al público','Por primera vez los datos se producen solos y sin parar.'],
  ['2004','Almacenamiento barato','Guardarlo todo deja de ser caro, así que se guarda todo.'],
  ['2007','Un sensor en cada bolsillo','El teléfono convierte a cada persona en una fuente permanente de datos.'],
  ['2012','Redes profundas','Los modelos empiezan a ver y a oír.'],
  ['2022','IA generativa masiva','Los datos dejan de ser solo insumo: ahora también son producto.']
];
