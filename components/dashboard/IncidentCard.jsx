/**
 * IncidentCard — Large swipeable card, Solo Leveling style.
 * Designed to be used inside a horizontal ScrollView.
 *
 * Props:
 *   incident (object) — { id, type, location, priority, time, units }
 *   width    (number) — card width (passed from parent based on screen size)
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function IncidentCard({ incident, width, onPress }) {
  const isHigh = incident.priority === 'high';
  const color = isHigh ? Colors.danger : Colors.warning;
  const bg = isHigh ? Colors.dangerFaint : Colors.warningFaint;
  const cardWidth = width || SCREEN_WIDTH - 56;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(incident)}
      style={[styles.card, { width: cardWidth, borderColor: color + '35' }]}
    >
      {/* Top glow line */}
      <View style={[styles.glowLine, { backgroundColor: color + '50' }]} />

      {/* Priority tag */}
      <View style={[styles.priorityBadge, { backgroundColor: bg, borderColor: color + '50' }]}>
        <Text style={[styles.priorityText, { color }]}>
          {isHigh ? '! URGENT' : '◉ ACTIVE'}
        </Text>
      </View>

      {/* Main content */}
      <View style={styles.body}>
        <View style={[styles.iconBox, { backgroundColor: bg, borderColor: color + '40' }]}>
          <Ionicons
            name={isHigh ? 'flame' : 'medkit'}
            size={26}
            color={color}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.type}>{incident.type}</Text>
          <Text style={styles.location}>{incident.location}</Text>
        </View>
      </View>

      {/* Footer stats */}
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={[styles.statValue, { color }]}>{incident.time}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: color + '20' }]} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>UNITS</Text>
          <Text style={[styles.statValue, { color }]}>{incident.units}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: color + '20' }]} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>ID</Text>
          <Text style={[styles.statValue, { color }]}>{incident.id}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 0,
  },
  glowLine: {
    height: 2,
    width: '100%',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    marginLeft: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 2,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  type: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textBright,
    letterSpacing: 0.3,
  },
  location: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
  },
});
