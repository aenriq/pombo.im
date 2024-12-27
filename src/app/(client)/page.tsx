"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth, signInWithGoogle, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import SignupFormDialog from "./SignupForm";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useUser } from "@/components/context-provider";

export default function Home() {
	const [open, setOpen] = useState(false);
	const { user, setUser } = useUser();

	return (
		<>
			<div className="flex flex-col items-center justify-center grid2">
				{user ? (
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
