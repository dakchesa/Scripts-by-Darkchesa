/**
 * Find and Replace Screenplay Modal
 * Scripts by Darkchesa
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
} from 'react-native';
import { FONTS } from '../constants/theme';
import Heroicon from './Heroicon';

export default function FindReplaceModal({
  visible,
  onClose,
  elements,
  onChangeElements,
  theme,
}) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [feedback, setFeedback] = useState('');

  const countOccurrences = () => {
    if (!findText.trim()) return 0;
    let count = 0;
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(escapeRegex(findText), flags);
    elements.forEach((el) => {
      const matches = (el.text || '').match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  const handleReplaceAll = () => {
    if (!findText.trim()) {
      setFeedback('Enter text to find');
      return;
    }
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(escapeRegex(findText), flags);
    let totalReplaced = 0;

    const updated = elements.map((el) => {
      const text = el.text || '';
      const matches = text.match(regex);
      if (matches) {
        totalReplaced += matches.length;
        return {
          ...el,
          text: text.replace(regex, replaceText),
        };
      }
      return el;
    });

    if (totalReplaced > 0) {
      onChangeElements(updated);
      setFeedback(`Successfully replaced ${totalReplaced} occurrence(s).`);
    } else {
      setFeedback('No occurrences found.');
    }
  };

  const handleReplaceOne = () => {
    if (!findText.trim()) return;
    const flags = matchCase ? '' : 'i';
    const regex = new RegExp(escapeRegex(findText), flags);
    let replaced = false;

    const updated = elements.map((el) => {
      if (!replaced && regex.test(el.text || '')) {
        replaced = true;
        return {
          ...el,
          text: el.text.replace(regex, replaceText),
        };
      }
      return el;
    });

    if (replaced) {
      onChangeElements(updated);
      setFeedback('Replaced 1 occurrence.');
    } else {
      setFeedback('No more occurrences found.');
    }
  };

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const matchCount = countOccurrences();

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
            <Text style={[styles.title, { color: theme.text }]}>Find & Replace</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Heroicon name="x-mark" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Find input */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>FIND</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
            value={findText}
            onChangeText={(txt) => {
              setFindText(txt);
              setFeedback('');
            }}
            placeholder="Search text in script..."
            placeholderTextColor={theme.textSecondary}
            autoFocus
          />

          {/* Replace input */}
          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 12 }]}>REPLACE WITH</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
            value={replaceText}
            onChangeText={setReplaceText}
            placeholder="New text..."
            placeholderTextColor={theme.textSecondary}
          />

          {/* Match Case row */}
          <View style={styles.optionRow}>
            <Text style={[styles.optionLabel, { color: theme.text }]}>Match Case</Text>
            <Switch
              value={matchCase}
              onValueChange={setMatchCase}
              trackColor={{ false: theme.border, true: theme.accent }}
            />
          </View>

          {/* Matches status */}
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: matchCount > 0 ? theme.accent : theme.textSecondary }]}>
              {findText ? `${matchCount} match${matchCount === 1 ? '' : 'es'} found` : 'Enter search term'}
            </Text>
            {feedback ? (
              <Text style={[styles.feedbackText, { color: theme.success }]}>{feedback}</Text>
            ) : null}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleReplaceOne}
              disabled={matchCount === 0}
              style={[
                styles.btn,
                { backgroundColor: theme.surfaceSubtle },
                matchCount === 0 && styles.disabledBtn,
              ]}
            >
              <Text style={[styles.btnText, { color: theme.text }]}>Replace</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReplaceAll}
              disabled={matchCount === 0}
              style={[
                styles.btn,
                { backgroundColor: theme.accent },
                matchCount === 0 && styles.disabledBtn,
              ]}
            >
              <Text style={[styles.btnText, { color: '#FFFFFF', fontWeight: 'bold' }]}>
                Replace All
              </Text>
            </TouchableOpacity>
          </View>
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
    maxWidth: 420,
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
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    fontFamily: FONTS.ui,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: FONTS.courier,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: FONTS.ui,
  },
  statusRow: {
    marginTop: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONTS.ui,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  btnText: {
    fontSize: 15,
    fontFamily: FONTS.ui,
    fontWeight: '600',
  },
});
