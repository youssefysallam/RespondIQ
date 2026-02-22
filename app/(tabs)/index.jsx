/**
 * Dashboard Screen (Team tab)
 * Owner: Youssef
 *
 * Shows:
 *  - Status summary chips
 *  - Active incidents
 *  - Sorted team member list
 *
 * TODO:
 *  - Pull-to-refresh
 *  - Tap a member to see detail view
 *  - Connect to shared state for live status updates
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, StatusStyles, STATUS_SORT_ORDER } from '../../constants/colors';
import { TEAM, INCIDENTS } from '../../constants/mockData';
import TeamMemberRow from '../../components/dashboard/TeamMemberRow';
import IncidentCard from '../../components/dashboard/IncidentCard';

export default function DashboardScreen() {
  // Sort team by urgency
  const sortedTeam = [...TEAM].sort(
    (a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]
  );

  // Count members per status
  const statusCounts = {};
  TEAM.forEach((m) => {
    statusCounts[m.status] = (statusCounts[m.status] || 0) + 1;
  });

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>INC-4821 · Structure Fire</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status summary chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}
        >
          {Object.entries(StatusStyles).map(([key, val]) => (
            <View key={key} style={[styles.chip, { backgroundColor: val.bg }]}>
              <View style={[styles.chipDot, { backgroundColor: val.color }]} />
              <Text style={[styles.chipText, { color: val.color }]}>
                {statusCounts[key] || 0} {val.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Active Incidents */}
        <Text style={styles.sectionLabel}>Active Incidents</Text>
        <View style={styles.incidentList}>
          {INCIDENTS.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} />
          ))}
        </View>

        {/* Team List */}
        <View style={styles.teamCard}>
          <Text style={styles.sectionLabel}>
            Team · {TEAM.length} members
          </Text>
          {sortedTeam.map((member, i) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              isLast={i === sortedTeam.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: Colors.bg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chipsScroll: {
    marginHorizontal: -20,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 10,
  },
  incidentList: {
    gap: 10,
    marginBottom: 8,
  },
  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
});
