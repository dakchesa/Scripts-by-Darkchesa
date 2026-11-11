/**
 * Theme & Typography Configuration
 * Scripts by Darkchesa
 */

import Platform from '../utils/platform.js';

export const FONTS = {
  // Screenplay standard: Permanent Courier New font
  courier: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    web: '"Courier New", Courier, monospace',
    default: '"Courier New", Courier, monospace',
  }),
  courierBold: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    web: '"Courier New", Courier, monospace',
    default: '"Courier New", Courier, monospace',
  }),
  ui: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: 'System',
  }),
};

export const SCREENPLAY_DIMENSIONS = {
  // Standard screenplay page dimensions and limits
  linesPerPage: 55,
  fontSize: 13, // Explicitly Courier New font size 13
  lineHeight: 21,
  characterIndent: 130,
  dialogueIndent: 70,
  dialogueMaxWidth: 260,
  parentheticalIndent: 90,
  pagePaddingHorizontal: 28,
  pagePaddingVertical: 36,
  pageMinHeight: 780,
};

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow (Tangle)', value: '#FFE58F', textColor: '#614700' },
  { name: 'Green (Mossy)', value: '#B7EB8F', textColor: '#135200' },
  { name: 'Cyan (Sky)', value: '#87E8DE', textColor: '#00474F' },
  { name: 'Pink (Rose)', value: '#FFADD2', textColor: '#780650' },
  { name: 'Orange (Sun)', value: '#FFD591', textColor: '#873800' },
  { name: 'Purple (Comment)', value: '#D3ADF7', textColor: '#391085' },
];

export const THEME = {
  dark: {
    background: '#121214',
    surface: '#1E1E24',
    surfaceSubtle: '#2A2A32',
    border: '#33333E',
    text: '#F5F5F7',
    textSecondary: '#9A9AA6',
    accent: '#DC143C', // Darchesa crimson
    accentHover: '#B01030',
    accentLight: 'rgba(220, 20, 60, 0.15)',
    danger: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
    // Screenplay page maintains authentic white paper look
    pageBg: '#FFFFFF',
    pageText: '#111111',
    pageShadow: 'rgba(0, 0, 0, 0.45)',
    pageBorder: '#D0D0D5',
    toolbarBg: '#1A1A22',
    toolbarBorder: '#2E2E3A',
  },
  light: {
    background: '#F0F2F5',
    surface: '#FFFFFF',
    surfaceSubtle: '#F8F9FA',
    border: '#E2E4E8',
    text: '#1C1E21',
    textSecondary: '#65676B',
    accent: '#DC143C', // Darchesa crimson
    accentHover: '#B01030',
    accentLight: 'rgba(220, 20, 60, 0.12)',
    danger: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
    pageBg: '#FFFFFF',
    pageText: '#111111',
    pageShadow: 'rgba(0, 0, 0, 0.08)',
    pageBorder: '#D8DADE',
    toolbarBg: '#FFFFFF',
    toolbarBorder: '#E2E4E8',
  },
};
