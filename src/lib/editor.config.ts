import HardBreak from "@tiptap/extension-hard-break";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import Underline from "@tiptap/extension-underline";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import CharacterCount from "@tiptap/extension-character-count";
import ListKeymap from "@tiptap/extension-list-keymap";
import Placeholder from "@tiptap/extension-placeholder";

const limit = 16000;
const editorConfig = {
	extensions: [
		Document,
		Text,
		CharacterCount.configure({
			limit,
		}),
		ListKeymap,
		Placeholder.configure({
			emptyEditorClass: "is-editor-empty",
			placeholder: "Start typing...",
		}),
		HardBreak,
		Bold,
		Italic,
		Strike,
		Code,
		Underline,
		Blockquote,
		Heading.configure({
			levels: [1, 2, 3, 4],
		}),
		Paragraph,
		BulletList.configure({
			keepMarks: true,
		}),
		OrderedList.configure({
			keepMarks: true,
		}),
		ListItem,
	],
};

export default editorConfig;
export { limit };
