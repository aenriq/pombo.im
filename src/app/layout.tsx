import "@/styles/globals.css";
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className="flex justify-center">
				<div className="w-full sm:grid sm:grid-cols-(--content-grid)">
					{children}
				</div>
			</body>
		</html>
	)
}