/**
 * Dan Harmon Story Circle - Circular Vector Chart Component
 * Scripts by Darkchesa - "Plot a Plot"
 *
 * Implements the 4 concentric circular layers (Green, Yellow, Red, Pink),
 * 8 equal radial story divisions, central "THE END" circle,
 * number badges, completion indicators, and interactive division selection.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { FONTS } from '../constants/theme';
import { STORY_CIRCLE_LAYERS } from '../types/storyCircle';

export default function StoryCircleChart({
  divisions = [],
  selectedDivisionId = null,
  onSelectDivision = () => {},
  size = 380,
  theme,
}) {
  const cx = size / 2;
  const cy = size / 2;

  // Concentric circle radii proportionally scaled
  const scale = size / 400;
  const rOuter = 160 * scale;   // Green (Act 1)
  const rMiddle = 115 * scale;  // Yellow (Act 2)
  const rInner = 72 * scale;    // Red (Act 3)
  const rCenter = 36 * scale;   // Pink (The End)

  // 8 Spoke angles in degrees from 12 o'clock clockwise (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
  const spokeAnglesDeg = [0, 45, 90, 135, 180, 225, 270, 315];

  // Division center angles & layer radius for placing number badges
  // 1: Upper-Right (22.5°), Outer Green (avg 115 and 160 = 137.5)
  // 2: Mid-Right (67.5°), Second Yellow (avg 72 and 115 = 93.5)
  // 3: Lower-Mid-Right (112.5°), Third Red (avg 36 and 72 = 54)
  // 4: Bottom-Right (157.5°), Third Red (54)
  // 5: Bottom-Left (202.5°), Third Red (54)
  // 6: Lower-Mid-Left (247.5°), Third Red (54)
  // 7: Upper-Mid-Left (292.5°), Second Yellow (93.5)
  // 8: Upper-Left (337.5°), Outer Green (137.5)
  const divisionPlacements = [
    { id: 1, angleDeg: 22.5, r: 137.5 * scale },
    { id: 2, angleDeg: 67.5, r: 93.5 * scale },
    { id: 3, angleDeg: 112.5, r: 54 * scale },
    { id: 4, angleDeg: 157.5, r: 54 * scale },
    { id: 5, angleDeg: 202.5, r: 54 * scale },
    { id: 6, angleDeg: 247.5, r: 54 * scale },
    { id: 7, angleDeg: 292.5, r: 93.5 * scale },
    { id: 8, angleDeg: 337.5, r: 137.5 * scale },
  ];

  // Helper to calculate (x, y) from center, radius, and clockwise angle from 12 o'clock
  const getCoordinates = (radius, angleDegrees) => {
    const angleRad = (angleDegrees - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
    };
  };

  return (
    <View style={styles.container}>
      {/* Interactive Svg Circular Chart */}
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Layer 1: Outer Circle (GREEN - Act 1) */}
          <Circle
            cx={cx}
            cy={cy}
            r={rOuter}
            fill="#22C55E"
            stroke="#0F172A"
            strokeWidth={3}
          />

          {/* Layer 2: Second Circle (YELLOW - Act 2) */}
          <Circle
            cx={cx}
            cy={cy}
            r={rMiddle}
            fill="#FACC15"
            stroke="#0F172A"
            strokeWidth={3}
          />

          {/* Layer 3: Third Circle (RED - Act 3) */}
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

          {/* Text in Centre Circle: "THE END" */}
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

          {/* Number Badges 1 to 8 positioned in their designated Act rings */}
          {divisionPlacements.map((placement) => {
            const pos = getCoordinates(placement.r, placement.angleDeg);
            const division = divisions.find((d) => d.id === placement.id) || {};
            const isCompleted = Boolean(division.completed);
            const isSelected = selectedDivisionId === placement.id;
            const badgeRadius = 14 * scale;

            return (
              <G
                key={`badge_${placement.id}`}
                onPress={() => onSelectDivision(division)}
              >
                {/* Glow ring if selected */}
                {isSelected && (
                  <Circle
                    cx={pos.x}
                    cy={pos.y}
                    r={badgeRadius + 5}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={3}
                  />
                )}

                {/* Badge circle */}
                <Circle
                  cx={pos.x}
                  cy={pos.y}
                  r={badgeRadius}
                  fill={isCompleted ? '#15803D' : '#FFFFFF'}
                  stroke={isSelected ? '#3B82F6' : '#0F172A'}
                  strokeWidth={2.2}
                />

                {/* Number text or checkmark */}
                <SvgText
                  x={pos.x}
                  y={pos.y + 4.5 * scale}
                  fill={isCompleted ? '#FFFFFF' : '#0F172A'}
                  fontSize={Math.max(12, 13 * scale)}
                  fontWeight="bold"
                  fontFamily={FONTS.ui}
                  textAnchor="middle"
                >
                  {isCompleted ? '✓' : placement.id.toString()}
                </SvgText>
              </G>
            );
          })}
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
    gap: 16,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 24,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  legendText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: FONTS.ui,
  },
});
