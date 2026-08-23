import { C, SERIF, svg, txt, arrow } from '../../../svg/kit.js';
import { box } from './shared.js';

/* ═══════════ B3 · the dataset as the thread through the course ═══════════ */
export function dataset() {
  const W=980, H=360;
  let b = arrow('ar-s2-ds') + arrow('ar-s2-ds2', C.ask);

  b += box(20,140,190,90,C.ink3);
  b += txt(40,172,'EL FORMULARIO',{fs:11.5,fill:C.ink3,ls:1.4});
  b += txt(40,196,'lo diseñamos',{fs:15,ff:SERIF,fill:C.ink});
  b += txt(40,216,'entre todos hoy',{fs:15,ff:SERIF,fill:C.ink});
  b += `<line x1="216" y1="185" x2="272" y2="185" stroke="${C.ink2}" stroke-width="1.3"
    marker-end="url(#ar-s2-ds)"/>`;

  b += box(280,120,270,130,C.ask,{sw:1.8,stroke:C.ask});
  b += txt(304,152,'LA TABLA DEL SALÓN',{fs:12,fill:C.ask,ls:1.6});
  b += txt(304,186,'una fila por persona',{fs:17,ff:SERIF,fill:C.ink});
  b += txt(304,212,'de este curso',{fs:17,ff:SERIF,fill:C.ink});
  b += txt(304,236,'nuestros datos, no los de un ejemplo',{fs:11,fill:C.ink3});

  const D = [
    ['SESIÓN 3','se limpia'],
    ['SESIÓN 4','se describe'],
    ['SESIÓN 5','se grafica'],
    ['SESIÓN 7','se modela']
  ];
  D.forEach(([s,q],i)=>{
    const y = 44+i*74;
    b += box(700,y,260,56,C.ask);
    b += txt(722,y+24,s,{fs:11.5,fill:C.ask,ls:1.6});
    b += txt(722,y+44,q,{fs:15,ff:SERIF,fill:C.ink});
    b += `<path d="M556,185 C620,185 620,${y+28} 692,${y+28}" fill="none" stroke="${C.ask}"
      stroke-width="1.2" opacity=".7" marker-end="url(#ar-s2-ds2)"/>`;
  });

  b += txt(20,H-14,'ESTA TABLA ES EL HILO QUE COSE EL CURSO. SIN ELLA SON OCHO TEMAS SUELTOS.',
    {fs:11,fill:C.ask,ls:1.6});
  return svg(W,H,'El formulario alimenta la tabla del salón, y de esa tabla salen flechas hacia las sesiones 3, 4, 5 y 7, donde se limpia, se describe, se grafica y se modela',b);
}
