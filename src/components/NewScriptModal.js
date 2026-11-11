/**
 * New Script Dialog Modal
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
} from 'react-native';
import { FONTS } from '../constants/theme';
import { TEMPLATES } from '../constants/templates';
import Heroicon from './Heroicon';

export default function NewScriptModal({
  visible,
  onClose,
  onCreateScript,
  theme,
}) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('blank');

  const handleCreate = () => {
    if (!title.trim()) return;

    onCreateScript({
      title: title.trim(),
      author: author.trim() || 'Anonymous',
      templateId: selectedTemplateId,
    });

    setTitle('');
    setAuthor('');
    setSelectedTemplateId('blank');
    onClose();
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
            <Text style={[styles.title, { color: theme.text }]}>New Screenplay</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Heroicon name="x-mark" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Title input */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>MOVIE / SCREENPLAY TITLE *</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. The Midnight Express"
            placeholderTextColor={theme.textSecondary}
            autoFocus
          />

          {/* Author input */}
          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>WRITTEN BY (OPTIONAL)</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
            value={author}
            onChangeText={setAuthor}
            placeholder="Screenwriter Name"
            placeholderTextColor={theme.textSecondary}
          />

          {/* Template Selection */}
          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>STARTING TEMPLATE</Text>
          <View style={styles.templatesList}>
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <TouchableOpacity
                  key={tmpl.id}
                  onPress={() => setSelectedTemplateId(tmpl.id)}
                  style={[
                    styles.templateCard,
                    { backgroundColor: theme.surfaceSubtle, borderColor: isSelected ? theme.accent : theme.border },
                    isSelected && { borderWidth: 2 },
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.templateHeader}>
                    <Text style={[styles.templateName, { color: theme.text }]}>
                      {tmpl.name}
                    </Text>
                    {isSelected && (
                      <Heroicon name="check" size={18} color={theme.accent} strokeWidth={2.4} />
                    )}
                  </View>
                  <Text style={[styles.templateDesc, { color: theme.textSecondary }]}>
                    {tmpl.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, { backgroundColor: theme.surfaceSubtle }]}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 15, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreate}
              disabled={!title.trim()}
              style={[
                styles.btn,
                { backgroundColor: theme.accent },
                !title.trim() && { opacity: 0.5 },
              ]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>Create Script</Text>
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
    maxWidth: 440,
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
    fontFamily: FONTS.ui,
  },
  templatesList: {
    gap: 10,
    marginTop: 6,
    marginBottom: 20,
  },
  templateCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  templateDesc: {
    fontSize: 12,
    marginTop: 3,
    fontFamily: FONTS.ui,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
