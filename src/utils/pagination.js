/**
 * Screenplay Pagination Engine
 * Scripts by Darchesa
 *
 * Implements Hollywood industry-standard line weight calculation
 * and discrete page grouping (54 lines / page in Courier 12pt).
 */

import { ELEMENT_TYPES } from '../types/screenplay.js';

export const LINES_PER_PAGE = 54;

/**
 * Estimates line weight of a screenplay element
 */
export function estimateElementLines(element) {
  if (!element) return 1;
  const text = element.text || '';
  const type = element.type;

  switch (type) {
    case ELEMENT_TYPES.SCENE_HEADING:
      // 1 line text + 2 blank lines spacing before
      return 3;
    case ELEMENT_TYPES.ACTION: {
      // Standard 6.0" action width in Courier 10cpi wraps at ~58 characters + 1 blank line after
      const textLines = text.trim() ? Math.max(1, Math.ceil(text.length / 58)) : 1;
      return textLines + 1;
    }
    case ELEMENT_TYPES.CHARACTER:
      // 1 line character name + 1 blank line before
      return 2;
    case ELEMENT_TYPES.PARENTHETICAL: {
      // 30 chars per line, directly above dialogue
      const textLines = text.trim() ? Math.max(1, Math.ceil(text.length / 32)) : 1;
      return textLines;
    }
    case ELEMENT_TYPES.DIALOGUE: {
      // Standard 3.5" dialogue width in Courier 10cpi wraps at ~35 characters + 1 blank line after
      const textLines = text.trim() ? Math.max(1, Math.ceil(text.length / 35)) : 1;
      return textLines + 1;
    }
    case ELEMENT_TYPES.TRANSITION:
      // 1 line transition + 1 line before + 1 line after
      return 3;
    default:
      return 1;
  }
}

/**
 * Distributes screenplay elements into discrete physical pages
 * Returns: [{ pageNumber: 1, items: [{ element, index, lines }], lineCount: number }, ...]
 */
export function paginateElements(elements, maxLinesPerPage = LINES_PER_PAGE) {
  if (!Array.isArray(elements) || elements.length === 0) {
    return [{ pageNumber: 1, items: [], lineCount: 0 }];
  }

  const pages = [];
  let currentPageNumber = 1;
  let currentItems = [];
  let currentLines = 0;

  elements.forEach((element, index) => {
    const lines = estimateElementLines(element);

    // If adding this element exceeds the page capacity and the page is not empty:
    // Start a new page
    if (currentItems.length > 0 && currentLines + lines > maxLinesPerPage) {
      pages.push({
        pageNumber: currentPageNumber,
        items: currentItems,
        lineCount: currentLines,
      });
      currentPageNumber += 1;
      currentItems = [];
      currentLines = 0;
    }

    currentItems.push({ element, index, lines });
    currentLines += lines;
  });

  if (currentItems.length > 0 || pages.length === 0) {
    pages.push({
      pageNumber: currentPageNumber,
      items: currentItems,
      lineCount: currentLines,
    });
  }

  return pages;
}
