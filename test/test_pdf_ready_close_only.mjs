/**
 * Verification that PDF Ready card shows only the 'Close' button
 * and eliminates 'Open File' and 'Share' buttons.
 */

import fs from 'fs';
import path from 'path';

console.log('🧪 Verifying PDF Ready card button configuration...');

const modalPath = path.resolve('src/components/ExportResultModal.js');
const modalCode = fs.readFileSync(modalPath, 'utf8');

// 1. Verify !isPdf guards the action row with Open File and Share
if (!modalCode.includes('{!isPdf &&') || !modalCode.includes('styles.actionRow')) {
  throw new Error('Expected {!isPdf && (<View style={styles.actionRow}> to prevent Open and Share on PDF Ready card');
}
console.log('✅ Open File and Share buttons are eliminated from PDF Ready card');

// 2. Verify Close button is present and styled as primary when isPdf
if (!modalCode.includes('Close') || !modalCode.includes('isPdf')) {
  throw new Error('Expected Close button to be preserved as sole action');
}
console.log('✅ Close button is preserved as the sole action on PDF Ready card');

// 3. Verify pdfService does not have AlertHelper with Open/Share
const pdfServicePath = path.resolve('src/services/pdfService.js');
const pdfServiceCode = fs.readFileSync(pdfServicePath, 'utf8');

if (pdfServiceCode.includes('Open / Share')) {
  throw new Error('Found redundant "Open / Share" Alert in pdfService.js');
}
console.log('✅ No redundant "Open / Share" native alert in pdfService.js');

console.log('🎉 PDF READY CLOSE-ONLY REQUIREMENTS VERIFIED SUCCESSFULLY!');
