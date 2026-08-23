import { C, SERIF, svg, txt } from '../../../svg/kit.js';

/* ═══════════ Intro · word cloud ═══════════ */
export function wordCloud() {
  const W = [
    ['Python',44,90,86,-4],['Excel',38,330,70,3],['magia',34,600,96,-6],
    ['estadística',40,80,168,0],['números',32,360,150,4],['IA',56,600,178,-3],
    ['gráficas',30,90,232,2],['predecir',36,270,238,-2],['patrones',34,560,246,3],
    ['no sé',42,120,312,-5],['Big Data',30,340,306,2],['algoritmos',32,540,318,-2],
    ['tablas',26,110,372,3],['futuro',30,330,378,-3],['matemáticas',26,530,380,2]
  ];
  const body = W.map(([w,fs,x,y,rot],i)=>{
    const fill = i%5===0 ? C.ask : (i%7===3 ? C.reveal : C.ink2);
    const op = i%3===0 ? 1 : .72;
    return `<g transform="translate(${x},${y}) rotate(${rot})" opacity="${op}">
      ${txt(0,0,w,{fs:fs,ff:SERIF,fill:fill})}</g>`;
  }).join('');
  return svg(760,420,'Nube de palabras con las respuestas frecuentes a la pregunta «ciencia de datos es…»',body);
}
