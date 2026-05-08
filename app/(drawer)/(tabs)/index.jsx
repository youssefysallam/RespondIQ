/**
 * Dashboard Screen (Team tab)
 * Owner: Youssef
 * Solo Leveling system UI — dark panels with glowing headers.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import IncidentCard from '../../../components/dashboard/IncidentCard';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors, STATUS_SORT_ORDER, StatusStyles } from '../../../constants/colors';
import { INCIDENTS, TEAM } from '../../../constants/mockData';
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
        <View style={styles.hamburgerRow}>
          <HamburgerButton />
        </View>
        <View style={styles.headerTop}>
          <View style={styles.headerBrand}>
            <View style={styles.brandIcon}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.cyan} />
            </View>
            <View>
              <Text style={styles.title}>RESPONDIQ</Text>
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>SYSTEM ONLINE</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Incidents — vertical stack */}
        <View style={styles.incidentHeader}>
          <View style={[styles.incidentHeaderIcon, { borderColor: Colors.danger }]}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.danger }}>!</Text>
          </View>
          <Text style={styles.incidentHeaderTitle}>ACTIVE INCIDENTS</Text>
        </View>
        <View style={styles.incidentList}>
          {INCIDENTS.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              onPress={(incident) => setSelectedIncident(incident)}
            />
          ))}
        </View>

        {/* Team — horizontal scroll */}
        <View style={styles.teamHeader}>
          <View style={[styles.teamHeaderIcon, { borderColor: Colors.cyan }]}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.cyan }}>!</Text>
          </View>
          <Text style={styles.teamHeaderTitle}>TEAM STATUS</Text>
          <Text style={styles.teamCount}>{TEAM.length}</Text>
        </View>
        {/* Crew readiness */}
        <View style={styles.readinessPanel}>
          <View style={styles.readinessHeader}>
            <Ionicons name="people" size={14} color={Colors.cyan} />
            <Text style={styles.readinessTitle}>LIVE STATUS</Text>
            <Text style={styles.readinessCount}>{TEAM.length} MEMBERS</Text>
          </View>
          <View style={styles.readinessGrid}>
            {Object.entries(StatusStyles).map(([key, val]) => {
              const count = statusCounts[key] || 0;
              return (
                <View key={key} style={[styles.readinessItem, { borderColor: val.color + '20' }]}>
                  <View style={styles.readinessItemTop}>
                    <View style={[styles.readinessDot, { backgroundColor: val.color }]} />
                    <Text style={[styles.readinessNum, { color: val.color }]}>{count}</Text>
                  </View>
                  <Text style={[styles.readinessLabel, { color: val.color + 'cc' }]}>{val.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={160}
          style={styles.teamScroll}
          contentContainerStyle={styles.teamScrollContent}
        >
          {sortedTeam.map((member) => {
            const ms = StatusStyles[member.status] || StatusStyles.offline;
            const isUrgent = member.status === 'needshelp';
            return (
              <View
                key={member.id}
                style={[
                  styles.teamCard,
                  { borderColor: isUrgent ? ms.color + '60' : Colors.border },
                  isUrgent && { backgroundColor: Colors.dangerFaint },
                ]}
              >
                {/* Urgent top glow */}
                {isUrgent && <View style={[styles.teamCardGlow, { backgroundColor: ms.color + '50' }]} />}
                {/* Avatar */}
                <View style={[styles.teamCardAvatar, { borderColor: ms.color + '50', backgroundColor: ms.bg }]}>
                  <Text style={[styles.teamCardInitial, { color: ms.color }]}>
                    {member.name.split(' ').pop()[0]}
                  </Text>
                  <View style={[styles.teamCardLevel, { borderColor: ms.color + '60' }]}>
                    <Text style={[styles.teamCardLevelText, { color: ms.color }]}>{member.level}</Text>
                  </View>
                </View>
                {/* Name */}
                <Text style={styles.teamCardName} numberOfLines={1}>{member.name}</Text>
                <Text style={styles.teamCardRole} numberOfLines={1}>{member.role}</Text>
                {/* Status badge */}
                <View style={[styles.teamCardBadge, { borderColor: ms.color + '40', backgroundColor: ms.bg }]}>
                  <Text style={[styles.teamCardBadgeText, { color: ms.color }]}>{ms.label}</Text>
                </View>
                {/* Footer */}
                <Text style={styles.teamCardMeta}>{member.lastUpdate}</Text>
              </View>
            );
          })}
        </ScrollView>
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
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  hamburgerRow: {
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 26,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: Colors.cyanFaint,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBright,
    letterSpacing: 1.5,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.success,
    letterSpacing: 1.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    gap: 14,
    paddingTop: 12,
  },
  readinessPanel: {
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    overflow: 'hidden',
  },
  readinessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  readinessTitle: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2,
    flex: 1,
  },
  readinessCount: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  readinessGrid: {
    flexDirection: 'row',
    padding: 8,
    gap: 6,
  },
  readinessItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 3,
    borderWidth: 1,
    backgroundColor: Colors.bg,
    gap: 4,
  },
  readinessItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  readinessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  readinessNum: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  readinessLabel: {
    fontSize: 7,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
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
  incidentList: {
    gap: 10,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamHeaderIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2.5,
    color: Colors.cyan,
    flex: 1,
  },
  teamCount: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
  },
  teamScroll: {
    marginHorizontal: -14,
  },
  teamScrollContent: {
    paddingHorizontal: 14,
    gap: 10,
    paddingVertical: 4,
  },
  teamCard: {
    width: 150,
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  teamCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  teamCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  teamCardInitial: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  teamCardLevel: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 4,
    minWidth: 18,
    alignItems: 'center',
  },
  teamCardLevelText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  teamCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textBright,
    textAlign: 'center',
    marginTop: 2,
  },
  teamCardRole: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  teamCardBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
    marginTop: 2,
  },
  teamCardBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  teamCardMeta: {
    fontSize: 8,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
});
