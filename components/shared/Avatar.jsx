/**
 * Avatar — displays a user's initials with a hue-based background
 * and a status indicator dot.
 *
 * Props:
 *   name     (string)  — full name, e.g. "Capt. Rivera"
 *   status   (string)  — one of: safe | enroute | onscene | needshelp | offline
 *   size     (number)  — optional, default 44
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusStyles } from '../../constants/colors';

export default function Avatar({ name, status, size = 44 }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  // Generate a consistent hue from the name
  const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  const statusStyle = StatusStyles[status] || StatusStyles.offline;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Initials circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size * 0.32,
            backgroundColor: `hsl(${hue}, 45%, 92%)`,
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            {
              fontSize: size * 0.34,
              color: `hsl(${hue}, 40%, 40%)`,
            },
          ]}
        >
          {initials}
        </Text>
      </View>

      {/* Status dot */}
      <View
        style={[
          styles.statusDot,
          { backgroundColor: statusStyle.color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#fff',
  },
});
