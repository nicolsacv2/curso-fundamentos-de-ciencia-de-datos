/* How a variable is written when a person reads it.
 *
 * A column has three strings and they are not interchangeable: the KEY (`erre`), which is
 * an identifier and must not look like a spreadsheet letter; the LABEL (`usa R`), which is
 * the question abbreviated; and this, the name of the thing itself (`R`).
 *
 * The figures print the name, not the label, because the course teaches pointing at a
 * column by its name — and «erre» on a wall reads as a typo. Where a key already is the
 * name, NOMBRES has no entry and this returns the key unchanged.
 *
 * One function, imported wherever a variable gets written down, so that no figure gets to
 * decide its own answer. scripts/export_xlsx.py resolves the same table for the file the
 * class is given, so the wall and the spreadsheet never disagree.
 */
import { NOMBRES } from './salon.js';

export function nombre(clave) {
  return NOMBRES[clave] || clave;
}
