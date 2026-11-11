/**
 * Screenplay Page Preview Modal
 * Scripts by Darkchesa
 *
 * Full-fidelity screenplay reader & previewer simulating physical
 * pages with page numbers, exact margins, and Courier New 13 typography.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { FONTS } from '../constants/theme';
import { ELEMENT_TYPES } from '../types/screenplay';
import { paginateElements } from '../utils/pagination';
import Heroicon from './Heroicon';

export default function ScriptPreviewModal({
  visible,
  onClose,
  script,
  onExportPdf,
  onExportSdach,
  theme,
}) {
  const elements = script?.elements || [];
  const scriptPages = paginateElements(elements);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: '#1A1A22' }]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.8}>
            <Heroicon name="x-mark" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.backBtnText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.scriptTitleHeader} numberOfLines={1}>
            {script?.title}
          </Text>

          <View style={styles.actionsRight}>
            <TouchableOpacity
              onPress={() => {
                onClose();
                onExportSdach();
              }}
              style={[styles.actionPill, { backgroundColor: '#DC143C' }]}
              activeOpacity={0.8}
            >
              <Text style={styles.actionPillText}>.sdach</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose();
                onExportPdf();
              }}
              style={[styles.actionPill, { backgroundColor: '#FF4D4F' }]}
              activeOpacity={0.8}
            >
              <Text style={styles.actionPillText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Screenplay Paper Sheet */}
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={true}
        >
          {/* Title Page (Higher up on page, avoiding extra blank page) */}
          <View style={styles.paperPage}>
            <View style={styles.titlePageInner}>
              <View style={styles.titleCenterBlock}>
                <Text style={styles.previewTitleText}>{script?.title?.toUpperCase()}</Text>
                <Text style={styles.previewByline}>by</Text>
                <Text style={styles.previewAuthor}>{script?.author || 'Anonymous'}</Text>
              </View>

              <View style={styles.titleFooter}>
                <Text style={styles.titleFooterText}>Scripts by Darkchesa</Text>
                <Text style={styles.titleFooterText}>
                  {new Date(script?.updatedAt || Date.now()).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Screenplay Content Pages */}
          {scriptPages.map((page) => (
            <View key={`preview_page_${page.pageNumber}`} style={[styles.paperPage, { marginTop: 24 }]}>
              {/* Running Page Number Header */}
              <View style={styles.pageNumberRow}>
                <Text style={styles.pageNumberText}>{page.pageNumber}.</Text>
              </View>

              {/* Elements on this page */}
              {page.items.map((item) => {
                const el = item.element;
                let textStyle = styles.previewAction;
                let containerStyle = styles.elemContainer;

                switch (el.type) {
                  case ELEMENT_TYPES.SCENE_HEADING:
                    textStyle = styles.previewSceneHeading;
                    containerStyle = { marginTop: 18, marginBottom: 6 };
                    break;
                  case ELEMENT_TYPES.ACTION:
                    textStyle = styles.previewAction;
                    containerStyle = { marginTop: 6, marginBottom: 6 };
                    break;
                  case ELEMENT_TYPES.CHARACTER:
                    textStyle = styles.previewCharacter;
                    containerStyle = { marginTop: 14, marginBottom: 0, alignItems: 'center' };
                    break;
                  case ELEMENT_TYPES.DIALOGUE:
                    textStyle = styles.previewDialogue;
                    containerStyle = { marginTop: 0, marginBottom: 6, alignItems: 'center' };
                    break;
                  case ELEMENT_TYPES.PARENTHETICAL:
                    textStyle = styles.previewParenthetical;
                    containerStyle = { marginTop: 0, marginBottom: 0, alignItems: 'center' };
                    break;
                  case ELEMENT_TYPES.TRANSITION:
                    textStyle = styles.previewTransition;
                    containerStyle = { marginTop: 12, marginBottom: 12, alignItems: 'flex-end' };
                    break;
                  default:
                    textStyle = styles.previewAction;
                }

                return (
                  <View key={`prev_elem_${item.index}`} style={containerStyle}>
                    <Text
                      style={[
                        textStyle,
                        el.highlightColor && {
                          backgroundColor: el.highlightColor,
                          paddingHorizontal: 4,
                          borderRadius: 2,
                        },
                      ]}
                    >
                      {el.type === ELEMENT_TYPES.SCENE_HEADING ||
                      el.type === ELEMENT_TYPES.CHARACTER ||
                      el.type === ELEMENT_TYPES.TRANSITION
                        ? (el.text || '').toUpperCase()
                        : el.type === ELEMENT_TYPES.PARENTHETICAL && !el.text?.startsWith('(')
                        ? `(${el.text})`
                        : el.text}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121218',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C38',
    height: 58,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  scriptTitleHeader: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    maxWidth: 200,
  },
  actionsRight: {
    flexDirection: 'row',
    gap: 10,
  },
  actionPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionPillText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: FONTS.ui,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  paperPage: {
    width: '95%',
    maxWidth: 620,
    minHeight: 800,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    paddingHorizontal: 40,
    paddingVertical: 45,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  titlePageInner: {
    flex: 1,
    minHeight: 700,
    paddingTop: 100, // Higher up on the page
    alignItems: 'center',
    position: 'relative',
  },
  titleCenterBlock: {
    alignItems: 'center',
    width: '100%',
  },
  previewTitleText: {
    fontFamily: FONTS.courier,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  previewByline: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    marginBottom: 12,
    color: '#000000',
  },
  previewAuthor: {
    fontFamily: FONTS.courier,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  titleFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
  },
  titleFooterText: {
    fontFamily: FONTS.courier,
    fontSize: 11,
    color: '#666666',
  },
  pageNumberRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  pageNumberText: {
    fontFamily: FONTS.courier,
    fontSize: 12,
    color: '#000000',
  },
  elemContainer: {
    width: '100%',
  },
  previewSceneHeading: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
  },
  previewAction: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
  },
  previewCharacter: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '60%',
    color: '#000000',
  },
  previewDialogue: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    lineHeight: 18,
    width: '75%',
    textAlign: 'left',
    color: '#000000',
  },
  previewParenthetical: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    fontStyle: 'italic',
    width: '55%',
    textAlign: 'center',
    color: '#000000',
  },
  previewTransition: {
    fontFamily: FONTS.courier,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
    textTransform: 'uppercase',
    color: '#000000',
  },
});
