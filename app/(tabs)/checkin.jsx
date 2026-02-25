/**
 * Check In Screen
 * Owner: Azealia
 * Solo Leveling system UI style.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';
import CheckInPanel from '../../components/checkin/CheckInPanel';

export default function CheckInScreen() {
  const [currentStatus, setCurrentStatus] = useState('safe');
  const [showPanel, setShowPanel] = useState(false);
  const s = StatusStyles[currentStatus];

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>CURRENT STATUS</Text>

        {/* Status display — system panel style */}
        <View style={[styles.statusPanel, { borderColor: s.color + '40' }]}>
          <View style={[styles.statusDot, { backgroundColor: s.color }]} />
          <Text style={[styles.statusLabel, { color: s.color }]}>
            [{s.label}]
          </Text>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => setShowPanel(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.updateButtonText}>UPDATE STATUS</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Your status is visible to all team members
        </Text>
      </View>

      <CheckInPanel
        visible={showPanel}
        onClose={() => setShowPanel(false)}
        currentStatus={currentStatus}
        onStatusChange={(newStatus) => setCurrentStatus(newStatus)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2.5,
    marginBottom: 20,
  },
  statusPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    marginBottom: 24,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  updateButton: {
    backgroundColor: Colors.cyanFaint,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 4,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  updateButtonText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  hint: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    marginTop: 16,
    letterSpacing: 0.5,
  },
});
