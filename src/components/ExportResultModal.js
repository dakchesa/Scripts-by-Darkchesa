/**
 * Export Result & File Location Modal
 * Scripts by Darkchesa
 *
 * Provides clear file confirmation, displays exact device target location,
 * and enables direct Open & Share operations across Web and Native mobile.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import Heroicon from './Heroicon';
import { FONTS } from '../constants/theme';

export default function ExportResultModal({
  visible,
  onClose,
  fileInfo,
  theme,
}) {
  const [copied, setCopied] = useState(false);

  if (!fileInfo) return null;

  const {
    type = 'pdf', // 'pdf' | 'sdach'
    title = 'Screenplay',
    filename = 'screenplay',
    location = 'Device Storage',
    fileUri = null,
    blobUrl = null,
    onOpenFile = null,
    onShareFile = null,
  } = fileInfo;

  const handleCopyLocation = () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(location);
      }
    } catch (e) {
      console.warn('Copy error:', e);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    if (onOpenFile) {
      onOpenFile();
      return;
    }

    if (Platform.OS === 'web') {
      if (blobUrl) {
        window.open(blobUrl, '_blank');
      } else {
        window.alert(`File is saved at: ${location}`);
      }
    } else {
      // Native Mobile: attempt to share or open with system intent
      try {
        const Sharing = require('expo-sharing');
        if (fileUri) {
          Sharing.shareAsync(fileUri, {
            mimeType: type === 'pdf' ? 'application/pdf' : 'application/json',
            dialogTitle: `Open ${filename}`,
          });
        }
      } catch (e) {
        console.warn('Native open error:', e);
      }
    }
  };

  const handleShare = async () => {
    if (onShareFile) {
      onShareFile();
      return;
    }

    if (Platform.OS === 'web') {
      try {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({
            title: `${title} - Scripts by Darkchesa`,
            text: `Screenplay: ${title} (${filename})`,
            url: blobUrl || window.location.href,
          });
          return;
        }
      } catch (shareErr) {
        if (shareErr.name !== 'AbortError') {
          console.warn('Web Share API error:', shareErr);
        }
      }
      // Fallback: copy location
      handleCopyLocation();
    } else {
      // Native Mobile
      try {
        const Sharing = require('expo-sharing');
        if (fileUri && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(fileUri, {
            mimeType: type === 'pdf' ? 'application/pdf' : 'application/json',
            dialogTitle: `Share ${filename}`,
            UTI: type === 'pdf' ? 'com.adobe.pdf' : 'public.json',
          });
        }
      } catch (e) {
        console.warn('Native share error:', e);
      }
    }
  };

  const isPdf = type === 'pdf';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Success Header */}
          <View style={styles.header}>
            <View style={[styles.successIconBadge, { backgroundColor: isPdf ? 'rgba(255, 77, 79, 0.15)' : 'rgba(82, 196, 26, 0.15)' }]}>
              <Heroicon
                name={isPdf ? 'document-arrow-down' : 'check'}
                size={28}
                color={isPdf ? '#FF4D4F' : '#52C41A'}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: theme.text }]}>
                {isPdf ? 'PDF Ready' : 'Screenplay Saved'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {isPdf ? 'Exported Hollywood PDF format' : 'Saved in native .sdach format'}
              </Text>
            </View>
          </View>

          {/* File Card & Location Details */}
          <View style={[styles.fileCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <View style={styles.fileNameRow}>
              <Heroicon name="document-text" size={20} color={theme.accent} />
              <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
                {filename}
              </Text>
            </View>

            <View style={styles.locationContainer}>
              <Text style={[styles.locationLabel, { color: theme.textSecondary }]}>
                LOCATION ON DEVICE:
              </Text>
              <View style={[styles.locationBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Heroicon name="folder" size={18} color={theme.textSecondary} style={{ marginRight: 6 }} />
                <Text style={[styles.locationText, { color: theme.text }]} numberOfLines={2} selectable>
                  {location}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCopyLocation}
              style={[styles.copyBtn, { borderColor: theme.border }]}
              accessibilityLabel="Copy file location"
            >
              <Heroicon
                name={copied ? 'check' : 'clipboard-check'}
                size={16}
                color={copied ? '#52C41A' : theme.textSecondary}
              />
              <Text style={[styles.copyBtnText, { color: copied ? '#52C41A' : theme.textSecondary }]}>
                {copied ? 'Location Copied!' : 'Copy Device Path'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons: Open, Share, Done */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={handleOpen}
              style={[styles.primaryActionBtn, { backgroundColor: theme.accent }]}
              accessibilityLabel="Open exported file"
            >
              <Heroicon name="arrow-top-right-on-square" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryActionText}>Open File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={[styles.secondaryActionBtn, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
              accessibilityLabel="Share file"
            >
              <Heroicon name="share" size={18} color={theme.text} style={{ marginRight: 6 }} />
              <Text style={[styles.secondaryActionText, { color: theme.text }]}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.doneBtn, { borderColor: theme.border }]}
          >
            <Text style={[styles.doneBtnText, { color: theme.textSecondary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  successIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: FONTS.ui,
  },
  fileCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  fileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  fileName: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.courier,
    flex: 1,
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
    fontFamily: FONTS.ui,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  locationText: {
    fontSize: 13,
    fontFamily: FONTS.courier,
    flex: 1,
    lineHeight: 18,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 2,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
  doneBtn: {
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
});
