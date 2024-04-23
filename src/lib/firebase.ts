// firebaseConfig.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
	getAuth,
	setPersistence,
	signInWithPopup,
	GoogleAuthProvider,
	browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig, "client");

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Auth and GoogleAuthProvider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to initiate sign-in with Google
const signInWithGoogle = async () => {
	await setPersistence(auth, browserLocalPersistence)
		.then(async () => {
			return signInWithPopup(auth, provider);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error(`Error during sign-in: ${errorCode}, ${errorMessage}`);
		});
};

export { app, db, storage, auth, provider, signInWithGoogle };
