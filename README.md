# Telegram Mini App - Web3 Gaming Platform

A comprehensive Telegram Mini App built with React that combines gaming, farming, task management, and Web3 wallet integration with TON blockchain support.

## 🚀 Features

- **Gaming System**: Interactive game with Firebase integration and streak tracking
- **Farming Component**: Virtual farming with reward system
- **Task Management**: Daily and weekly tasks with point rewards
- **Network/Referral System**: User invitation and referral tracking
- **Web3 Wallet**: TON Connect integration for blockchain transactions
- **Admin Panel**: Task and news management for administrators
- **User Profile**: History tracking and streak management
- **News System**: Dynamic news feed with admin controls

## 📁 Project Structure

### Core Files
- **`package.json`** - Project dependencies including React 19, Firebase, TON Connect, Tailwind CSS, and Framer Motion
- **`package-lock.json`** - Dependency lock file ensuring consistent installs across environments
- **`.gitignore`** - Git ignore rules for node_modules, build files, and environment variables
- **`README.md`** - Project documentation and setup instructions

### Configuration Files
- **`postcss.config.js`** - PostCSS configuration for Tailwind CSS and Autoprefixer
- **`tailwind.config.js`** - Tailwind CSS configuration for custom styling and responsive design

### Public Assets
- **`public/`** - Static assets including HTML template, manifest files, and audio resources
  - **`index.html`** - Main HTML template with Telegram Web App and TON Connect scripts
  - **`manifest.json`** - PWA manifest for app installation
  - **`tonconnect-manifest.json`** - TON Connect wallet integration manifest
  - **`backgroundmusic.mp3`** - Background music for gaming experience
  - **`slicesound.mp3`** - Sound effects for game interactions
  - **`slicesoundbomb.mp3`** - Explosion sound effects for game

### Source Code
- **`src/`** - Main application source code
  - **`App.js`** - Main application component with routing, context providers, and daily/weekly task resets
  - **`index.js`** - Application entry point and React DOM rendering
  - **`App.css`** - Global application styles
  - **`index.css`** - Base styles and Tailwind CSS imports

### Components
- **`components/`** - Reusable UI components
  - **`Navbar.js`** - Main navigation component with route-based visibility
  - **`Footer.js`** - Application footer component
  - **`Sidebar.js`** - Side navigation component
  - **`ui/`** - Custom UI components (avatar, badge, button, card, progress)

### Pages
- **`pages/`** - Application pages and features
  - **`HomePage/HomeComponent.js`** - Landing page with user dashboard
  - **`GamePage/`** - Gaming system with Firebase integration and streak tracking
  - **`FarmPage/`** - Virtual farming component with reward mechanics
  - **`TaskPage/`** - Task management system with daily/weekly tasks
  - **`NetworkPage/`** - Referral and invitation system
  - **`WalletPage/`** - TON Connect wallet integration
  - **`ProfilePage/`** - User profile and history management
  - **`NewsPage/`** - News feed with admin controls
  - **`AdminTask.js`** - Admin panel for task management
  - **`AdminNews.js`** - Admin panel for news management

### Context & State Management
- **`reactContext/`** - React context providers for global state
  - **`TelegramContext.js`** - Telegram Web App integration and user data
  - **`WalletContext.js`** - TON Connect wallet state management
  - **`ReferralContext.js`** - Referral system state management
  - **`HistoryContext.js`** - User activity history tracking
  - **`StreakTracker.js`** - Gaming streak tracking and rewards

### Services
- **`services/`** - Backend integration and utility services
  - **`FirebaseConfig.js`** - Firebase configuration and database setup
  - **`userManagement.js`** - User initialization and management
  - **`addHistory.js`** - History logging service

### Styles
- **`Styles/`** - Component-specific CSS files for custom styling

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM
- **Styling**: Tailwind CSS, PostCSS, Framer Motion
- **Backend**: Firebase (Realtime Database, Authentication)
- **Web3**: TON Connect, TON blockchain integration
- **UI Components**: Radix UI, Lucide React, React Icons
- **Testing**: React Testing Library, Jest
- **Build Tools**: Create React App, Vercel deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup
- TON Connect manifest configuration

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Telegram-Mini-App
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file with your Firebase and TON Connect credentials
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app

### Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner
- **`npm run build`** - Builds the app for production
- **`npm run eject`** - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Realtime Database
3. Update `src/services/FirebaseConfig.js` with your config

### TON Connect Setup
1. Configure your wallet manifest in `public/tonconnect-manifest.json`
2. Update TON Connect settings in wallet components

### Telegram Web App
1. Configure your bot with Telegram
2. Set up the Web App URL in your bot settings
3. The app automatically integrates with Telegram Web App API

## 📱 Features Overview

### Gaming System
- Interactive gameplay with sound effects
- Streak tracking and rewards
- Firebase integration for score persistence
- Game over popups and instructions

### Task Management
- Daily and weekly task system
- Point-based reward system
- Admin panel for task management
- Automatic task resets

### Web3 Integration
- TON Connect wallet integration
- Blockchain transaction support
- Wallet state management
- TON token support

### User Management
- Telegram user integration
- Referral system
- Activity history tracking
- Profile management

## 🚀 Deployment

The app is configured for deployment on Vercel. Simply connect your repository to Vercel and deploy.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For any issues or suggestions, please contact the development team.

---

**Last Updated**: Octobar 2025  
**Version**: 0.1.0  
**Maintainer**: Raju VB