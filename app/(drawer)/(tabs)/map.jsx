/**
 * Map Screen
 * Owner: Youssef / Azealia
 * Solo Leveling system UI — tactical map with ICS assignments,
 * live teammate locations, hazard overlays, and man-down emergency.
 *
 * SETUP: Run `npx expo install react-native-maps` before using.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors, StatusStyles } from '../../../constants/colors';
import { MAN_DOWN, RESPONDER_STATUS } from '../../../constants/Config';
import { HAZARD_ZONES, INCIDENTS, TEAM, USER_PROFILE } from '../../../constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ─── Helpers ─── */

/** Distance between two coords in meters (haversine). */
function getDistanceMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Get all unique divisions for the current incident. */
function getDivisions(team, incidentId) {
  const divs = new Set();
  team.forEach((m) => {
    if (m.incidentId === incidentId && m.division) divs.add(m.division);
  });
  return ['All', ...Array.from(divs)];
}

/** Get 2 closest qualified (not offline, not needshelp) responders. */
function getClosestResponders(fromCoords, team) {
  return team
    .filter((m) => m.status !== 'offline' && m.status !== 'needshelp')
    .map((m) => ({
      ...m,
      dist: getDistanceMeters(fromCoords, m.coords),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 2);
}

/* ─── Dark map style ─── */
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a6080' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#161b22' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a2332' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#040810' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

/* ─── Custom Marker ─── */
function TeamMarker({ member, isUser = false }) {
  const s = StatusStyles[member.status] || StatusStyles.offline;
  const isUrgent = member.status === 'needshelp';
  const label = isUser ? 'YOU' : member.name.split(' ').pop();

  return (
    <View style={markerStyles.container}>
      <View
        style={[
          markerStyles.pin,
          {
            backgroundColor: s.bg,
            borderColor: s.color + (isUrgent ? 'ff' : '80'),
          },
          isUser && markerStyles.userPin,
        ]}
      >
        <Text style={[markerStyles.pinText, { color: s.color }]}>
          {label[0]}
        </Text>
      </View>
      <Text
        style={[markerStyles.label, { color: s.color }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const markerStyles = StyleSheet.create({
  container: { alignItems: 'center', width: 60 },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPin: {
    width: 36,
    height: 36,
    borderWidth: 2.5,
  },
  pinText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  label: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});

/* ─── ICS Assignment Banner ─── */
function ICSBanner({ profile }) {
  const incident = INCIDENTS.find((i) => i.id === profile.incidentId);
  return (
    <View style={icsStyles.banner}>
      <View style={icsStyles.glowLine} />
      <View style={icsStyles.row}>
        <View style={icsStyles.iconBox}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.cyan} />
        </View>
        <View style={icsStyles.info}>
          <Text style={icsStyles.incident}>
            {profile.incidentId} · {incident?.type || 'UNKNOWN'}
          </Text>
          <Text style={icsStyles.assignment}>
            {profile.division} → {profile.assignment}
          </Text>
        </View>
      </View>
    </View>
  );
}

const icsStyles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 54,
    left: 12,
    right: 12,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    overflow: 'hidden',
    zIndex: 10,
  },
  glowLine: {
    height: 1,
    backgroundColor: Colors.cyan + '40',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: Colors.cyanFaint,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  incident: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 1,
  },
  assignment: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});

/* ─── Filter Panel ─── */
function FilterPanel({ visible, onClose, filters, setFilters, divisions }) {
  const radiusOptions = [0, 50, 100, 200, 500]; // 0 = no radius filter

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={filterStyles.overlay} onPress={onClose}>
        <Pressable style={filterStyles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={filterStyles.glowLine} />
          <View style={filterStyles.handle} />

          <Text style={filterStyles.title}>FILTER TEAMMATES</Text>
          <Text style={filterStyles.subtitle}>Narrow down who appears on the map</Text>

          {/* Division filter */}
          <Text style={filterStyles.sectionTitle}>DIVISION</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={filterStyles.chipRow}>
            {divisions.map((div) => {
              const active = filters.division === div;
              return (
                <TouchableOpacity
                  key={div}
                  onPress={() => setFilters({ ...filters, division: div })}
                  style={[
                    filterStyles.chip,
                    active && { backgroundColor: Colors.cyanFaint, borderColor: Colors.cyan + '50' },
                  ]}
                >
                  <Text
                    style={[filterStyles.chipText, active && { color: Colors.cyan }]}
                  >
                    {div.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Status filter */}
          <Text style={filterStyles.sectionTitle}>STATUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={filterStyles.chipRow}>
            {['All', ...Object.keys(StatusStyles)].map((key) => {
              const active = filters.status === key;
              const s = key === 'All' ? { color: Colors.cyan } : StatusStyles[key];
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setFilters({ ...filters, status: key })}
                  style={[
                    filterStyles.chip,
                    active && { backgroundColor: s.bg || Colors.cyanFaint, borderColor: s.color + '50' },
                  ]}
                >
                  <Text
                    style={[filterStyles.chipText, active && { color: s.color }]}
                  >
                    {key.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Radius filter */}
          <Text style={filterStyles.sectionTitle}>NEARBY RADIUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={filterStyles.chipRow}>
            {radiusOptions.map((r) => {
              const active = filters.radius === r;
              const label = r === 0 ? 'ALL' : `${r}m`;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setFilters({ ...filters, radius: r })}
                  style={[
                    filterStyles.chip,
                    active && { backgroundColor: Colors.cyanFaint, borderColor: Colors.cyan + '50' },
                  ]}
                >
                  <Text style={[filterStyles.chipText, active && { color: active ? Colors.cyan : Colors.textTertiary }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Hazard overlay toggle */}
          <Text style={filterStyles.sectionTitle}>OVERLAYS</Text>
          <TouchableOpacity
            onPress={() => setFilters({ ...filters, hazards: !filters.hazards })}
            style={[
              filterStyles.toggleRow,
              filters.hazards && { borderColor: Colors.danger + '50' },
            ]}
          >
            <Ionicons
              name={filters.hazards ? 'checkbox' : 'square-outline'}
              size={18}
              color={filters.hazards ? Colors.danger : Colors.textTertiary}
            />
            <Text style={[filterStyles.toggleLabel, filters.hazards && { color: Colors.danger }]}>
              HAZARD ZONES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={filterStyles.applyButton} onPress={onClose}>
            <Text style={filterStyles.applyText}>APPLY FILTERS</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const filterStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,7,18,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.cyanBorder,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  glowLine: {
    height: 1,
    backgroundColor: Colors.cyan + '40',
    marginBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginTop: 14,
    marginBottom: 8,
  },
  chipRow: { gap: 6, paddingRight: 16 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
  },
  toggleLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1.5,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: Colors.cyanFaint,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2,
  },
});

/* ─── Man-Down Alert Overlay ─── */
function ManDownOverlay({ visible, responders, onClose }) {
  if (!visible || !responders) return null;

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={mdStyles.overlay}>
        <View style={mdStyles.card}>
          <View style={mdStyles.glowLine} />

          {/* Header */}
          <View style={mdStyles.header}>
            <View style={mdStyles.pulseRing}>
              <Ionicons name="warning" size={28} color={Colors.danger} />
            </View>
            <Text style={mdStyles.title}>MAN-DOWN ALERT</Text>
            <Text style={mdStyles.subtitle}>Emergency broadcast sent</Text>
          </View>

          {/* Actions taken */}
          <View style={mdStyles.section}>
            <Text style={mdStyles.sectionTitle}>SYSTEM ACTIONS</Text>
            <View style={mdStyles.actionRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={mdStyles.actionText}>2 closest responders identified</Text>
            </View>
            <View style={mdStyles.actionRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={mdStyles.actionText}>Priority alert dispatched</Text>
            </View>
            <View style={mdStyles.actionRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={mdStyles.actionText}>Command notified (Capt. Rivera)</Text>
            </View>
            <View style={mdStyles.actionRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={mdStyles.actionText}>Route highlighted on map</Text>
            </View>
          </View>

          {/* Closest responders */}
          <View style={mdStyles.section}>
            <Text style={mdStyles.sectionTitle}>RESPONDING</Text>
            {responders.map((r) => {
              const s = StatusStyles[r.status];
              return (
                <View key={r.id} style={mdStyles.responderRow}>
                  <View style={[mdStyles.responderIcon, { borderColor: s.color + '60', backgroundColor: s.bg }]}>
                    <Text style={[mdStyles.responderInitial, { color: s.color }]}>
                      {r.name.split(' ').pop()[0]}
                    </Text>
                  </View>
                  <View style={mdStyles.responderInfo}>
                    <Text style={mdStyles.responderName}>{r.name}</Text>
                    <Text style={mdStyles.responderDetail}>
                      {r.role} · {Math.round(r.dist)}m away
                    </Text>
                  </View>
                  <View style={[mdStyles.etaBadge, { borderColor: Colors.cyan + '40' }]}>
                    <Text style={mdStyles.etaText}>
                      ~{Math.max(1, Math.round(r.dist / 80))} min
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={mdStyles.closeButton} onPress={onClose}>
            <Text style={mdStyles.closeText}>DISMISS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const mdStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,7,18,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.danger + '40',
    width: '100%',
    overflow: 'hidden',
  },
  glowLine: { height: 3, backgroundColor: Colors.danger + '80' },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    gap: 8,
  },
  pulseRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.danger + '60',
    backgroundColor: Colors.dangerFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.danger,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 11,
    color: Colors.text,
    fontFamily: 'monospace',
    letterSpacing: 0.3,
  },
  responderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  responderIcon: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responderInitial: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  responderInfo: { flex: 1 },
  responderName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBright,
  },
  responderDetail: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  etaBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: Colors.cyanFaint,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 0.5,
  },
  closeButton: {
    margin: 16,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
});

/* ════════════════════════════════════════════
   MAIN MAP SCREEN
   ════════════════════════════════════════════ */

const INITIAL_REGION = {
  latitude: 40.7142,
  longitude: -74.0060,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

export default function MapScreen() {
  const mapRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    division: 'All',
    status: 'All',
    radius: 0,
    hazards: true,
  });
  const [manDownActive, setManDownActive] = useState(false);
  const [manDownResponders, setManDownResponders] = useState(null);

  const currentIncidentId = USER_PROFILE.incidentId;
  const divisions = useMemo(() => getDivisions(TEAM, currentIncidentId), []);

  // Apply filters
  const filteredTeam = useMemo(() => {
    return TEAM.filter((m) => {
      if (filters.division !== 'All' && m.division !== filters.division) return false;
      if (filters.status !== 'All' && m.status !== filters.status) return false;
      if (filters.radius > 0) {
        const dist = getDistanceMeters(USER_PROFILE.coords, m.coords);
        if (dist > filters.radius) return false;
      }
      return true;
    });
  }, [filters]);

  // Hazard zones for current incident
  const hazards = filters.hazards
    ? HAZARD_ZONES.filter((h) => h.incidentId === currentIncidentId)
    : [];

  const hazardColors = {
    danger: { fill: 'rgba(255,59,59,0.12)', stroke: 'rgba(255,59,59,0.5)' },
    warning: { fill: 'rgba(255,176,32,0.10)', stroke: 'rgba(255,176,32,0.4)' },
    caution: { fill: 'rgba(0,212,255,0.08)', stroke: 'rgba(0,212,255,0.3)' },
  };

  // Qualified responders (not offline or needing help themselves)
  const qualifiedResponders = useMemo(
    () => TEAM.filter(
      (m) => m.status !== RESPONDER_STATUS.OFFLINE && m.status !== RESPONDER_STATUS.NEEDSHELP
    ),
    []
  );
  const manDownEnabled = qualifiedResponders.length >= MAN_DOWN.MIN_RESPONDERS;

  // Man-down trigger
  const handleManDown = () => {
    if (!manDownEnabled) return;
    Alert.alert(
      'MAN-DOWN EMERGENCY',
      'This will broadcast an emergency alert to your team and command. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'CONFIRM',
          style: 'destructive',
          onPress: () => {
            const closest = getClosestResponders(USER_PROFILE.coords, TEAM);
            setManDownResponders(closest);
            setManDownActive(true);
          },
        },
      ]
    );
  };

  // Active filter count for badge
  const activeFilterCount = [
    filters.division !== 'All',
    filters.status !== 'All',
    filters.radius > 0,
  ].filter(Boolean).length;

  return (
    <View style={styles.screen}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation={false}
        showsCompass={false}
        showsMyLocationButton={false}
      >
        {/* Hazard zone circles */}
        {hazards.map((hz) => {
          const hc = hazardColors[hz.type] || hazardColors.caution;
          return (
            <Circle
              key={hz.id}
              center={hz.center}
              radius={hz.radius}
              fillColor={hc.fill}
              strokeColor={hc.stroke}
              strokeWidth={1.5}
            />
          );
        })}

        {/* User marker */}
        <Marker coordinate={USER_PROFILE.coords} anchor={{ x: 0.5, y: 0.8 }}>
          <TeamMarker member={USER_PROFILE} isUser />
        </Marker>

        {/* Teammate markers */}
        {filteredTeam.map((m) => (
          <Marker key={m.id} coordinate={m.coords} anchor={{ x: 0.5, y: 0.8 }}>
            <TeamMarker member={m} />
          </Marker>
        ))}
      </MapView>
      <View style={styles.hamburger}>
          <HamburgerButton />
      </View>   
      {/* ICS assignment banner */}
      <ICSBanner profile={USER_PROFILE} />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Filter button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons name="filter" size={18} color={Colors.cyan} />
          <Text style={styles.controlLabel}>FILTER</Text>
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Man-down button */}
        <TouchableOpacity
          style={[styles.manDownButton, !manDownEnabled && styles.manDownButtonDisabled]}
          onPress={handleManDown}
          activeOpacity={manDownEnabled ? 0.7 : 1}
          disabled={!manDownEnabled}
        >
          <Ionicons
            name="alert-circle"
            size={28}
            color={manDownEnabled ? Colors.danger : Colors.textTertiary}
          />
          <Text style={[styles.manDownLabel, !manDownEnabled && styles.manDownLabelDisabled]}>
            MAN{'\n'}DOWN
          </Text>
          {!manDownEnabled && (
            <Text style={styles.manDownUnavailable}>
              {qualifiedResponders.length}/{MAN_DOWN.MIN_RESPONDERS}
            </Text>
          )}
        </TouchableOpacity>

        {/* Recenter button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 300)}
        >
          <Ionicons name="locate" size={18} color={Colors.cyan} />
          <Text style={styles.controlLabel}>CENTER</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(StatusStyles)
          .filter(([k]) => k !== 'offline')
          .map(([key, val]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: val.color }]} />
              <Text style={[styles.legendText, { color: val.color }]}>{val.label}</Text>
            </View>
          ))}
      </View>

      {/* Teammate count */}
      <View style={styles.countBadge}>
        <Ionicons name="people" size={12} color={Colors.cyan} />
        <Text style={styles.countText}>
          {filteredTeam.length}/{TEAM.length} VISIBLE
        </Text>
      </View>

      {/* Filter Panel */}
      <FilterPanel
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        divisions={divisions}
      />

      {/* Man-Down Overlay */}
      <ManDownOverlay
        visible={manDownActive}
        responders={manDownResponders}
        onClose={() => setManDownActive(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  controls: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  controlButton: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  controlLabel: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 1.5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.bg,
    fontFamily: 'monospace',
  },
  manDownButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.danger + '60',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  manDownLabel: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.danger,
    letterSpacing: 1.5,
    textAlign: 'center',
    lineHeight: 10,
  },
  manDownButtonDisabled: {
    borderColor: Colors.border,
    shadowOpacity: 0,
    opacity: 0.5,
  },
  manDownLabelDisabled: {
    color: Colors.textTertiary,
  },
  manDownUnavailable: {
    fontSize: 7,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  legend: {
    position: 'absolute',
    bottom: 114,
    left: 12,
    backgroundColor: Colors.surface + 'e6',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  countBadge: {
    position: 'absolute',
    top: 108,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 1,
  },
  hamburger: {
    position: 'absolute',
    top: 110,
    left: 12,
    zIndex: 10,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    padding: 10,
  },
});
