/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

// IMPORTANT:
// To enable the cross-device session feature, you need to create a Firebase project
// and get your web app's configuration object.
//
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Create a new project.
// 3. In your project, go to Project Settings (click the gear icon).
// 4. In the "Your apps" card, click the web icon (</>) to add a web app.
// 5. Register your app and Firebase will provide you with a `firebaseConfig` object.
// 6. Copy that object and paste it here, replacing the placeholder values below.
// 7. In the Firebase Console, go to "Build" > "Realtime Database".
// 8. Click "Create database" and start in "test mode" for easy setup.
//
// Once you've replaced the config below, the multi-device sync will be fully functional.

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};