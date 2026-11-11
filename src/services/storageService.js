/**
 * Local Storage Service for Scripts & Projects
 * Scripts by Darkchesa
 *
 * Provides completely offline, local database-free persistence
 * for user screenplays and app settings.
 */

import Platform from '../utils/platform.js';
import { SAMPLE_TANGLE_AND_MOSS } from '../constants/templates.js';

const STORAGE_KEYS = {
  SCRIPTS_INDEX: '@darkchesa_scripts_index_v1',
  SCRIPT_PREFIX: '@darkchesa_script_',
  SETTINGS: '@darkchesa_settings_v1',
  LEGACY_INDEX: '@darchesa_scripts_index_v1',
  LEGACY_PREFIX: '@darchesa_script_',
};

// Cross-platform key-value storage helper
const memoryStorage = {};

const storageDriver = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return memoryStorage[key] || null;
      }
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },

  async setItem(key, value) {
    if (Platform.OS === 'web') {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        memoryStorage[key] = value;
        return;
      }
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },

  async removeItem(key) {
    if (Platform.OS === 'web') {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        delete memoryStorage[key];
        return;
      }
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem(key);
    } catch (e) {
      delete memoryStorage[key];
    }
  },
};

/**
 * Initialize repository with default sample project if first launch
 */
export async function initializeStorage() {
  try {
    let existingIndex = await storageDriver.getItem(STORAGE_KEYS.SCRIPTS_INDEX);
    if (!existingIndex) {
      // Check legacy index
      const legacyIndex = await storageDriver.getItem(STORAGE_KEYS.LEGACY_INDEX);
      if (legacyIndex) {
        await storageDriver.setItem(STORAGE_KEYS.SCRIPTS_INDEX, legacyIndex);
        existingIndex = legacyIndex;
      }
    }

    if (!existingIndex) {
      // Seed with initial sample script "Tangle and Moss"
      const initialList = [
        {
          id: SAMPLE_TANGLE_AND_MOSS.id,
          title: SAMPLE_TANGLE_AND_MOSS.title,
          author: SAMPLE_TANGLE_AND_MOSS.author,
          updatedAt: SAMPLE_TANGLE_AND_MOSS.updatedAt,
          elementsCount: SAMPLE_TANGLE_AND_MOSS.elements.length,
          previewText: 'EXT. HILLSIDE OVERLOOK - DUSK',
        },
      ];
      await storageDriver.setItem(STORAGE_KEYS.SCRIPTS_INDEX, JSON.stringify(initialList));
      await storageDriver.setItem(
        `${STORAGE_KEYS.SCRIPT_PREFIX}${SAMPLE_TANGLE_AND_MOSS.id}`,
        JSON.stringify(SAMPLE_TANGLE_AND_MOSS)
      );
    }
  } catch (err) {
    console.warn('Storage init warning:', err);
  }
}

/**
 * Get all saved script metadata for dashboard
 */
export async function getAllScripts() {
  await initializeStorage();
  try {
    const rawIndex = await storageDriver.getItem(STORAGE_KEYS.SCRIPTS_INDEX);
    return rawIndex ? JSON.parse(rawIndex) : [];
  } catch (err) {
    console.error('Error fetching scripts:', err);
    return [];
  }
}

/**
 * Load a full screenplay by its ID
 */
export async function loadScriptById(scriptId) {
  try {
    let raw = await storageDriver.getItem(`${STORAGE_KEYS.SCRIPT_PREFIX}${scriptId}`);
    if (!raw) {
      raw = await storageDriver.getItem(`${STORAGE_KEYS.LEGACY_PREFIX}${scriptId}`);
    }
    if (raw) {
      return JSON.parse(raw);
    }
    if (scriptId === SAMPLE_TANGLE_AND_MOSS.id) {
      return SAMPLE_TANGLE_AND_MOSS;
    }
    return null;
  } catch (err) {
    console.error(`Error loading script ${scriptId}:`, err);
    return null;
  }
}

/**
 * Save / Auto-save script locally
 */
export async function saveScript(script) {
  if (!script || !script.id) return false;

  try {
    const updatedScript = {
      ...script,
      updatedAt: new Date().toISOString(),
    };

    // Save full document
    await storageDriver.setItem(
      `${STORAGE_KEYS.SCRIPT_PREFIX}${script.id}`,
      JSON.stringify(updatedScript)
    );

    // Update index list
    const currentList = await getAllScripts();
    const existingIndex = currentList.findIndex((item) => item.id === script.id);

    const firstActionOrScene = script.elements.find(
      (e) => e.text && e.text.trim().length > 0
    );

    const metaEntry = {
      id: script.id,
      title: script.title,
      author: script.author || 'Anonymous',
      updatedAt: updatedScript.updatedAt,
      elementsCount: script.elements.length,
      previewText: firstActionOrScene ? firstActionOrScene.text.substring(0, 60) : '',
    };

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...currentList];
      updatedList[existingIndex] = metaEntry;
    } else {
      updatedList = [metaEntry, ...currentList];
    }

    // Sort by most recently updated
    updatedList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    await storageDriver.setItem(STORAGE_KEYS.SCRIPTS_INDEX, JSON.stringify(updatedList));
    return true;
  } catch (err) {
    console.error('Error saving script:', err);
    return false;
  }
}

/**
 * Duplicate an existing script
 */
export async function duplicateScript(scriptId) {
  const original = await loadScriptById(scriptId);
  if (!original) return null;

  const duplicated = {
    ...original,
    id: `script_${Date.now()}`,
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveScript(duplicated);
  return duplicated;
}

/**
 * Delete a script
 */
export async function deleteScript(scriptId) {
  try {
    await storageDriver.removeItem(`${STORAGE_KEYS.SCRIPT_PREFIX}${scriptId}`);
    const currentList = await getAllScripts();
    const filtered = currentList.filter((item) => item.id !== scriptId);
    await storageDriver.setItem(STORAGE_KEYS.SCRIPTS_INDEX, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Error deleting script:', err);
    return false;
  }
}
