/**
 * Home Screen Dashboard
 * Scripts by Darkchesa
 *
 * Implements the document management dashboard with offline Heroicons,
 * generous touch targets, .sdach file persistence, and Export Result dialog.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { FONTS } from '../constants/theme';
import { TEMPLATES } from '../constants/templates';
import {
  getAllScripts,
  loadScriptById,
  saveScript,
  duplicateScript,
  deleteScript,
} from '../services/storageService';
import {
  pickAndOpenSdachFile,
  exportSdachFile,
} from '../services/sdachFileService';
import { exportScreenplayPDF } from '../services/pdfService';
import ScriptCard from '../components/ScriptCard';
import NewScriptModal from '../components/NewScriptModal';
import ExportResultModal from '../components/ExportResultModal';
import Heroicon from '../components/Heroicon';

export default function HomeScreen({
  onOpenScript,
  isDarkMode,
  onToggleTheme,
  theme,
}) {
  const [scripts, setScripts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Export Result Modal state
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportResultInfo, setExportResultInfo] = useState(null);

  useEffect(() => {
    loadScriptsList();
  }, []);

  const loadScriptsList = async () => {
    setIsLoading(true);
    try {
      const list = await getAllScripts();
      setScripts(list);
    } catch (err) {
      console.error('Error fetching scripts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Open an existing script in the editor
   */
  const handleOpenScript = async (scriptId) => {
    const fullScript = await loadScriptById(scriptId);
    if (fullScript) {
      onOpenScript(fullScript);
    } else {
      Alert.alert('Error', 'Unable to load script.');
    }
  };

  /**
   * Open .sdach file from phone/computer storage
   */
  const handleOpenSdachFile = async () => {
    try {
      setStatusMessage('Opening .sdach file...');
      const importedScript = await pickAndOpenSdachFile();
      if (!importedScript) {
        setStatusMessage('');
        return;
      }

      // Save imported script locally so it appears in recent scripts
      await saveScript(importedScript);
      await loadScriptsList();
      setStatusMessage('');

      // Open directly in the editor!
      onOpenScript(importedScript);
    } catch (err) {
      setStatusMessage('');
      Alert.alert(
        'Invalid .sdach File',
        err.message || 'The chosen file could not be recognized as a Scripts by Darkchesa (.sdach) file.'
      );
    }
  };

  /**
   * Create a new script from template
   */
  const handleCreateNewScript = async ({ title, author, templateId }) => {
    const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

    const newScript = {
      id: `script_${Date.now()}`,
      title,
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      characterPalette: {},
      settings: {
        theme: isDarkMode ? 'dark' : 'light',
        continuousView: true,
        fontSize: 13,
        showPageNumbers: true,
        enableCharacterHighlights: true,
      },
      elements: JSON.parse(JSON.stringify(template.elements)),
    };

    await saveScript(newScript);
    await loadScriptsList();
    onOpenScript(newScript);
  };

  /**
   * Export .sdach directly from list
   */
  const handleExportSdach = async (scriptId) => {
    const script = await loadScriptById(scriptId);
    if (!script) return;
    try {
      const result = await exportSdachFile(script);
      if (result.success) {
        setExportResultInfo(result);
        setExportModalVisible(true);
      }
    } catch (err) {
      Alert.alert('Export Error', err.message);
    }
  };

  /**
   * Export PDF directly from list
   */
  const handleExportPdf = async (scriptId) => {
    const script = await loadScriptById(scriptId);
    if (!script) return;
    try {
      const result = await exportScreenplayPDF(script);
      if (result && result.success) {
        setExportResultInfo(result);
        setExportModalVisible(true);
      }
    } catch (err) {
      Alert.alert('PDF Export Error', err.message);
    }
  };

  /**
   * Duplicate script
   */
  const handleDuplicate = async (scriptId) => {
    await duplicateScript(scriptId);
    await loadScriptsList();
  };

  /**
   * Delete script
   */
  const handleDelete = (scriptId) => {
    Alert.alert(
      'Delete Script',
      'Are you sure you want to delete this screenplay project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteScript(scriptId);
            await loadScriptsList();
          },
        },
      ]
    );
  };

  // Filter scripts by title or author
  const filteredScripts = scripts.filter((s) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = (s.title || '').toLowerCase().includes(query);
    const authorMatch = (s.author || '').toLowerCase().includes(query);
    return titleMatch || authorMatch;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* App Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/darkchesa-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View>
            <Text style={[styles.brandTitle, { color: theme.text }]}>Scripts by Darkchesa</Text>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
              Professional Screenplay Studio
            </Text>
          </View>
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity
          onPress={onToggleTheme}
          style={[styles.themeBtn, { backgroundColor: theme.surfaceSubtle }]}
          accessibilityLabel="Toggle Dark/Light Mode"
        >
          <Heroicon
            name={isDarkMode ? 'sun' : 'moon'}
            size={20}
            color={isDarkMode ? '#FFD591' : '#1890FF'}
          />
        </TouchableOpacity>
      </View>

      {/* Action Buttons: New Document & Open .sdach */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => setNewModalVisible(true)}
          style={[styles.newDocBtn, { backgroundColor: theme.accent }]}
          activeOpacity={0.8}
        >
          <Heroicon name="plus" size={20} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
          <Text style={styles.newDocText}>New Script</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOpenSdachFile}
          style={[styles.openSdachBtn, { backgroundColor: theme.surface, borderColor: theme.accent }]}
          activeOpacity={0.8}
        >
          <Heroicon name="folder-open" size={20} color={theme.accent} strokeWidth={2} style={{ marginRight: 6 }} />
          <Text style={[styles.openSdachText, { color: theme.accent }]}>Open .sdach File</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Heroicon name="magnifying-glass" size={19} color={theme.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search scripts by title or writer..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Heroicon name="x-mark" size={17} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {statusMessage ? (
        <View style={styles.statusBox}>
          <ActivityIndicator size="small" color={theme.accent} />
          <Text style={[styles.statusText, { color: theme.accent }]}>{statusMessage}</Text>
        </View>
      ) : null}

      {/* Scripts Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>RECENT SCRIPTS</Text>
        <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
          {filteredScripts.length} project{filteredScripts.length === 1 ? '' : 's'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading scripts...</Text>
        </View>
      ) : filteredScripts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Heroicon name="document-text" size={48} color={theme.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Screenplays Found</Text>
          <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
            {searchQuery
              ? `No scripts match "${searchQuery}"`
              : 'Create a new script or open an existing (.sdach) file to begin writing.'}
          </Text>

          <View style={styles.emptyActions}>
            <TouchableOpacity
              onPress={() => setNewModalVisible(true)}
              style={[styles.emptyActionBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>Create New Script</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenSdachFile}
              style={[styles.emptyActionBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
            >
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Open .sdach File</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredScripts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ScriptCard
              scriptMeta={item}
              onOpen={handleOpenScript}
              onExportSdach={handleExportSdach}
              onExportPdf={handleExportPdf}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              theme={theme}
            />
          )}
        />
      )}

      {/* New Script Modal */}
      <NewScriptModal
        visible={newModalVisible}
        onClose={() => setNewModalVisible(false)}
        onCreateScript={handleCreateNewScript}
        theme={theme}
      />

      {/* Export Result & Device Location Modal */}
      <ExportResultModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        fileInfo={exportResultInfo}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.ui,
    marginTop: 1,
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  newDocBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#DC143C',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  newDocText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  openSdachBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  openSdachText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.ui,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONTS.ui,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: FONTS.ui,
  },
  sectionCount: {
    fontSize: 12,
    fontFamily: FONTS.ui,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: FONTS.ui,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  emptyIconBox: {
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: FONTS.ui,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: FONTS.ui,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyActionBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
