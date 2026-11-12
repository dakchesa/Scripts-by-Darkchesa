/**
 * Dan Harmon Story Circle - "Plot a Plot" Workspace
 * Scripts by Darkchesa
 *
 * Implements the full interactive story-development environment:
 * - Top section: Title "Dan Harmon Story Circle", Back button, Save status, Export PDF button
 * - Main section: Large circular Story Circle visualization with selectable divisions & act legend
 * - Act Explanation Panel: Grouped into Act 1 (1 & 8), Act 2 (2 & 7), Act 3 (3, 4, 5, 6)
 * - Progress tracking: Overall story progress (e.g. 5/8 completed – 62.5%), progress bar, manual ticks
 * - Interactive division editor modal integration
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS } from '../constants/theme';
import Heroicon from './Heroicon';
import StoryCircleChart from './StoryCircleChart';
import StoryDivisionEditorModal from './StoryDivisionEditorModal';
import ExportResultModal from './ExportResultModal';
import {
  createDefaultStoryCircle,
  calculateStoryProgress,
  validateAndSanitizeStoryCircle,
} from '../types/storyCircle';
import { exportStoryCirclePDF } from '../services/storyCirclePdfService';

export default function PlotAPlotWorkspace({
  visible,
  onClose,
  scriptTitle = 'Untitled Screenplay',
  initialStoryCircle = null,
  onUpdateStoryCircle = () => {},
  theme,
}) {
  const windowDims = useWindowDimensions();
  const screenWidth = windowDims?.width || (typeof Dimensions !== 'undefined' ? Dimensions.get('window').width : 380);
  const chartSize = Math.max(260, Math.min(380, screenWidth - 48));

  const [storyCircle, setStoryCircle] = useState(() =>
    validateAndSanitizeStoryCircle(initialStoryCircle || createDefaultStoryCircle())
  );
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportResultInfo, setExportResultInfo] = useState(null);
  const [isEditingEndNotes, setIsEditingEndNotes] = useState(false);
  const [endNotesInput, setEndNotesInput] = useState(() => storyCircle?.theEndNotes || '');

  const scrollViewRef = useRef(null);
  const actLayouts = useRef({ act1: 0, act2: 0, act3: 0, theEnd: 0 });
  const [activeActNav, setActiveActNav] = useState('act1');

  const handleJumpToAct = (actKey) => {
    setActiveActNav(actKey);
    const targetY = actLayouts.current[actKey];
    if (typeof targetY === 'number' && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: Math.max(0, targetY - 10), animated: true });
    }
  };

  useEffect(() => {
    if (initialStoryCircle) {
      const sanitized = validateAndSanitizeStoryCircle(initialStoryCircle);
      setStoryCircle(sanitized);
      setEndNotesInput(sanitized.theEndNotes || '');
    }
  }, [initialStoryCircle, visible]);

  if (!visible) return null;

  const divisions = storyCircle.divisions || [];
  const progress = calculateStoryProgress(divisions);

  // Group divisions into Acts: Act 1 (1.1-1.8), Act 2 (2.1-2.8), Act 3 (3.1-3.8)
  const act1Divisions = divisions.filter((d) => d.act === 'ACT 1');
  const act2Divisions = divisions.filter((d) => d.act === 'ACT 2');
  const act3Divisions = divisions.filter((d) => d.act === 'ACT 3');

  const handleOpenDivisionEditor = (division) => {
    setSelectedDivision(division);
    setEditorModalVisible(true);
  };

  const handleSaveDivision = (updatedDivision) => {
    const updatedDivisions = divisions.map((d) =>
      d.id === updatedDivision.id ? updatedDivision : d
    );
    const updatedCircle = {
      ...storyCircle,
      updatedAt: new Date().toISOString(),
      divisions: updatedDivisions,
      progress: calculateStoryProgress(updatedDivisions),
    };
    setStoryCircle(updatedCircle);
    onUpdateStoryCircle(updatedCircle);
    setSaveStatus('Saved');
  };

  const handleClearDivision = (divisionId) => {
    const updatedDivisions = divisions.map((d) =>
      d.id === divisionId
        ? {
            ...d,
            description: '',
            characterActions: '',
            importantEvents: '',
            completed: false,
          }
        : d
    );
    const updatedCircle = {
      ...storyCircle,
      updatedAt: new Date().toISOString(),
      divisions: updatedDivisions,
      progress: calculateStoryProgress(updatedDivisions),
    };
    setStoryCircle(updatedCircle);
    onUpdateStoryCircle(updatedCircle);
    setSaveStatus('Saved');
  };

  const handleToggleDivisionCompletion = (divisionId) => {
    const updatedDivisions = divisions.map((d) =>
      d.id === divisionId ? { ...d, completed: !d.completed } : d
    );
    const updatedCircle = {
      ...storyCircle,
      updatedAt: new Date().toISOString(),
      divisions: updatedDivisions,
      progress: calculateStoryProgress(updatedDivisions),
    };
    setStoryCircle(updatedCircle);
    onUpdateStoryCircle(updatedCircle);
    setSaveStatus('Saved');
  };

  const handleSaveEndNotes = () => {
    const updatedCircle = {
      ...storyCircle,
      updatedAt: new Date().toISOString(),
      theEndNotes: endNotesInput,
    };
    setStoryCircle(updatedCircle);
    onUpdateStoryCircle(updatedCircle);
    setIsEditingEndNotes(false);
    setSaveStatus('Saved');
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      const res = await exportStoryCirclePDF(scriptTitle, storyCircle);
      if (res && res.success) {
        setExportResultInfo(res);
        setExportModalVisible(true);
      } else if (res && !res.success && !res.cancelled) {
        Alert.alert('PDF Export Error', res.error || 'Failed to export Story Circle PDF');
      }
    } catch (err) {
      Alert.alert('PDF Export Error', err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const renderStoryDivisionCard = (d) => {
    const hasContent = Boolean(d.description || d.characterActions || d.importantEvents);
    return (
      <View
        key={`div_card_${d.id}`}
        style={[
          styles.divisionCard,
          {
            backgroundColor: theme.surfaceSubtle,
            borderColor: d.completed ? '#22C55E' : theme.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          {/* Number / Code badge */}
          <View style={[styles.cardBadge, { backgroundColor: d.color }]}>
            <Text style={styles.cardBadgeText}>{d.code || d.number}</Text>
          </View>

          {/* Title & subtitle */}
          <View style={styles.cardTitleBox}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {d.code} {d.stageName || d.title}
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Stage {d.stage}: {d.subtitle}
            </Text>
          </View>

          {/* Completion Checkbox Button */}
          <TouchableOpacity
            onPress={() => handleToggleDivisionCompletion(d.id)}
            style={[
              styles.cardCheckbox,
              {
                backgroundColor: d.completed ? '#22C55E' : theme.surface,
                borderColor: d.completed ? '#22C55E' : theme.border,
              },
            ]}
            accessibilityLabel={`Toggle completion for ${d.title}`}
          >
            {d.completed ? (
              <Heroicon name="check" size={15} color="#FFFFFF" strokeWidth={2.5} />
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Written standard explanation */}
        <Text style={[styles.cardExplanation, { color: theme.textSecondary }]}>
          {d.explanation}
        </Text>

        {/* User's story information */}
        {hasContent ? (
          <View style={[styles.userContentBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {d.description ? (
              <View style={styles.contentItem}>
                <Text style={[styles.contentItemLabel, { color: theme.textSecondary }]}>
                  STORY DESCRIPTION:
                </Text>
                <Text style={[styles.contentItemText, { color: theme.text }]}>
                  {d.description}
                </Text>
              </View>
            ) : null}

            {d.characterActions ? (
              <View style={styles.contentItem}>
                <Text style={[styles.contentItemLabel, { color: theme.textSecondary }]}>
                  CHARACTER ACTIONS:
                </Text>
                <Text style={[styles.contentItemText, { color: theme.text }]}>
                  {d.characterActions}
                </Text>
              </View>
            ) : null}

            {d.importantEvents ? (
              <View style={styles.contentItem}>
                <Text style={[styles.contentItemLabel, { color: theme.textSecondary }]}>
                  IMPORTANT EVENTS:
                </Text>
                <Text style={[styles.contentItemText, { color: theme.text }]}>
                  {d.importantEvents}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => handleOpenDivisionEditor(d)}
            style={[styles.emptyPromptBtn, { borderColor: theme.border }]}
          >
            <Heroicon name="pencil-square" size={16} color={theme.accent} style={{ marginRight: 6 }} />
            <Text style={[styles.emptyPromptText, { color: theme.accent }]}>
              Enter plot points & character actions...
            </Text>
          </TouchableOpacity>
        )}

        {/* Edit Button */}
        <View style={styles.cardFooter}>
          <View style={styles.statusPill}>
            <Text style={[styles.statusPillText, { color: d.completed ? '#22C55E' : theme.textSecondary }]}>
              {d.completed ? '✓ WRITTEN IN SCRIPT' : 'PENDING SCRIPT DRAFT'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleOpenDivisionEditor(d)}
            style={[styles.editBtn, { backgroundColor: theme.accent }]}
            accessibilityLabel={`Edit ${d.title}`}
          >
            <Heroicon name="pencil-square" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {/* Top Header Section */}
      <View style={[styles.topHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.topHeaderLeft}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.backBtn, { backgroundColor: theme.surfaceSubtle }]}
            accessibilityLabel="Back to screenplay"
          >
            <Heroicon name="chevron-left" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>
              Dan Harmon Expanded Story Circle
            </Text>
            <Text style={[styles.screenplaySubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
              {scriptTitle} &bull; <Text style={{ fontStyle: 'italic' }}>Feeling stuck? Craft a Plot.</Text>
            </Text>
          </View>
        </View>

        <View style={styles.topHeaderRight}>
          {/* Save status */}
          <View style={styles.saveStatusBadge}>
            <View style={[styles.saveStatusDot, { backgroundColor: '#22C55E' }]} />
            <Text style={[styles.saveStatusText, { color: theme.textSecondary }]}>
              {saveStatus}
            </Text>
          </View>

          {/* Export PDF Button */}
          <TouchableOpacity
            onPress={handleExportPdf}
            disabled={isExporting}
            style={[styles.exportPdfBtn, { backgroundColor: theme.accent }]}
            accessibilityLabel="Export Story Circle PDF"
          >
            <Heroicon name="arrow-down-tray" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.exportPdfBtnText}>
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Section: Story Circle Visualization */}
        <View style={[styles.chartSectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.sectionTitleRow}>
            <Heroicon name="story-circle" size={22} color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              DAN HARMON EXPANDED STORY CIRCLE
            </Text>
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Tap any division badge or segment on the circle to view and write plot developments.
          </Text>

          <StoryCircleChart
            divisions={divisions}
            selectedDivisionId={selectedDivision?.id}
            onSelectDivision={handleOpenDivisionEditor}
            size={chartSize}
            theme={theme}
          />
        </View>

        {/* Overall Progress Tracking Banner */}
        <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressTitle, { color: theme.text }]}>
                Dan Harmon Expanded Story Circle Progress
              </Text>
              <Text style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
                {progress.formatted}
              </Text>
            </View>
            <View style={styles.progressStatBox}>
              <Text style={[styles.progressBigPercent, { color: '#22C55E' }]}>
                {progress.percentage}%
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarTrack, { backgroundColor: theme.surfaceSubtle }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress.percentage}%`, backgroundColor: '#22C55E' },
              ]}
            />
          </View>

          {/* Quick Checkbox Indicators: 3 Rows for Act 1, Act 2, and Act 3 */}
          <View style={styles.quickIndicatorsContainer}>
            {/* Act 1 row (1.1 - 1.8) */}
            <View style={styles.quickRowHeader}>
              <Text style={[styles.quickRowTitle, { color: '#22C55E' }]}>ACT 1 &bull; THE BEGINNING (1.1 - 1.8)</Text>
            </View>
            <View style={styles.quickIndicatorsRow}>
              {act1Divisions.map((d) => (
                <TouchableOpacity
                  key={`ind_${d.id}`}
                  onPress={() => handleToggleDivisionCompletion(d.id)}
                  style={[
                    styles.quickIndicatorBtn,
                    {
                      backgroundColor: d.completed ? '#22C55E' : theme.surfaceSubtle,
                      borderColor: '#22C55E',
                    },
                  ]}
                  accessibilityLabel={`Toggle step ${d.code}`}
                >
                  <Text
                    style={[
                      styles.quickIndicatorText,
                      { color: d.completed ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {d.completed ? '✓' : d.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Act 2 row (2.1 - 2.8) */}
            <View style={[styles.quickRowHeader, { marginTop: 6 }]}>
              <Text style={[styles.quickRowTitle, { color: '#EAB308' }]}>ACT 2 &bull; THE MIDDLE (2.1 - 2.8)</Text>
            </View>
            <View style={styles.quickIndicatorsRow}>
              {act2Divisions.map((d) => (
                <TouchableOpacity
                  key={`ind_${d.id}`}
                  onPress={() => handleToggleDivisionCompletion(d.id)}
                  style={[
                    styles.quickIndicatorBtn,
                    {
                      backgroundColor: d.completed ? '#FACC15' : theme.surfaceSubtle,
                      borderColor: '#FACC15',
                    },
                  ]}
                  accessibilityLabel={`Toggle step ${d.code}`}
                >
                  <Text
                    style={[
                      styles.quickIndicatorText,
                      { color: d.completed ? '#0F172A' : theme.text },
                    ]}
                  >
                    {d.completed ? '✓' : d.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Act 3 row (3.1 - 3.8) */}
            <View style={[styles.quickRowHeader, { marginTop: 6 }]}>
              <Text style={[styles.quickRowTitle, { color: '#EF4444' }]}>ACT 3 &bull; THE CLIMAX (3.1 - 3.8)</Text>
            </View>
            <View style={styles.quickIndicatorsRow}>
              {act3Divisions.map((d) => (
                <TouchableOpacity
                  key={`ind_${d.id}`}
                  onPress={() => handleToggleDivisionCompletion(d.id)}
                  style={[
                    styles.quickIndicatorBtn,
                    {
                      backgroundColor: d.completed ? '#EF4444' : theme.surfaceSubtle,
                      borderColor: '#EF4444',
                    },
                  ]}
                  accessibilityLabel={`Toggle step ${d.code}`}
                >
                  <Text
                    style={[
                      styles.quickIndicatorText,
                      { color: d.completed ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {d.completed ? '✓' : d.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Quick Act Jump Bar: ACT 1, ACT 2, ACT 3 & THE END placed side by side */}
        <View style={[styles.actNavCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.actNavHeaderRow}>
            <Heroicon name="bolt" size={13} color={theme.accent} style={{ marginRight: 5 }} />
            <Text style={[styles.actNavHeaderTitle, { color: theme.textSecondary }]}>
              QUICK JUMP TO ACT BREAKDOWN
            </Text>
          </View>
          <View style={styles.actNavRow}>
            {/* ACT 1 Button */}
            <TouchableOpacity
              onPress={() => handleJumpToAct('act1')}
              style={[
                styles.actNavBtn,
                {
                  backgroundColor: activeActNav === 'act1' ? 'rgba(34, 197, 94, 0.18)' : theme.surfaceSubtle,
                  borderColor: '#22C55E',
                },
              ]}
              activeOpacity={0.7}
              accessibilityLabel="Jump directly to Act 1 breakdown"
            >
              <View style={[styles.actNavDot, { backgroundColor: '#22C55E' }]} />
              <Text style={[styles.actNavBtnText, { color: '#22C55E' }]}>ACT 1</Text>
              <Text style={[styles.actNavBtnSub, { color: theme.textSecondary }]}>1.1 - 1.8</Text>
            </TouchableOpacity>

            {/* ACT 2 Button */}
            <TouchableOpacity
              onPress={() => handleJumpToAct('act2')}
              style={[
                styles.actNavBtn,
                {
                  backgroundColor: activeActNav === 'act2' ? 'rgba(250, 204, 21, 0.2)' : theme.surfaceSubtle,
                  borderColor: '#FACC15',
                },
              ]}
              activeOpacity={0.7}
              accessibilityLabel="Jump directly to Act 2 breakdown"
            >
              <View style={[styles.actNavDot, { backgroundColor: '#FACC15' }]} />
              <Text style={[styles.actNavBtnText, { color: '#EAB308' }]}>ACT 2</Text>
              <Text style={[styles.actNavBtnSub, { color: theme.textSecondary }]}>2.1 - 2.8</Text>
            </TouchableOpacity>

            {/* ACT 3 Button */}
            <TouchableOpacity
              onPress={() => handleJumpToAct('act3')}
              style={[
                styles.actNavBtn,
                {
                  backgroundColor: activeActNav === 'act3' ? 'rgba(239, 68, 68, 0.18)' : theme.surfaceSubtle,
                  borderColor: '#EF4444',
                },
              ]}
              activeOpacity={0.7}
              accessibilityLabel="Jump directly to Act 3 breakdown"
            >
              <View style={[styles.actNavDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.actNavBtnText, { color: '#EF4444' }]}>ACT 3</Text>
              <Text style={[styles.actNavBtnSub, { color: theme.textSecondary }]}>3.1 - 3.8</Text>
            </TouchableOpacity>

            {/* THE END Button */}
            <TouchableOpacity
              onPress={() => handleJumpToAct('theEnd')}
              style={[
                styles.actNavBtn,
                {
                  backgroundColor: activeActNav === 'theEnd' ? 'rgba(244, 114, 182, 0.22)' : theme.surfaceSubtle,
                  borderColor: '#F472B6',
                },
              ]}
              activeOpacity={0.7}
              accessibilityLabel="Jump directly to The End resolution"
            >
              <View style={[styles.actNavDot, { backgroundColor: '#F472B6' }]} />
              <Text style={[styles.actNavBtnText, { color: '#DB2777' }]}>THE END</Text>
              <Text style={[styles.actNavBtnSub, { color: theme.textSecondary }]}>Climax</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Act Breakdowns & Story Details */}
        <View style={styles.actsSection}>
          <Text style={[styles.actsSectionHeader, { color: theme.text }]}>
            ACT BREAKDOWNS &amp; STORY DETAILS
          </Text>

          {/* ACT 1 - GREEN: THE BEGINNING */}
          <View
            style={styles.actGroup}
            onLayout={(e) => {
              actLayouts.current['act1'] = e.nativeEvent.layout.y;
            }}
          >
            <View style={[styles.actBanner, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22C55E' }]}>
              <View style={[styles.actColorBar, { backgroundColor: '#22C55E' }]} />
              <View>
                <Text style={[styles.actBannerTitle, { color: '#22C55E' }]}>
                  ACT 1 &ndash; GREEN: THE BEGINNING
                </Text>
                <Text style={[styles.actBannerDesc, { color: theme.textSecondary }]}>
                  Outer Circle (Green) &bull; Divisions 1.1 to 1.8: Ordinary world, desire, crossing into the journey.
                </Text>
              </View>
            </View>
            {act1Divisions.map(renderStoryDivisionCard)}
          </View>

          {/* ACT 2 - YELLOW: THE MIDDLE */}
          <View
            style={styles.actGroup}
            onLayout={(e) => {
              actLayouts.current['act2'] = e.nativeEvent.layout.y;
            }}
          >
            <View style={[styles.actBanner, { backgroundColor: 'rgba(250, 204, 21, 0.18)', borderColor: '#FACC15' }]}>
              <View style={[styles.actColorBar, { backgroundColor: '#FACC15' }]} />
              <View>
                <Text style={[styles.actBannerTitle, { color: '#EAB308' }]}>
                  ACT 2 &ndash; YELLOW: THE MIDDLE
                </Text>
                <Text style={[styles.actBannerDesc, { color: theme.textSecondary }]}>
                  Second Circle (Yellow) &bull; Divisions 2.1 to 2.8: Unfamiliar territory, rising trials, midpoint breakthrough, and crisis.
                </Text>
              </View>
            </View>
            {act2Divisions.map(renderStoryDivisionCard)}
          </View>

          {/* ACT 3 - RED: THE CLIMAX */}
          <View
            style={styles.actGroup}
            onLayout={(e) => {
              actLayouts.current['act3'] = e.nativeEvent.layout.y;
            }}
          >
            <View style={[styles.actBanner, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' }]}>
              <View style={[styles.actColorBar, { backgroundColor: '#EF4444' }]} />
              <View>
                <Text style={[styles.actBannerTitle, { color: '#EF4444' }]}>
                  ACT 3 &ndash; RED: THE CLIMAX
                </Text>
                <Text style={[styles.actBannerDesc, { color: theme.textSecondary }]}>
                  Third Circle (Red) &bull; Divisions 3.1 to 3.8: Confrontation, decisive adaptation, heavy sacrifice, and master transformation.
                </Text>
              </View>
            </View>
            {act3Divisions.map(renderStoryDivisionCard)}
          </View>

          {/* THE END */}
          <View
            style={styles.actGroup}
            onLayout={(e) => {
              actLayouts.current['theEnd'] = e.nativeEvent.layout.y;
            }}
          >
            <View style={[styles.actBanner, { backgroundColor: 'rgba(244, 114, 182, 0.18)', borderColor: '#F472B6' }]}>
              <View style={[styles.actColorBar, { backgroundColor: '#EC4899' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.actBannerTitle, { color: '#DB2777' }]}>
                  THE END
                </Text>
                <Text style={[styles.actBannerDesc, { color: theme.textSecondary }]}>
                  Centre Circle (PINK) &bull; The ultimate destination, final thematic resolution, and the permanent new normal.
                </Text>
              </View>
            </View>

            {/* Central Resolution Card */}
            <View
              style={[
                styles.divisionCard,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: '#F472B6',
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardBadge, { backgroundColor: '#F472B6' }]}>
                  <Text style={[styles.cardBadgeText, { color: '#0F172A', fontSize: 11 }]}>END</Text>
                </View>

                <View style={styles.cardTitleBox}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    THE END &bull; CENTRAL RESOLUTION
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                    Centre Circle of the Expanded Story Circle
                  </Text>
                </View>
              </View>

              <Text style={[styles.cardExplanation, { color: theme.textSecondary }]}>
                The ultimate destination and complete thematic resolution at the exact centre of the chart. How has the protagonist and their world permanently changed?
              </Text>

              {isEditingEndNotes ? (
                <View style={{ marginTop: 8 }}>
                  <TextInput
                    style={[
                      styles.endNotesInput,
                      {
                        backgroundColor: theme.surface,
                        borderColor: '#F472B6',
                        color: theme.text,
                      },
                    ]}
                    multiline
                    value={endNotesInput}
                    onChangeText={setEndNotesInput}
                    placeholder="Enter final climax resolution and the permanent new normal..."
                    placeholderTextColor={theme.textSecondary}
                  />
                  <View style={styles.endNotesBtnRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setEndNotesInput(storyCircle?.theEndNotes || '');
                        setIsEditingEndNotes(false);
                      }}
                      style={[styles.cancelBtn, { borderColor: theme.border }]}
                    >
                      <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveEndNotes}
                      style={[styles.saveBtn, { backgroundColor: '#EC4899' }]}
                    >
                      <Text style={styles.saveBtnText}>Save Resolution</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  {storyCircle?.theEndNotes ? (
                    <View style={[styles.userContentBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Text style={[styles.contentItemLabel, { color: '#DB2777' }]}>
                        FINAL RESOLUTION &amp; OUTCOME:
                      </Text>
                      <Text style={[styles.contentItemText, { color: theme.text }]}>
                        {storyCircle.theEndNotes}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setIsEditingEndNotes(true)}
                      style={[styles.emptyPromptBtn, { borderColor: '#F472B6' }]}
                    >
                      <Heroicon name="pencil-square" size={16} color="#DB2777" style={{ marginRight: 6 }} />
                      <Text style={[styles.emptyPromptText, { color: '#DB2777' }]}>
                        Write central resolution &amp; ending notes...
                      </Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.cardFooter}>
                    <View style={styles.statusPill}>
                      <Text style={[styles.statusPillText, { color: storyCircle?.theEndNotes ? '#22C55E' : theme.textSecondary }]}>
                        {storyCircle?.theEndNotes ? '✓ RESOLUTION WRITTEN' : 'PENDING ENDING DRAFT'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => setIsEditingEndNotes(true)}
                      style={[styles.editBtn, { backgroundColor: '#EC4899' }]}
                      accessibilityLabel="Edit central resolution notes"
                    >
                      <Heroicon name="pencil-square" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Division Editor Modal */}
      <StoryDivisionEditorModal
        visible={editorModalVisible}
        onClose={() => setEditorModalVisible(false)}
        division={selectedDivision}
        onSaveDivision={handleSaveDivision}
        onClearDivision={handleClearDivision}
        theme={theme}
      />

      {/* Export Result & Device Location Modal */}
      <ExportResultModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        fileInfo={exportResultInfo}
        theme={theme}
      />
    </SafeAreaView>
  </Modal>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  topHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitles: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  screenplaySubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: FONTS.ui,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  saveStatusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
  exportPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  exportPdfBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
  },
  chartSectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontSize: 13,
    marginBottom: 12,
    fontFamily: FONTS.ui,
  },
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  progressSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: FONTS.ui,
  },
  progressStatBox: {
    alignItems: 'flex-end',
  },
  progressBigPercent: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: FONTS.ui,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickIndicatorsContainer: {
    gap: 8,
    marginTop: 4,
  },
  quickRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickRowTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: FONTS.ui,
  },
  quickIndicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  quickIndicatorBtn: {
    flex: 1,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIndicatorText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    fontFamily: FONTS.courier,
  },
  actNavCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  actNavHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actNavHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: FONTS.ui,
  },
  actNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  actNavBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actNavDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 3,
  },
  actNavBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: FONTS.ui,
  },
  actNavBtnSub: {
    fontSize: 9.5,
    marginTop: 2,
    fontFamily: FONTS.courier,
  },
  actsSection: {
    marginTop: 8,
  },
  actsSectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 14,
    fontFamily: FONTS.ui,
  },
  actGroup: {
    marginBottom: 22,
  },
  actBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  actColorBar: {
    width: 6,
    height: 38,
    borderRadius: 3,
    marginRight: 12,
  },
  actBannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  actBannerDesc: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: FONTS.ui,
  },
  divisionCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBadge: {
    minWidth: 36,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardBadgeText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 12.5,
    fontFamily: FONTS.ui,
  },
  cardTitleBox: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 1,
    fontFamily: FONTS.ui,
  },
  cardCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardExplanation: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 10,
    fontFamily: FONTS.ui,
  },
  userContentBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  contentItem: {},
  contentItemLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
    fontFamily: FONTS.ui,
  },
  contentItemText: {
    fontSize: 13,
    fontFamily: FONTS.courier,
    lineHeight: 18,
  },
  emptyPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  emptyPromptText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FONTS.ui,
  },
  endNotesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    minHeight: 85,
    textAlignVertical: 'top',
    fontFamily: FONTS.courier,
    marginBottom: 8,
  },
  endNotesBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusPill: {},
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: FONTS.ui,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
});
