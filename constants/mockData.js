/**
 * PSC Companion — Mock Data
 * Shared data source for all screens.
 * Eventually this gets replaced with a real backend / state management.
 *
 * Import: import { TEAM, INCIDENTS, ALERTS } from '../constants/mockData';
 */

export const TEAM = [
  {
    id: '1',
    name: 'Capt. Rivera',
    role: 'Incident Commander',
    status: 'onscene',
    lastUpdate: '2m ago',
    signal: 3,
  },
  {
    id: '2',
    name: 'Lt. Chen',
    role: 'Operations',
    status: 'safe',
    lastUpdate: '5m ago',
    signal: 4,
  },
  {
    id: '3',
    name: 'FF Torres',
    role: 'Engine 7',
    status: 'enroute',
    lastUpdate: '1m ago',
    signal: 2,
  },
  {
    id: '4',
    name: 'PM Walsh',
    role: 'Medic 3',
    status: 'onscene',
    lastUpdate: '8m ago',
    signal: 4,
  },
  {
    id: '5',
    name: 'FF Okafor',
    role: 'Ladder 2',
    status: 'needshelp',
    lastUpdate: '30s ago',
    signal: 1,
  },
  {
    id: '6',
    name: 'Lt. Park',
    role: 'Hazmat',
    status: 'offline',
    lastUpdate: '12m ago',
    signal: 0,
  },
];

export const INCIDENTS = [
  {
    id: 'INC-4821',
    type: 'Structure Fire',
    location: '742 Elm St',
    priority: 'high',
    time: '14:23',
    units: 4,
  },
  {
    id: 'INC-4819',
    type: 'Medical Response',
    location: 'Riverside Park',
    priority: 'medium',
    time: '13:47',
    units: 2,
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
