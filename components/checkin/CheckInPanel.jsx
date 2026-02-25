/**
 * CheckInPanel — Solo Leveling system notification style bottom sheet.
 * Two-tap flow: select status → confirm.
 * Preserves gesture-based dismiss and haptic feedback.
 *
 * Props:
 *   visible        (bool)
 *   onClose        (func)
 *   currentStatus  (string)
 *   onStatusChange (func)
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, StatusStyles } from '../../constants/colors';

const STATUS_OPTIONS = ['safe', 'enroute', 'onscene', 'needshelp'];
const SCREEN_HEIGHT = Dimensions.get('window').height;

function getIconName(status) {
  const map = {
    safe: 'checkmark-circle',
    enroute: 'arrow-forward-circle',
    onscene: 'eye',
    needshelp: 'warning',
  };
  return map[status] || 'help-circle';
}

export default function CheckInPanel({
  visible,
  onClose,
  currentStatus,
  onStatusChange,
}) {
  const [confirming, setConfirming] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const translateY = useSharedValue(0);
  const shouldDismiss = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose = translateY.value > 120 || event.velocityY > 1000;
      if (shouldClose) {
        shouldDismiss.value = true;
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
      } else {
        translateY.value = withSpring(0);
      }
    });

  useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
  }, [visible]);

  useEffect(() => {
    const id = setInterval(() => {
      if (shouldDismiss.value && translateY.value >= 500) {
        shouldDismiss.value = false;
        setConfirmed(false);
        setConfirming(null);
        onClose();
      }
    }, 16);
    return () => clearInterval(id);
  }, []);

  const handleSelect = (status) => {
    setConfirming(status);
  };

  const handleConfirm = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Heavy);
    onStatusChange(confirming);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setConfirming(null);
      onClose();
    }, 1100);
  };

  const renderConfirmed = () => {
    const s = StatusStyles[confirming];
    return (
      <View style={styles.confirmedContainer}>
        <View style={[styles.confirmedIcon, { backgroundColor: s.bg, borderColor: s.color + '60' }]}>
          <Ionicons name="checkmark" size={32} color={s.color} />
        </View>
        <Text style={styles.confirmedTitle}>STATUS UPDATED</Text>
        <Text style={[styles.confirmedStatus, { color: s.color }]}>
          [{s.label}]
        </Text>
        <Text style={styles.confirmedDetail}>Broadcast to all team members</Text>
      </View>
    );
  };

  const renderConfirmStep = () => {
    const s = StatusStyles[confirming];
    return (
      <View style={styles.confirmStep}>
        <View style={[styles.confirmIcon, { backgroundColor: s.bg, borderColor: s.color + '60' }]}>
          <Ionicons name={getIconName(confirming)} size={28} color={s.color} />
        </View>
        <Text style={styles.confirmText}>
          Update status to{' '}
          <Text style={{ color: s.color, fontWeight: '700' }}>
            [{s.label}]
          </Text>
          ?
        </Text>
        <View style={styles.confirmButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setConfirming(null)}
          >
            <Text style={styles.backButtonText}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: s.bg, borderColor: s.color + '60' }]}
            onPress={handleConfirm}
          >
            <Text style={[styles.confirmButtonText, { color: s.color }]}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderOptions = () => (
    <View style={styles.options}>
      {STATUS_OPTIONS.map((key) => {
        const s = StatusStyles[key];
        const isCurrent = key === currentStatus;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.option,
              { borderColor: isCurrent ? s.color + '50' : Colors.border },
              isCurrent && { backgroundColor: s.bg },
            ]}
            onPress={() => handleSelect(key)}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: s.bg, borderColor: s.color + '50' }]}>
              <Ionicons name={getIconName(key)} size={20} color={s.color} />
            </View>
            <Text style={[styles.optionLabel, { color: s.color }]}>{s.label}</Text>
            <View style={{ flex: 1 }} />
            {isCurrent && (
              <Text style={[styles.currentTag, { color: s.color }]}>[CURRENT]</Text>
            )}
            <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, animatedStyle]}>
            {/* Handle bar */}
            <View style={styles.handle} />

            {/* Top glow line */}
            <View style={styles.glowLine} />

            {confirmed ? (
              renderConfirmed()
            ) : (
              <>
                <Text style={styles.title}>QUICK CHECK-IN</Text>
                <Text style={styles.subtitle}>Select your current status</Text>
                {confirming ? renderConfirmStep() : renderOptions()}
              </>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.8)',
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
    paddingTop: 12,
    position: 'relative',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'center',
    marginBottom: 16,
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1,
    backgroundColor: Colors.cyan + '40',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.cyan,
    fontFamily: 'monospace',
    letterSpacing: 2.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 4,
    backgroundColor: Colors.panel,
    borderWidth: 1,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  currentTag: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginRight: 4,
  },
  // Confirm step
  confirmStep: {
    alignItems: 'center',
    paddingTop: 8,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  backButton: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
    color: Colors.textTertiary,
  },
  confirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  // Confirmed
  confirmedContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  confirmedIcon: {
    width: 72,
    height: 72,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmedTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2,
  },
  confirmedStatus: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginTop: 6,
  },
  confirmedDetail: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    marginTop: 10,
    letterSpacing: 0.5,
  },
});
