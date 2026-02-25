/**
 * Dashboard Screen (Team tab)
 * Owner: Youssef
 * Solo Leveling system UI — dark panels with glowing headers.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 56;
import { Colors, StatusStyles, STATUS_SORT_ORDER } from '../../constants/colors';
import { TEAM, INCIDENTS } from '../../constants/mockData';
import TeamMemberRow from '../../components/dashboard/TeamMemberRow';
import IncidentCard from '../../components/dashboard/IncidentCard';

/**
 * SystemPanelHeader — the ⓘ NOTIFICATION-style header
 * used on Solo Leveling quest/status panels.
 */
function SystemPanelHeader({ title, color = Colors.cyan }) {
  return (
    <View style={[panelStyles.header, { borderBottomColor: color + '15' }]}>
      <View style={[panelStyles.headerIcon, { borderColor: color }]}>
        <Text style={[panelStyles.headerIconText, { color }]}>!</Text>
      </View>
      <Text style={[panelStyles.headerTitle, { color }]}>
        {title}
      </Text>
    </View>
  );
}

const panelStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
});

export default function DashboardScreen() {
  const sortedTeam = [...TEAM].sort(
    (a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]
  );

  const statusCounts = {};
  TEAM.forEach((m) => {
    statusCounts[m.status] = (statusCounts[m.status] || 0) + 1;
  });

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PSC COMPANION</Text>
        <Text style={styles.subtitle}>
          INC-4821 · STRUCTURE FIRE · 742 ELM ST
        </Text>
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
            <View key={key} style={[styles.chip, { backgroundColor: val.bg, borderColor: val.color + '25' }]}>
              <View style={[styles.chipDot, { backgroundColor: val.color }]} />
              <Text style={[styles.chipText, { color: val.color }]}>
                {statusCounts[key] || 0}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Active Incidents — horizontal swipe cards */}
        <View style={styles.incidentHeader}>
          <View style={[styles.incidentHeaderIcon, { borderColor: Colors.danger }]}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.danger }}>!</Text>
          </View>
          <Text style={styles.incidentHeaderTitle}>ACTIVE INCIDENTS</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 10}
          style={styles.incidentScroll}
          contentContainerStyle={styles.incidentScrollContent}
        >
          {INCIDENTS.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} width={CARD_WIDTH} />
          ))}
        </ScrollView>

        {/* Team — system panel */}
        <View style={[styles.panel, { borderColor: Colors.cyanBorder }]}>
          <SystemPanelHeader title="Team Status" color={Colors.cyan} />
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
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textBright,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginTop: 2,
    letterSpacing: 0.8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    gap: 12,
    paddingTop: 12,
  },
  chipsScroll: {
    marginHorizontal: -14,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
    borderWidth: 1,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incidentHeaderIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incidentHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2.5,
    color: Colors.danger,
  },
  incidentScroll: {
    marginHorizontal: -14,
  },
  incidentScrollContent: {
    paddingHorizontal: 14,
    gap: 10,
  },
  panel: {
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
