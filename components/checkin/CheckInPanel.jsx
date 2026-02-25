/**
 * CheckInPanel — bottom sheet for quick status updates.
 * Two-tap flow: select status → confirm.
 *
 * Props:
 *   visible       (bool)     — controls visibility
 *   onClose       (func)     — called when panel is dismissed
 *   currentStatus (string)   — the user's current status key
 *   onStatusChange(func)     — called with new status key on confirm
 *
 * TODO (Azealia):
 *   - Add haptic feedback on confirm (expo-haptics)
 *   - Add slide-to-dismiss gesture
 *   - Animate the confirmation checkmark
 *   - Connect to real state management when ready
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
  View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, StatusStyles } from '../../constants/colors';

const STATUS_OPTIONS = ['safe', 'enroute', 'onscene', 'needshelp'];
const SCREEN_HEIGHT = Dimensions.get('window').height;

const STATUS_ICONS = {
  safe: 'checkmark-shield',
  enroute: 'arrow-forward',
  onscene: 'eye',
  needshelp: 'alert',
  offline: 'wifi-off', // not selectable, but here for reference
};

// Helper: get the right Ionicons name
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

  const translateY = useSharedValue(0); //intialy modal is visible 
  const shouldDismiss = useSharedValue(false);
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose =
        translateY.value > 120 || event.velocityY > 1000;
    
      if (shouldClose) {
        shouldDismiss.value = true;
        translateY.value = withTiming(SCREEN_HEIGHT, {duration: 250 });
      
      } else {
        translateY.value = withSpring(0);
      }
    });

    useEffect(() => {
      if (visible){
        translateY.value = 0;
      }
    }, [visible]);
    
    useEffect(() => {
      const id = setInterval(() => {
        if (shouldDismiss.value && translateY.value >= 500) {
          shouldDismiss.value = false;
          //reset internal state before closing 
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

  const handleConfirm = async() => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Heavy);
    onStatusChange(confirming);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setConfirming(null);
      onClose();
    }, 1100);
  };

  // Confirmation success screen
  const renderConfirmed = () => {
    const style = StatusStyles[confirming];
    return (
      <View style={styles.confirmedContainer}>
        <View style={[styles.confirmedIcon, { backgroundColor: style.bg }]}>
          <Ionicons name="checkmark" size={32} color={style.color} />
        </View>
        <Text style={styles.confirmedTitle}>Updated</Text>
        <Text style={[styles.confirmedStatus, { color: style.color }]}>
          {style.label}
        </Text>
        <Text style={styles.confirmedDetail}>Broadcast to your team</Text>
      </View>
    );
  };

  // Confirm step
  const renderConfirmStep = () => {
    const style = StatusStyles[confirming];
    return (
      <View style={styles.confirmStep}>
        <View style={[styles.confirmIcon, { backgroundColor: style.bg }]}>
          <Ionicons name={getIconName(confirming)} size={28} color={style.color} />
        </View>
        <Text style={styles.confirmText}>
          Change to{' '}
          <Text style={{ color: style.color, fontWeight: '700' }}>
            {style.label}
          </Text>
          ?
        </Text>
        <View style={styles.confirmButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setConfirming(null)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: style.color }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Selection list
  const renderOptions = () => (
    <View style={styles.options}>
      {STATUS_OPTIONS.map((key) => {
        const style = StatusStyles[key];
        const isCurrent = key === currentStatus;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.option,
              isCurrent && { backgroundColor: style.bg, borderColor: style.color + '30', borderWidth: 2 },
            ]}
            onPress={() => handleSelect(key)}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: style.bg }]}>
              <Ionicons name={getIconName(key)} size={20} color={style.color} />
            </View>
            <Text style={styles.optionLabel}>{style.label}</Text>
            <View style={{ flex: 1 }} />
            {isCurrent && (
              <View style={[styles.currentBadge, { backgroundColor: '#fff' }]}>
                <Text style={[styles.currentBadgeText, { color: style.color }]}>
                  Current
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style = {[styles.sheet, animatedStyle]}>
              {/* Handle bar */}
              <View style={styles.handle} />

              {confirmed ? (
                renderConfirmed()
              ) : (
                <>
                  <Text style={styles.title}>Check In</Text>
                  <Text style={styles.subtitle}>
                    Update your status for the team
                  </Text>
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
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#dce0e8',
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1d26',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#9099b0',
    marginBottom: 22,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#f8f9fb',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1d26',
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Confirm step
  confirmStep: {
    alignItems: 'center',
    paddingTop: 8,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmText: {
    fontSize: 16,
    color: '#1a1d26',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  backButton: {
    flex: 1,
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#f1f3f7',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5f6578',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  // Confirmed
  confirmedContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  confirmedIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1d26',
  },
  confirmedStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  confirmedDetail: {
    fontSize: 12,
    color: '#9099b0',
    marginTop: 8,
  },
});
