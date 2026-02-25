/**
 * IncidentCard — Solo Leveling system notification style.
 *
 * Props:
 *   incident (object) — { id, type, location, priority, time, units }
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function IncidentCard({ incident }) {
  const isHigh = incident.priority === 'high';
  const color = isHigh ? Colors.danger : Colors.warning;
  const bg = isHigh ? Colors.dangerFaint : Colors.warningFaint;

  return (
    <View style={[styles.card, { borderColor: color + '30' }]}>
      <View style={[styles.iconBox, { backgroundColor: bg, borderColor: color + '50' }]}>
        <Ionicons
          name={isHigh ? 'flame' : 'medkit'}
          size={20}
          color={color}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{incident.type}</Text>
        <Text style={styles.detail}>
          {incident.location} · {incident.time}
        </Text>
        <Text style={styles.units}>{incident.units} units assigned</Text>
      </View>

      <View style={styles.priorityColumn}>
        <Text style={[styles.priorityText, { color }]}>
          {isHigh ? 'URGENT' : 'ACTIVE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textBright,
  },
  detail: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginTop: 3,
    letterSpacing: 0.3,
  },
  units: {
    fontSize: 9,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  priorityColumn: {
    alignItems: 'flex-end',
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
});
