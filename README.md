# RespondIQ

A React Native mobile app for coordinating emergency response teams in real time. Designed for rapid deployment in man-down scenarios, RespondIQ surfaces live responder locations on a map, monitors signal strength, and enforces a minimum-responder safety gate before allowing critical actions.

---

## Key Features

- **Live map view** — responder positions, incident markers, and hazard zone overlays rendered with React Native Maps
- **MAN DOWN safety gate** — requires ≥ 2 qualified responders (non-offline, non-NEEDSHELP) before the alert can be triggered; shows a real-time `n/2` count badge when the gate is closed
- **Signal-quality monitoring** — color-coded STRONG / MEDIUM / WEAK / NONE signal levels per responder
- **Incident lifecycle** — ACTIVE / STANDBY / RESOLVED status transitions with role-based controls
- **Offline-first constants** — all magic numbers (map deltas, thresholds, radius options) live in `constants/Config.ts` for easy auditing and tuning

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo Router (file-based routing) |
| Navigation | Drawer + Tab navigator |
| Maps | `react-native-maps` |
| State | React `useState` / `useMemo` |
| Language | JavaScript (JSX) |

---

## Project Structure

```
app/
  (drawer)/
    (tabs)/
      map.jsx        # Main map screen — responder pins, MAN DOWN button
      index.jsx      # Home / incident overview
constants/
  Config.ts          # Tunable constants: MAP_DEFAULTS, MAN_DOWN, SIGNAL_LEVELS, …
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```

Scan the QR code with Expo Go (iOS / Android) or press `i` / `a` for simulators.

---

## Notable Engineering Decisions

**MAN DOWN disabled-state guard** — `handleManDown` returns early when `qualifiedResponders.length < MAN_DOWN.MIN_RESPONDERS`. The button renders a live `n/2` counter so dispatchers can see exactly how far they are from the threshold, rather than silently ignoring the tap.

**`Config.ts` single source of truth** — all numeric thresholds previously scattered as inline literals are now `as const` objects. Changing `MAN_DOWN.MIN_RESPONDERS` in one place propagates everywhere instantly.

---

## Screenshots

> *Add screenshots or a demo GIF of the map view here.*
