"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth, signInWithGoogle, db } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import SignupFormDialog from "./SignupForm";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Home() {
	const [user, setUser] = useState<User | null>(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				const userRef = doc(db, "uidrefs", currentUser.uid);
				const userSnap = await getDoc(userRef);

				// If the user doesn't exist in the database, open the signup form
				if (userSnap.exists()) {
					setUser(currentUser);
				}
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<>
			<div className="flex flex-col items-center justify-center grid2">
				{loading ? (
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				) : user ? (
					<>
						<Button asChild className="w-max">
							<a href="/blog">Begin Writing</a>
						</Button>
					</>
				) : (
					<>
						<SignupFormDialog open={open} setOpen={setOpen} setUser={setUser} />
						<Button
							className="w-max"
							onClick={async () => {
								await signInWithGoogle();
								if (auth.currentUser) {
									const userRef = doc(db, "uidrefs", auth.currentUser.uid);
									const userSnap = await getDoc(userRef);
									if (!userSnap.exists()) {
										setOpen(true);
									} else {
										setUser(auth.currentUser);
									}
								}
							}}
						>
							Sign in to start writing!
						</Button>
					</>
				)}
			</div>
		</>
	);
}
