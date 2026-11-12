/**
 * Dan Harmon Expanded Story Circle - Circular Vector Chart Component
 * Scripts by Darkchesa - "Plot a Plot"
 *
 * Implements the 4 concentric circular layers with all 8 divisions in every ring:
 * - Outer Green Layer (Act 1: The Beginning): 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 * - Second Yellow Layer (Act 2: The Middle): 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8
 * - Third Red Layer (Act 3: The Climax): 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8
 * - Centre Pink Circle: THE END
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { FONTS } from '../constants/theme';
import { STORY_CIRCLE_LAYERS, CORE_8_STAGES } from '../types/storyCircle';

export default function StoryCircleChart({
  divisions = [],
  selectedDivisionId = null,
  onSelectDivision = () => {},
  size = 400,
  theme,
}) {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 420;

  // Concentric circle layer radii
  const rOuter = 185 * scale;  // Green (Act 1)
  const rMiddle = 135 * scale; // Yellow (Act 2)
  const rInner = 86 * scale;   // Red (Act 3)
  const rCenter = 42 * scale;  // Pink (The End)

  // 8 radial spoke angles in degrees from 12 o'clock (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
  const spokeAnglesDeg = [0, 45, 90, 135, 180, 225, 270, 315];

  // Radii for badge placement in each ring
  const rBadgeAct1 = 160 * scale; // (135 + 185) / 2
  const rBadgeAct2 = 110 * scale; // (86 + 135) / 2
  const rBadgeAct3 = 64 * scale;  // (42 + 86) / 2

  const getCoordinates = (radius, angleDegrees) => {
    const angleRad = (angleDegrees - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
    };
  };

  // Ring definitions with their divisions
  const rings = [
    { act: 'ACT 1', prefix: '1', rBadge: rBadgeAct1, badgeRadius: 13.5 * scale },
    { act: 'ACT 2', prefix: '2', rBadge: rBadgeAct2, badgeRadius: 13 * scale },
    { act: 'ACT 3', prefix: '3', rBadge: rBadgeAct3, badgeRadius: 12.5 * scale },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Layer 1: Outer Circle (GREEN - Act 1: The Beginning) */}
          <Circle
            cx={cx}
            cy={cy}
            r={rOuter}
            fill="#22C55E"
            stroke="#0F172A"
            strokeWidth={3}
          />

          {/* Layer 2: Second Circle (YELLOW - Act 2: The Middle) */}
          <Circle
            cx={cx}
            cy={cy}
            r={rMiddle}
            fill="#FACC15"
            stroke="#0F172A"
            strokeWidth={3}
          />

          {/* Layer 3: Third Circle (RED - Act 3: The Climax) */}
          <Circle
            cx={cx}
            cy={cy}
            r={rInner}
            fill="#EF4444"
            stroke="#0F172A"
            strokeWidth={3}
          />

          {/* 8 Radial Dividing Lines (Spokes) extending from Center Pink circle to Outer Green ring */}
          {spokeAnglesDeg.map((deg, i) => {
            const start = getCoordinates(rCenter, deg);
            const end = getCoordinates(rOuter, deg);
            return (
              <Line
                key={`spoke_${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#0F172A"
                strokeWidth={2.5}
              />
            );
          })}

          {/* Layer 4: Centre Circle (PINK - THE END) */}
          <Circle
            cx={cx}
            cy={cy}
            r={rCenter}
            fill="#F472B6"
            stroke="#0F172A"
            strokeWidth={3}
          />

          {/* Centre Text: "THE END" */}
          <SvgText
            x={cx}
            y={cy - 2 * scale}
            fill="#0F172A"
            fontSize={Math.max(10, 11 * scale)}
            fontWeight="bold"
            fontFamily={FONTS.ui}
            textAnchor="middle"
          >
            THE
          </SvgText>
          <SvgText
            x={cx}
            y={cy + 11 * scale}
            fill="#0F172A"
            fontSize={Math.max(10, 11 * scale)}
            fontWeight="bold"
            fontFamily={FONTS.ui}
            textAnchor="middle"
          >
            END
          </SvgText>

          {/* Badges for all 3 Rings: Act 1 (1.1-1.8), Act 2 (2.1-2.8), Act 3 (3.1-3.8) */}
          {rings.map((ring) =>
            CORE_8_STAGES.map((stage) => {
              const code = `${ring.prefix}.${stage.stage}`;
              const pos = getCoordinates(ring.rBadge, stage.angleDeg);
              const division = divisions.find((d) => d.id === code) || {};
              const isCompleted = Boolean(division.completed);
              const isSelected = selectedDivisionId === code;

              return (
                <G
                  key={`badge_${code}`}
                  onPress={() => onSelectDivision(division)}
                >
                  {/* Selection glow */}
                  {isSelected && (
                    <Circle
                      cx={pos.x}
                      cy={pos.y}
                      r={ring.badgeRadius + 4}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={2.5}
                    />
                  )}

                  {/* Badge circle */}
                  <Circle
                    cx={pos.x}
                    cy={pos.y}
                    r={ring.badgeRadius}
                    fill={isCompleted ? '#15803D' : '#FFFFFF'}
                    stroke={isSelected ? '#3B82F6' : '#0F172A'}
                    strokeWidth={2}
                  />

                  {/* Division code (e.g. 1.1) or checkmark */}
                  <SvgText
                    x={pos.x}
                    y={pos.y + (3.5 * scale)}
                    fill={isCompleted ? '#FFFFFF' : '#0F172A'}
                    fontSize={Math.max(8.5, 9.5 * scale)}
                    fontWeight="bold"
                    fontFamily={FONTS.courier}
                    textAnchor="middle"
                  >
                    {isCompleted ? '✓' : code}
                  </SvgText>
                </G>
              );
            })
          )}
        </Svg>
      </View>

      {/* Act Legend Bar */}
      <View style={styles.legendContainer}>
        {STORY_CIRCLE_LAYERS.map((layer) => (
          <View key={layer.id} style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: layer.color }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>
              {layer.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendBox: {
    width: 20,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  legendText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
});
