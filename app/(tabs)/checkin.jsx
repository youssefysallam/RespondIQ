/**
 * Check In Screen
 * Owner: Azealia
 *
 * This screen serves as the entry point for the Check In tab.
 * In a more polished version, tapping the Check In tab button
 * could directly open the modal without navigating here.
 *
 * For now, this screen immediately shows the CheckInPanel.
 *
 * TODO:
 *  - Consider making this a modal route instead of a tab
 *  - Connect currentStatus to shared app state
 *  - Add status history view here
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';
import CheckInPanel from '../../components/checkin/CheckInPanel';

export default function CheckInScreen() {
  const [currentStatus, setCurrentStatus] = useState('safe');
  const [showPanel, setShowPanel] = useState(false);
  const statusStyle = StatusStyles[currentStatus];

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Status</Text>

        {/* Current status display */}
        <View style={[styles.statusCard, { borderColor: statusStyle.color + '30' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
          <Text style={[styles.statusLabel, { color: statusStyle.color }]}>
            {statusStyle.label}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => setShowPanel(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.updateButtonText}>Update Status</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  updateButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 16,
  },
});
