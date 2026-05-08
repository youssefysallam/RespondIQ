export const MAP_DEFAULTS = {
  LATITUDE_DELTA: 0.006,
  LONGITUDE_DELTA: 0.006,
  HAZARD_ZONE_OPACITY: 0.12,
  RADIUS_OPTIONS: [0.5, 1, 2, 5] as const,
} as const;

export const RESPONDER_STATUS = {
  OFFLINE: 'offline',
  NEEDSHELP: 'needshelp',
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
} as const;

export const MAN_DOWN = {
  MIN_RESPONDERS: 2,
  METERS_PER_MINUTE: 80,
} as const;

export const SIGNAL_LEVELS = {
  STRONG: 'strong',
  MEDIUM: 'medium',
  WEAK: 'weak',
  NONE: 'none',
} as const;

export const INCIDENT_STATUS = {
  ACTIVE: 'active',
  STANDBY: 'standby',
  RESOLVED: 'resolved',
} as const;
