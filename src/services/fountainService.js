/**
 * Fountain Format Import & Export Service
 * Scripts by Darchesa
 *
 * Implements Fountain syntax (industry standard plain-text screenwriting).
 */

import { ELEMENT_TYPES } from '../types/screenplay.js';

/**
 * Export screenplay elements to Fountain format text
 */
export function exportToFountain(script) {
  const lines = [];

  // Title page metadata
  lines.push(`Title: ${script.title}`);
  if (script.author) lines.push(`Credit: written by`);
  if (script.author) lines.push(`Author: ${script.author}`);
  lines.push(`Source: Scripts by Darchesa`);
  lines.push('');
  lines.push('===');
  lines.push('');

  for (const el of script.elements || []) {
    const text = (el.text || '').trim();
    if (!text) continue;

    switch (el.type) {
      case ELEMENT_TYPES.SCENE_HEADING:
        // Force scene heading with dot if needed or uppercase
        if (/^(INT|EXT|EST|INT\.\/EXT|I\/E)/i.test(text)) {
          lines.push(text.toUpperCase());
        } else {
          lines.push(`.${text.toUpperCase()}`);
        }
        lines.push('');
        break;

      case ELEMENT_TYPES.ACTION:
        lines.push(text);
        lines.push('');
        break;

      case ELEMENT_TYPES.CHARACTER:
        lines.push(text.toUpperCase());
        break;

      case ELEMENT_TYPES.PARENTHETICAL:
        const cleanPar = text.replace(/^\(|\)$/g, '');
        lines.push(`(${cleanPar})`);
        break;

      case ELEMENT_TYPES.DIALOGUE:
        lines.push(text);
        lines.push('');
        break;

      case ELEMENT_TYPES.TRANSITION:
        if (/TO:$/i.test(text) || /^FADE /i.test(text)) {
          lines.push(text.toUpperCase());
        } else {
          lines.push(`> ${text.toUpperCase()}`);
        }
        lines.push('');
        break;

      default:
        lines.push(text);
        lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Parse a Fountain formatted string into script elements
 */
export function parseFountain(fountainText) {
  const rawLines = (fountainText || '').split(/\r?\n/);
  const elements = [];
  let inTitlePage = false;
  let title = 'Imported Script';
  let author = 'Anonymous';

  let i = 0;
  // Parse metadata if present at start
  while (i < rawLines.length) {
    const line = rawLines[i].trim();
    if (line === '===') {
      i++;
      break;
    }
    const match = line.match(/^([A-Za-z\s]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim().toLowerCase();
      const val = match[2].trim();
      if (key === 'title') title = val;
      if (key === 'author') author = val;
    } else if (line === '' && i > 0) {
      // blank line might terminate title page
      break;
    }
    i++;
  }

  // Parse body
  let previousType = null;
  while (i < rawLines.length) {
    const line = rawLines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // Scene heading
    if (/^(INT\.|EXT\.|EST\.|INT\/EXT|I\/E|\.[A-Z])/i.test(line)) {
      const cleanHeading = line.startsWith('.') ? line.substring(1) : line;
      elements.push({
        id: `f_${Date.now()}_${i}`,
        type: ELEMENT_TYPES.SCENE_HEADING,
        text: cleanHeading.toUpperCase(),
      });
      previousType = ELEMENT_TYPES.SCENE_HEADING;
    }
    // Transition (e.g. CUT TO: or > TRANSITION)
    else if (/^(CUT TO:|FADE OUT\.|FADE IN:|DISSOLVE TO:)$/i.test(line) || line.startsWith('>')) {
      const cleanTrans = line.startsWith('>') ? line.substring(1).trim() : line;
      elements.push({
        id: `f_${Date.now()}_${i}`,
        type: ELEMENT_TYPES.TRANSITION,
        text: cleanTrans.toUpperCase(),
      });
      previousType = ELEMENT_TYPES.TRANSITION;
    }
    // Parenthetical
    else if (line.startsWith('(') && line.endsWith(')')) {
      elements.push({
        id: `f_${Date.now()}_${i}`,
        type: ELEMENT_TYPES.PARENTHETICAL,
        text: line,
      });
      previousType = ELEMENT_TYPES.PARENTHETICAL;
    }
    // Character (all uppercase, not a scene heading, typically precedes dialogue)
    else if (
      line === line.toUpperCase() &&
      !line.endsWith('.') &&
      line.length < 35 &&
      previousType !== ELEMENT_TYPES.CHARACTER
    ) {
      elements.push({
        id: `f_${Date.now()}_${i}`,
        type: ELEMENT_TYPES.CHARACTER,
        text: line,
      });
      previousType = ELEMENT_TYPES.CHARACTER;
    }
    // Dialogue (follows character or parenthetical)
    else if (
      previousType === ELEMENT_TYPES.CHARACTER ||
      previousType === ELEMENT_TYPES.PARENTHETICAL
    ) {
      elements.push({
        id: `f_${Date.now()}_${i}`,
        type: ELEMENT_TYPES.DIALOGUE,
        text: line,
      });
      previousType = ELEMENT_TYPES.DIALOGUE;
    }
    // Action (default)
    else {
      elements.push({
        id: `f_${Date.now()}_${i}`,
        type: ELEMENT_TYPES.ACTION,
        text: line,
      });
      previousType = ELEMENT_TYPES.ACTION;
    }

    i++;
  }

  return {
    id: `script_${Date.now()}`,
    title,
    author,
    elements: elements.length > 0 ? elements : [
      { id: `init_1`, type: ELEMENT_TYPES.SCENE_HEADING, text: 'INT. SCENE - DAY' },
      { id: `init_2`, type: ELEMENT_TYPES.ACTION, text: '' },
    ],
  };
}
