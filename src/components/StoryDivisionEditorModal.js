/**
 * Story Division Editor Modal
 * Scripts by Darkchesa - "Plot a Plot"
 *
 * Implements Section 4 & Section 6 of Dan Harmon Story Circle specification:
 * - A. Story point title (Non-editable)
 * - B. Story description (multiline text editor)
 * - C. Character actions (optional description of what protagonist does)
 * - D. Important events (optional description of events, discoveries, conflicts)
 * - Progress Tracking Checkbox (TICK) control (manual completion tracking)
 * - E. Save changes
 * - F. Edit/reopen modifications
 * - G. Clear contents (with confirmation prompt)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { FONTS } from '../constants/theme';
import Heroicon from './Heroicon';

export default function StoryDivisionEditorModal({
  visible,
  onClose,
  division,
  onSaveDivision,
  onClearDivision,
  theme,
}) {
  const [description, setDescription] = useState('');
  const [characterActions, setCharacterActions] = useState('');
  const [importantEvents, setImportantEvents] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (division) {
      setDescription(division.description || '');
      setCharacterActions(division.characterActions || '');
      setImportantEvents(division.importantEvents || '');
      setCompleted(Boolean(division.completed));
    }
  }, [division, visible]);

  if (!division) return null;

  const handleSave = () => {
    onSaveDivision({
      ...division,
      description,
      characterActions,
      importantEvents,
      completed,
    });
    onClose();
  };

  const handleClear = () => {
    const doClear = () => {
      setDescription('');
      setCharacterActions('');
      setImportantEvents('');
      setCompleted(false);
      onClearDivision(division.id);
      onClose();
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to clear "${division.number}. ${division.title}"?`)) {
        doClear();
      }
    } else {
      Alert.alert(
        'Clear Story Point',
        `Are you sure you want to clear all entered plot information for "${division.number}. ${division.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: doClear },
        ]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.actBadge, { backgroundColor: division.color }]}>
                <Text style={styles.actBadgeText}>{division.number}</Text>
              </View>
              <View style={styles.headerTextGroup}>
                <Text style={[styles.storyPointTitle, { color: theme.text }]} numberOfLines={2}>
                  {division.number}. {division.title}
                </Text>
                <Text style={[styles.actLabel, { color: division.color }]}>
                  {division.act} • {division.layer}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}
              accessibilityLabel="Close editor"
            >
              <Heroicon name="x-mark" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Explanation Banner */}
          <View style={[styles.explanationBanner, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <Text style={[styles.explanationText, { color: theme.textSecondary }]}>
              {division.explanation}
            </Text>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Progress Tick Checkbox */}
            <TouchableOpacity
              onPress={() => setCompleted((prev) => !prev)}
              style={[
                styles.checkboxCard,
                {
                  backgroundColor: completed ? 'rgba(34, 197, 94, 0.12)' : theme.surfaceSubtle,
                  borderColor: completed ? '#22C55E' : theme.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxIcon, { backgroundColor: completed ? '#22C55E' : theme.surface }]}>
                {completed ? (
                  <Heroicon name="check" size={16} color="#FFFFFF" strokeWidth={2.5} />
                ) : null}
              </View>
              <View style={styles.checkboxTextGroup}>
                <Text style={[styles.checkboxTitle, { color: theme.text }]}>
                  {completed ? 'Written in Screenplay (Completed)' : 'Mark as Written in Screenplay'}
                </Text>
                <Text style={[styles.checkboxSubtitle, { color: theme.textSecondary }]}>
                  Tick when this story point has been drafted in the screenplay editor.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Input B: Story Description */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                STORY DESCRIPTION (WHAT HAPPENS AT THIS STAGE) *
              </Text>
              <TextInput
                style={[
                  styles.multilineInput,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Describe the story events, protagonist dilemma, and developments..."
                placeholderTextColor={theme.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Input C: Character Actions */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                CHARACTER ACTIONS (WHAT THE PROTAGONIST DOES)
              </Text>
              <TextInput
                style={[
                  styles.multilineInput,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.border,
                    color: theme.text,
                    minHeight: 70,
                  },
                ]}
                placeholder="Specific decisions, steps, mistakes, or actions taken by protagonist..."
                placeholderTextColor={theme.textSecondary}
                value={characterActions}
                onChangeText={setCharacterActions}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {/* Input D: Important Events */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                IMPORTANT EVENTS (DISCOVERIES, CONFLICTS, DECISIONS)
              </Text>
              <TextInput
                style={[
                  styles.multilineInput,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.border,
                    color: theme.text,
                    minHeight: 70,
                  },
                ]}
                placeholder="Key plot reveals, turning points, surprises, or stakes..."
                placeholderTextColor={theme.textSecondary}
                value={importantEvents}
                onChangeText={setImportantEvents}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Action Footer: Save, Clear, Cancel */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={handleClear}
              style={[styles.clearBtn, { borderColor: '#EF4444' }]}
              accessibilityLabel="Clear story point"
            >
              <Heroicon name="trash" size={16} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>

            <View style={styles.rightActions}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
              >
                <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: theme.accent }]}
                accessibilityLabel="Save story point changes"
              >
                <Heroicon name="check" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 580,
    maxHeight: '90%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  actBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actBadgeText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 18,
    fontFamily: FONTS.ui,
  },
  headerTextGroup: {
    flex: 1,
  },
  storyPointTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    lineHeight: 22,
  },
  actLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0.5,
    fontFamily: FONTS.ui,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationBanner: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONTS.ui,
    fontStyle: 'italic',
  },
  scrollArea: {
    maxHeight: 380,
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  checkboxIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxTextGroup: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  checkboxSubtitle: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: FONTS.ui,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    fontFamily: FONTS.ui,
  },
  multilineInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 85,
    fontFamily: FONTS.courier,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
});
