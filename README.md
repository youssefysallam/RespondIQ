# PSC Companion

A mobile-first interface for first responders to stay connected, coordinate quickly, and maintain situational awareness during critical deployments.

**Course:** CS 415/615 — User Interface Design
**Group 9:** Youssef Sallam, Azealia Khalid

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Expo Go](https://expo.dev/go) app on your phone

### Setup
```bash
# Clone the repo
git clone https://github.com/youssefysallam/PSCCompanion.git
cd PSCCompanion

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go to run on your phone.

---

## Project Structure

```
PSCCompanion/
├── app/                      # Screens (Expo Router — file-based routing)
│   ├── _layout.jsx           # Root layout
│   └── (tabs)/
│       ├── _layout.jsx       # Tab bar configuration
│       ├── index.jsx         # Team Dashboard        [Youssef]
│       ├── checkin.jsx       # Check-In screen       [Azealia]
│       └── alerts.jsx        # Alerts feed           [Azealia]
├── components/
│   ├── shared/               # Reusable by both
│   │   ├── Avatar.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── SignalBars.jsx
│   │   └── index.js          # Barrel export
│   ├── dashboard/            # Dashboard-specific    [Youssef]
│   │   ├── TeamMemberRow.jsx
│   │   └── IncidentCard.jsx
│   └── checkin/              # Check-in-specific     [Azealia]
│       └── CheckInPanel.jsx
├── constants/
│   ├── colors.js             # Design system colors & status styles
│   └── mockData.js           # Shared mock data
└── assets/
```

---

## Ownership

| Feature              | Owner    | Files                                      |
| -------------------- | -------- | ------------------------------------------ |
| App scaffold & nav   | Youssef  | `app/_layout`, `app/(tabs)/_layout`        |
| Team Dashboard       | Youssef  | `app/(tabs)/index`, `components/dashboard` |
| Check-In flow        | Azealia  | `app/(tabs)/checkin`, `components/checkin`  |
| Alerts screen        | Azealia  | `app/(tabs)/alerts`                        |
| Shared components    | Both     | `components/shared`                        |
| Colors & data        | Both     | `constants/`                               |

---

## Git Workflow

```bash
# Always start from latest main
git checkout main
git pull

# Create a feature branch
git checkout -b yourname/feature-name

# Work, commit, push
git add .
git commit -m "descriptive message"
git push -u origin yourname/feature-name

# Open a Pull Request on GitHub → merge to main
```

---

## Tech Stack
- **React Native** with **Expo**
- **Expo Router** (file-based navigation)
- **@expo/vector-icons** (Ionicons)
