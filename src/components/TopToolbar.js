/**
 * Top Toolbar Component
 * Scripts by Darkchesa
 *
 * Provides Word-like top action bar with document title,
 * pagination indicators, undo/redo, auto-save status, and export actions.
 * Sized generously for comfortable mobile touch and offline vector Heroicons.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { FONTS } from '../constants/theme';
import Heroicon from './Heroicon';

export default function TopToolbar({
  title,
  onUpdateTitle,
  onGoBack,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenTools,
  onExportSdach,
  onExportPdf,
  saveStatus = 'Saved',
  pageInfo = { current: 1, total: 1 },
  theme,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.toolbarBg, borderBottomColor: theme.toolbarBorder }]}>
      {/* Left section: Back button & Save indicator */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.iconButton}
          accessibilityLabel="Back to scripts"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heroicon name="chevron-left" size={26} color={theme.text} strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.saveBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: saveStatus === 'Saving...' ? theme.warning : theme.success },
            ]}
          />
          <Text style={[styles.saveStatusText, { color: theme.textSecondary }]}>
            {saveStatus}
          </Text>
        </View>
      </View>

      {/* Center section: Document title & Pagination indicator */}
      <View style={styles.centerSection}>
        <TouchableOpacity
          onPress={() => {
            setTempTitle(title);
            setIsEditingTitle(true);
          }}
          style={styles.titleTouch}
        >
          <Text style={[styles.docTitle, { color: theme.text }]} numberOfLines={1}>
            {title || 'Untitled Screenplay'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.paginationBadge, { color: theme.textSecondary }]}>
          ({pageInfo.current} of {pageInfo.total})
        </Text>
      </View>

      {/* Right section: Undo, Redo, Export, Tools */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={onUndo}
          disabled={!canUndo}
          style={[styles.actionIconBtn, !canUndo && styles.disabledBtn]}
          accessibilityLabel="Undo"
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        >
          <Heroicon
            name="arrow-uturn-left"
            size={20}
            color={canUndo ? theme.text : theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRedo}
          disabled={!canRedo}
          style={[styles.actionIconBtn, !canRedo && styles.disabledBtn]}
          accessibilityLabel="Redo"
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        >
          <Heroicon
            name="arrow-uturn-right"
            size={20}
            color={canRedo ? theme.text : theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowExportMenu(true)}
          style={[styles.exportBtn, { backgroundColor: theme.accent }]}
          accessibilityLabel="Export or Save"
          activeOpacity={0.8}
        >
          <Heroicon name="arrow-down-tray" size={15} color="#FFFFFF" strokeWidth={2.2} style={{ marginRight: 5 }} />
          <Text style={styles.exportBtnText}>SAVE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenTools}
          style={styles.toolsBtn}
          accessibilityLabel="Tools"
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        >
          <Heroicon name="cog-6-tooth" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Title Rename Modal */}
      <Modal
        visible={isEditingTitle}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingTitle(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>Rename Screenplay</Text>
            <TextInput
              style={[styles.titleInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}
              value={tempTitle}
              onChangeText={setTempTitle}
              autoFocus
              selectTextOnFocus
              placeholder="Script title..."
              placeholderTextColor={theme.textSecondary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsEditingTitle(false)}
                style={[styles.modalBtn, { backgroundColor: theme.surfaceSubtle }]}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveTitle}
                style={[styles.modalBtn, { backgroundColor: theme.accent }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Export & Save Action Sheet Modal */}
      <Modal
        visible={showExportMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExportMenu(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowExportMenu(false)}
        >
          <View style={[styles.sheetContent, { backgroundColor: theme.surface }]}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Save & Export Screenplay</Text>
            <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>
              {title}
            </Text>

            {/* Native .sdach Format Option */}
            <TouchableOpacity
              style={[styles.sheetOption, { backgroundColor: theme.surfaceSubtle }]}
              onPress={() => {
                setShowExportMenu(false);
                onExportSdach();
              }}
            >
              <View style={styles.optionIconContainer}>
                <Text style={styles.optionBadgeText}>.sdach</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  Save Native (.sdach) File
                </Text>
                <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                  Shows saved device location; stores full script to reopen on any phone or computer
                </Text>
              </View>
            </TouchableOpacity>

            {/* Hollywood PDF Export */}
            <TouchableOpacity
              style={[styles.sheetOption, { backgroundColor: theme.surfaceSubtle }]}
              onPress={() => {
                setShowExportMenu(false);
                onExportPdf();
              }}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: '#FF4D4F' }]}>
                <Text style={styles.optionBadgeText}>PDF</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  Export Screenplay PDF
                </Text>
                <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                  Standard Courier 12pt format, clean title page (no blank pages), and device location
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.border }]}
              onPress={() => setShowExportMenu(false)}
            >
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    height: 62,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 90,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 2,
  },
  saveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  saveStatusText: {
    fontSize: 12,
    fontFamily: FONTS.ui,
    fontWeight: '500',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  titleTouch: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    textAlign: 'center',
  },
  paginationBadge: {
    fontSize: 12,
    fontFamily: FONTS.courier,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  disabledBtn: {
    opacity: 0.35,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    marginLeft: 4,
    marginRight: 2,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    letterSpacing: 0.5,
  },
  toolsBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
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
    maxWidth: 400,
    borderRadius: 14,
    padding: 22,
    borderWidth: 1,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: FONTS.ui,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FONTS.ui,
    marginBottom: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#888888',
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  sheetSubtitle: {
    fontSize: 14,
    marginBottom: 18,
    fontFamily: FONTS.ui,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  optionIconContainer: {
    width: 54,
    height: 42,
    backgroundColor: '#DC143C',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: FONTS.courier,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 13,
    fontFamily: FONTS.ui,
    lineHeight: 17,
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
});
