/**
 * Screenplay Formatting Toolbar Component
 * Scripts by Darkchesa
 *
 * Dedicated screenplay toolbar placed above the keyboard for 1-tap
 * element transformation and SmartType character suggestions.
 * Sized generously for comfortable tapping and offline vector Heroicons.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { ELEMENT_TYPES } from '../types/screenplay';
import { FONTS } from '../constants/theme';
import Heroicon from './Heroicon';

const TOOLBAR_ITEMS = [
  { type: ELEMENT_TYPES.SCENE_HEADING, label: 'Scene Heading', short: 'SCENE' },
  { type: ELEMENT_TYPES.ACTION, label: 'Action', short: 'ACTION' },
  { type: ELEMENT_TYPES.CHARACTER, label: 'Character', short: 'CHAR' },
  { type: ELEMENT_TYPES.DIALOGUE, label: 'Dialogue', short: 'DIAL' },
  { type: ELEMENT_TYPES.PARENTHETICAL, label: 'Parenthetical', short: 'PAREN' },
  { type: ELEMENT_TYPES.TRANSITION, label: 'Transition', short: 'TRANS' },
];

export default function FormattingToolbar({
  activeType,
  onChangeElementType,
  smartTypeCharacters = [],
  onSelectSmartCharacter,
  onAddComment,
  theme,
}) {
  return (
    <View style={[styles.container, { backgroundColor: theme.toolbarBg, borderTopColor: theme.toolbarBorder }]}>
      {/* SmartType Character Autocomplete row (if typing character or characters exist) */}
      {smartTypeCharacters.length > 0 && (
        <View style={[styles.smartTypeRow, { borderBottomColor: theme.toolbarBorder }]}>
          <Text style={[styles.smartTypeLabel, { color: theme.textSecondary }]}>SMARTTYPE:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.smartTypeScroll}>
            {smartTypeCharacters.map((charName) => (
              <TouchableOpacity
                key={charName}
                onPress={() => onSelectSmartCharacter(charName)}
                style={[styles.smartTypePill, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.smartTypePillText, { color: theme.accent }]}>
                  {charName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Screenplay Element Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.elementsRow}
      >
        {TOOLBAR_ITEMS.map((item) => {
          const isActive = activeType === item.type;
          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => onChangeElementType(item.type)}
              style={[
                styles.elementBtn,
                isActive
                  ? [styles.activeElementBtn, { backgroundColor: theme.accent }]
                  : [styles.inactiveElementBtn, { backgroundColor: theme.surfaceSubtle }],
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Format as ${item.label}`}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.elementBtnText,
                  { color: isActive ? '#FFFFFF' : theme.text },
                ]}
              >
                {item.short}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Comment / Note Flag button */}
        {onAddComment && (
          <TouchableOpacity
            onPress={onAddComment}
            style={[styles.commentBtn, { backgroundColor: theme.surfaceSubtle }]}
            accessibilityLabel="Add note or comment"
            activeOpacity={0.75}
          >
            <Heroicon name="chat-bubble" size={17} color="#9254DE" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, color: '#9254DE', fontWeight: 'bold' }}>Note</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  smartTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  smartTypeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginRight: 8,
    fontFamily: FONTS.ui,
  },
  smartTypeScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smartTypePill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  smartTypePillText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: FONTS.courier,
  },
  elementsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  elementBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 9,
    minWidth: 68,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeElementBtn: {
    transform: [{ scale: 1.03 }],
  },
  inactiveElementBtn: {
    opacity: 0.9,
  },
  elementBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    letterSpacing: 0.6,
  },
  commentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9,
    minHeight: 42,
  },
});
