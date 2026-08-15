# BlinkTrack

A clean, modern expense tracker built with React Native (Expo) for the BlinkMoney Frontend Engineering Assignment.

## Why Expense Tracking?

Expense tracking is a natural fit for BlinkMoney's fintech ecosystem. The **Save → Grow → Borrow** loop starts with understanding where money goes. BlinkTrack demonstrates:

- **Product thinking**: Transforms raw spending data into actionable insights ("You've spent the most on Food this month")
- **Data thinking**: Category breakdowns with percentages help users visualize spending patterns
- **Fintech relevance**: Expense tracking is the entry point for financial awareness, which leads to saving and investing decisions

## Features

- **Monthly spending dashboard** with total and category breakdown
- **6 expense categories** (Food, Travel, Shopping, Bills, Entertainment, Other) with distinct colors and icons
- **Smart insights** computed from spending patterns
- **Date-grouped transaction list** (Today, Yesterday, dates)
- **Add expense flow** with numeric input, category selector, note, and date
- **Empty state** encouraging first-time usage
- **Persistent storage** via AsyncStorage (no backend required)

## Architecture

```
BlinkTrack/
├── app/                              # Expo Router screens
│   ├── _layout.js                    # Root navigation layout
│   ├── index.js                      # Home screen
│   └── add-transaction.js            # Add expense modal
├── features/
│   └── transactions/                 # Feature-based module
│       ├── components/               # UI components
│       ├── hooks/                    # useTransactions hook
│       └── utils/                    # Helpers and constants
├── shared/
│   ├── components/                   # Reusable components
│   ├── constants/                    # Theme tokens
│   └── utils/                        # Storage utilities
```

## Tech Stack

- **Expo SDK 57** with React Native 0.86
- **Expo Router** for file-based navigation (built on React Navigation)
- **AsyncStorage** for local data persistence
- **@expo/vector-icons** (Ionicons) for category icons
- **react-native-reanimated** for animations

## Getting Started

```bash
cd BlinkTrack
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or Camera (iOS).

## What Could Be Added Next

- **Charts & visualizations** (spending trends, pie charts)
- **Budget limits** per category with alerts
- **Backend sync** for cross-device access
- **Recurring expenses** and subscriptions tracking
- **Export to CSV/PDF** for financial records
- **Multi-currency support** for international users
- **Savings goals** tied to spending reduction
