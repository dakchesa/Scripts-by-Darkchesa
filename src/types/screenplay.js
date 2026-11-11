/**
 * Screenplay Element Types and Specification Constants
 * Scripts by Darchesa
 */

export const ELEMENT_TYPES = {
  SCENE_HEADING: 'scene_heading',
  ACTION: 'action',
  CHARACTER: 'character',
  DIALOGUE: 'dialogue',
  PARENTHETICAL: 'parenthetical',
  TRANSITION: 'transition',
};

export const ELEMENT_LABELS = {
  [ELEMENT_TYPES.SCENE_HEADING]: 'Scene Heading',
  [ELEMENT_TYPES.ACTION]: 'Action',
  [ELEMENT_TYPES.CHARACTER]: 'Character',
  [ELEMENT_TYPES.DIALOGUE]: 'Dialogue',
  [ELEMENT_TYPES.PARENTHETICAL]: 'Parenthetical',
  [ELEMENT_TYPES.TRANSITION]: 'Transition',
};

export const ELEMENT_SHORT_LABELS = {
  [ELEMENT_TYPES.SCENE_HEADING]: 'SCENE',
  [ELEMENT_TYPES.ACTION]: 'ACTION',
  [ELEMENT_TYPES.CHARACTER]: 'CHAR',
  [ELEMENT_TYPES.DIALOGUE]: 'DIAL',
  [ELEMENT_TYPES.PARENTHETICAL]: 'PAR',
  [ELEMENT_TYPES.TRANSITION]: 'TRANS',
};

// Next suggested element when pressing Enter in editor
export const NEXT_ELEMENT_MAP = {
  [ELEMENT_TYPES.SCENE_HEADING]: ELEMENT_TYPES.ACTION,
  [ELEMENT_TYPES.ACTION]: ELEMENT_TYPES.CHARACTER,
  [ELEMENT_TYPES.CHARACTER]: ELEMENT_TYPES.DIALOGUE,
  [ELEMENT_TYPES.DIALOGUE]: ELEMENT_TYPES.ACTION,
  [ELEMENT_TYPES.PARENTHETICAL]: ELEMENT_TYPES.DIALOGUE,
  [ELEMENT_TYPES.TRANSITION]: ELEMENT_TYPES.SCENE_HEADING,
};

// Placeholders for screenplay elements
export const ELEMENT_PLACEHOLDERS = {
  [ELEMENT_TYPES.SCENE_HEADING]: 'INT. LOCATION - DAY / EXT. LOCATION - NIGHT',
  [ELEMENT_TYPES.ACTION]: 'Describe what the camera sees and what happens...',
  [ELEMENT_TYPES.CHARACTER]: 'CHARACTER NAME (ALL CAPS)',
  [ELEMENT_TYPES.DIALOGUE]: 'Character dialogue...',
  [ELEMENT_TYPES.PARENTHETICAL]: '(acting instruction or delivery)',
  [ELEMENT_TYPES.TRANSITION]: 'FADE IN: / CUT TO: / DISSOLVE TO:',
};

// Standard margins for screenplay elements in percentage / indents
export const ELEMENT_FORMATTING = {
  [ELEMENT_TYPES.SCENE_HEADING]: {
    uppercase: true,
    align: 'left',
    marginTop: 18,
    marginBottom: 6,
    paddingLeft: 0,
    fontWeight: 'bold',
  },
  [ELEMENT_TYPES.ACTION]: {
    uppercase: false,
    align: 'left',
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 0,
    fontWeight: 'normal',
  },
  [ELEMENT_TYPES.CHARACTER]: {
    uppercase: true,
    align: 'center',
    marginTop: 14,
    marginBottom: 2,
    paddingLeft: 0,
    fontWeight: 'bold',
  },
  [ELEMENT_TYPES.DIALOGUE]: {
    uppercase: false,
    align: 'center',
    marginTop: 2,
    marginBottom: 6,
    paddingLeft: 0,
    fontWeight: 'normal',
    maxWidthPct: '78%',
  },
  [ELEMENT_TYPES.PARENTHETICAL]: {
    uppercase: false,
    align: 'center',
    marginTop: 2,
    marginBottom: 2,
    paddingLeft: 0,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  [ELEMENT_TYPES.TRANSITION]: {
    uppercase: true,
    align: 'right',
    marginTop: 14,
    marginBottom: 10,
    paddingLeft: 0,
    fontWeight: 'bold',
  },
};

export const SDACH_EXTENSION = '.sdach';
export const SDACH_SIGNATURE = 'SDACH_SCRIPT_FORMAT';
export const SDACH_CURRENT_VERSION = '1.0.0';
