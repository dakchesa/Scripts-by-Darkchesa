/**
 * Comprehensive Verification Suite for "Plot a Plot" - Dan Harmon Story Circle
 * Scripts by Darkchesa
 */

import fs from 'fs';
import path from 'path';
import {
  STORY_CIRCLE_LAYERS,
  STORY_CIRCLE_DIVISIONS_SPEC,
  createDefaultStoryCircle,
  calculateStoryProgress,
  validateAndSanitizeStoryCircle,
} from '../src/types/storyCircle.js';
import {
  generateStoryCircleSvgHtml,
  generateStoryCircleHtml,
} from '../src/services/storyCirclePdfService.js';
import {
  serializeSdach,
  parseSdach,
} from '../src/services/sdachFileService.js';
import { SAMPLE_TANGLE_AND_MOSS } from '../src/constants/templates.js';

console.log('====================================================');
console.log('🧪 TESTING "PLOT A PLOT" - DAN HARMON STORY CIRCLE');
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

// 2. Eight Story Divisions in exact clockwise sequence
assert(STORY_CIRCLE_DIVISIONS_SPEC.length === 8, 'Chart contains exactly 8 story divisions');
const expectedSequence = [
  'ZONE OF COMFORT',
  'DESIRE SOMETHING',
  'ENTERS UNFAMILIAR SITUATION (DEFEAT / OVERPOWERED)',
  'ADAPTS TO SITUATION',
  'OVERCOMES (GETS WHAT THEY WANT)',
  'PAYS THE HEAVY PRICE',
  'RETURNS TO FAMILIAR SITUATION (ZONE OF COMFORT)',
  'CHANGES AS A RESULT OF JOURNEY',
];

expectedSequence.forEach((title, index) => {
  const div = STORY_CIRCLE_DIVISIONS_SPEC[index];
  assert(div.id === index + 1, `Division ${index + 1} ID is ${index + 1}`);
  assert(div.title === title, `Division ${index + 1} is "${title}"`);
});

// Act assignments
assert(STORY_CIRCLE_DIVISIONS_SPEC[0].act === 'ACT 1', 'Division 1 belongs to ACT 1 (Green)');
assert(STORY_CIRCLE_DIVISIONS_SPEC[7].act === 'ACT 1', 'Division 8 belongs to ACT 1 (Green)');
assert(STORY_CIRCLE_DIVISIONS_SPEC[1].act === 'ACT 2', 'Division 2 belongs to ACT 2 (Yellow)');
assert(STORY_CIRCLE_DIVISIONS_SPEC[6].act === 'ACT 2', 'Division 7 belongs to ACT 2 (Yellow)');
assert(STORY_CIRCLE_DIVISIONS_SPEC[2].act === 'ACT 3', 'Division 3 belongs to ACT 3 (Red)');
assert(STORY_CIRCLE_DIVISIONS_SPEC[3].act === 'ACT 3', 'Division 4 belongs to ACT 3 (Red)');
assert(STORY_CIRCLE_DIVISIONS_SPEC[4].act === 'ACT 3', 'Division 5 belongs to ACT 3 (Red)');
assert(STORY_CIRCLE_DIVISIONS_SPEC[5].act === 'ACT 3', 'Division 6 belongs to ACT 3 (Red)');

// 3. Progress Tracking & Manual Tick
const defaultCircle = createDefaultStoryCircle('My Screenplay');
assert(defaultCircle.progress.completedCount === 0, 'Initial completed count is 0');
assert(defaultCircle.progress.percentage === 0, 'Initial progress is 0%');

// Mark 5 divisions complete
defaultCircle.divisions[0].completed = true;
defaultCircle.divisions[1].completed = true;
defaultCircle.divisions[2].completed = true;
defaultCircle.divisions[3].completed = true;
defaultCircle.divisions[4].completed = true;

const updatedProgress = calculateStoryProgress(defaultCircle.divisions);
assert(updatedProgress.completedCount === 5, 'Progress correctly tracks 5 completed');
assert(updatedProgress.percentage === 62.5, '5/8 completed reports 62.5%');
assert(updatedProgress.formatted.includes('5/8 completed – 62.5%'), 'Formatted string matches spec: 5/8 completed – 62.5%');

// 4. Data Validation and Sanitization
const corrupted = {
  title: 'Corrupted Test',
  divisions: [
    { id: 1, description: 'Test desc', completed: true },
    { id: 999, description: 'Illegal extra division' }, // Should be stripped/ignored
  ],
};
const sanitized = validateAndSanitizeStoryCircle(corrupted);
assert(sanitized.divisions.length === 8, 'Sanitizer enforces exactly 8 story divisions');
assert(sanitized.divisions[0].description === 'Test desc', 'Preserved valid division description');
assert(sanitized.divisions[0].completed === true, 'Preserved completion tick');
assert(sanitized.divisions[0].title === 'ZONE OF COMFORT', 'Preserved immutable structural title');

// 5. .sdach File Integration
const testScript = {
  ...SAMPLE_TANGLE_AND_MOSS,
  storyCircle: {
    ...defaultCircle,
    divisions: defaultCircle.divisions.map((d, i) => ({
      ...d,
      description: `Plot development for stage ${i + 1}`,
      characterActions: `Protagonist actions at ${i + 1}`,
      importantEvents: `Key discovery ${i + 1}`,
    })),
  },
};

const serialized = serializeSdach(testScript);
assert(typeof serialized === 'string', '.sdach serializes with storyCircle');
const parsedPayload = JSON.parse(serialized);
assert(parsedPayload.script.storyCircle !== undefined, '.sdach payload contains storyCircle object');
assert(parsedPayload.script.storyCircle.divisions.length === 8, '.sdach payload preserves all 8 divisions');

const restored = parseSdach(serialized);
assert(restored.storyCircle !== null, 'parseSdach restored storyCircle object');
assert(restored.storyCircle.divisions.length === 8, 'Restored storyCircle has 8 divisions');
assert(restored.storyCircle.divisions[0].description === 'Plot development for stage 1', 'Restored division description matches');
assert(restored.storyCircle.divisions[0].characterActions === 'Protagonist actions at 1', 'Restored characterActions match');
assert(restored.storyCircle.divisions[0].importantEvents === 'Key discovery 1', 'Restored importantEvents match');
assert(restored.storyCircle.divisions[0].completed === true, 'Restored completion checkbox status');

// 6. PDF Export HTML Generation
const pdfHtml = generateStoryCircleHtml('Tangle and Moss', testScript.storyCircle);
assert(pdfHtml.includes('DAN HARMON STORY CIRCLE'), 'PDF HTML includes document title "DAN HARMON STORY CIRCLE"');
assert(pdfHtml.includes('TANGLE AND MOSS'), 'PDF HTML includes script title');
assert(pdfHtml.includes('Plot a Plot &bull; Feeling stuck? Craft a Plot.'), 'PDF HTML includes tagline "Feeling stuck? Craft a Plot."');
assert(pdfHtml.includes('<svg'), 'PDF HTML renders full inline SVG circular chart');
assert(pdfHtml.includes('THE</text>') && pdfHtml.includes('END</text>'), 'SVG includes central "THE END" text');
assert(pdfHtml.includes('#22C55E') && pdfHtml.includes('#FACC15') && pdfHtml.includes('#EF4444') && pdfHtml.includes('#F472B6'), 'SVG includes Green, Yellow, Red, Pink color layers');
assert(pdfHtml.includes('ACT 1 &ndash; GREEN: THE BEGINNING'), 'PDF includes Act 1 breakdown');
assert(pdfHtml.includes('ACT 2 &ndash; YELLOW: THE JOURNEY'), 'PDF includes Act 2 breakdown');
assert(pdfHtml.includes('ACT 3 &ndash; RED: THE CONFLICT AND RESOLUTION'), 'PDF includes Act 3 breakdown');
assert(pdfHtml.includes('5 of 8 Divisions Completed (62.5%)'), 'PDF includes progress summary');

// 7. Access in Tools & Document Settings
const toolsModalPath = path.resolve('src/components/ToolsModal.js');
const toolsModalCode = fs.readFileSync(toolsModalPath, 'utf8');
assert(toolsModalCode.includes('Plot a Plot'), 'ToolsModal contains "Plot a Plot" button');
assert(toolsModalCode.includes('Feeling stuck? Craft a Plot.'), 'ToolsModal displays tagline "Feeling stuck? Craft a Plot."');
assert(toolsModalCode.includes('plot_a_plot'), 'ToolsModal dispatches "plot_a_plot" action');

// 8. Editor Screen integration
const editorScreenPath = path.resolve('src/screens/EditorScreen.js');
const editorScreenCode = fs.readFileSync(editorScreenPath, 'utf8');
assert(editorScreenCode.includes('PlotAPlotWorkspace'), 'EditorScreen imports PlotAPlotWorkspace');
assert(editorScreenCode.includes('case \'plot_a_plot\':'), 'EditorScreen handles "plot_a_plot" tool selection');
assert(editorScreenCode.includes('initialStoryCircle={script.storyCircle}'), 'EditorScreen passes storyCircle to workspace');

console.log('\n====================================================');
console.log(`🎉 ALL ${passedTests} / ${totalTests} TESTS PASSED FOR PLOT A PLOT!`);
console.log('====================================================\n');
