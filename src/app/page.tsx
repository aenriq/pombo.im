"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth, provider, db } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, []);

	const signInWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			const userRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(userRef);
			if (!docSnap.exists()) {
				await setDoc(userRef, {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL,
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<div className="flex flex-col items-center justify-center">
				{user ? (
					<Button className="w-max">Begin Writing</Button>
				) : (
					<Button className="w-max" onClick={signInWithGoogle}>
						Sign In
					</Button>
				)}
			</div>
		</>
	);
}
