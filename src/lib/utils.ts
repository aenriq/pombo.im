import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Editor } from "@tiptap/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Calculates the symmetric difference between two sets.
 * The symmetric difference is a set of elements which are in either of the sets
 * and not in their intersection. This function returns a new Set containing
 * elements that are in either the first or the second set but not in both.
 *
 * @param {Set<any>} setA The first set.
 * @param {Set<any>} setB The second set.
 * @returns {Set<any>} A new set that is the symmetric difference of setA and setB.
 */
export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	let _difference = new Set(setA);
	for (let elem of setB) {
		if (_difference.has(elem)) {
			_difference.delete(elem);
		} else {
			_difference.add(elem);
		}
	}
	return _difference;
}

type EditorAction =
	| "bold"
	| "italic"
	| "underline"
	| "strikethrough"
	| "code"
	| "heading"
	| "blockquote"
	| "paragraph"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "bulletList"
	| "orderedList"
	| "listItem";

/**
 * Checks if an editor action is valid based on the current editor state.
 *
 * @param {EditorAction} action The editor action to check.
 * @param {Editor} editor The editor instance.
 * @returns {boolean} Whether the action is valid.
 */
export function isValidEditorAction(
	action: EditorAction,
	editor: Editor
): boolean {
	const actionRules: Record<string, boolean> = {
		blockquote:
			editor.can().toggleBlockquote() &&
			!editor.isActive("h1") &&
			!editor.isActive("h2") &&
			!editor.isActive("h3") &&
			!editor.isActive("h4") &&
			editor.isActive("paragraph"),
		bold: editor.can().toggleBold(),
		italic: editor.can().toggleItalic(),
		underline: editor.can().toggleUnderline(),
		strikethrough: editor.can().toggleStrike(),
		code: editor.can().toggleCode(),
		h1: editor.can().toggleHeading({ level: 1 }),
		h2: editor.can().toggleHeading({ level: 2 }),
		h3: editor.can().toggleHeading({ level: 3 }),
		h4: editor.can().toggleHeading({ level: 4 }),
		heading:
			editor.can().toggleHeading({ level: 1 }) ||
			editor.can().toggleHeading({ level: 2 }) ||
			editor.can().toggleHeading({ level: 3 }) ||
			editor.can().toggleHeading({ level: 4 }),
	};

	return actionRules[action];
}

export async function isUsernameTaken(username: string): Promise<boolean> {
	const docSnap = await getDoc(doc(db, "users", username));
	if (docSnap.exists()) {
		return true;
	}
	return false;
}
