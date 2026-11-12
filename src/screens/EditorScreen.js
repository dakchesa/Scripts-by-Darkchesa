/**
 * Main Script Editor Screen
 * Scripts by Darkchesa
 *
 * Coordinates the full Word-like mobile screenplay writing environment.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FONTS } from '../constants/theme';
import { ELEMENT_TYPES } from '../types/screenplay';
import {
  saveScript,
  loadScriptById,
} from '../services/storageService';
import {
  exportSdachFile,
  calculateWordCount,
  calculateEstimatedPages,
} from '../services/sdachFileService';
import { exportScreenplayPDF } from '../services/pdfService';
import { exportToFountain } from '../services/fountainService';

import TopToolbar from '../components/TopToolbar';
import ScreenplayEditor from '../components/ScreenplayEditor';
import FormattingToolbar from '../components/FormattingToolbar';
import ToolsModal from '../components/ToolsModal';
import FindReplaceModal from '../components/FindReplaceModal';
import CharacterHighlightModal from '../components/CharacterHighlightModal';
import ScriptPreviewModal from '../components/ScriptPreviewModal';
import ExportResultModal from '../components/ExportResultModal';
import PlotAPlotWorkspace from '../components/PlotAPlotWorkspace';

export default function EditorScreen({
  initialScript,
  onGoBack,
  theme,
  isDarkMode,
}) {
  const [script, setScript] = useState(initialScript);
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [paginationInfo, setPaginationInfo] = useState({ current: 1, total: 1 });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Modals state
  const [toolsModalVisible, setToolsModalVisible] = useState(false);
  const [findReplaceVisible, setFindReplaceVisible] = useState(false);
  const [highlightModalVisible, setHighlightModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [plotAPlotVisible, setPlotAPlotVisible] = useState(false);
  const [titlePageModalVisible, setTitlePageModalVisible] = useState(false);
  const [isContinuousView, setIsContinuousView] = useState(
    initialScript?.settings?.continuousView ?? true
  );
  const [enableHighlights, setEnableHighlights] = useState(
    initialScript?.settings?.enableCharacterHighlights ?? true
  );

  // Export Result Modal state
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportResultInfo, setExportResultInfo] = useState(null);

  // Debounced auto-save timer
  const autoSaveTimerRef = useRef(null);

  // Extract smart character names for SmartType
  const smartTypeCharacters = Array.from(
    new Set(
      script.elements
        .filter((el) => el.type === ELEMENT_TYPES.CHARACTER && el.text?.trim())
        .map((el) => el.text.trim())
    )
  );

  // Calculate live stats
  const totalWords = calculateWordCount(script.elements);
  const estimatedPages = calculateEstimatedPages(script.elements);
  const totalScenes = script.elements.filter(
    (el) => el.type === ELEMENT_TYPES.SCENE_HEADING
  ).length;

  /**
   * Handle updates to screenplay elements with undo history tracking
   */
  const handleElementsChange = useCallback(
    (newElements, recordHistory = true) => {
      if (recordHistory) {
        setUndoStack((prev) => [...prev.slice(-30), script.elements]);
        setRedoStack([]);
      }

      setScript((prev) => {
        const updated = {
          ...prev,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        };

        // Trigger debounced auto-save
        setSaveStatus('Saving...');
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(async () => {
          await saveScript(updated);
          setSaveStatus('Saved');
        }, 1200);

        return updated;
      });
    },
    [script.elements]
  );

  /**
   * Update script title
   */
  const handleUpdateTitle = (newTitle) => {
    setScript((prev) => {
      const updated = {
        ...prev,
        title: newTitle,
        updatedAt: new Date().toISOString(),
      };
      saveScript(updated);
      return updated;
    });
  };

  /**
   * Undo last operation
   */
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, undoStack.length - 1);
    setRedoStack((prev) => [...prev, script.elements]);
    setUndoStack(newUndo);
    handleElementsChange(previous, false);
  };

  /**
   * Redo previously undone operation
   */
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, redoStack.length - 1);
    setUndoStack((prev) => [...prev, script.elements]);
    setRedoStack(newRedo);
    handleElementsChange(next, false);
  };

  /**
   * Switch the element type of the currently active block
   */
  const handleChangeElementType = (newType) => {
    if (activeElementIndex === null || !script.elements[activeElementIndex]) return;

    const currentEl = script.elements[activeElementIndex];
    let newText = currentEl.text;

    if (
      newType === ELEMENT_TYPES.SCENE_HEADING ||
      newType === ELEMENT_TYPES.CHARACTER ||
      newType === ELEMENT_TYPES.TRANSITION
    ) {
      newText = newText.toUpperCase();
    }

    const updated = [...script.elements];
    updated[activeElementIndex] = {
      ...currentEl,
      type: newType,
      text: newText,
    };

    handleElementsChange(updated);
  };

  /**
   * Insert smart character name into active element
   */
  const handleSelectSmartCharacter = (charName) => {
    if (activeElementIndex === null || !script.elements[activeElementIndex]) return;

    const currentEl = script.elements[activeElementIndex];
    const updated = [...script.elements];
    updated[activeElementIndex] = {
      ...currentEl,
      type: ELEMENT_TYPES.CHARACTER,
      text: charName.toUpperCase(),
    };

    handleElementsChange(updated);
  };

  /**
   * Export to proprietary .sdach file
   */
  const handleExportSdach = async () => {
    try {
      const result = await exportSdachFile(script);
      if (result.success) {
        setExportResultInfo(result);
        setExportModalVisible(true);
      }
    } catch (err) {
      Alert.alert('Export Error', err.message);
    }
  };

  /**
   * Export to Hollywood Standard PDF
   */
  const handleExportPdf = async () => {
    try {
      const result = await exportScreenplayPDF(script, {
        includeTitlePage: true,
        showHighlights: enableHighlights,
      });
      if (result && result.success) {
        setExportResultInfo(result);
        setExportModalVisible(true);
      }
    } catch (err) {
      Alert.alert('PDF Export Error', err.message);
    }
  };

  /**
   * Export to Fountain text file
   */
  const handleExportFountain = async () => {
    const fountainText = exportToFountain(script);
    if (Platform.OS === 'web') {
      const blob = new Blob([fountainText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${script.title.replace(/\s+/g, '_')}.fountain`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Alert.alert('Fountain Script', fountainText.substring(0, 300) + '...');
    }
  };

  /**
   * Handle Tool Selection from ToolsModal
   */
  const handleSelectTool = (toolId) => {
    switch (toolId) {
      case 'plot_a_plot':
        setPlotAPlotVisible(true);
        break;
      case 'find_replace':
        setFindReplaceVisible(true);
        break;
      case 'character_highlight':
        setHighlightModalVisible(true);
        break;
      case 'preview':
        setPreviewModalVisible(true);
        break;
      case 'title_page':
        setTitlePageModalVisible(true);
        break;
      case 'continuous_toggle':
        setIsContinuousView((prev) => !prev);
        break;
      case 'rebuild_smarttype':
        Alert.alert(
          'SmartType Rebuilt',
          `Discovered ${smartTypeCharacters.length} character names: ${smartTypeCharacters.join(', ') || 'None yet'}`
        );
        break;
      case 'revision':
        Alert.alert(
          'Screenplay Statistics',
          `Total Pages: ~${estimatedPages}\nTotal Words: ${totalWords}\nTotal Scenes: ${totalScenes}\nTotal Elements: ${script.elements.length}`
        );
        break;
      case 'styles':
        Alert.alert(
          'Screenplay Formatting Standards',
          '• Scene Heading: ALL CAPS, location and time.\n• Action: Present tense description.\n• Character: ALL CAPS, centered.\n• Dialogue: Spoken words with standard margin indents.\n• Parenthetical: Acting direction in (parentheses).\n• Transition: ALL CAPS right-aligned (e.g. CUT TO:).'
        );
        break;
      default:
        break;
    }
  };

  const currentActiveType =
    script.elements[activeElementIndex]?.type || ELEMENT_TYPES.ACTION;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Action Toolbar */}
      <TopToolbar
        title={script.title}
        onUpdateTitle={handleUpdateTitle}
        onGoBack={async () => {
          await saveScript(script);
          onGoBack();
        }}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenTools={() => setToolsModalVisible(true)}
        onExportSdach={handleExportSdach}
        onExportPdf={handleExportPdf}
        saveStatus={saveStatus}
        pageInfo={paginationInfo}
        theme={theme}
      />

      {/* Main Screenplay Surface */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenplayEditor
          elements={script.elements}
          onChangeElements={handleElementsChange}
          activeElementIndex={activeElementIndex}
          setActiveElementIndex={setActiveElementIndex}
          characterPalette={script.characterPalette || {}}
          enableHighlights={enableHighlights}
          theme={theme}
          isContinuousView={isContinuousView}
          onPaginationChange={setPaginationInfo}
        />

        {/* Bottom Screenplay Element Formatting Bar */}
        <FormattingToolbar
          activeType={currentActiveType}
          onChangeElementType={handleChangeElementType}
          smartTypeCharacters={smartTypeCharacters}
          onSelectSmartCharacter={handleSelectSmartCharacter}
          theme={theme}
        />
      </KeyboardAvoidingView>

      {/* Tools Modal Sheet */}
      <ToolsModal
        visible={toolsModalVisible}
        onClose={() => setToolsModalVisible(false)}
        onSelectTool={handleSelectTool}
        theme={theme}
        stats={{ wordCount: totalWords, pageCount: estimatedPages, sceneCount: totalScenes }}
      />

      {/* Find and Replace Dialog */}
      <FindReplaceModal
        visible={findReplaceVisible}
        onClose={() => setFindReplaceVisible(false)}
        elements={script.elements}
        onChangeElements={handleElementsChange}
        theme={theme}
      />

      {/* Character Highlighting Dialog */}
      <CharacterHighlightModal
        visible={highlightModalVisible}
        onClose={() => setHighlightModalVisible(false)}
        elements={script.elements}
        characterPalette={script.characterPalette || {}}
        onUpdatePalette={(newPalette) => {
          setScript((prev) => ({
            ...prev,
            characterPalette: newPalette,
          }));
          saveScript({
            ...script,
            characterPalette: newPalette,
          });
        }}
        enableHighlights={enableHighlights}
        onToggleEnableHighlights={() => setEnableHighlights((prev) => !prev)}
        theme={theme}
      />

      {/* Screenplay Page Preview Modal */}
      <ScriptPreviewModal
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}
        script={script}
        onExportPdf={handleExportPdf}
        onExportSdach={handleExportSdach}
        theme={theme}
      />

      {/* Title Page Metadata Modal */}
      <Modal
        visible={titlePageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTitlePageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Title Page Metadata</Text>

            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>SCREENPLAY TITLE</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
              value={script.title}
              onChangeText={(txt) => setScript((prev) => ({ ...prev, title: txt }))}
            />

            <Text style={[styles.modalLabel, { color: theme.textSecondary, marginTop: 10 }]}>WRITTEN BY</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
              value={script.author}
              onChangeText={(txt) => setScript((prev) => ({ ...prev, author: txt }))}
            />

            <Text style={[styles.modalLabel, { color: theme.textSecondary, marginTop: 10 }]}>LOGLINE</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
              value={script.logline || ''}
              onChangeText={(txt) => setScript((prev) => ({ ...prev, logline: txt }))}
              placeholder="One or two sentence summary of the film..."
              placeholderTextColor={theme.textSecondary}
              multiline
            />

            <TouchableOpacity
              onPress={() => {
                saveScript(script);
                setTitlePageModalVisible(false);
              }}
              style={[styles.modalSaveBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Save Title Page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Export Result & Device Location Modal */}
      <ExportResultModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        fileInfo={exportResultInfo}
        theme={theme}
      />

      {/* Plot a Plot: Dan Harmon Story Circle Workspace */}
      <PlotAPlotWorkspace
        visible={plotAPlotVisible}
        onClose={() => setPlotAPlotVisible(false)}
        scriptTitle={script.title}
        initialStoryCircle={script.storyCircle}
        onUpdateStoryCircle={(updatedStoryCircle) => {
          setScript((prev) => {
            const nextScript = {
              ...prev,
              storyCircle: updatedStoryCircle,
              updatedAt: new Date().toISOString(),
            };
            saveScript(nextScript).catch(console.warn);
            return nextScript;
          });
        }}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: FONTS.ui,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    fontFamily: FONTS.ui,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONTS.ui,
  },
  modalSaveBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
});
