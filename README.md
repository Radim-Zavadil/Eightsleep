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
