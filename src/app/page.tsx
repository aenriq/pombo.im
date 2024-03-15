"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth, provider } from "@/lib/firebase"; // Update the import path
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			console.log(currentUser);
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, []);

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="main-grid">
			<div className="grid w-full gap-2">
				<Textarea placeholder="Type your message here." />
				<Button>Send message</Button>
			</div>
			{user ? (
				<Button>Begin Writing</Button>
			) : (
				<Button onClick={signInWithGoogle}>Sign In</Button>
			)}
		</div>
	);
}
