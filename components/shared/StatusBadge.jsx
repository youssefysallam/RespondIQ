/**
 * StatusBadge — Solo Leveling system notification style.
 * Glowing border with uppercase monospace text.
 *
 * Props:
 *   status  (string) — safe | enroute | onscene | needshelp | offline
 *   compact (bool)   — dot only
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusStyles } from '../../constants/colors';

export default function StatusBadge({ status, compact = false }) {
  const s = StatusStyles[status] || StatusStyles.offline;

  if (compact) {
    return (
      <View style={[styles.dot, { backgroundColor: s.color }]} />
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.color + '40' }]}>
      <Text style={[styles.label, { color: s.color }]}>
        {s.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});
