/**
 * IncidentCard — displays an active incident with priority styling.
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
  const color = isHigh ? Colors.danger : Colors.accent;
  const bgColor = isHigh ? Colors.dangerBg : Colors.accentLight;

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <Ionicons
          name={isHigh ? 'flame' : 'medkit'}
          size={20}
          color={color}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{incident.type}</Text>
          {isHigh && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        <Text style={styles.detail}>
          {incident.location} · {incident.time}
        </Text>
        <Text style={styles.units}>{incident.units} units assigned</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1d26',
  },
  urgentBadge: {
    backgroundColor: '#fce8e6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#d93025',
    letterSpacing: 0.5,
  },
  detail: {
    fontSize: 12,
    color: '#9099b0',
    marginTop: 3,
  },
  units: {
    fontSize: 11,
    color: '#9099b0',
    marginTop: 6,
  },
});
