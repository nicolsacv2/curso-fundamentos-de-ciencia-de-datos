import { C, SERIF, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import { box, elbow } from './shared.js';

/* ═══════════ B1 · the type tree ═══════════ */
export function types() {
  const W=980, H=430;
  let b = arrow('ar-s2-types');

  b += box(380,20,220,54,null,{stroke:C.ink3});
  b += txt(490,53,'UN DATO',{fs:21,ff:SERIF,fill:C.ink,ta:'middle'});

  const branch = [
    [110,'CUANTITATIVO','se expresa con números',250],
    [590,'CUALITATIVO','se expresa con categorías',730]
  ];
  branch.forEach(([x,t,d,cx])=>{
    b += box(x,130,280,56,C.ask);
    b += txt(x+18,155,t,{fs:12.5,fill:C.ask,ls:1.8});
    b += txt(x+18,175,d,{fs:12,fill:C.ink3});
    b += elbow(490,74,cx,130,'ar-s2-types');
  });

  const leaf = [
    [20,130,'DISCRETO','se cuenta, va de salto en salto',
      ['hermanos: 0, 1, 2…','goles del partido','apps instaladas']],
    [260,370,'CONTINUO','se mide, admite decimales',
      ['estatura: 1,715 m','minutos de traslado','temperatura']],
    [500,610,'NOMINAL','etiquetas sin orden',
      ['ciudad de origen','carrera que estudia','sistema operativo']],
    [740,850,'ORDINAL','etiquetas con orden',
      ['estrés del 1 al 5','talla S · M · L','último grado cursado']]
  ];
  leaf.forEach(([x,cx,t,d,ex],i)=>{
    const parent = i<2 ? 250 : 730;
    b += elbow(parent,186,cx,246,'ar-s2-types');
    b += box(x,246,220,124,C.ink3);
    b += txt(x+16,272,t,{fs:12,fill:C.ink,ls:1.6});
    b += txt(x+16,290,d,{fs:11,fill:C.ink3});
    ex.forEach((e,k)=> b += txt(x+16,316+k*18,'· '+e,{fs:11.5,fill:C.ink2}));
  });

  b += txt(20,H-14,'CUIDADO: HAY NÚMEROS QUE NO SON CUANTITATIVOS. LOS VEMOS ENSEGUIDA.',
    {fs:11,fill:C.reveal,ls:1.6});
  return svg(W,H,'Árbol de tipos de datos: un dato se divide en cuantitativo (discreto y continuo) y cualitativo (nominal y ordinal), con tres ejemplos en cada hoja',b);
}

/* ═══════════ B1 · anatomy of a table ═══════════ */
export function table() {
  const W=980, H=450, x0=200, colw=136, rowh=42, y0=118, ncol=5, nrow=5;
  const head = ['id','ciudad','horas_sueño','cafés','estrés'];
  const rows = [
    ['01','Bogotá','6,5','3','4'],
    ['02','Medellín','7,0','1','2'],
    ['03','Cali','5,0','4','5'],
    ['04','Bogotá','8,0','0','2'],
    ['05','Tunja','6,0','2','3']
  ];
  const cx = j => x0 + j*colw;
  const cy = i => y0 + (i+1)*rowh;          // i = data row index
  const tableW = ncol*colw, tableH = (nrow+1)*rowh;
  const ROW = 4, COL = 2;                    // the highlighted row and column

  let b = '';
  // highlights, underneath the grid
  b += `<rect x="${cx(COL)}" y="${y0}" width="${colw}" height="${tableH}"
    fill="${C.ask}" fill-opacity=".10"/>`;
  b += `<rect x="${x0}" y="${cy(ROW)}" width="${tableW}" height="${rowh}"
    fill="${C.ask}" fill-opacity=".10"/>`;

  // header
  b += `<rect x="${x0}" y="${y0}" width="${tableW}" height="${rowh}" fill="${C.ground2}"/>`;
  head.forEach((c,j)=> b += txt(cx(j)+14, y0+26, c, {fs:12.5,fill:C.ask,ls:.6}));

  // cells
  rows.forEach((f,i)=> f.forEach((v,j)=>
    b += txt(cx(j)+14, cy(i)+27, v, {fs:15,ff:SERIF,fill:C.ink})));

  // grid
  for(let j=0;j<=ncol;j++)
    b += `<line x1="${cx(j)}" y1="${y0}" x2="${cx(j)}" y2="${y0+tableH}" stroke="${C.lineSoft}"/>`;
  for(let i=0;i<=nrow+1;i++)
    b += `<line x1="${x0}" y1="${y0+i*rowh}" x2="${x0+tableW}" y2="${y0+i*rowh}"
      stroke="${i===1?C.line:C.lineSoft}" stroke-width="${i===1?1.5:1}"/>`;

  // the cell: intersection of the highlighted row and column
  b += `<rect x="${cx(COL)}" y="${cy(ROW)}" width="${colw}" height="${rowh}"
    fill="none" stroke="${C.reveal}" stroke-width="2"/>`;

  // labels
  b += txt(x0-24, cy(ROW)+20, 'UNA FILA', {fs:12,fill:C.ask,ta:'end',ls:1.4});
  b += txt(x0-24, cy(ROW)+37, '= UNA OBSERVACIÓN', {fs:12,fill:C.ink2,ta:'end',ls:1.4});
  b += `<line x1="${x0-18}" y1="${cy(ROW)+rowh/2}" x2="${x0-4}" y2="${cy(ROW)+rowh/2}" stroke="${C.ask}"/>`;

  b += txt(cx(COL)+colw/2, 84, 'UNA COLUMNA = UNA VARIABLE', {fs:12,fill:C.ask,ta:'middle',ls:1.4});
  b += `<line x1="${cx(COL)+colw/2}" y1="94" x2="${cx(COL)+colw/2}" y2="${y0-4}" stroke="${C.ask}"/>`;

  const yc = cy(ROW)+rowh;
  b += `<line x1="${cx(COL)+colw/2}" y1="${yc+4}" x2="${cx(COL)+colw/2}" y2="${yc+28}" stroke="${C.reveal}"/>`;
  b += txt(cx(COL)+colw/2, yc+46, 'UNA CELDA = UN VALOR', {fs:12,fill:C.reveal,ta:'middle',ls:1.4});

  b += txt(20, H-14, 'CINCO PERSONAS · CINCO VARIABLES · VEINTICINCO VALORES. ESO ES UNA TABLA.',
    {fs:11,fill:C.ink3,ls:1.6});
  return svg(W,H,'Una tabla de cinco filas y cinco columnas, con una fila resaltada como observación, una columna como variable y su intersección marcada como el valor de una celda',b);
}

/* ═══════════ B1 · numbers that are not numbers ═══════════ */
export function fakeNumbers() {
  const W=980, H=310;
  const F = [
    [20,'CÓDIGO POSTAL','110111','el promedio de dos códigos postales','no cae entre los dos barrios'],
    [340,'NÚMERO DE CAMISETA','10','el 10 vale el doble que el 5','ni juega el doble de bien'],
    [660,'ESCALA DE SATISFACCIÓN','1 → 5','de 3 a 4 hay lo mismo que de 4 a 5','nadie lo garantizó nunca']
  ];
  let b = '';
  F.forEach(([x,k,n,wrong,right])=>{
    b += box(x,44,300,196,C.reveal);
    b += txt(x+20,72,k,{fs:11.5,fill:C.reveal,ls:1.6});
    b += txt(x+150,132,n,{fs:n.length>4?34:46,ff:SERIF,fill:C.ink,ta:'middle'});
    wrap(wrong,26).forEach((ln,i)=>{
      const y = 176+i*18;
      b += txt(x+20,y,ln,{fs:12,fill:C.ink3});
      b += `<line x1="${x+18}" y1="${y-4}" x2="${x+18+ln.length*6.6}" y2="${y-4}"
        stroke="${C.reveal}" stroke-width="1.2"/>`;
    });
    wrap(right,30).forEach((ln,i)=> b += txt(x+20,222+i*16,ln,{fs:12,fill:C.ink2}));
  });
  b += txt(20,H-14,'SI SUMARLO NO SIGNIFICA NADA, NO ES UN NÚMERO: ES UNA ETIQUETA CON FORMA DE NÚMERO.',
    {fs:11,fill:C.reveal,ls:1.6});
  return svg(W,H,'Tres tarjetas con números que no son cantidades: código postal, número de camiseta y escala de satisfacción, cada una con la operación que resulta absurda tachada',b);
}

/* ═══════════ B1 · structured, semi and unstructured ═══════════ */
export function structure() {
  const W=980, H=360;
  const P = [
    [20,'ESTRUCTURADO','ya viene en rejilla','una hoja de cálculo, una tabla de la base de datos'],
    [340,'SEMIESTRUCTURADO','tiene etiquetas, no rejilla','un correo, un JSON, la ficha de un producto'],
    [660,'NO ESTRUCTURADO','no tiene forma todavía','un audio, una foto, un video, un texto libre']
  ];
  let b = '';
  P.forEach(([x,k,d,ex],i)=>{
    b += txt(x,40,k,{fs:12,fill:C.ask,ls:1.6});
    b += box(x,54,300,168,null,{stroke:C.lineSoft});

    if(i===0){                                   // grid
      for(let c=0;c<4;c++) for(let f=0;f<4;f++){
        const gx = x+26+c*62, gy = 78+f*36;
        b += `<rect x="${gx}" y="${gy}" width="56" height="30" fill="none"
          stroke="${f===0?C.ask:C.lineSoft}"/>`;
        if(f>0) b += `<line x1="${gx+10}" y1="${gy+18}" x2="${gx+46}" y2="${gy+18}"
          stroke="${C.ink3}" stroke-width="1.4" opacity=".6"/>`;
      }
    }
    if(i===1){                                   // key: value pairs
      const L = ['{','  "ciudad": "Bogotá",','  "cafés": 3,','  "notas": "llegó tarde"','}'];
      L.forEach((ln,k2)=> b += txt(x+24,86+k2*26,ln.replace(/ /g,'&#160;'),
        {fs:13,fill:k2===0||k2===4?C.ink3:C.ink2}));
    }
    if(i===2){                                   // audio waveform
      const A = [.2,.5,.9,.4,.75,1,.55,.3,.8,.45,.95,.35,.6,.85,.25,.7,.4,.9,.5,.2];
      A.forEach((a,k2)=>{
        const bx = x+26+k2*14, h = a*90;
        b += `<rect x="${bx}" y="${138-h/2}" width="6" height="${h}" fill="${C.ink3}" opacity=".8"/>`;
      });
      b += txt(x+150,206,'…y aquí, ¿cuál es la fila?',{fs:12,fill:C.reveal,ta:'middle'});
    }

    b += txt(x,246,d,{fs:13,ff:SERIF,fill:C.ink});
    wrap(ex,34).forEach((ln,k2)=> b += txt(x,270+k2*17,ln,{fs:11.5,fill:C.ink3}));
  });
  b += txt(20,H-14,'CUANTO MENOS ESTRUCTURA TRAE, MÁS TRABAJO CUESTA — Y MÁS DECISIONES TUYAS LLEVA DENTRO.',
    {fs:11,fill:C.ink3,ls:1.6});
  return svg(W,H,'Tres paneles comparan datos estructurados en rejilla, semiestructurados en pares de clave y valor, y no estructurados como una onda de audio',b);
}

/* ═══════════ B1 · the four-quadrant board ═══════════ */
export function quadrants() {
  const W=920, H=600;
  const Q = [
    [40,96,'DISCRETO','se cuenta',['tazas de café','hermanos','apps instaladas','goles del partido']],
    [480,96,'CONTINUO','se mide',['horas de sueño','minutos de traslado','estatura','temperatura']],
    [40,356,'NOMINAL','sin orden',['ciudad de origen','carrera','color favorito','sistema operativo']],
    [480,356,'ORDINAL','con orden',['estrés del 1 al 5','talla S · M · L','último grado','nivel de inglés']]
  ];
  let b = '';
  b += txt(40,72,'CUANTITATIVO · SE PUEDE SUMAR Y PROMEDIAR',{fs:12,fill:C.ask,ls:1.8});
  b += txt(40,332,'CUALITATIVO · SOLO SE PUEDE CONTAR Y AGRUPAR',{fs:12,fill:C.ask,ls:1.8});

  Q.forEach(([x,y,t,d,cards])=>{
    b += box(x,y,400,208,null,{stroke:C.lineSoft});
    b += txt(x+22,y+32,t,{fs:12.5,fill:C.ink,ls:1.8});
    b += txt(x+22+t.length*9.5+14,y+32,'· '+d,{fs:12,fill:C.ink3});
    cards.forEach((s,i)=>{
      const bx = x+22+(i%2)*186, by = y+56+Math.floor(i/2)*54;
      b += `<rect x="${bx}" y="${by}" width="170" height="40" fill="${C.ground2}"
        stroke="${C.line}"/>`;
      b += txt(bx+14,by+25,s,{fs:12.5,fill:C.ink2});
    });
  });

  b += txt(40,H-14,'CADA PERSONA RECIBE 24 TARJETAS Y ESTE TABLERO. DIEZ MINUTOS.',
    {fs:11,fill:C.ink3,ls:1.6});
  return svg(W,H,'Tablero de cuatro cuadrantes —discreto, continuo, nominal y ordinal— con cuatro tarjetas de ejemplo colocadas en cada uno',b);
}
