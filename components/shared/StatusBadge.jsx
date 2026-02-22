/**
 * StatusBadge — colored pill showing a member's status.
 *
 * Props:
 *   status  (string)  — safe | enroute | onscene | needshelp | offline
 *   compact (bool)    — optional, smaller version without label
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusStyles } from '../../constants/colors';

export default function StatusBadge({ status, compact = false }) {
  const style = StatusStyles[status] || StatusStyles.offline;

  if (compact) {
    return (
      <View style={[styles.dot, { backgroundColor: style.color }]} />
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <View style={[styles.dot, { backgroundColor: style.color }]} />
      <Text style={[styles.label, { color: style.color }]}>
        {style.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
