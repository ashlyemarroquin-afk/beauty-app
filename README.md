
  # Local Stylist Showcase App

  This is a code bundle for Local Stylist Showcase App. The original project is available at https://www.figma.com/design/Qm5K79klxNbKvkRDumXbUC/Local-Stylist-Showcase-App.

  ## Firebase Integration

  This app is integrated with Firebase for authentication and data storage. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions.

  **Quick Setup:**
  1. Create a Firebase project at https://console.firebase.google.com/
  2. Enable Email/Password authentication
  3. Create a Firestore database
  4. Copy your Firebase config to a `.env` file (see `.env.example` for format)
  5. Run `npm run dev` to start the app

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  **Note:** Make sure to configure your Firebase credentials in the `.env` file before running the app.
  