/**
 * Verification Test Suite for Scripts by Darchesa (ESM)
 */

import {
  ELEMENT_TYPES,
  NEXT_ELEMENT_MAP,
  SDACH_SIGNATURE,
  SDACH_CURRENT_VERSION,
} from '../src/types/screenplay.js';

import {
  serializeSdach,
  parseSdach,
  validateScriptData,
  calculateWordCount,
  calculateEstimatedPages,
  getSdachFilename,
} from '../src/services/sdachFileService.js';

import {
  exportToFountain,
  parseFountain,
} from '../src/services/fountainService.js';

import {
  generateScreenplayHTML,
} from '../src/services/pdfService.js';

import {
  SAMPLE_TANGLE_AND_MOSS,
} from '../src/constants/templates.js';

console.log('====================================================');
console.log('🧪 RUNNING SCRIPTS BY DARKCHESA VERIFICATION SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Intelligent Keyboard Element Sequence Tests
assert(
  NEXT_ELEMENT_MAP[ELEMENT_TYPES.SCENE_HEADING] === ELEMENT_TYPES.ACTION,
  'Scene Heading -> Enter produces Action'
);
assert(
  NEXT_ELEMENT_MAP[ELEMENT_TYPES.ACTION] === ELEMENT_TYPES.CHARACTER,
  'Action -> Enter suggests Character'
);
assert(
  NEXT_ELEMENT_MAP[ELEMENT_TYPES.CHARACTER] === ELEMENT_TYPES.DIALOGUE,
  'Character -> Enter produces Dialogue'
);
assert(
  NEXT_ELEMENT_MAP[ELEMENT_TYPES.DIALOGUE] === ELEMENT_TYPES.ACTION,
  'Dialogue -> Enter returns to Action'
);
assert(
  NEXT_ELEMENT_MAP[ELEMENT_TYPES.PARENTHETICAL] === ELEMENT_TYPES.DIALOGUE,
  'Parenthetical -> Enter produces Dialogue'
);
assert(
  NEXT_ELEMENT_MAP[ELEMENT_TYPES.TRANSITION] === ELEMENT_TYPES.SCENE_HEADING,
  'Transition -> Enter produces Scene Heading'
);

// 2. .sdach Serialization & Integrity Tests
const sampleScript = SAMPLE_TANGLE_AND_MOSS;
const serialized = serializeSdach(sampleScript);
assert(typeof serialized === 'string', '.sdach serializes to string');

const parsedJson = JSON.parse(serialized);
assert(parsedJson.fileSignature === SDACH_SIGNATURE, '.sdach file signature matches SDACH_SCRIPT_FORMAT');
assert(parsedJson.appName === 'Scripts by Darkchesa', 'App name in .sdach is "Scripts by Darkchesa"');
assert(parsedJson.formatVersion === SDACH_CURRENT_VERSION, '.sdach format version matches 1.0.0');
assert(parsedJson.script.title === 'Tangle and Moss', 'Script title preserved in .sdach');
assert(Array.isArray(parsedJson.script.elements), '.sdach elements is an array');
assert(parsedJson.script.elements.length === sampleScript.elements.length, 'All screenplay elements serialized');

// 3. .sdach Parsing & Deserialization Tests
const restoredScript = parseSdach(serialized);
assert(restoredScript.title === 'Tangle and Moss', 'parseSdach restored script title');
assert(restoredScript.author === sampleScript.author, 'parseSdach restored author');
assert(restoredScript.elements.length === sampleScript.elements.length, 'parseSdach restored all elements');
assert(
  restoredScript.characterPalette['TANGLE'] === '#FFE58F',
  'Character highlight for TANGLE restored accurately (#FFE58F)'
);
assert(
  restoredScript.characterPalette['MOSSY'] === '#B7EB8F',
  'Character highlight for MOSSY restored accurately (#B7EB8F)'
);

// 4. Filename generation
const filename = getSdachFilename('Tangle & Moss: Part 1');
assert(filename === 'Tangle_Moss_Part_1.sdach', 'Generated clean .sdach filename: ' + filename);

// 5. Corrupted / Invalid File Handling
let caughtError = false;
try {
  parseSdach('{"invalid": true}');
} catch (e) {
  caughtError = true;
}
assert(caughtError, 'Corrupted / invalid file throws descriptive validation error');

// 6. Word & Page Count Calculators
const words = calculateWordCount(sampleScript.elements);
assert(words > 50, `Calculated screenplay word count: ${words} words`);
const estPages = calculateEstimatedPages(sampleScript.elements);
assert(estPages >= 1, `Calculated screenplay pages: ${estPages} pages`);

// 7. Fountain Screenplay Format Tests
const fountainOut = exportToFountain(sampleScript);
assert(fountainOut.includes('Title: Tangle and Moss'), 'Fountain export includes Title');
assert(fountainOut.includes('TANGLE'), 'Fountain export includes character TANGLE');
assert(fountainOut.includes("It's okay to be scared of things."), 'Fountain export includes dialogue');

const parsedFtn = parseFountain(fountainOut);
assert(parsedFtn.title === 'Tangle and Moss', 'Fountain parser extracted title');
assert(parsedFtn.elements.length > 5, 'Fountain parser extracted elements');

// 8. Hollywood Standard Screenplay HTML / PDF generator Tests
const screenplayHtml = generateScreenplayHTML(sampleScript);
assert(screenplayHtml.includes('Courier'), 'Screenplay HTML uses permanent Courier typography');
assert(screenplayHtml.includes('TANGLE AND MOSS'), 'Screenplay HTML includes title page');
assert(screenplayHtml.includes('EXT. HILLSIDE OVERLOOK - DUSK'), 'Screenplay HTML includes scene heading');
assert(screenplayHtml.includes('class="element dialogue"'), 'Screenplay HTML formats dialogue class');
assert(screenplayHtml.includes('class="element character"'), 'Screenplay HTML formats character class');

console.log(`\n====================================================`);
console.log(`🎉 TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log(`====================================================`);
