# Firebase Integration Setup Guide

This guide will help you set up Firebase for your React web app.

## Prerequisites

1. A Firebase account (sign up at https://firebase.google.com/)
2. A Firebase project created in the Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Register Your Web App

1. In your Firebase project, click the web icon (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Beauty App")
3. Copy the Firebase configuration object

## Step 3: Enable Authentication

1. In the Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable other sign-in methods as needed

## Step 4: Set Up Firestore Database

1. Go to **Firestore Database** in the Firebase Console
2. Click "Create database"
3. Start in **test mode** for development (you can change security rules later)
4. Choose a location for your database

## Step 5: Configure Firebase Credentials

**For React Web Apps (This Project):** Use `.env` files (recommended)

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the placeholder values with your actual Firebase configuration values from Step 2.

**Note:** `google-services.json` is only used for **Android native apps**, not React web apps. For web apps, environment variables (`.env`) are the standard approach.

## Step 6: Set Up Firestore Security Rules (Important!)

Go to **Firestore Database** > **Rules** and update them for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add more rules for other collections as needed
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note:** The above rules are permissive for development. Update them based on your security requirements.

## Step 7: Install Dependencies

The Firebase SDK is already installed. If you need to reinstall:

```bash
npm install firebase
```

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try creating a new account through the signup flow
3. Check the Firebase Console to verify:
   - A new user appears in **Authentication** > **Users**
   - A user document is created in **Firestore Database** > **users** collection

## Features Implemented

✅ **Authentication**
- Email/password sign up
- Email/password sign in
- Password reset
- User session persistence
- Sign out

✅ **Firestore Integration**
- User data storage
- Onboarding data persistence
- User profile updates

✅ **Real-time Auth State**
- Automatic user session detection
- Persistent login across page refreshes

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase initialization
│   └── firebaseAuth.ts      # Authentication functions
├── components/
│   └── auth/
│       ├── LoginPage.tsx    # Updated to use Firebase
│       ├── SignupPage.tsx   # Updated to use Firebase
│       └── AuthWrapper.tsx  # Updated to save onboarding data
└── App.tsx                  # Updated to listen to auth state
```

## FAQ

### Why `.env` instead of `google-services.json`?

- **`google-services.json`** is for **Android native apps** only
- **`GoogleService-Info.plist`** is for **iOS native apps** only  
- **`.env` files** are the standard for **web apps** (React, Vue, Angular, etc.)

Since this is a React web app, using `.env` is the correct and recommended approach.

## Troubleshooting

### Environment Variables Not Loading
- Make sure your `.env` file is in the root directory
- Restart your development server after creating/updating `.env`
- Ensure all variables start with `VITE_`
- The `.env` file should be in the same directory as `package.json`

### Authentication Errors
- Verify Email/Password is enabled in Firebase Console
- Check that your Firebase project is active
- Ensure your API keys are correct

### Firestore Permission Errors
- Check your Firestore security rules
- Verify the user is authenticated before accessing Firestore
- Check the browser console for specific error messages

## Next Steps

Consider implementing:
- [ ] Social authentication (Google, Facebook, etc.)
- [ ] Email verification
- [ ] User profile image uploads (using Firebase Storage)
- [ ] Real-time data synchronization
- [ ] Cloud Functions for server-side logic

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

