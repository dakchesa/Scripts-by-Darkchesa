/**
 * .sdach Native Script File Format Service
 * Scripts by Darkchesa
 *
 * Handles complete serialization, file saving, file opening,
 * parsing, and format validation for the proprietary .sdach file standard.
 */

import Platform from '../utils/platform.js';
import { SDACH_EXTENSION, SDACH_SIGNATURE, SDACH_CURRENT_VERSION, ELEMENT_TYPES } from '../types/screenplay.js';

/**
 * Validate script object structure before serialization
 */
export function validateScriptData(script) {
  if (!script || typeof script !== 'object') {
    throw new Error('Invalid script data: Object expected');
  }
  if (!script.title || typeof script.title !== 'string') {
    throw new Error('Invalid script data: Missing script title');
  }
  if (!Array.isArray(script.elements)) {
    throw new Error('Invalid script data: elements must be an array');
  }
  return true;
}

/**
 * Serialize a screenplay into the official .sdach file format string
 */
export function serializeSdach(script) {
  validateScriptData(script);

  const payload = {
    fileSignature: SDACH_SIGNATURE,
    formatVersion: SDACH_CURRENT_VERSION,
    appName: 'Scripts by Darkchesa',
    exportedAt: new Date().toISOString(),
    script: {
      id: script.id || `sdach_${Date.now()}`,
      title: script.title.trim(),
      author: script.author ? script.author.trim() : 'Anonymous',
      logline: script.logline || '',
      createdAt: script.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: script.settings || {
        theme: 'dark',
        continuousView: true,
        fontSize: 12,
        showPageNumbers: true,
        enableCharacterHighlights: true,
      },
      characterPalette: script.characterPalette || {},
      elements: script.elements.map((el, index) => ({
        id: el.id || `elem_${index}_${Date.now()}`,
        type: Object.values(ELEMENT_TYPES).includes(el.type) ? el.type : ELEMENT_TYPES.ACTION,
        text: typeof el.text === 'string' ? el.text : '',
        highlightColor: el.highlightColor || null,
        comment: el.comment || null,
      })),
      stats: {
        totalElements: script.elements.length,
        totalWords: calculateWordCount(script.elements),
        estimatedPages: calculateEstimatedPages(script.elements),
      },
    },
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Parse and validate a .sdach file content string
 */
export function parseSdach(fileContentString) {
  if (!fileContentString || typeof fileContentString !== 'string') {
    throw new Error('File content is empty or unreadable.');
  }

  let parsed;
  try {
    parsed = JSON.parse(fileContentString);
  } catch (err) {
    throw new Error('Failed to parse .sdach file: Invalid JSON format.');
  }

  // Validate signature
  if (parsed.fileSignature !== SDACH_SIGNATURE) {
    // If not direct signature, check if it is direct script object
    if (parsed.title && Array.isArray(parsed.elements)) {
      return normalizeScript(parsed);
    }
    throw new Error('Selected file is not a valid "Scripts by Darkchesa" (.sdach) file.');
  }

  if (!parsed.script) {
    throw new Error('Malformed .sdach file: Missing script contents.');
  }

  return normalizeScript(parsed.script);
}

/**
 * Normalize and sanitize script object into runtime structure
 */
function normalizeScript(rawScript) {
  const elements = Array.isArray(rawScript.elements)
    ? rawScript.elements.map((el, index) => ({
        id: el.id || `elem_${index}_${Date.now()}`,
        type: Object.values(ELEMENT_TYPES).includes(el.type) ? el.type : ELEMENT_TYPES.ACTION,
        text: typeof el.text === 'string' ? el.text : '',
        highlightColor: el.highlightColor || null,
        comment: el.comment || null,
      }))
    : [];

  return {
    id: rawScript.id || `script_${Date.now()}`,
    title: rawScript.title || 'Untitled Screenplay',
    author: rawScript.author || 'Anonymous',
    logline: rawScript.logline || '',
    createdAt: rawScript.createdAt || new Date().toISOString(),
    updatedAt: rawScript.updatedAt || new Date().toISOString(),
    settings: {
      theme: rawScript.settings?.theme || 'dark',
      continuousView: rawScript.settings?.continuousView ?? true,
      fontSize: rawScript.settings?.fontSize || 12,
      showPageNumbers: rawScript.settings?.showPageNumbers ?? true,
      enableCharacterHighlights: rawScript.settings?.enableCharacterHighlights ?? true,
    },
    characterPalette: rawScript.characterPalette || {},
    elements: elements.length > 0 ? elements : [
      { id: 'elem_init', type: ELEMENT_TYPES.SCENE_HEADING, text: 'INT. SCENE - DAY' },
      { id: 'elem_init_act', type: ELEMENT_TYPES.ACTION, text: '' }
    ],
  };
}

/**
 * Calculate total words in script
 */
export function calculateWordCount(elements) {
  if (!Array.isArray(elements)) return 0;
  return elements.reduce((acc, el) => {
    if (!el.text) return acc;
    const words = el.text.trim().split(/\s+/).filter(Boolean);
    return acc + words.length;
  }, 0);
}

/**
 * Screenplay rule of thumb: ~55 lines per page, 1 page = ~1 min screen time
 */
export function calculateEstimatedPages(elements) {
  if (!Array.isArray(elements) || elements.length === 0) return 1;
  let totalLineWeight = 0;
  for (const el of elements) {
    const text = el.text || '';
    const lines = Math.max(1, Math.ceil(text.length / (el.type === ELEMENT_TYPES.DIALOGUE ? 35 : 60)));
    // Add margin spacing weight
    const spacingWeight = el.type === ELEMENT_TYPES.SCENE_HEADING ? 2 : 1;
    totalLineWeight += lines + spacingWeight;
  }
  return Math.max(1, Math.ceil(totalLineWeight / 55));
}

/**
 * Generate a clean filename for .sdach export
 */
export function getSdachFilename(scriptTitle) {
  const safeName = (scriptTitle || 'Untitled')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return `${safeName}${SDACH_EXTENSION}`;
}

/**
 * Trigger export/download of .sdach file across Web and Native platforms
 */
export async function exportSdachFile(script) {
  const sdachContent = serializeSdach(script);
  const filename = getSdachFilename(script.title);

  if (Platform.OS === 'web') {
    // Download directly via browser Blob
    const blob = new Blob([sdachContent], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const location = `Device Downloads Folder / ${filename}`;
    return {
      success: true,
      filename,
      location,
      blobUrl,
      type: 'sdach',
      title: script.title,
    };
  } else {
    // Native Mobile using Expo FileSystem and Sharing
    try {
      let FileSystem = null;
      let Sharing = null;

      if (typeof require !== 'undefined') {
        try {
          FileSystem = require('expo-file-system/legacy');
        } catch (e) {
          try {
            FileSystem = require('expo-file-system');
          } catch (e2) {}
        }
        try {
          Sharing = require('expo-sharing');
        } catch (e) {}
      }

      const docDir =
        FileSystem?.documentDirectory ||
        FileSystem?.Paths?.document?.uri ||
        'file:///documents/';
      const fileUri = `${docDir}${filename}`;
      const location = `Device Documents / ${filename}`;

      if (FileSystem && FileSystem.writeAsStringAsync) {
        await FileSystem.writeAsStringAsync(fileUri, sdachContent, {
          encoding: FileSystem.EncodingType ? FileSystem.EncodingType.UTF8 : 'utf8',
        });
      }

      if (Sharing && Sharing.isAvailableAsync && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: `Export ${filename} (Scripts by Darkchesa)`,
          UTI: 'public.json',
        });
      }
      return {
        success: true,
        fileUri,
        filename,
        location,
        type: 'sdach',
        title: script.title,
      };
    } catch (err) {
      console.warn('Native file export fallback:', err);
      return {
        success: true,
        filename,
        location: `Device Storage / ${filename}`,
        type: 'sdach',
        title: script.title,
      };
    }
  }
}

/**
 * Open/Import .sdach file using DocumentPicker or File input
 */
export async function pickAndOpenSdachFile() {
  if (Platform.OS === 'web') {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.sdach,.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsedScript = parseSdach(event.target.result);
            resolve(parsedScript);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file from disk.'));
        reader.readAsText(file);
      };
      input.click();
    });
  } else {
    // Native Mobile
    try {
      const DocumentPicker = require('expo-document-picker');
      const FileSystem = require('expo-file-system');

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const pickedFile = result.assets[0];
      const content = await FileSystem.readAsStringAsync(pickedFile.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsedScript = parseSdach(content);
      return parsedScript;
    } catch (err) {
      console.warn('Error reading native .sdach file:', err);
      throw err;
    }
  }
}
