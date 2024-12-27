import React, { useState, useEffect } from "react";
import type { Editor } from "@tiptap/core";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const BlockTypeSelector = ({ editor }: { editor: Editor | null }) => {
	if (!editor) return;

	const blockTypeCommands: { [key: string]: () => boolean } = {
		paragraph: () => editor.chain().focus().setParagraph().run(),
		h1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
		h2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
		h3: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
		h4: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
		codeBlock: () => editor.chain().focus().toggleCode().run(),
	};

	return (
		<Select
			disabled={editor.isActive("blockquote")}
			value={
				editor.isActive("heading", { level: 1 })
					? "h1"
					: editor.isActive("heading", { level: 2 })
					? "h2"
					: editor.isActive("heading", { level: 3 })
					? "h3"
					: editor.isActive("heading", { level: 4 })
					? "h4"
					: editor.isActive("paragraph")
					? "paragraph"
					: undefined
			}
			onValueChange={(value) => blockTypeCommands[value]()}
		>
			<SelectTrigger className="w-[165px]">
				<SelectValue placeholder="Block type" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="paragraph">Paragraph</SelectItem>
				<SelectItem value="h1">Heading 1</SelectItem>
				<SelectItem value="h2">Heading 2</SelectItem>
				<SelectItem value="h3">Heading 3</SelectItem>
				<SelectItem value="h4">Heading 4</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default BlockTypeSelector;
