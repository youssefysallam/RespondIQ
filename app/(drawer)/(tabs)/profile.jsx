/**
 * Profile Screen
 * Solo Leveling system UI — user identity, ICS assignment,
 * gear readiness, certifications, and shift info.
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors, StatusStyles } from '../../../constants/colors';
import { INCIDENTS, USER_PROFILE } from '../../../constants/mockData';

/* ─── Section header (reusable) ─── */
function SectionHeader({ icon, title, color = Colors.cyan }) {
  return (
    <View style={[secStyles.header, { borderBottomColor: color + '15' }]}>
      <View style={[secStyles.iconCircle, { borderColor: color }]}>
        <Ionicons name={icon} size={12} color={color} />
      </View>
      <Text style={[secStyles.title, { color }]}>{title}</Text>
    </View>
  );
}

const secStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
});

export default function ProfileScreen() {
  const p = USER_PROFILE;
  const s = StatusStyles[p.status] || StatusStyles.offline;
  const incident = INCIDENTS.find((i) => i.id === p.incidentId);

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
              <Ionicons name="person" size={16} color={Colors.cyan} />
            </View>
            <View>
              <Text style={styles.headerTitle}>OPERATOR PROFILE</Text>
              <View style={styles.liveRow}>
                <View style={[styles.liveDot, { backgroundColor: s.color }]} />
                <Text style={[styles.liveText, { color: s.color }]}>{s.label}</Text>
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
        {/* Identity card */}
        <View style={[styles.panel, { borderColor: Colors.cyanBorder }]}>
          <View style={styles.identityGlow} />
          <View style={styles.identityContent}>
            {/* Avatar */}
            <View style={[styles.avatar, { borderColor: s.color + '60', backgroundColor: s.bg }]}>
              <Text style={[styles.avatarText, { color: s.color }]}>
                {p.name.split(' ').pop()[0]}
              </Text>
              <View style={[styles.levelBadge, { borderColor: s.color + '60' }]}>
                <Text style={[styles.levelText, { color: s.color }]}>{p.level}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.identityInfo}>
              <Text style={styles.name}>{p.name.replace('You (', '').replace(')', '')}</Text>
              <Text style={styles.rank}>{p.rank} · {p.role}</Text>
              <Text style={styles.station}>{p.station}</Text>
            </View>
          </View>
        </View>

        {/* ICS Assignment */}
        <View style={[styles.panel, { borderColor: Colors.cyan + '25' }]}>
          <SectionHeader icon="shield-checkmark" title="ICS Assignment" />
          <View style={styles.icsContent}>
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>INCIDENT</Text>
              <View style={styles.icsValueRow}>
                <Text style={[styles.icsValue, { color: Colors.danger }]}>
                  {p.incidentId}
                </Text>
                <Text style={styles.icsSeparator}>·</Text>
                <Text style={[styles.icsValue, { color: Colors.textBright }]}>
                  {incident?.type || '—'}
                </Text>
              </View>
            </View>
            <View style={styles.icsDivider} />
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>DIVISION</Text>
              <Text style={[styles.icsValue, { color: Colors.cyan }]}>{p.division}</Text>
            </View>
            <View style={styles.icsDivider} />
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>ASSIGNMENT</Text>
              <Text style={[styles.icsValue, { color: Colors.cyan }]}>{p.assignment}</Text>
            </View>
          </View>
        </View>

        {/* Shift Info */}
        <View style={[styles.panel, { borderColor: Colors.cyan + '25' }]}>
          <SectionHeader icon="time" title="Shift Info" />
          <View style={styles.shiftContent}>
            <View style={styles.shiftStat}>
              <Text style={styles.shiftStatLabel}>SHIFT</Text>
              <Text style={styles.shiftStatValue}>{p.shift}</Text>
            </View>
            <View style={[styles.shiftDivider, { backgroundColor: Colors.border }]} />
            <View style={styles.shiftStat}>
              <Text style={styles.shiftStatLabel}>ON DUTY</Text>
              <Text style={[styles.shiftStatValue, { color: Colors.warning }]}>
                {p.hoursOnDuty}h
              </Text>
            </View>
          </View>
        </View>

        {/* Gear Readiness */}
        <View style={[styles.panel, { borderColor: Colors.cyan + '25' }]}>
          <SectionHeader icon="construct" title="Gear Status" />
          <View style={styles.gearList}>
            {p.gear.map((g, i) => {
              const isActive = g.status === 'active' || g.status === 'checked';
              const gColor = isActive ? Colors.success : Colors.warning;
              return (
                <View
                  key={i}
                  style={[
                    styles.gearRow,
                    i < p.gear.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.border },
                  ]}
                >
                  <View style={[styles.gearIcon, { borderColor: gColor + '40', backgroundColor: gColor + '10' }]}>
                    <Ionicons
                      name={isActive ? 'checkmark' : 'time-outline'}
                      size={14}
                      color={gColor}
                    />
                  </View>
                  <View style={styles.gearInfo}>
                    <Text style={styles.gearName}>{g.item}</Text>
                    <Text style={styles.gearDetail}>
                      {g.psi || g.channel || g.note}
                    </Text>
                  </View>
                  <View style={[styles.gearBadge, { borderColor: gColor + '40', backgroundColor: gColor + '10' }]}>
                    <Text style={[styles.gearBadgeText, { color: gColor }]}>
                      {g.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Certifications */}
        <View style={[styles.panel, { borderColor: Colors.cyan + '25' }]}>
          <SectionHeader icon="ribbon" title="Certifications" />
          <View style={styles.certList}>
            {p.certifications.map((c, i) => {
              const cColor = c.active ? Colors.success : Colors.danger;
              return (
                <View
                  key={i}
                  style={[
                    styles.certRow,
                    i < p.certifications.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.border },
                  ]}
                >
                  <View style={[styles.certDot, { backgroundColor: cColor }]} />
                  <View style={styles.certInfo}>
                    <Text style={styles.certName}>{c.name}</Text>
                    <Text style={styles.certExpiry}>
                      {c.active ? 'Expires' : 'Expired'}: {c.expires}
                    </Text>
                  </View>
                  <View style={[styles.certBadge, { borderColor: cColor + '40', backgroundColor: cColor + '10' }]}>
                    <Text style={[styles.certBadgeText, { color: cColor }]}>
                      {c.active ? 'ACTIVE' : 'EXPIRED'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
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
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 55,
  },
  hamburgerRow: {
    paddingHorizontal: 18,
    paddingBottom: 26,
  },
  headerTop: {
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
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
  headerTitle: {
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
  },
  liveText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    paddingTop: 12,
    gap: 12,
  },
  panel: {
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },

  /* Identity */
  identityGlow: {
    height: 2,
    backgroundColor: Colors.cyan + '30',
  },
  identityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 5,
    minWidth: 22,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  identityInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textBright,
    letterSpacing: 0.3,
  },
  rank: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  station: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: 2,
  },

  /* ICS */
  icsContent: {
    padding: 14,
    gap: 0,
  },
  icsRow: {
    paddingVertical: 8,
  },
  icsLabel: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  icsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icsValue: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  icsSeparator: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  icsDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  /* Shift */
  shiftContent: {
    flexDirection: 'row',
    padding: 14,
  },
  shiftStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  shiftStatLabel: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1.5,
  },
  shiftStatValue: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textBright,
    letterSpacing: 0.5,
  },
  shiftDivider: {
    width: 1,
    alignSelf: 'stretch',
  },

  /* Gear */
  gearList: {},
  gearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  gearIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearInfo: {
    flex: 1,
  },
  gearName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBright,
  },
  gearDetail: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  gearBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
  },
  gearBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },

  /* Certifications */
  certList: {},
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  certDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  certInfo: {
    flex: 1,
  },
  certName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBright,
  },
  certExpiry: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  certBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
  },
  certBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});
