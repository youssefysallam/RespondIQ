/**
 * PSC Companion — Solo Leveling System UI Design Tokens
 * Dark theme with cyan glow, system-panel aesthetic.
 * Import: import { Colors, StatusStyles, STATUS_SORT_ORDER } from '../constants/colors';
 */

export const Colors = {
  // Backgrounds
  bg: '#070c1a',
  surface: '#0a1228',
  panel: 'rgba(8, 18, 40, 0.85)',

  // Primary glow accent
  cyan: '#00d4ff',
  cyanDim: '#0090b3',
  cyanGlow: 'rgba(0, 212, 255, 0.35)',
  cyanFaint: 'rgba(0, 212, 255, 0.08)',
  cyanBorder: 'rgba(0, 212, 255, 0.25)',

  // Semantic
  danger: '#ff3b3b',
  dangerGlow: 'rgba(255, 59, 59, 0.3)',
  dangerStrong: 'rgba(255, 59, 59, 0.16)',
  dangerFaint: 'rgba(255, 59, 59, 0.08)',
  orange: '#FF5F15',
  orangeStrong: 'gba(255, 149, 0, 0.16',
  orangeFaint:'rgba(255, 140, 0, 0.08)',
  warning: '#ffb020',
  warningGlow: 'rgba(255, 176, 32, 0.3)',
  warningStrong: 'rgba(255, 204, 0, 0.16)',
  warningFaint: 'rgba(255, 176, 32, 0.08)',
  success: '#00e676',
  successGlow: 'rgba(0, 230, 118, 0.3)',
  successFaint: 'rgba(0, 230, 118, 0.08)',

  // Text
  text: '#c8d6e5',
  textBright: '#e8f0fe',
  textSecondary: '#7a8ba8',
  textTertiary: '#4a6080',
  textQuaternary: '#7688a3',

  // Borders
  border: 'rgba(0, 212, 255, 0.12)',
  borderStrong: 'rgba(0, 212, 255, 0.25)',
};

/**
 * Status definitions — Solo Leveling system notification style.
 * Labels are UPPERCASE to match the game UI bracket style.
 */
export const StatusStyles = {
  safe: {
    color: Colors.success,
    glow: Colors.successGlow,
    bg: Colors.successFaint,
    label: 'SAFE',
    icon: 'checkmark-shield',
  },
  enroute: {
    color: Colors.cyan,
    glow: Colors.cyanGlow,
    bg: Colors.cyanFaint,
    label: 'EN ROUTE',
    icon: 'arrow-forward-circle',
  },
  onscene: {
    color: Colors.warning,
    glow: Colors.warningGlow,
    bg: Colors.warningFaint,
    label: 'ON SCENE',
    icon: 'eye',
  },
  needshelp: {
    color: Colors.danger,
    glow: Colors.dangerGlow,
    bg: Colors.dangerFaint,
    label: 'NEEDS HELP',
    icon: 'warning',
  },
  offline: {
    color: Colors.textTertiary,
    glow: 'transparent',
    bg: 'rgba(74, 96, 128, 0.08)',
    label: 'OFFLINE',
    icon: 'wifi-off',
  },
};

export const STATUS_SORT_ORDER = {
  needshelp: 0,
  onscene: 1,
  enroute: 2,
  safe: 3,
  offline: 4,
};
