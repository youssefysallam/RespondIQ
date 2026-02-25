/**
 * Avatar — Solo Leveling system UI style.
 * Square with glowing border and level badge.
 *
 * Props:
 *   name   (string) — full name
 *   status (string) — safe | enroute | onscene | needshelp | offline
 *   level  (number) — optional level number
 *   size   (number) — optional, default 40
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';

export default function Avatar({ name, status, level, size = 40 }) {
  const initial = name.split(' ').pop()[0];
  const s = StatusStyles[status] || StatusStyles.offline;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.square,
          {
            width: size,
            height: size,
            borderRadius: 4,
            borderColor: s.color + '50',
            backgroundColor: s.bg,
          },
        ]}
      >
        <Text
          style={[
            styles.initial,
            {
              fontSize: size * 0.42,
              color: s.color,
            },
          ]}
        >
          {initial}
        </Text>
      </View>

      {/* Level badge */}
      {level != null && (
        <View style={[styles.levelBadge, { borderColor: s.color + '60' }]}>
          <Text style={[styles.levelText, { color: s.color }]}>{level}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  initial: {
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 4,
    minWidth: 18,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});
