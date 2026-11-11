/**
 * Screenplay Tools Sheet Modal
 * Scripts by Darkchesa
 *
 * Implements the tools panel with offline vector Heroicons:
 * Find & Replace, Character Highlighting, Styles, Rebuild SmartType,
 * Title Page, Preview, Page Layout Toggle, and Revision/Stats.
 * Generously sized for comfortable mobile touch and selection.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { FONTS } from '../constants/theme';
import Heroicon from './Heroicon';

export default function ToolsModal({
  visible,
  onClose,
  onSelectTool,
  theme,
  stats = { wordCount: 0, pageCount: 1, sceneCount: 0 },
}) {
  const tools = [
    { id: 'find_replace', label: 'Find &\nReplace', iconName: 'magnifying-glass', color: '#1890FF' },
    { id: 'character_highlight', label: 'Character\nHighlighting', iconName: 'paint-brush', color: '#FAAD14' },
    { id: 'styles', label: 'Styles &\nFormatting', iconName: 'document-text', color: '#52C41A' },
    { id: 'rebuild_smarttype', label: 'Rebuild\nSmartType', iconName: 'bolt', color: '#722ED1' },
    { id: 'title_page', label: 'Title Page &\nMetadata', iconName: 'document-duplicate', color: '#13C2C2' },
    { id: 'preview', label: 'Screenplay\nPreview', iconName: 'eye', color: '#2F54EB' },
    { id: 'continuous_toggle', label: 'Page Layout\nToggle', iconName: 'book-open', color: '#EB2F96' },
    { id: 'revision', label: 'Stats &\nRevisions', iconName: 'chart-bar', color: '#FA541C' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Tools & Document Settings</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}
              accessibilityLabel="Close tools"
            >
              <Heroicon name="x-mark" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Grid of Tools with Heroicons */}
          <View style={styles.grid}>
            {tools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                onPress={() => {
                  onClose();
                  onSelectTool(tool.id);
                }}
                style={[styles.toolCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrapper, { backgroundColor: theme.surface }]}>
                  <Heroicon name={tool.iconName} size={24} color={tool.color} />
                </View>
                <Text style={[styles.toolLabel, { color: theme.text }]}>
                  {tool.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mini Stats Banner */}
          <View style={[styles.statsBanner, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.accent }]}>{stats.pageCount}</Text>
              <Text style={[styles.statTitle, { color: theme.textSecondary }]}>PAGES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.accent }]}>{stats.wordCount}</Text>
              <Text style={[styles.statTitle, { color: theme.textSecondary }]}>WORDS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.accent }]}>{stats.sceneCount}</Text>
              <Text style={[styles.statTitle, { color: theme.textSecondary }]}>SCENES</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
    maxHeight: '90%',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8E8E93',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  toolCard: {
    width: '23%',
    minWidth: 76,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: FONTS.ui,
    lineHeight: 16,
    fontWeight: '600',
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.courier,
  },
  statTitle: {
    fontSize: 10,
    letterSpacing: 1.0,
    marginTop: 2,
    fontFamily: FONTS.ui,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#3E3E4A',
  },
});
