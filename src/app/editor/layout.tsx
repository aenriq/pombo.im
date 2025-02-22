export default function EditorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="col-start-2">
			{children}
		</div>
	)
}