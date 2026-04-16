import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ---------------------------------------------------------------------------
// All Firebase config values come from client/.env (VITE_ prefix is required
// by Vite — never hardcode credentials here or in the service worker).
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Warn loudly in the console if any required variable is missing
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error(
    `[Firebase] Missing required environment variable(s): ${missingKeys.join(", ")}. ` +
    "Please check that all VITE_FIREBASE_* keys are defined in client/.env"
  );
}

// ---------------------------------------------------------------------------
// Initialize Firebase app + messaging
// ---------------------------------------------------------------------------
let app;
let messaging;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (error) {
  console.error("[Firebase] Initialization failed:", error);
}

// ---------------------------------------------------------------------------
// Register the Service Worker manually so we can inject the Firebase config
// as URL query parameters. This avoids hardcoding credentials in the
// public/firebase-messaging-sw.js file (Service Workers cannot use
// import.meta.env, so query params are the correct approach).
// ---------------------------------------------------------------------------
const getServiceWorkerRegistration = async () => {
  if (!("serviceWorker" in navigator)) return undefined;

  try {
    // Build a URL with the config encoded as query params so the SW can read
    // them via new URL(location.href).searchParams — no credentials in source.
    const params = new URLSearchParams({
      apiKey: firebaseConfig.apiKey ?? "",
      authDomain: firebaseConfig.authDomain ?? "",
      projectId: firebaseConfig.projectId ?? "",
      storageBucket: firebaseConfig.storageBucket ?? "",
      messagingSenderId: firebaseConfig.messagingSenderId ?? "",
      appId: firebaseConfig.appId ?? "",
    });

    const swUrl = `/firebase-messaging-sw.js?${params.toString()}`;

    // Register (or retrieve the existing) service worker at this URL
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: "/",
    });

    return registration;
  } catch (err) {
    console.error("[Firebase] Service Worker registration failed:", err);
    return undefined;
  }
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Requests an FCM token. Registers the service worker with injected config
 * params before asking Firebase for the token.
 */
export const requestForToken = async () => {
  if (!messaging) {
    console.error("[Firebase] Messaging is not initialized.");
    return null;
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.error(
      "[Firebase] VITE_FIREBASE_VAPID_KEY is not set in client/.env"
    );
    return null;
  }

  try {
    // Manually register the SW with config params before getToken() is called.
    // If we skip this Firebase would auto-register /firebase-messaging-sw.js
    // without any params, causing the SW to fail config validation.
    const serviceWorkerRegistration = await getServiceWorkerRegistration();

    const currentToken = await getToken(messaging, {
      vapidKey,
      ...(serviceWorkerRegistration ? { serviceWorkerRegistration } : {}),
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.log(
        "[Firebase] No registration token available. Request notification permission to generate one."
      );
      return null;
    }
  } catch (err) {
    console.error("[Firebase] An error occurred while retrieving token:", err);
    return null;
  }
};

/**
 * Listens for foreground push messages and resolves the promise with the
 * payload. Call this in a loop to keep listening after each message.
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });

export { messaging };
