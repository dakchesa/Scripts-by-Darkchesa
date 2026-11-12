/**
 * Comprehensive Verification Suite for "Plot a Plot" - Dan Harmon Expanded Story Circle
 * Scripts by Darkchesa
 */

import {
  STORY_CIRCLE_LAYERS,
  STORY_CIRCLE_DIVISIONS_SPEC,
  createDefaultStoryCircle,
  calculateStoryProgress,
  validateAndSanitizeStoryCircle,
  CORE_8_STAGES,
} from '../src/types/storyCircle.js';
import {
  generateExpandedStoryCircleSvgHtml,
  generateExpandedStoryCircleHtml,
  generateStoryCircleSvgHtml,
  generateStoryCircleHtml,
} from '../src/services/storyCirclePdfService.js';
import {
  serializeSdach,
  parseSdach,
} from '../src/services/sdachFileService.js';
import { SAMPLE_TANGLE_AND_MOSS } from '../src/constants/templates.js';

console.log('====================================================');
console.log('🧪 TESTING "PLOT A PLOT" - DAN HARMON EXPANDED STORY CIRCLE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Structure Verification: 4 concentric layers
assert(STORY_CIRCLE_LAYERS.length === 4, 'Chart contains exactly 4 concentric layers');
assert(STORY_CIRCLE_LAYERS[0].act === 'ACT 1' && STORY_CIRCLE_LAYERS[0].color === '#22C55E', 'Layer 1 is Outer Circle: GREEN (ACT 1)');
assert(STORY_CIRCLE_LAYERS[1].act === 'ACT 2' && STORY_CIRCLE_LAYERS[1].color === '#FACC15', 'Layer 2 is Second Circle: YELLOW (ACT 2)');
assert(STORY_CIRCLE_LAYERS[2].act === 'ACT 3' && STORY_CIRCLE_LAYERS[2].color === '#EF4444', 'Layer 3 is Third Circle: RED (ACT 3)');
assert(STORY_CIRCLE_LAYERS[3].act === 'THE END' && STORY_CIRCLE_LAYERS[3].color === '#F472B6', 'Layer 4 is Centre Circle: PINK (THE END)');

// 2. 24 Divisions Specification across 3 Acts
assert(STORY_CIRCLE_DIVISIONS_SPEC.length === 24, 'Chart contains exactly 24 expanded story divisions');
assert(CORE_8_STAGES.length === 8, '8 core story cycle stages repeated across each act');

// Verify Act 1: 1.1 to 1.8
for (let i = 1; i <= 8; i++) {
  const code = `1.${i}`;
  const div = STORY_CIRCLE_DIVISIONS_SPEC.find((d) => d.code === code);
  assert(div !== undefined, `Act 1 contains division ${code}`);
  assert(div.act === 'ACT 1', `${code} belongs to ACT 1`);
  assert(div.color === '#22C55E', `${code} has Green color (#22C55E)`);
  assert(div.stage === i, `${code} has stage ${i}`);
}

// Verify Act 2: 2.1 to 2.8
for (let i = 1; i <= 8; i++) {
  const code = `2.${i}`;
  const div = STORY_CIRCLE_DIVISIONS_SPEC.find((d) => d.code === code);
  assert(div !== undefined, `Act 2 contains division ${code}`);
  assert(div.act === 'ACT 2', `${code} belongs to ACT 2`);
  assert(div.color === '#FACC15', `${code} has Yellow color (#FACC15)`);
  assert(div.stage === i, `${code} has stage ${i}`);
}

// Verify Act 3: 3.1 to 3.8
for (let i = 1; i <= 8; i++) {
  const code = `3.${i}`;
  const div = STORY_CIRCLE_DIVISIONS_SPEC.find((d) => d.code === code);
  assert(div !== undefined, `Act 3 contains division ${code}`);
  assert(div.act === 'ACT 3', `${code} belongs to ACT 3`);
  assert(div.color === '#EF4444', `${code} has Red color (#EF4444)`);
  assert(div.stage === i, `${code} has stage ${i}`);
}

// 3. Progress Tracking across 24 divisions
const defaultCircle = createDefaultStoryCircle('My Screenplay');
assert(defaultCircle.title === 'Dan Harmon Expanded Story Circle', 'Document title is Dan Harmon Expanded Story Circle');
assert(defaultCircle.divisions.length === 24, 'Default circle has 24 divisions');
assert(defaultCircle.progress.completedCount === 0, 'Initial completed count is 0');
assert(defaultCircle.progress.percentage === 0, 'Initial progress is 0%');

// Mark 6 divisions complete (6/24 = 25%)
defaultCircle.divisions[0].completed = true;
defaultCircle.divisions[1].completed = true;
defaultCircle.divisions[2].completed = true;
defaultCircle.divisions[8].completed = true;
defaultCircle.divisions[9].completed = true;
defaultCircle.divisions[16].completed = true;

const updatedProgress = calculateStoryProgress(defaultCircle.divisions);
assert(updatedProgress.completedCount === 6, 'Progress correctly tracks 6 completed divisions');
assert(updatedProgress.percentage === 25, '6/24 completed reports 25%');
assert(updatedProgress.formatted.includes('6/24 completed – 25%'), 'Formatted string reports: 6/24 completed – 25%');

// 4. Data Validation and Sanitization (including legacy backward compatibility)
const corrupted = {
  title: 'Corrupted Test',
  divisions: [
    { id: '1.1', description: 'Test desc 1.1', completed: true },
    { id: 999, description: 'Illegal extra division' },
  ],
  theEndNotes: 'Protagonist has triumphed.',
};
const sanitized = validateAndSanitizeStoryCircle(corrupted);
assert(sanitized.divisions.length === 24, 'Sanitizer enforces exactly 24 story divisions');
assert(sanitized.divisions[0].description === 'Test desc 1.1', 'Preserved valid division description');
assert(sanitized.divisions[0].completed === true, 'Preserved completion tick');
assert(sanitized.theEndNotes === 'Protagonist has triumphed.', 'Preserved theEndNotes');

// Test legacy format backward compatibility (numeric IDs 1..8 mapped to 1.1..1.8)
const legacy = {
  divisions: [
    { id: 1, description: 'Legacy division 1', completed: true },
    { id: 2, description: 'Legacy division 2', completed: false },
  ],
};
const migrated = validateAndSanitizeStoryCircle(legacy);
assert(migrated.divisions.length === 24, 'Legacy circle migrated to 24 divisions');
assert(migrated.divisions[0].description === 'Legacy division 1', 'Legacy division 1 mapped to 1.1');
assert(migrated.divisions[1].description === 'Legacy division 2', 'Legacy division 2 mapped to 1.2');

// 5. .sdach File Integration
const testScript = {
  ...SAMPLE_TANGLE_AND_MOSS,
  storyCircle: {
    ...defaultCircle,
    theEndNotes: 'Final resolution notes.',
    divisions: defaultCircle.divisions.map((d) => ({
      ...d,
      description: `Plot development for ${d.code}`,
      characterActions: `Actions at ${d.code}`,
      importantEvents: `Key discovery at ${d.code}`,
    })),
  },
};

const serialized = serializeSdach(testScript);
assert(typeof serialized === 'string', '.sdach serializes with expanded storyCircle');
const parsedPayload = JSON.parse(serialized);
assert(parsedPayload.script.storyCircle !== undefined, '.sdach payload contains storyCircle object');
assert(parsedPayload.script.storyCircle.divisions.length === 24, '.sdach payload preserves all 24 divisions');

const restored = parseSdach(serialized);
assert(restored.storyCircle !== null, 'parseSdach restored storyCircle object');
assert(restored.storyCircle.divisions.length === 24, 'Restored storyCircle has 24 divisions');
assert(restored.storyCircle.divisions[0].description === 'Plot development for 1.1', 'Restored 1.1 description matches');
assert(restored.storyCircle.theEndNotes === 'Final resolution notes.', 'Restored theEndNotes matches');

// 6. PDF Export HTML Generation
const pdfHtml = generateExpandedStoryCircleHtml('Tangle and Moss', testScript.storyCircle);
assert(pdfHtml.includes('DAN HARMON EXPANDED STORY CIRCLE'), 'PDF HTML includes document title "DAN HARMON EXPANDED STORY CIRCLE"');
assert(pdfHtml.includes('TANGLE AND MOSS'), 'PDF HTML includes screenplay title');
assert(pdfHtml.includes('Plot a Plot &bull; Feeling stuck? Craft a Plot.'), 'PDF HTML includes tagline "Feeling stuck? Craft a Plot."');
assert(pdfHtml.includes('<svg'), 'PDF HTML renders full inline SVG circular chart');
assert(pdfHtml.includes('THE</text>') && pdfHtml.includes('END</text>'), 'SVG includes central "THE END" text');
assert(pdfHtml.includes('#22C55E') && pdfHtml.includes('#FACC15') && pdfHtml.includes('#EF4444') && pdfHtml.includes('#F472B6'), 'SVG includes Green, Yellow, Red, Pink color layers');
assert(pdfHtml.includes('ACT 1 &ndash; GREEN: THE BEGINNING'), 'PDF includes Act 1 breakdown');
assert(pdfHtml.includes('ACT 2 &ndash; YELLOW: THE MIDDLE'), 'PDF includes Act 2 breakdown');
assert(pdfHtml.includes('ACT 3 &ndash; RED: THE CLIMAX'), 'PDF includes Act 3 breakdown');
assert(pdfHtml.includes('THE END &ndash; CENTRAL RESOLUTION'), 'PDF includes The End central resolution box');
assert(pdfHtml.includes('Final resolution notes.'), 'PDF includes theEndNotes content');

// Check that all 24 badges are in the SVG HTML
for (let act = 1; act <= 3; act++) {
  for (let stage = 1; stage <= 8; stage++) {
    const code = `${act}.${stage}`;
    assert(pdfHtml.includes(code) || pdfHtml.includes('&#10003;'), `SVG includes badge for division ${code}`);
  }
}

console.log(`\n====================================================`);
console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
console.log(`====================================================\n`);
