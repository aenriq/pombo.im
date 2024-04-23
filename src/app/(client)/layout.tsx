import type { Metadata } from "next";
import "@/style/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
	title: "Pombo",
	description: "Jot down your thoughts and ideas.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="data-theme"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main className="main-grid">{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
