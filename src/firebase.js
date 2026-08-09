import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCCHW7Lz4pRKBJLg0mQcFJCoNEwGZnp0-M",
  authDomain: "attendencesystem-8a136.firebaseapp.com",
  projectId: "attendencesystem-8a136",
  storageBucket: "attendencesystem-8a136.firebasestorage.app",
  messagingSenderId: "208359735157",
  appId: "1:208359735157:web:79b392e787e7718ab25d3c",
  measurementId: "G-LVBHG8P1KG",
};

// Initialize Firebase App (Prevent duplicate initialization in Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize & Export Auth
export const auth = getAuth(app);

// Initialize Analytics safely (Client-side only)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export default app;