/**
 * Character Highlighting Management Modal
 * Scripts by Darkchesa
 *
 * Implements the character color highlighting feature shown in the specification:
 * e.g. TANGLE in yellow, MOSSY in green.
 * Offline vector Heroicons, comfortable touch targets.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { FONTS, HIGHLIGHT_COLORS } from '../constants/theme';
import { ELEMENT_TYPES } from '../types/screenplay';
import Heroicon from './Heroicon';

export default function CharacterHighlightModal({
  visible,
  onClose,
  elements,
  characterPalette = {},
  onUpdatePalette,
  enableHighlights = true,
  onToggleEnableHighlights,
  theme,
}) {
  // Extract all distinct characters from screenplay elements
  const characters = Array.from(
    new Set(
      elements
        .filter((el) => el.type === ELEMENT_TYPES.CHARACTER && el.text?.trim())
        .map((el) => el.text.trim())
    )
  );

  const handleSelectColor = (charName, color) => {
    const updated = {
      ...characterPalette,
      [charName]: color,
    };
    onUpdatePalette(updated);
  };

  const handleRemoveColor = (charName) => {
    const updated = { ...characterPalette };
    delete updated[charName];
    onUpdatePalette(updated);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Character Highlighting</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Heroicon name="x-mark" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Toggle global highlighting */}
          <View style={[styles.globalToggleRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.globalToggleText, { color: theme.text }]}>
              Enable Highlights in Script
            </Text>
            <Switch
              value={enableHighlights}
              onValueChange={onToggleEnableHighlights}
              trackColor={{ false: theme.border, true: theme.accent }}
            />
          </View>

          {/* Characters list */}
          <ScrollView style={styles.charScroll} contentContainerStyle={styles.charList}>
            {characters.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No character elements found yet in this script.
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                  Add Character elements in the editor to assign colors.
                </Text>
              </View>
            ) : (
              characters.map((charName) => {
                const currentColor = characterPalette[charName] || null;

                return (
                  <View
                    key={charName}
                    style={[
                      styles.charCard,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}
                  >
                    <View style={styles.charHeader}>
                      <View style={styles.charBadge}>
                        <Text
                          style={[
                            styles.charName,
                            { color: theme.text },
                            currentColor && {
                              backgroundColor: currentColor,
                              paddingHorizontal: 10,
                              paddingVertical: 3,
                              borderRadius: 4,
                              color: '#111111',
                            },
                          ]}
                        >
                          {charName}
                        </Text>
                      </View>

                      {currentColor && (
                        <TouchableOpacity
                          onPress={() => handleRemoveColor(charName)}
                          style={styles.removeColorBtn}
                        >
                          <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: '600' }}>Clear</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Color Swatches */}
                    <View style={styles.swatchRow}>
                      {HIGHLIGHT_COLORS.map((colorObj) => {
                        const isSelected = currentColor === colorObj.value;
                        return (
                          <TouchableOpacity
                            key={colorObj.value}
                            onPress={() => handleSelectColor(charName, colorObj.value)}
                            style={[
                              styles.swatch,
                              { backgroundColor: colorObj.value },
                              isSelected && styles.selectedSwatch,
                            ]}
                            accessibilityLabel={colorObj.name}
                          >
                            {isSelected && (
                              <Heroicon name="check" size={16} color="#111111" strokeWidth={3} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.doneBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '82%',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  globalToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  globalToggleText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
  charScroll: {
    maxHeight: 380,
  },
  charList: {
    gap: 12,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: FONTS.ui,
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: FONTS.ui,
  },
  charCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  charHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  charBadge: {
    flexDirection: 'row',
  },
  charName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.courier,
  },
  removeColorBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  selectedSwatch: {
    borderWidth: 2.5,
    borderColor: '#111111',
    transform: [{ scale: 1.1 }],
  },
  doneBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
});
