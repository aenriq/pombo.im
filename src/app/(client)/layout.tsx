import type { Metadata } from "next";
import "@/style/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { auth, db } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { UserContext } from "@/components/context-provider";

export const metadata: Metadata = {
	title: "Pombo",
	description: "Jot down your thoughts and ideas.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
					setUsername(userSnap.data().username);
				}
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="data-theme"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<UserContext.Provider value={{ user, setUser }}>
						<main className="main-grid">{children}</main>
						<Toaster />
					</UserContext.Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
