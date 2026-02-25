/**
 * Dashboard Screen (Team tab)
 * Owner: Youssef
 * Solo Leveling system UI — dark panels with glowing headers.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

/**
 * IncidentDetailOverlay — expanded detail view shown on tap.
 * Blurred backdrop, dismiss on outside tap.
 */
function IncidentDetailOverlay({ incident, onClose }) {
  if (!incident) return null;

  const isHigh = incident.priority === 'high';
  const color = isHigh ? Colors.danger : Colors.warning;
  const bg = isHigh ? Colors.dangerFaint : Colors.warningFaint;

  return (
    <Modal visible={true} transparent animationType="fade">
      <Pressable style={detailStyles.overlay} onPress={onClose}>
        <Pressable style={detailStyles.card} onPress={(e) => e.stopPropagation()}>
          {/* Top glow line */}
          <View style={[detailStyles.glowLine, { backgroundColor: color + '60' }]} />

          {/* Close X button */}
          <Pressable style={detailStyles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={18} color={Colors.textTertiary} />
          </Pressable>

          {/* Scrollable content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={detailStyles.scrollContent}
          >
            {/* Header */}
            <View style={detailStyles.headerRow}>
              <View style={[detailStyles.iconBox, { backgroundColor: bg, borderColor: color + '40' }]}>
                <Ionicons name={isHigh ? 'flame' : 'medkit'} size={24} color={color} />
              </View>
              <View style={detailStyles.headerInfo}>
                <View style={[detailStyles.priorityBadge, { backgroundColor: bg, borderColor: color + '50' }]}>
                  <Text style={[detailStyles.priorityText, { color }]}>
                    {isHigh ? '! URGENT' : '◉ ACTIVE'}
                  </Text>
                </View>
                <Text style={detailStyles.type}>{incident.type}</Text>
                <Text style={detailStyles.id}>{incident.id}</Text>
              </View>
            </View>

            {/* Quick stats row */}
            <View style={detailStyles.statsRow}>
              <View style={detailStyles.stat}>
                <Ionicons name="time-outline" size={14} color={Colors.textTertiary} />
                <Text style={detailStyles.statLabel}>TIME</Text>
                <Text style={[detailStyles.statValue, { color }]}>{incident.time}</Text>
              </View>
              <View style={[detailStyles.statDivider, { backgroundColor: color + '15' }]} />
              <View style={detailStyles.stat}>
                <Ionicons name="people-outline" size={14} color={Colors.textTertiary} />
                <Text style={detailStyles.statLabel}>UNITS</Text>
                <Text style={[detailStyles.statValue, { color }]}>{incident.units}</Text>
              </View>
              <View style={[detailStyles.statDivider, { backgroundColor: color + '15' }]} />
              <View style={detailStyles.stat}>
                <Ionicons name="navigate-outline" size={14} color={Colors.textTertiary} />
                <Text style={detailStyles.statLabel}>DIST</Text>
                <Text style={[detailStyles.statValue, { color }]}>{incident.distance}</Text>
              </View>
            </View>

            {/* Address */}
            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>LOCATION</Text>
              <Text style={detailStyles.sectionBody}>{incident.address}</Text>
            </View>

            {/* Hazards */}
            {incident.hazards && incident.hazards.length > 0 && (
              <View style={detailStyles.section}>
                <Text style={[detailStyles.sectionTitle, { color: Colors.danger }]}>⚠ HAZARD WARNINGS</Text>
                {incident.hazards.map((h, i) => (
                  <View key={i} style={detailStyles.hazardRow}>
                    <View style={detailStyles.hazardDot} />
                    <Text style={detailStyles.hazardText}>{h}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Assigned team */}
            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>ASSIGNED TEAM</Text>
              <View style={detailStyles.tagRow}>
                {incident.assignedTeam?.map((name, i) => (
                  <View key={i} style={[detailStyles.tag, { borderColor: Colors.cyan + '30' }]}>
                    <Text style={detailStyles.tagText}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Resources requested */}
            {incident.resourcesRequested && (
              <View style={detailStyles.section}>
                <Text style={[detailStyles.sectionTitle, { color: Colors.warning }]}>RESOURCES REQUESTED</Text>
                {incident.resourcesRequested.map((r, i) => (
                  <View key={i} style={detailStyles.resourceRow}>
                    <Text style={detailStyles.resourceBullet}>→</Text>
                    <Text style={detailStyles.resourceText}>{r}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 911 Call transcript */}
            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>911 CALL TRANSCRIPT</Text>
              <View style={detailStyles.transcriptBox}>
                <Text style={detailStyles.transcriptText}>
                  "{incident.callTranscript}"
                </Text>
              </View>
            </View>

            {/* Timeline */}
            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>INCIDENT TIMELINE</Text>
              {incident.timeline?.map((entry, i) => (
                <View key={i} style={detailStyles.timelineRow}>
                  <View style={detailStyles.timelineLeft}>
                    <Text style={[detailStyles.timelineTime, { color }]}>{entry.time}</Text>
                    {i < incident.timeline.length - 1 && (
                      <View style={[detailStyles.timelineLine, { backgroundColor: color + '25' }]} />
                    )}
                  </View>
                  <View style={[detailStyles.timelineDot, { backgroundColor: color, borderColor: color + '40' }]} />
                  <Text style={detailStyles.timelineEvent}>{entry.event}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const detailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  glowLine: {
    height: 2,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 6,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  type: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textBright,
    letterSpacing: 0.3,
  },
  id: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginTop: 3,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2,
  },
  sectionBody: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  hazardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hazardDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.danger,
  },
  hazardText: {
    fontSize: 12,
    color: Colors.danger,
    fontFamily: 'monospace',
    letterSpacing: 0.3,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: Colors.cyanFaint,
  },
  tagText: {
    fontSize: 11,
    color: Colors.cyan,
    fontFamily: 'monospace',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourceBullet: {
    fontSize: 12,
    color: Colors.warning,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  resourceText: {
    fontSize: 12,
    color: Colors.text,
    fontFamily: 'monospace',
    letterSpacing: 0.3,
  },
  transcriptBox: {
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.textTertiary,
    padding: 12,
  },
  transcriptText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    minHeight: 36,
  },
  timelineLeft: {
    width: 42,
    alignItems: 'center',
  },
  timelineTime: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    marginTop: 4,
    minHeight: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    marginTop: 2,
  },
  timelineEvent: {
    flex: 1,
    fontSize: 11,
    color: Colors.text,
    lineHeight: 16,
  },
  closeHint: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  closeHintText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
});

export default function DashboardScreen() {
  const [selectedIncident, setSelectedIncident] = useState(null);

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
            <IncidentCard
              key={inc.id}
              incident={inc}
              width={CARD_WIDTH}
              onPress={(incident) => setSelectedIncident(incident)}
            />
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

      {/* Incident Detail Overlay */}
      {selectedIncident && (
        <IncidentDetailOverlay
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
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
