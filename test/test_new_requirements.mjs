/**
 * Verification for user's updated requirements
 */

import { FONTS, SCREENPLAY_DIMENSIONS } from '../src/constants/theme.js';
import { generateScreenplayHTML } from '../src/services/pdfService.js';
import { exportSdachFile, serializeSdach } from '../src/services/sdachFileService.js';
import { SAMPLE_TANGLE_AND_MOSS } from '../src/constants/templates.js';

console.log('🧪 Verifying new requirements...');

// 1. Font and Size check
if (SCREENPLAY_DIMENSIONS.fontSize !== 13) {
  throw new Error(`Expected fontSize 13, got ${SCREENPLAY_DIMENSIONS.fontSize}`);
}
console.log('✅ SCREENPLAY_DIMENSIONS.fontSize is 13');

if (!FONTS.courier.includes('Courier New')) {
  throw new Error(`Expected FONTS.courier to include "Courier New", got ${FONTS.courier}`);
}
console.log('✅ FONTS.courier includes "Courier New"');

// 2. HTML PDF Generation and Title Page positioning check
const html = generateScreenplayHTML(SAMPLE_TANGLE_AND_MOSS, { includeTitlePage: true });

if (!html.includes('Scripts by Darkchesa')) {
  throw new Error('Expected HTML to include "Scripts by Darkchesa"');
}
console.log('✅ Screenplay HTML includes "Scripts by Darkchesa"');

if (html.includes('height: 9.5in')) {
  throw new Error('Title page height still contains 9.5in causing blank page overflow');
}
console.log('✅ Title page 9.5in height removed');

if (!html.includes('padding-top: 2.2in')) {
  throw new Error('Expected title-page to have padding-top: 2.2in for clean upper page positioning');
}
console.log('✅ Title page positioned cleanly higher (padding-top: 2.2in)');

// Verify that the title page has page-break-after and there is no extra page-break div right after it
if (html.includes('</div>\n      <div class="page-break"></div>')) {
  throw new Error('Redundant page-break div found right after title page');
}
console.log('✅ Redundant extra blank page break eliminated');

// 3. .sdach Serialization check
const serialized = serializeSdach(SAMPLE_TANGLE_AND_MOSS);
const parsed = JSON.parse(serialized);
if (parsed.appName !== 'Scripts by Darkchesa') {
  throw new Error(`Expected appName "Scripts by Darkchesa", got ${parsed.appName}`);
}
console.log('✅ .sdach appName is "Scripts by Darkchesa"');

// 4. Export Sdach result check
const exportResult = await exportSdachFile(SAMPLE_TANGLE_AND_MOSS);
if (!exportResult.location) {
  throw new Error('Export result missing location on device');
}
console.log(`✅ Export result reports location on device: "${exportResult.location}"`);

console.log('🎉 ALL NEW REQUIREMENTS VERIFIED SUCCESSFULLY!');
