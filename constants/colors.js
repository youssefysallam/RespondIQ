/**
 * PSC Companion — Design System Colors
 * Shared across all screens and components.
 * Import: import { Colors, StatusStyles } from '../constants/colors';
 */

export const Colors = {
  // Backgrounds
  bg: '#f2f4f7',
  surface: '#ffffff',

  // Primary accent
  accent: '#2d6cdf',
  accentLight: '#e8f0fe',
  accentSoft: '#4a8af4',

  // Semantic
  danger: '#d93025',
  dangerBg: '#fce8e6',
  warning: '#e8710a',
  warningBg: '#fef3e1',
  success: '#1a8d5f',
  successBg: '#e6f5ed',

  // Text
  text: '#1a1d26',
  textSecondary: '#5f6578',
  textTertiary: '#9099b0',

  // Borders & shadows
  border: 'rgba(0,0,0,0.06)',
  shadow: 'rgba(0,0,0,0.04)',
  shadowMd: 'rgba(0,0,0,0.07)',
};

/**
 * Status definitions — used everywhere a member status is displayed.
 * Keys match the `status` field in member data.
 */
export const StatusStyles = {
  safe: {
    color: Colors.success,
    bg: Colors.successBg,
    label: 'Safe',
  },
  enroute: {
    color: Colors.accent,
    bg: Colors.accentLight,
    label: 'En Route',
  },
  onscene: {
    color: Colors.warning,
    bg: Colors.warningBg,
    label: 'On Scene',
  },
  needshelp: {
    color: Colors.danger,
    bg: Colors.dangerBg,
    label: 'Needs Help',
  },
  offline: {
    color: Colors.textTertiary,
    bg: '#f0f1f5',
    label: 'Offline',
  },
};

/**
 * Helper: sort priority for statuses.
 * Lower number = shown first (more urgent).
 */
export const STATUS_SORT_ORDER = {
  needshelp: 0,
  onscene: 1,
  enroute: 2,
  safe: 3,
  offline: 4,
};
