/* Generado por scripts/extract_salon.py — no editar a mano.

   Las 23 respuestas del formulario de la sesión 2, en las diez columnas que
   la sesión 3 trabaja. Los valores están tal como llegaron: los espacios al
   final y las tildes que faltan son el material de la clase. */

/* [letra en pantalla, clave, encabezado] */
export const COLS = [
  ["A", "codigo", "código"],
  ["B", "depto", "departamento"],
  ["C", "municipio", "municipio"],
  ["D", "area", "área de pregrado"],
  ["E", "pantalla", "pantalla h/día"],
  ["F", "minutos", "minutos ayer"],
  ["G", "porciones", "porciones"],
  ["H", "balanceada", "balanceada 1–5"],
  ["I", "sangre", "sangre"],
  ["J", "libro", "último libro"],
];

export const ROWS = [
  ["1234", "Cundinamarca", "Sopó", "Ciencias exactas y naturales", "30", "", "3", "1", "O+", "Cómo hacer amigos e influir en las personas - Dale Carnegie"],
  ["1069", "Cundinamarca", "El Rosal ", "Ingeniería y afines, Economía, administración y contaduría", "3", "1", "3", "3", "O+", "ninguno "],
  ["9224", "Cundinamarca ", "Bogotá", "", "", "2", "4", "3", "O+", "El principito Antoine de Saint-Exupéry"],
  ["4371", "Bogota D.C.", "Bogota D.C.", "Economía, administración y contaduría", "6", "120", "1", "4", "O+", "ninguno"],
  ["8205", "Bogotá D.C.", "Bogotá D.C.", "Economía, administración y contaduría", "", "5", "2", "2", "O−", "ninguno"],
  ["1834", "Cundinamarca ", "La calera ", "Economía, administración y contaduría", "3", "210", "2", "3", "O+", "La rebelión de la granja, George orwell"],
  ["1430", "Bogotá D.C", "Bogotá D.C", "Economía, administración y contaduría", "5", "420", "0", "2", "A+", "Antonio Nariño Cartas de un patriota del Archivo Nacional"],
  ["1016", "Antioquia", "Copacabana", "Ingeniería y afines", "", "1", "3", "4", "A+", "Delirio de Laura restrepo"],
  ["3597", "Bogotá D.C", "Bogotá D.C", "Ciencias sociales y humanidades", "", "", "3", "3", "B+", "En diciembre llegaban las brisas de Marvel Moreno"],
  ["3160", "Cundinamarca ", "Bogotá DC", "Ingeniería y afines", "5", "120", "3", "2", "A+", "Vendes o vendes - Grant Cardone"],
  ["9999", "Cundinamarca ", "Bogotá D.C.", "Ciencias sociales y humanidades", "6", "120", "4", "3", "O+", "Ninguno "],
  ["6912", "Cundinamarca", "Bogotá", "Ingeniería y afines, Tecnología en Sistemas", "", "45", "1", "3", "O+", "relato de un Naufrago Gabril garcia Marquez"],
  ["2905", "Cundinamarca", "Bogotá", "Ciencias exactas y naturales", "6.04", "8", "2", "4", "A+", "La Vorágine"],
  ["8651", "Antioquia", "Medellín", "Ciencias sociales y humanidades", "5", "16", "2", "3", "O+", "La casa de los espíritus - Isabel Allende"],
  ["9999", "Cundinamarca ", "Cajicá ", "Ingeniería y afines", "2", "120", "2", "4", "O+", "Crónica de una muerte anunciada, Gabriel García "],
  ["7281", "Boyacá", "Tunja", "Derecho", "9.6", "960", "0", "5", "A+", "Sapiens Yuval Noah Harari"],
  ["2411", "Caldas", "Manizales", "Ingeniería y afines", "4", "60", "2", "4", "B+", "El coronel no tiene quien le escriba - Gabriel García Marquez "],
  ["5847", "Bogotá", "Bogotá", "Ciencias de la salud", "6", "240", "2", "4", "AB+", "The Girl on the Train by Paula Hawkins"],
  ["1431", "Cundinamarca", "Bogotá D.C.", "Ciencias sociales y humanidades", "", "300", "4", "3", "O+", "El contrato. Autor Lars Kepler"],
  ["2510", "Cundinamarca ", "Cajica", "Ingeniería y afines", "8", "4", "3", "4", "A+", "Marian Roja estapé Cómo hacer que te pasen cosas buenas "],
  ["1416", "Cundinamarca", "Bogotá", "Ciencias exactas y naturales", "4.7", "180", "1", "3", "A+", "Alicia en el país de las maravillas-Lewis Carrol"],
  ["4095", "Bogotá ", "Bogotá ", "Ciencias exactas y naturales", "", "", "1", "4", "A+", "Ninguno"],
  ["1428", "Arauca", "Tame", "Economía, administración y contaduría", "6", "120", "1", "4", "A+", "ninguno"],
];

/* Las cuatro medias de la columna F, una por decisión de limpieza.
   Recalculadas por el script en cada corrida. */
export const MEDIAS = {
  ignorarVacias: 152.6,
  vaciasComoCero: 132.7,
  sinAtipico: 110.1,
  horasAMinutos: 261.8,
};
