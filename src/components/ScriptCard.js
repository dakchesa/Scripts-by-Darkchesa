/**
 * Script Card Dashboard Item
 * Scripts by Darkchesa
 *
 * Implements dashboard script cards with offline Heroicons,
 * generous touch targets, and quick action options.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { FONTS } from '../constants/theme';
import Heroicon from './Heroicon';

export default function ScriptCard({
  scriptMeta,
  onOpen,
  onExportSdach,
  onExportPdf,
  onDuplicate,
  onDelete,
  theme,
}) {
  const [menuVisible, setMenuVisible] = useState(false);

  const formattedDate = scriptMeta.updatedAt
    ? new Date(scriptMeta.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TouchableOpacity
        style={styles.cardMain}
        onPress={() => onOpen(scriptMeta.id)}
        activeOpacity={0.7}
      >
        {/* Document Heroicon */}
        <View style={[styles.iconBox, { backgroundColor: theme.accentLight }]}>
          <Heroicon name="document-text" size={24} color={theme.accent} />
        </View>

        {/* Script Details */}
        <View style={styles.details}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {scriptMeta.title || 'Untitled'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Modified by me {formattedDate}
          </Text>
          {scriptMeta.previewText ? (
            <Text style={[styles.previewSnippet, { color: theme.textSecondary }]} numberOfLines={1}>
              {scriptMeta.previewText}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* 3-Dots Action Button */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuBtn}
        accessibilityLabel="Script actions"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Heroicon name="ellipsis-vertical" size={22} color={theme.textSecondary} />
      </TouchableOpacity>

      {/* Script Options Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.menuHeader, { color: theme.text }]} numberOfLines={1}>
              {scriptMeta.title}
            </Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onOpen(scriptMeta.id);
              }}
            >
              <Heroicon name="pencil-square" size={20} color={theme.text} style={{ marginRight: 12 }} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>Open in Editor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onExportSdach(scriptMeta.id);
              }}
            >
              <Heroicon name="folder" size={20} color={theme.accent} style={{ marginRight: 12 }} />
              <Text style={[styles.menuItemText, { color: theme.accent }]}>Save .sdach File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onExportPdf(scriptMeta.id);
              }}
            >
              <Heroicon name="document-arrow-down" size={20} color="#FF4D4F" style={{ marginRight: 12 }} />
              <Text style={[styles.menuItemText, { color: '#FF4D4F' }]}>Export Screenplay PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onDuplicate(scriptMeta.id);
              }}
            >
              <Heroicon name="document-duplicate" size={20} color={theme.text} style={{ marginRight: 12 }} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>Duplicate Script</Text>
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onDelete(scriptMeta.id);
              }}
            >
              <Heroicon name="trash" size={20} color={theme.danger} style={{ marginRight: 12 }} />
              <Text style={[styles.menuItemText, { color: theme.danger }]}>Delete Script</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.ui,
    marginBottom: 2,
  },
  previewSnippet: {
    fontSize: 12,
    fontFamily: FONTS.courier,
    opacity: 0.8,
  },
  menuBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  menuHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 14,
    fontFamily: FONTS.ui,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3E3E4A',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
  menuDivider: {
    height: 1,
    marginVertical: 6,
  },
});
