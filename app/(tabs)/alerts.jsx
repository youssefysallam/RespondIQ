/**
 * Alerts Screen
 * Owner: Azealia
 *
 * Shows a feed of team alerts and notifications.
 *
 * TODO:
 *  - Add pull-to-refresh
 *  - Mark alerts as read
 *  - Filter by type (urgent / warning / info)
 *  - Connect to real data source
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { ALERTS } from '../../constants/mockData';

const TYPE_STYLES = {
  urgent: { color: Colors.danger, bg: Colors.dangerBg, icon: 'warning' },
  warning: { color: Colors.warning, bg: Colors.warningBg, icon: 'cellular' },
  info: { color: Colors.accent, bg: Colors.accentLight, icon: 'checkmark-circle' },
};

function AlertRow({ alert, isLast }) {
  const style = TYPE_STYLES[alert.type] || TYPE_STYLES.info;

  return (
    <View style={[styles.alertRow, !isLast && styles.alertBorder]}>
      <View style={[styles.alertIcon, { backgroundColor: style.bg }]}>
        <Ionicons name={style.icon} size={16} color={style.color} />
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

export default function AlertsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>Recent team activity</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
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
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
  },
  alertBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
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
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  alertTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
  alertDetail: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 3,
  },
});
