/**
 * TeamMemberRow — Solo Leveling system UI style.
 * Urgent members get a glowing red left border.
 *
 * Props:
 *   member  (object) — { id, name, role, status, lastUpdate, signal, level }
 *   isLast  (bool)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';
import { Avatar, StatusBadge, SignalBars } from '../shared';

export default function TeamMemberRow({ member, isLast = false }) {
  const isUrgent = member.status === 'needshelp';

  return (
    <View
      style={[
        styles.row,
        isUrgent && styles.urgentRow,
        !isLast && styles.bordered,
      ]}
    >
      {/* Urgent left glow bar */}
      {isUrgent && <View style={styles.urgentBar} />}

      <Avatar
        name={member.name}
        status={member.status}
        level={member.level}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.detail}>
          {member.role} · {member.lastUpdate}
        </Text>
      </View>

      <View style={styles.trailing}>
        <SignalBars strength={member.signal} />
        <StatusBadge status={member.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    position: 'relative',
  },
  urgentRow: {
    backgroundColor: Colors.dangerFaint,
  },
  urgentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.danger,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textBright,
  },
  detail: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
