/**
 * SignalBars — shows connectivity strength (0–4 bars).
 *
 * Props:
 *   strength (number) — 0 to 4
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default function SignalBars({ strength = 0 }) {
  const barColor =
    strength <= 1
      ? Colors.danger
      : strength <= 2
      ? Colors.warning
      : Colors.success;

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: 2 + i * 2.5,
              backgroundColor: i <= strength ? barColor : '#dce0e8',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 12,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
  },
});
