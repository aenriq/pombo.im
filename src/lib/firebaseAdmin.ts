import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const admin = require("firebase-admin");

let firebaseApp;

if (!admin.apps.length) {
	firebaseApp = admin.initializeApp(
		{
			// Your Firebase configuration object
		},
		"server"
	);
} else {
	firebaseApp = admin.app("server");
}

const app = !admin.app.length
	? initializeApp(
			{
				credential: admin.credential.cert({
					projectId: process.env.FIREBASE_PROJECT_ID,
					clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
					privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
				}),
				databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
			},
			"server"
	  )
	: admin.app("server");
const auth = getAuth(app);

export { app, auth };
