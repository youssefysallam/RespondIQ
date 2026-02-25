/**
 * Alerts Screen
 * Owner: Azealia
 * Solo Leveling system notification style.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { ALERTS } from '../../constants/mockData';

const TYPE_STYLES = {
  urgent: { color: Colors.danger, bg: Colors.dangerFaint, icon: 'warning' },
  warning: { color: Colors.warning, bg: Colors.warningFaint, icon: 'cellular' },
  info: { color: Colors.cyan, bg: Colors.cyanFaint, icon: 'checkmark-circle' },
};

function AlertRow({ alert, isLast }) {
  const s = TYPE_STYLES[alert.type] || TYPE_STYLES.info;
  const isUrgent = alert.type === 'urgent';

  return (
    <View
      style={[
        styles.alertRow,
        !isLast && styles.alertBorder,
        isUrgent && styles.alertUrgent,
      ]}
    >
      {/* Left color bar */}
      <View style={[styles.leftBar, { backgroundColor: s.color }]} />

      <View style={[styles.alertIcon, { backgroundColor: s.bg, borderColor: s.color + '40' }]}>
        <Ionicons name={s.icon} size={14} color={s.color} />
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertTop}>
          <Text style={styles.alertTitle} numberOfLines={1}>
            {alert.title}
          </Text>
          <Text style={styles.alertTime}>{alert.time}</Text>
        </View>
        <Text style={styles.alertDetail}>{alert.detail}</Text>
      </View>
    </View>
  );
}

function PanelHeader({ title, color = Colors.cyan }) {
  return (
    <View style={[styles.panelHeader, { borderBottomColor: color + '15' }]}>
      <View style={[styles.headerIcon, { borderColor: color }]}>
        <Text style={[styles.headerIconText, { color }]}>!</Text>
      </View>
      <Text style={[styles.headerTitle, { color }]}>{title}</Text>
    </View>
  );
}

export default function AlertsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>SYSTEM ALERTS</Text>
        <Text style={styles.subtitle}>Recent team activity</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.panel}>
          <PanelHeader title="Alert Feed" />
          {ALERTS.map((alert, i) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isLast={i === ALERTS.length - 1}
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
    paddingTop: 12,
  },
  panel: {
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    overflow: 'hidden',
  },
  panelHeader: {
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
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    paddingLeft: 16,
    position: 'relative',
  },
  alertUrgent: {
    backgroundColor: Colors.dangerFaint,
  },
  alertBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  alertContent: {
    flex: 1,
    minWidth: 0,
  },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBright,
    flex: 1,
  },
  alertTime: {
    fontSize: 9,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  alertDetail: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
