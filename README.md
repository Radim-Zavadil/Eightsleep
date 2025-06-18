# SleepSync - Sleep Optimization App

A wellness and sleep optimization mobile app designed for both iOS and Android, featuring user authentication, onboarding, and comprehensive sleep tracking features.

## Features

### Authentication & Onboarding
- **User Authentication**: Email/password signup and login using Supabase
- **5-Step Onboarding Process**:
  1. Date of Birth input
  2. Weight input (kg)
  3. Height input (cm)
  4. Sport activity selection (Yes/No/Sometimes)
  5. Optimal sleep goal calculation with custom override option
- **Automatic Routing**: New users go through onboarding, returning users go directly to app

### Sleep Tracking & Optimization
- Sleep duration tracking
- Sleep quality analysis
- Circadian rhythm monitoring
- Smart alarm functionality
- Recovery tracking
- Journal entries for sleep insights

### Wellness Features
- Caffeine intake tracking
- Screen time monitoring
- Vitamin D exposure tracking
- Light exposure optimization
- Water intake tracking

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
Run the SQL schema in your Supabase SQL editor to create the necessary tables:

```sql
-- The schema.sql file contains all the necessary database setup
-- This includes the profiles table and related triggers/functions
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the App
```bash
npm start
```

## Database Schema

### Profiles Table
Stores user onboarding data and preferences:
- `id`: UUID (references auth.users)
- `email`: User's email address
- `date_of_birth`: User's birth date
- `weight`: Weight in kg
- `height`: Height in cm
- `sport_activity`: Sport activity level (Yes/No/Sometimes)
- `sleep_goal_hours`: Optimal sleep duration in hours
- `onboarding_completed`: Boolean flag for onboarding status
- `created_at` & `updated_at`: Timestamps

## Authentication Flow

1. **New User**: Sign up → Onboarding → Main App
2. **Returning User**: Login → Main App (skips onboarding)
3. **Sign Out**: Returns to authentication screen

## Onboarding Flow

1. **Step 1**: Date of Birth selection
2. **Step 2**: Weight input (kg)
3. **Step 3**: Height input (cm)
4. **Step 4**: Sport activity selection
5. **Step 5**: Sleep goal calculation and customization

## Sleep Goal Calculation

The app calculates optimal sleep duration based on:
- **Age**: Different recommendations for teenagers, adults, and elderly
- **Sport Activity**: Active users may need more sleep
- **Custom Override**: Users can set their own sleep goal

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: Expo Router
- **State Management**: React Context
- **UI Components**: Custom components with consistent styling
- **Date/Time**: @react-native-community/datetimepicker

## Project Structure

```
├── app/                    # Main app screens
│   ├── auth.tsx           # Authentication screen
│   ├── onboarding.tsx     # Onboarding flow
│   └── (tabs)/            # Main app tabs
├── components/            # Reusable components
│   └── Onboarding/        # Onboarding step components
├── context/               # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── types/                 # TypeScript type definitions
├── supabaseClient.js      # Supabase client configuration
└── schema.sql            # Database schema
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Welcome to Expo on Replit 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app), and adapted to use on Replit.

Expo is an open-source React Native framework for apps that run natively on Android, iOS, and the web. Expo brings together the best of mobile and the web and enables many important features for building and scaling an app such as live updates, instantly sharing your app, and web support. 

Using Replit, you can build Expo apps from BOTH your desktop and mobile devices.

## Get started

**Click the Run button to start the app.**

In the output, use the QR code to open the app in [Expo Go](https://expo.dev/go), or open a webview.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

You can also follow along in our video tutorial [here](https://www.youtube.com/watch?v=aSMYllFeryE).

Here is the structure for the app, all core files are found in `app/`:

```
.
├── app                          # Main application directory (Expo Router)
│   ├── _layout.tsx              # Root layout component for the app
│   ├── +not-found.tsx           
│   └── (tabs)                   # Tab navigation group
├── app.json                     # Expo configuration file
├── assets                       # Static assets directory
│   ├── fonts                    # Custom fonts
│   └── images                   # Image assets
├── components                   # Reusable component directory
│   ├── Collapsible.tsx          # Collapsible/expandable component
│   ├── ExternalLink.tsx         # External link handler component
│   ├── HapticTab.tsx            # Tab with haptic feedback
│   ├── HelloWave.tsx            # Wave animation component
│   ├── ParallaxScrollView.tsx   # Scrollview with parallax effect
│   ├── __tests__                # Component test directory
│   ├── ThemedText.tsx           # Theme-aware text component
│   ├── ThemedView.tsx           # Theme-aware view component
│   └── ui                       # UI component library
├── constants                    # Application constants
│   └── Colors.ts                # Color definitions
├── expo-env.d.ts                
├── generated-icon.png           
├── hooks                        # Custom React hooks
│   ├── useColorScheme.ts        # Hook for handling color scheme
│   ├── useColorScheme.web.ts    # Web-specific color scheme hook
│   └── useThemeColor.ts         # Hook for theme colors
├── package.json                 # NPM package configuration
├── package-lock.json            
├── README.md                    # Project documentation
├── replit.nix                   
├── scripts                      
│   └── reset-project.js         # Project reset script
└── tsconfig.json                # TypeScript configuration
```
## Publishing your app

The following steps will guide you through deploying your app from Replit to your iOS device. This tutorial covers:
	- Creating a preview build
  - Installing the preview build on your iOS device

While the app will only be useable on _your_ device, this will suffice for building and testing tools. To publish your app on the App store, you'll need to configure your app in App Store Connect.

For additional details, refer to the Apple and Expo documentation. 

### Initial Setup

1. **Remix the Expo Template**
   - Creates a new project with the latest Expo SDK
   - Includes essential configurations and dependencies 
   - Sets up a basic app structure following best practices

2. **Create Apple Developer Account**
   - Register for a developer account (requires $99/year subscription)
   - Select appropriate certificate (Development or Distribution)
   - Select or generate device profile for test device installation
   - Set up code signing and provisioning profiles
   - Wait 24-48h for Apple to approve the account

### Build Configuration

3. **Initialize EAS Project**
   Click the dropdown underneath the "Run" button and select "EAS Init"
   Alternatively, you can run:
   ```bash
   npx eas init
   ```
   - Creates a new EAS project in the current directory
   - Follow the interactive prompts to configure your project

4. **Update EAS Configuration**
   Click the dropdown underneath the "Run" button and select "EAS Update"
   Alternatively, you can run:
   ```bash
   npx eas update --auto
   ```
   - Sets up Expo Application Services for build management
   - Creates necessary build profiles in eas.json
   - Configures over-the-air updates capability

   Expected output:
   ```bash
   [expo-cli] Starting Metro Bundler
   [expo-cli] 
   ⠸ Exporting...
   ```

5. **Build iOS Preview**
   Click the dropdown underneath the "Run" button and select "EAS Build iOS"
   Alternatively, you can run:
   ```bash
   npx eas build --platform ios --profile preview
   ```
   - Generates a development build optimized for testing
   - Includes debugging tools and development features
   - Creates smaller build size compared to production builds

   Required steps:
   - Create iOS bundle identifier (e.g., `io.mattpalmer.my-first-expo-app`)
   - Accept warning about iOS encryption
   - Log in to Apple Developer account
   - Create or reuse distribution certificate
   - Create or reuse device profile

### Build Process

6. **Handle Initial Build**
   - Note: First build may fail with GraphQL error
   - Solution: Simply re-run the build command
   - This is a common first-time issue during EAS service initialization

7. **Wait for Build Completion**
   - Expected duration: 10-15 minutes
   - System will display progress updates

8. **Access Build Results**
   - QR code will display when build is ready
   - Scan with iPhone camera
   - Installation process begins automatically

### Device Setup

9. **Configure Test Device**
   Required steps:
   - Install device profile
   - Enable Developer mode:
     1. Open iOS Settings
     2. Navigate to General → Security
     3. Enable Developer Mode
   - Restart device
   Note: These steps are required for installing development builds
   For detailed instructions, visit: [Expo Documentation](https://docs.expo.dev/tutorial/eas/internal-distribution-builds/)

### Final Installation

10. **Install and Run**
    - Scan QR code with iPhone camera
    - Follow installation prompts
    - Install the app
    - Launch and test the app

## Next Steps

- Configure production builds for App Store submission
- Set up development builds for testing

## Get a fresh project

If you'd like to reset your project, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
