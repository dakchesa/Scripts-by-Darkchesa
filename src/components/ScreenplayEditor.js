/**
 * Main Screenplay Editor Surface
 * Scripts by Darkchesa
 *
 * Implements a Microsoft Word-like page document writing environment
 * with permanent Courier typography, screenplay margin standards,
 * intelligent element switching, and character highlighting.
 */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { ELEMENT_TYPES, NEXT_ELEMENT_MAP, ELEMENT_PLACEHOLDERS } from '../types/screenplay';
import { FONTS, SCREENPLAY_DIMENSIONS } from '../constants/theme';
import { paginateElements, LINES_PER_PAGE } from '../utils/pagination';
import Heroicon from './Heroicon';

export default function ScreenplayEditor({
  elements,
  onChangeElements,
  activeElementIndex,
  setActiveElementIndex,
  characterPalette = {},
  enableHighlights = true,
  theme,
  onCommentEdit,
  isContinuousView = true,
  onPaginationChange,
}) {
  const inputRefs = useRef({});
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [tempCommentText, setTempCommentText] = useState('');

  // Dynamically compute pages based on standard screenplay line count as user types
  const pages = useMemo(() => {
    return paginateElements(elements, LINES_PER_PAGE);
  }, [elements]);

  // Report active page number and total pages to parent toolbar
  useEffect(() => {
    if (onPaginationChange) {
      const activePage =
        pages.find((p) => p.items.some((it) => it.index === activeElementIndex))
          ?.pageNumber || 1;
      onPaginationChange({ current: activePage, total: pages.length });
    }
  }, [pages, activeElementIndex, onPaginationChange]);

  // Auto-focus active element when index changes externally
  useEffect(() => {
    if (activeElementIndex !== null && inputRefs.current[activeElementIndex]) {
      inputRefs.current[activeElementIndex]?.focus();
    }
  }, [activeElementIndex]);

  /**
   * Handle text changes in a screenplay element
   */
  const handleTextChange = (text, index) => {
    const target = elements[index];
    if (!target) return;

    let processedText = text;

    // Intelligent auto-formatting per screenplay standard
    if (
      target.type === ELEMENT_TYPES.SCENE_HEADING ||
      target.type === ELEMENT_TYPES.CHARACTER ||
      target.type === ELEMENT_TYPES.TRANSITION
    ) {
      processedText = text.toUpperCase();
    }

    const updatedElements = [...elements];
    updatedElements[index] = {
      ...target,
      text: processedText,
    };

    onChangeElements(updatedElements);
  };

  /**
   * Intelligent Enter key handling:
   * Transitions seamlessly to the next logical screenplay element
   */
  const handleKeyPress = (e, index) => {
    const key = e.nativeEvent?.key;

    // Handle Enter / Return
    if (key === 'Enter') {
      const currentElement = elements[index];
      const nextType = NEXT_ELEMENT_MAP[currentElement.type] || ELEMENT_TYPES.ACTION;

      // Create new element right after current one
      const newElement = {
        id: `elem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: nextType,
        text: '',
        highlightColor: null,
      };

      const updatedElements = [
        ...elements.slice(0, index + 1),
        newElement,
        ...elements.slice(index + 1),
      ];

      onChangeElements(updatedElements);
      setActiveElementIndex(index + 1);

      // Focus the newly inserted element
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }

    // Handle Backspace on empty element (delete and step back)
    if (key === 'Backspace' && elements[index]?.text === '' && elements.length > 1) {
      const updatedElements = elements.filter((_, idx) => idx !== index);
      const prevIndex = Math.max(0, index - 1);
      onChangeElements(updatedElements);
      setActiveElementIndex(prevIndex);

      setTimeout(() => {
        inputRefs.current[prevIndex]?.focus();
      }, 50);
    }
  };

  /**
   * Insert new element directly below an existing one
   */
  const handleInsertBelow = (index) => {
    const current = elements[index];
    const nextType = NEXT_ELEMENT_MAP[current?.type] || ELEMENT_TYPES.ACTION;
    const newElement = {
      id: `elem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: nextType,
      text: '',
    };
    const updated = [
      ...elements.slice(0, index + 1),
      newElement,
      ...elements.slice(index + 1),
    ];
    onChangeElements(updated);
    setActiveElementIndex(index + 1);
  };

  /**
   * Open comment dialog for an element
   */
  const openCommentModal = (index) => {
    setEditingCommentIndex(index);
    setTempCommentText(elements[index]?.comment || '');
    setCommentModalVisible(true);
  };

  const saveComment = () => {
    if (editingCommentIndex !== null) {
      const updated = [...elements];
      updated[editingCommentIndex] = {
        ...updated[editingCommentIndex],
        comment: tempCommentText.trim() ? tempCommentText.trim() : null,
      };
      onChangeElements(updated);
    }
    setCommentModalVisible(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {pages.map((page, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <React.Fragment key={`page_wrapper_${page.pageNumber}`}>
            {/* Physical Screenplay Page Surface (Word-style document paper) */}
            <View
              style={[
                styles.pageSurface,
                {
                  backgroundColor: theme.pageBg,
                  shadowColor: theme.pageShadow,
                  borderColor: theme.pageBorder,
                },
              ]}
            >
              {/* Top Paper Header with Hollywood standard page number */}
              <View style={styles.pageHeaderDecoration}>
                <Text style={styles.pageRunningHeader}>SCRIPTS BY DARCHESA</Text>
                <Text style={styles.pageNumberTopRight}>
                  {page.pageNumber > 1 ? `${page.pageNumber}.` : '1.'}
                </Text>
              </View>

              {/* Screenplay Elements Flow on this page */}
              {page.items.map(({ element: el, index }) => {
                const isActive = activeElementIndex === index;
                const assignedCharColor =
                  el.type === ELEMENT_TYPES.CHARACTER
                    ? characterPalette[el.text?.trim()] || el.highlightColor
                    : el.highlightColor;

                const isHighlighted = enableHighlights && Boolean(assignedCharColor);

                return (
                  <View
                    key={el.id || `elem_${index}`}
                    style={[
                      styles.elementContainer,
                      getElementContainerStyle(el.type),
                      isActive && styles.activeElementContainer,
                    ]}
                  >
                    {/* Left indicator for Scene Headings */}
                    {el.type === ELEMENT_TYPES.SCENE_HEADING && (
                      <View style={styles.sceneNumberBadge}>
                        <Text style={styles.sceneNumberText}>{index + 1}</Text>
                      </View>
                    )}

                    {/* Text Input Block */}
                    <View
                      style={[
                        styles.inputWrapper,
                        getElementWrapperStyle(el.type),
                        isHighlighted && { backgroundColor: assignedCharColor, borderRadius: 3, paddingHorizontal: 4 },
                      ]}
                    >
                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        value={el.text}
                        onChangeText={(txt) => handleTextChange(txt, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => setActiveElementIndex(index)}
                        multiline
                        placeholder={ELEMENT_PLACEHOLDERS[el.type]}
                        placeholderTextColor="#B0B0B8"
                        style={[
                          styles.baseInput,
                          getElementTextStyle(el.type),
                          { color: theme.pageText },
                        ]}
                        scrollEnabled={false}
                        blurOnSubmit={false}
                      />
                    </View>

                    {/* Comment / Note Flag */}
                    {el.comment && (
                      <TouchableOpacity
                        onPress={() => openCommentModal(index)}
                        style={styles.commentFlag}
                        accessibilityLabel="Read note"
                      >
                        <Heroicon name="chat-bubble" size={18} color="#9254DE" />
                      </TouchableOpacity>
                    )}

                    {/* Quick Add block button when active */}
                    {isActive && (
                      <TouchableOpacity
                        onPress={() => handleInsertBelow(index)}
                        style={[styles.inlineAddBtn, { backgroundColor: 'rgba(220, 20, 60, 0.15)' }]}
                        accessibilityLabel="Insert block below"
                      >
                        <Heroicon name="plus" size={16} color={theme.accent} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}

              {/* End of Page marker (visible as user types) */}
              <View style={styles.pageEndFooter}>
                <View style={styles.pageEndLine} />
                <View style={styles.pageEndBadge}>
                  <Text style={styles.pageEndText}>
                    {isLastPage
                      ? `PAGE ${page.pageNumber} (${page.lineCount}/${LINES_PER_PAGE} lines)`
                      : `END OF PAGE ${page.pageNumber} (${page.lineCount}/${LINES_PER_PAGE} lines)`}
                  </Text>
                </View>
                <View style={styles.pageEndLine} />
              </View>
            </View>

            {/* Visual Page Break Between Pages - clearly showing the start of next page */}
            {!isLastPage && (
              <View style={styles.pageBreakGap}>
                <View style={[styles.pageBreakDividerLine, { borderColor: theme.border }]} />
                <View
                  style={[
                    styles.pageBreakPill,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.pageBreakPillText, { color: theme.accent }]}>
                    ✂ PAGE BREAK • START OF PAGE {page.pageNumber + 1}
                  </Text>
                </View>
                <View style={[styles.pageBreakDividerLine, { borderColor: theme.border }]} />
              </View>
            )}
          </React.Fragment>
        );
      })}

      {/* Comment / Note Modal */}
      <Modal
        visible={commentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Screenplay Note / Comment</Text>
            <TextInput
              style={[
                styles.modalTextInput,
                { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
              ]}
              value={tempCommentText}
              onChangeText={setTempCommentText}
              placeholder="e.g. Check rhythm here - beat pause"
              placeholderTextColor={theme.textSecondary}
              multiline
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                style={[styles.modalBtn, { backgroundColor: theme.surfaceSubtle }]}
              >
                <Text style={{ color: theme.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveComment}
                style={[styles.modalBtn, { backgroundColor: theme.accent }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/**
 * Styling helpers adhering to Hollywood screenplay standards
 */
function getElementContainerStyle(type) {
  switch (type) {
    case ELEMENT_TYPES.SCENE_HEADING:
      return { marginTop: 22, marginBottom: 6 };
    case ELEMENT_TYPES.ACTION:
      return { marginTop: 6, marginBottom: 8 };
    case ELEMENT_TYPES.CHARACTER:
      return { marginTop: 16, marginBottom: 2, alignItems: 'center' };
    case ELEMENT_TYPES.DIALOGUE:
      return { marginTop: 2, marginBottom: 8, alignItems: 'center' };
    case ELEMENT_TYPES.PARENTHETICAL:
      return { marginTop: 2, marginBottom: 2, alignItems: 'center' };
    case ELEMENT_TYPES.TRANSITION:
      return { marginTop: 14, marginBottom: 12, alignItems: 'flex-end' };
    default:
      return { marginTop: 6, marginBottom: 6 };
  }
}

function getElementWrapperStyle(type) {
  switch (type) {
    case ELEMENT_TYPES.SCENE_HEADING:
      return { width: '100%' };
    case ELEMENT_TYPES.ACTION:
      return { width: '100%' };
    case ELEMENT_TYPES.CHARACTER:
      // Character is centered / indented ~37% from left in standard screenplay
      return { width: '60%', alignSelf: 'center' };
    case ELEMENT_TYPES.DIALOGUE:
      // Dialogue is ~3.5" wide (approx 75% on mobile screen)
      return { width: '80%', alignSelf: 'center' };
    case ELEMENT_TYPES.PARENTHETICAL:
      return { width: '55%', alignSelf: 'center' };
    case ELEMENT_TYPES.TRANSITION:
      return { width: '60%', alignSelf: 'flex-end' };
    default:
      return { width: '100%' };
  }
}

function getElementTextStyle(type) {
  switch (type) {
    case ELEMENT_TYPES.SCENE_HEADING:
      return {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
      };
    case ELEMENT_TYPES.ACTION:
      return {
        lineHeight: 22,
        fontWeight: 'normal',
      };
    case ELEMENT_TYPES.CHARACTER:
      return {
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1.0,
      };
    case ELEMENT_TYPES.DIALOGUE:
      return {
        textAlign: 'left',
        lineHeight: 21,
      };
    case ELEMENT_TYPES.PARENTHETICAL:
      return {
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
      };
    case ELEMENT_TYPES.TRANSITION:
      return {
        textAlign: 'right',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
      };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pageSurface: {
    width: '100%',
    maxWidth: 680,
    minHeight: SCREENPLAY_DIMENSIONS.pageMinHeight,
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderRadius: 4,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  pageHeaderDecoration: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E6',
    paddingBottom: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageRunningHeader: {
    fontSize: 9,
    fontFamily: FONTS.courier,
    color: '#8E8E93',
    letterSpacing: 1.5,
  },
  pageNumberTopRight: {
    fontSize: 11,
    fontFamily: FONTS.courier,
    fontWeight: 'bold',
    color: '#666666',
  },
  elementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    minHeight: 26,
  },
  activeElementContainer: {
    backgroundColor: 'rgba(220, 20, 60, 0.05)',
    borderRadius: 4,
  },
  sceneNumberBadge: {
    position: 'absolute',
    left: -18,
    top: 2,
    paddingHorizontal: 3,
  },
  sceneNumberText: {
    fontSize: 10,
    fontFamily: FONTS.courier,
    color: '#999999',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flex: 1,
  },
  baseInput: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    lineHeight: 21,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  commentFlag: {
    marginLeft: 8,
    marginTop: 2,
    padding: 4,
    minWidth: 26,
    minHeight: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineAddBtn: {
    marginLeft: 8,
    marginTop: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageEndFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  pageEndLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E2E8',
  },
  pageEndBadge: {
    paddingHorizontal: 12,
  },
  pageEndText: {
    fontSize: 9,
    fontFamily: FONTS.courier,
    color: '#9E9EA6',
    letterSpacing: 1.0,
    fontWeight: 'bold',
  },
  pageBreakGap: {
    width: '100%',
    maxWidth: 680,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBreakDividerLine: {
    flex: 1,
    height: 1,
    borderWidth: 0.5,
    borderStyle: 'dashed',
  },
  pageBreakPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pageBreakPillText: {
    fontSize: 10,
    fontFamily: FONTS.ui,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: FONTS.ui,
  },
  modalTextInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    fontFamily: FONTS.ui,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
