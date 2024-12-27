import { type Editor } from "@tiptap/core";
import React from "react";
import {
	FontBoldIcon,
	FontItalicIcon,
	UnderlineIcon,
	StrikethroughIcon,
	CodeIcon,
	QuoteIcon,
} from "@radix-ui/react-icons";
import { ListOl, ListUl } from "@emotion-icons/bootstrap";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Separator } from "../ui/separator";
import { isValidEditorAction } from "@/lib/utils";

export function BIUS({ editor }: { editor: Editor }) {
	return (
		<div className="flex-row flex items-center">
			<Tooltip>
				<TooltipTrigger asChild disabled={!editor.can().toggleBold()}>
					<div>
						<Toggle
							pressed={editor.isActive("bold")}
							onPressedChange={() => editor.chain().focus().toggleBold().run()}
							type="button"
							value="bold"
							aria-label="Toggle bold"
							disabled={!editor.can().toggleBold()}
						>
							<FontBoldIcon className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Bold ⌘B</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild disabled={!editor.can().toggleItalic()}>
					<div>
						<Toggle
							pressed={editor.isActive("italic")}
							onPressedChange={() =>
								editor.chain().focus().toggleItalic().run()
							}
							type="button"
							value="italic"
							aria-label="Toggle italic"
							disabled={!editor.can().toggleItalic()}
						>
							<FontItalicIcon className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Italic ⌘I</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild disabled={!editor.can().toggleUnderline()}>
					<div>
						<Toggle
							pressed={editor.isActive("underline")}
							onPressedChange={() =>
								editor.chain().focus().toggleUnderline().run()
							}
							type="button"
							value="underline"
							aria-label="Toggle underline"
							disabled={!editor.can().toggleUnderline()}
						>
							<UnderlineIcon className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Underline ⌘U</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild disabled={!editor.can().toggleStrike()}>
					<div>
						<Toggle
							pressed={editor.isActive("strike")}
							onPressedChange={() =>
								editor.chain().focus().toggleStrike().run()
							}
							type="button"
							value="skrike"
							aria-label="Toggle strikethrough"
							disabled={!editor.can().toggleStrike()}
						>
							<StrikethroughIcon className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Strikethrough</TooltipContent>
			</Tooltip>
			<Separator orientation="vertical" className="h-8 mx-2" />
		</div>
	);
}

export function CB({ editor }: { editor: Editor }) {
	const isBlockquoteDisabled = !isValidEditorAction("blockquote", editor);
	return (
		<div className="flex-row flex items-center">
			<Tooltip>
				<TooltipTrigger asChild disabled={!editor.can().toggleCode()}>
					<div>
						<Toggle
							pressed={editor.isActive("code")}
							onPressedChange={() => editor.chain().focus().toggleCode().run()}
							type="button"
							value="code"
							aria-label="Toggle Code"
							disabled={!editor.can().toggleCode()}
						>
							<CodeIcon className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Inline code format ⌘E</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild disabled={isBlockquoteDisabled}>
					<div>
						<Toggle
							pressed={editor.isActive("blockquote")}
							onPressedChange={() =>
								editor.chain().focus().toggleBlockquote().run()
							}
							type="button"
							value="blockquote"
							aria-label="Toggle Blockquote"
							disabled={isBlockquoteDisabled}
						>
							<QuoteIcon className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Block quote</TooltipContent>
			</Tooltip>
			<Separator orientation="vertical" className="h-8 mx-2" />
		</div>
	);
}

export function L({ editor }: { editor: Editor }) {
	return (
		<div className="flex-row flex items-center">
			<Tooltip>
				<TooltipTrigger asChild disabled={!editor.can().toggleBulletList()}>
					<div>
						<Toggle
							pressed={editor.isActive("bulletList")}
							onPressedChange={() =>
								editor.chain().focus().toggleBulletList().run()
							}
							type="button"
							value="bulletList"
							aria-label="Toggle Bullet List"
							disabled={!editor.can().toggleBulletList()}
						>
							<ListUl className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Bullet list</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild disabled={!editor.can().toggleOrderedList()}>
					<div>
						<Toggle
							pressed={editor.isActive("orderedList")}
							onPressedChange={() =>
								editor.chain().focus().toggleOrderedList().run()
							}
							type="button"
							value="orderedList"
							aria-label="Toggle Ordered List"
							disabled={!editor.can().toggleOrderedList()}
						>
							<ListOl className="h-4 w-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Ordered list</TooltipContent>
			</Tooltip>
			<Separator orientation="vertical" className="h-8 mx-2" />
		</div>
	);
}
