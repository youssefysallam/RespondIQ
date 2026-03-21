/**
 * Check In Screen
 * Owner: Azealia
 * Solo Leveling system UI style.
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, StatusStyles } from "../../constants/colors";

const STATUS_KEYS = ["safe", "enroute", "onscene", "needshelp"];

export default function CheckInScreen() {
  const [currentStatus, setCurrentStatus] = useState("safe");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [info, setInfo] = useState(null);
  const [infoType, setInfoType] = useState(null);

  const current = StatusStyles[currentStatus];

  const pending = useMemo(() => {
    if (!pendingStatus) return null;
    return StatusStyles[pendingStatus];
  }, [pendingStatus]);

  const onPickStatus = async (key) => {
    if (key === currentStatus) {
      await Haptics.selectionAsync();
      setPendingStatus(null);
      setInfo("ALREADY CURRENT STATUS");
      setInfoType("warning");
      return;
    }
    await Haptics.selectionAsync();
    setInfo(null);
    setPendingStatus(key);
  };

  const onCancel = async () => {
    await Haptics.selectionAsync();
    setPendingStatus(null);
  };

  const onConfirm = async () => {
    if (!pendingStatus) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Heavy);
    setCurrentStatus(pendingStatus);
    setPendingStatus(null);
    setInfo("STATUS UPDATED · TEAM NOTIFIED");
    setInfoType("success");
  };

  const alertColor =
    infoType === "success" ? Colors.success : Colors.warning;
  const alertGlow =
    infoType === "success" ? Colors.successGlow : Colors.warningGlow;
  const alertBg =
    infoType === "success" ? Colors.successFaint : Colors.warningFaint;
  const alertIcon =
    infoType === "success" ? "checkmark-circle" : "alert-circle";

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>CURRENT STATUS</Text>

        <View style={[styles.statusPanel, { borderColor: current.color + "40" }]}>
          <View style={[styles.statusDot, { backgroundColor: current.color }]} />
          <Text style={[styles.statusLabel, { color: current.color }]}>
            [{current.label}]
          </Text>
        </View>

        <View style={styles.grid}>
          {STATUS_KEYS.map((key) => {
            const s = StatusStyles[key];
            const isCurrent = key === currentStatus;
            const isPending = key === pendingStatus;

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.statusButton,
                  { borderColor: s.color + (isCurrent ? "70" : "35") },
                  isCurrent && { backgroundColor: s.bg },
                  isPending && {
                    shadowColor: s.color,
                    shadowOpacity: 0.35,
                    elevation: 10,
                  },
                ]}
                onPress={() => onPickStatus(key)}
                activeOpacity={0.75}
              >
                <Text style={[styles.statusButtonText, { color: s.color }]}>
                  {s.label}
                </Text>
                {isCurrent && (
                  <Text style={[styles.currentTag, { color: s.color }]}>
                    [CURRENT]
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {pendingStatus && pending && (
          <View style={[styles.confirmBox, { borderColor: pending.color + "50" }]}>
            <Text style={styles.confirmText}>
              Update status to{" "}
              <Text style={{ color: pending.color, fontWeight: "700" }}>
                [{pending.label}]
              </Text>
              ?
            </Text>

            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: pending.bg,
                    borderColor: pending.color + "60",
                  },
                ]}
                onPress={onConfirm}
              >
                <Text style={[styles.confirmBtnText, { color: pending.color }]}>
                  CONFIRM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!!info && (
          <View
            style={[
              styles.alertBox,
              {
                borderColor: alertColor + "40",
                backgroundColor: alertBg,
              },
            ]}
          >
            {/* Glow line */}
            <View style={[styles.alertGlow, { backgroundColor: alertColor + "50" }]} />

            {/* Icon circle */}
            <View style={[styles.alertIconBox, { borderColor: alertColor + "50" }]}>
              <Ionicons name={alertIcon} size={22} color={alertColor} />
            </View>

            <Text style={[styles.alertText, { color: alertColor }]}>
              {info}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    color: Colors.cyan,
    letterSpacing: 2.5,
    marginBottom: 16,
  },
  statusPanel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 4,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    marginBottom: 16,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusLabel: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1.5,
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 4,
  },
  statusButton: {
    width: "48%",
    minHeight: 58,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "800",
    fontFamily: "monospace",
    letterSpacing: 1.6,
    textAlign: "center",
  },
  currentTag: {
    marginTop: 4,
    fontSize: 9,
    fontFamily: "monospace",
    letterSpacing: 1.4,
    opacity: 0.9,
  },

  confirmBox: {
    width: "100%",
    marginTop: 60,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
  },
  confirmText: {
    color: Colors.textBright,
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 0.6,
    marginBottom: 10,
    textAlign: "center",
  },
  confirmRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "900",
    letterSpacing: 1.8,
  },

  alertBox: {
    width: "100%",
    marginTop: 60,
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
  },
  alertGlow: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: 1,
  },
  alertIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
  },
});
