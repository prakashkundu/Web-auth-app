# Domain-Restricted React Authentication App

A secure, cross-platform React application that implements Google OAuth 2.0 and restricts access exclusively to users with a specific email domain (`@hbplus.fit`). Built with Vite, React, and Firebase.

## Problem Statement Addressed
This project fulfills the requirement to design a secure web application that:
1. Allows users to log in using Google OAuth.
2. Verifies the user’s email domain upon authentication.
3. Grants access only if the email belongs to the allowed domain (`@hbplus.fit`).
4. Restricts all other domains with a specific error message.

## Tech Stack
- **Frontend Framework:** React (via Vite)
- **Authentication & Backend:** Firebase Authentication
- **Routing:** React Router v6
- **Styling:** Inline modern dark-mode CSS

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Git

### 2. Clone and Install Dependencies
Open your terminal and run the following commands:

\`\`\`bash
# Clone the repository
git clone <your-github-repo-url>

# Navigate into the project directory
cd web-auth-app

# Install all required dependencies (React, Firebase, React Router)
npm install
\`\`\`

### 3. Firebase Configuration
To run this locally, you must provide your own Firebase configuration.
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Google Sign-In** under **Build > Authentication**.
3. Register a Web App to get your configuration object.
4. In the `src/` directory, locate `firebase.js` and replace the placeholder `firebaseConfig` with your actual keys:
   
\`\`\`javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
\`\`\`

### 4. Run the Development Server
Start the local Vite server by running:
\`\`\`bash
npm run dev
\`\`\`
The application will be available at `http://localhost:5173`.

---

## Authentication Flow & Domain Restriction Logic

### How Domain Restriction Works
The core security logic is implemented inside `src/Login.jsx` using Firebase's `signInWithPopup`.

1. **Triggering OAuth:** When a user clicks "Continue with Google," Firebase opens the Google login popup. A custom parameter (`{ hd: 'hbplus.fit' }`) is sent to Google to hint that the user should select their corporate account.
2. **Post-Login Interception:** Before granting access to the application's protected routes, the code evaluates the returned user payload:
   \`\`\`javascript
   const result = await signInWithPopup(auth, googleProvider);
   if (!result.user.email?.endsWith('@hbplus.fit')) {
     await auth.signOut(); // Immediately revoke the session
     setError('Access restricted. Please login using your @hbplus.fit email.');
     return;
   }
   \`\`\`
3. **Session Revocation:** If the email (e.g., `@gmail.com`) does not match the target domain, the Firebase session is immediately destroyed (`auth.signOut()`), and the user is shown an error state on the login screen.
4. **Dashboard Access:** If the domain is valid, React Router navigates the user to the `/dashboard`.

### Security Expectations Met
- **Protected Routes:** The `/dashboard` route is wrapped in a `<ProtectedRoute>` component. It actively listens to Firebase's `onAuthStateChanged`. If a user attempts to navigate directly to the URL without a valid, verified session, they are redirected to `/login`.
- **Token Handling:** Session tokens are securely managed natively by the Firebase SDK, removing the need for manual `localStorage` token management.

<img width="1366" height="730" alt="image" src="https://github.com/user-attachments/assets/1bd65dbe-be60-4bab-874c-5953e528aae0" />
