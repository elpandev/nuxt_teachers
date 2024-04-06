import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.FIREBASE_API_KEY,
  authDomain:        process.env.FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.FIREBASE_PROJECT_ID,
  storageBucket:     process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.FIREBASE_APP_ID,
};

const app            = initializeApp(firebaseConfig, 'primary');
const auth           = getAuth(app)
const app_secondary  = initializeApp(firebaseConfig, 'secondary');
const auth_secondary = getAuth(app_secondary)
const firestore      = getFirestore(app);
const storage        = getStorage(app);

// if (env == EnvEnum.DEVELOPMENT) {
//   connectAuthEmulator     (auth,           'http://127.0.0.1:9099');
//   connectAuthEmulator     (auth_secondary, 'http://127.0.0.1:9099');
//   connectFirestoreEmulator(firestore,      '127.0.0.1', 8080);
//   connectStorageEmulator  (storage,        '127.0.0.1', 9199);
// }

export {
  auth,
  firestore,
  storage,
  auth_secondary,
}
