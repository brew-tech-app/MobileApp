# Mobile App

A cross-platform mobile application built with React Native and Expo.

## Prerequisites

- Node.js (v18 or newer)
- npm (v9 or newer)
- Expo CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web
```

## Project Structure

```
MobileApp/
├── assets/         # Images, fonts, and other static files
├── src/           
│   ├── components/ # Reusable components
│   ├── screens/    # Screen components
│   ├── navigation/ # Navigation configuration
│   └── utils/      # Utility functions
├── App.tsx         # App entry point
└── package.json    # Project dependencies
```

## Development

This project uses TypeScript for type safety and better developer experience.

## Build and Deploy

Follow the Expo documentation for building and deploying your app:
- [Building for iOS](https://docs.expo.dev/build/setup/)
- [Building for Android](https://docs.expo.dev/build-reference/android/)