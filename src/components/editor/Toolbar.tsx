import { type Editor } from "@milkdown/kit/core";
import gfm from "@milkdown/preset-gfm";
}
export default function Toolbar({ editor }: { editor: Editor }) {
	return <button onClick={() => editor.action(toggleBoldCommand)}></button>;
}
