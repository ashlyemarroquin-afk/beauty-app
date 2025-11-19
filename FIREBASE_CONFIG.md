# Firebase Configuration

## Your Firebase Credentials

Use these values to create your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyBDU2ZhiGtzpJpfwaoYaGT9-ioHK7JCTrA
VITE_FIREBASE_AUTH_DOMAIN=beauty-services-app-5f9b6.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=beauty-services-app-5f9b6
VITE_FIREBASE_STORAGE_BUCKET=beauty-services-app-5f9b6.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=366390374850
VITE_FIREBASE_APP_ID=1:366390374850:web:12387994a4263dad67e65b
```

## Quick Setup

1. Create a `.env` file in the root directory (same level as `package.json`)
2. Copy the above configuration into the `.env` file
3. Restart your development server: `npm run dev`

## Security Note

⚠️ **Important:** The `.env` file is already in `.gitignore` to prevent committing your credentials to version control. Never commit your `.env` file!

