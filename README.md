# PSC Companion

A mobile first interface for first responders to stay connected, coordinate quickly, and maintain situational awareness during critical deployments.

**Course:** CS 415/615, User Interface Design
**Group 9:** Youssef Sallam, Azealia Khalid

## Quick Start

### Prerequisites

You will need [Node.js](https://nodejs.org/) v18 or newer installed, and the [Expo Go](https://expo.dev/go) app on your phone so the project can be previewed on a real device.

### Setup

```bash
git clone https://github.com/youssefysallam/PSCCompanion.git
cd PSCCompanion
npm install
npx expo start
```

Then scan the QR code with Expo Go, so the app runs on your phone.

### Running the Map

The MAP tab uses `react-native-maps`, which is already declared in `package.json`, so `npm install` pulls it in automatically. However, `react-native-maps` is a native module, thus it will not load inside a plain web preview, so always test it through Expo Go on a device or through the iOS / Android simulator. If the map stays blank on first launch, clear the Expo cache with `npx expo start -c` and then reopen the app.

## What's Completed

The app currently ships five tabs, such as TEAM, ALERTS, CHECK IN, PROFILE, and MAP. The TEAM dashboard shows roster status, signal strength, and incident metadata, so leads can read the whole picture at a glance. The CHECK IN flow was redesigned from a 3 step process into a 2 step process because the extra tab hop was slowing people down, thus it now doubles as the landing screen. The ALERTS feed surfaces operational messages, and the PROFILE tab shows the current user's role, assignment, and incident context. On top of that, the MAP tab renders teammates over a dark themed map with hazard zones, filters for division, status, and radius, an ICS assignment banner, and a MAN DOWN emergency flow that picks the two closest qualified responders and displays a confirmation overlay. Furthermore, a shared component layer such as Avatar, StatusBadge, and SignalBars keeps the visual language consistent across every screen.

## Project Structure

```
PSCCompanion/
├── app/                            Screens (Expo Router, file based routing)
│   ├── _layout.jsx                 Root layout
│   ├── index.jsx                   Entry redirect
│   └── (drawer)/
│       ├── _layout.jsx             Drawer layout
│       └── (tabs)/
│           ├── _layout.jsx         Tab bar configuration
│           ├── index.jsx           Team Dashboard
│           ├── alerts.jsx          Alerts feed
│           ├── checkin.jsx         Check In landing and flow
│           ├── profile.jsx         User profile
│           └── map.jsx             Tactical map
├── components/
│   ├── shared/                     Reusable pieces such as Avatar, StatusBadge, SignalBars
│   ├── dashboard/                  Dashboard pieces such as TeamMemberRow, IncidentCard
│   └── checkin/                    Check in panel
├── constants/
│   ├── colors.js                   Design system colors and status styles
│   └── mockData.js                 Shared mock data for team, incidents, hazards, profile
└── assets/
```

## Ownership

| Feature | Owner | Files |
| :--- | :--- | :--- |
| App scaffold and navigation | Youssef | `app/_layout.jsx`, `app/(drawer)/_layout.jsx`, `app/(drawer)/(tabs)/_layout.jsx` |
| Team Dashboard | Youssef | `app/(drawer)/(tabs)/index.jsx`, `components/dashboard/` |
| Profile screen | Youssef | `app/(drawer)/(tabs)/profile.jsx` |
| Check In flow | Azealia | `app/(drawer)/(tabs)/checkin.jsx`, `components/checkin/` |
| Alerts screen | Azealia | `app/(drawer)/(tabs)/alerts.jsx` |
| Map screen | Youssef, Azealia | `app/(drawer)/(tabs)/map.jsx` |
| Shared components | Both | `components/shared/` |
| Colors and mock data | Both | `constants/colors.js`, `constants/mockData.js` |

## Git Workflow

Always start from the latest `main` branch, then create a feature branch with `git checkout -b yourname/feature-name`, so your work stays isolated. After you have made commits, push with `git push -u origin yourname/feature-name`, then open a Pull Request on GitHub and merge into `main` once reviewed.

```bash
git checkout main
git pull
git checkout -b yourname/feature-name
git add .
git commit -m "descriptive message"
git push -u origin yourname/feature-name
```

## Tech Stack

The app is built on React Native with Expo, it routes through Expo Router for file based navigation, it uses `@expo/vector-icons` (Ionicons) for iconography, and it renders the tactical map with `react-native-maps`.
