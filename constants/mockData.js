/**
 * PSC Companion — Mock Data
 * Import: import { TEAM, INCIDENTS, ALERTS, HAZARD_ZONES, USER_PROFILE } from '../constants/mockData';
 */

/**
 * Current user profile — the person using the app.
 */
export const USER_PROFILE = {
  id: '0',
  name: 'You (FF Sallam)',
  role: 'Engine 7',
  status: 'onscene',
  level: 25,
  incidentId: 'INC-4821',
  division: 'Division Alpha',
  assignment: 'Search Team 1',
  coords: { latitude: 40.7138, longitude: -74.0060 },
};

export const TEAM = [
  {
    id: '1',
    name: 'Capt. Rivera',
    role: 'Incident Commander',
    status: 'onscene',
    lastUpdate: '2m ago',
    signal: 3,
    level: 47,
    incidentId: 'INC-4821',
    division: 'Command',
    assignment: 'Incident Command Post',
    coords: { latitude: 40.7142, longitude: -74.0064 },
  },
  {
    id: '2',
    name: 'Lt. Chen',
    role: 'Operations',
    status: 'safe',
    lastUpdate: '5m ago',
    signal: 4,
    level: 38,
    incidentId: 'INC-4819',
    division: 'Medical Group',
    assignment: 'Triage Lead',
    coords: { latitude: 40.7180, longitude: -74.0010 },
  },
  {
    id: '3',
    name: 'FF Torres',
    role: 'Engine 7',
    status: 'enroute',
    lastUpdate: '1m ago',
    signal: 2,
    level: 22,
    incidentId: 'INC-4821',
    division: 'Division Alpha',
    assignment: 'Search Team 1',
    coords: { latitude: 40.7125, longitude: -74.0045 },
  },
  {
    id: '4',
    name: 'PM Walsh',
    role: 'Medic 3',
    status: 'onscene',
    lastUpdate: '8m ago',
    signal: 4,
    level: 31,
    incidentId: 'INC-4821',
    division: 'Division Alpha',
    assignment: 'Medical Standby',
    coords: { latitude: 40.7135, longitude: -74.0058 },
  },
  {
    id: '5',
    name: 'FF Okafor',
    role: 'Ladder 2',
    status: 'needshelp',
    lastUpdate: '30s ago',
    signal: 1,
    level: 19,
    incidentId: 'INC-4821',
    division: 'Division Beta',
    assignment: 'Ventilation',
    coords: { latitude: 40.7145, longitude: -74.0068 },
  },
  {
    id: '6',
    name: 'Lt. Park',
    role: 'Hazmat',
    status: 'offline',
    lastUpdate: '12m ago',
    signal: 0,
    level: 35,
    incidentId: 'INC-4821',
    division: 'Division Beta',
    assignment: 'Perimeter Control',
    coords: { latitude: 40.7150, longitude: -74.0072 },
  },
];

/**
 * Hazard zones — polygons/circles displayed as map overlays.
 */
export const HAZARD_ZONES = [
  {
    id: 'hz-1',
    label: 'Collapse Zone',
    type: 'danger',
    center: { latitude: 40.7142, longitude: -74.0064 },
    radius: 40, // meters
    incidentId: 'INC-4821',
  },
  {
    id: 'hz-2',
    label: 'Gas Leak Perimeter',
    type: 'warning',
    center: { latitude: 40.7146, longitude: -74.0070 },
    radius: 60,
    incidentId: 'INC-4821',
  },
  {
    id: 'hz-3',
    label: 'Crowd Area',
    type: 'caution',
    center: { latitude: 40.7180, longitude: -74.0010 },
    radius: 30,
    incidentId: 'INC-4819',
  },
];

export const INCIDENTS = [
  {
    id: 'INC-4821',
    type: 'Structure Fire',
    location: '742 Elm St',
    address: '742 Elm St, Unit B, Downtown District',
    priority: 'high',
    time: '14:23',
    units: 4,
    distance: '1.2 mi',
    hazards: ['Structural collapse risk', 'Possible gas leak'],
    assignedTeam: ['Capt. Rivera', 'PM Walsh', 'FF Okafor', 'FF Torres'],
    resourcesRequested: ['Ladder truck', 'Hazmat unit', 'Additional medic'],
    callTranscript:
      'Caller reports heavy smoke from second floor of residential building. Occupants believed to still be inside. Caller states they heard an explosion before the fire started.',
    timeline: [
      { time: '14:23', event: 'Dispatch received — structure fire reported' },
      { time: '14:25', event: 'Engine 7 + Medic 3 dispatched' },
      { time: '14:28', event: 'Capt. Rivera on scene — confirms active fire' },
      { time: '14:31', event: 'FF Okafor requests assistance — Ladder 2' },
      { time: '14:33', event: 'Hazmat unit requested — possible gas leak' },
    ],
  },
  {
    id: 'INC-4819',
    type: 'Medical Response',
    location: 'Riverside Park',
    address: 'Riverside Park, North Entrance, Pavilion Area',
    priority: 'medium',
    time: '13:47',
    units: 2,
    distance: '0.8 mi',
    hazards: ['Crowd gathering'],
    assignedTeam: ['Lt. Chen', 'PM Walsh'],
    resourcesRequested: ['Additional medic'],
    callTranscript:
      'Caller reports adult male collapsed near the north pavilion. Conscious but disoriented. Possible heat exhaustion. Bystanders providing shade.',
    timeline: [
      { time: '13:47', event: 'Dispatch received — medical emergency' },
      { time: '13:50', event: 'Medic 3 dispatched' },
      { time: '13:55', event: 'Lt. Chen on scene — patient stable' },
    ],
  },
];

export const ALERTS = [
  {
    id: '1',
    type: 'urgent',
    title: 'FF Okafor needs assistance',
    detail: 'Ladder 2 — last signal 30s ago',
    time: '14:31',
  },
  {
    id: '2',
    type: 'info',
    title: 'Capt. Rivera checked in',
    detail: 'Status: On Scene',
    time: '14:29',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Connectivity degraded',
    detail: 'Sector B — 2 units affected',
    time: '14:22',
  },
  {
    id: '4',
    type: 'info',
    title: 'FF Torres en route',
    detail: 'Engine 7 — ETA 4 min',
    time: '14:20',
  },
];
