"use client";
import { Editor, rootCtx } from "@milkdown/kit/core";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/kit/preset/commonmark";

const MilkdownEditor: React.FC = () => {
	const { editor } = useEditor((root) =>
		Editor.make()
			.config(nord)
			.config((ctx) => {
				ctx.set(rootCtx, root);
			})
			.use(commonmark)
	);

	return <Milkdown />;
};

export const EditorWrapper: React.FC = () => {
	return (
		<MilkdownProvider>
			<div>Milkdown Editor</div>
			<MilkdownEditor />
		</MilkdownProvider>
	);
};
