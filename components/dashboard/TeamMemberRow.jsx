/**
 * TeamMemberRow — single row in the team list.
 * Highlights "needshelp" members with a tinted background.
 *
 * Props:
 *   member  (object) — { id, name, role, status, lastUpdate, signal }
 *   isLast  (bool)   — hides bottom border on last item
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
        !isLast && !isUrgent && styles.bordered,
      ]}
    >
      <Avatar name={member.name} status={member.status} />

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
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  urgentRow: {
    backgroundColor: 'rgba(252, 232, 230, 0.5)',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1d26',
  },
  detail: {
    fontSize: 12,
    color: '#9099b0',
    marginTop: 2,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
