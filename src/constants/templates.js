/**
 * Screenplay Templates and Sample Script
 * Scripts by Darchesa
 */

import { ELEMENT_TYPES } from '../types/screenplay.js';

export const SAMPLE_TANGLE_AND_MOSS = {
  id: 'script_tangle_and_moss',
  title: 'Tangle and Moss',
  author: 'Darchesa Writer',
  logline: 'Two wanderers find quiet camaraderie amidst the ruins of an old kingdom.',
  createdAt: '2026-05-20T10:30:00.000Z',
  updatedAt: '2026-05-20T14:45:00.000Z',
  version: '1.0.0',
  characterPalette: {
    'TANGLE': '#FFE58F', // Yellow highlight as in reference screenshot
    'MOSSY': '#B7EB8F',  // Green highlight as in reference screenshot
  },
  settings: {
    theme: 'dark',
    continuousView: true,
    fontSize: 12,
    showPageNumbers: true,
    enableCharacterHighlights: true,
  },
  elements: [
    {
      id: 'elem_tm_01',
      type: ELEMENT_TYPES.SCENE_HEADING,
      text: 'EXT. HILLSIDE OVERLOOK - DUSK',
    },
    {
      id: 'elem_tm_02',
      type: ELEMENT_TYPES.ACTION,
      text: 'Wind ripples through tall sea grass. TANGLE (20s) stands at the crest, shield strapped across her shoulder.',
    },
    {
      id: 'elem_tm_03',
      type: ELEMENT_TYPES.CHARACTER,
      text: 'TANGLE',
      highlightColor: '#FFE58F',
    },
    {
      id: 'elem_tm_04',
      type: ELEMENT_TYPES.DIALOGUE,
      text: "I'm not.",
    },
    {
      id: 'elem_tm_05',
      type: ELEMENT_TYPES.CHARACTER,
      text: 'MOSSY',
      highlightColor: '#B7EB8F',
    },
    {
      id: 'elem_tm_06',
      type: ELEMENT_TYPES.DIALOGUE,
      text: "It's okay to be scared of things. I seen war and I'm scared of plenty things nowhere near as bad. Should see me around spiders.",
      highlightColor: '#D9F7BE',
    },
    {
      id: 'elem_tm_07',
      type: ELEMENT_TYPES.ACTION,
      text: "Tangle's caught off guard by his empathy. She lets her guard down... a little:",
    },
    {
      id: 'elem_tm_08',
      type: ELEMENT_TYPES.CHARACTER,
      text: 'TANGLE',
      highlightColor: '#FFE58F',
    },
    {
      id: 'elem_tm_09',
      type: ELEMENT_TYPES.DIALOGUE,
      text: "I don't know how long.",
    },
    {
      id: 'elem_tm_10',
      type: ELEMENT_TYPES.CHARACTER,
      text: 'MOSSY',
      highlightColor: '#B7EB8F',
    },
    {
      id: 'elem_tm_11',
      type: ELEMENT_TYPES.DIALOGUE,
      text: "That's okay, too. Don't know how long I've been scared of spiders.",
      highlightColor: '#D9F7BE',
    },
    {
      id: 'elem_tm_12',
      type: ELEMENT_TYPES.ACTION,
      text: 'She looks at him, as if: Who is this guy?',
      comment: 'Check rhythm here - beat pause',
    },
    {
      id: 'elem_tm_13',
      type: ELEMENT_TYPES.ACTION,
      text: 'Mossy stops to rest, sits on a boulder.',
    },
    {
      id: 'elem_tm_14',
      type: ELEMENT_TYPES.CHARACTER,
      text: 'TANGLE',
      highlightColor: '#FFE58F',
    },
    {
      id: 'elem_tm_15',
      type: ELEMENT_TYPES.DIALOGUE,
      text: 'What are you doing now?',
    },
    {
      id: 'elem_tm_16',
      type: ELEMENT_TYPES.ACTION,
      text: 'Mossy points to the cloudless sky, listens to the BIRDS.',
    },
    {
      id: 'elem_tm_17',
      type: ELEMENT_TYPES.CHARACTER,
      text: 'MOSSY',
      highlightColor: '#B7EB8F',
    },
    {
      id: 'elem_tm_18',
      type: ELEMENT_TYPES.DIALOGUE,
      text: 'Wow! Listen to that.',
      highlightColor: '#D9F7BE',
    },
    {
      id: 'elem_tm_19',
      type: ELEMENT_TYPES.ACTION,
      text: 'Tangle’s about to protest, but is interrupted by a few haunting notes. Then she listens.',
    },
    {
      id: 'elem_tm_20',
      type: ELEMENT_TYPES.TRANSITION,
      text: 'CUT TO:',
    },
  ],
};

export const TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Screenplay',
    description: 'Start with an empty script and your own blank canvas.',
    elements: [
      {
        id: 'elem_init_1',
        type: ELEMENT_TYPES.SCENE_HEADING,
        text: 'INT. LIVING ROOM - DAY',
      },
      {
        id: 'elem_init_2',
        type: ELEMENT_TYPES.ACTION,
        text: '',
      },
    ],
  },
  {
    id: 'feature',
    name: 'Feature Film Standard',
    description: 'Industry standard three-act structure with opening sequence.',
    elements: [
      {
        id: 'f_01',
        type: ELEMENT_TYPES.TRANSITION,
        text: 'FADE IN:',
      },
      {
        id: 'f_02',
        type: ELEMENT_TYPES.SCENE_HEADING,
        text: 'EXT. CITY SKYLINE - DAWN',
      },
      {
        id: 'f_03',
        type: ELEMENT_TYPES.ACTION,
        text: 'Sunlight catches the steel and glass monoliths of the metropolis. Far below, morning traffic snakes like veins of light.',
      },
      {
        id: 'f_04',
        type: ELEMENT_TYPES.SCENE_HEADING,
        text: 'INT. APARTMENT 4B - CONTINUOUS',
      },
      {
        id: 'f_05',
        type: ELEMENT_TYPES.ACTION,
        text: 'An antique typewriter sits next to an overflowing cup of espresso. A single sheet of paper is loaded in the carriage.',
      },
      {
        id: 'f_06',
        type: ELEMENT_TYPES.CHARACTER,
        text: 'WRITER (O.S.)',
      },
      {
        id: 'f_07',
        type: ELEMENT_TYPES.DIALOGUE,
        text: 'Every story has a beginning. This one begins with a choice.',
      },
    ],
  },
  {
    id: 'tv_episode',
    name: 'Television Episode',
    description: 'Cold open teaser format with act break transitions.',
    elements: [
      {
        id: 'tv_01',
        type: ELEMENT_TYPES.ACTION,
        text: 'TEASER',
      },
      {
        id: 'tv_02',
        type: ELEMENT_TYPES.SCENE_HEADING,
        text: 'INT. PRECINCT 12 - BULLPEN - NIGHT',
      },
      {
        id: 'tv_03',
        type: ELEMENT_TYPES.ACTION,
        text: 'Fluorescent lights buzz. Rain lashes the high arched windows. DETECTIVE VANCE (40s) sifts through a stack of manila folders.',
      },
      {
        id: 'tv_04',
        type: ELEMENT_TYPES.CHARACTER,
        text: 'VANCE',
      },
      {
        id: 'tv_05',
        type: ELEMENT_TYPES.PARENTHETICAL,
        text: '(to himself)',
      },
      {
        id: 'tv_06',
        type: ELEMENT_TYPES.DIALOGUE,
        text: 'The pieces don’t fit because they want us looking at the wrong puzzle.',
      },
      {
        id: 'tv_07',
        type: ELEMENT_TYPES.TRANSITION,
        text: 'SMASH CUT TO MAIN TITLES.',
      },
    ],
  },
];
