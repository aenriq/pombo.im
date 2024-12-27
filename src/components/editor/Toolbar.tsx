import { type Editor } from "@tiptap/core";
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "../ui/separator";
import BlockTypeSelector from "./BlockTypeSelector";
import { BIUS, CB, L } from "./actionGroups";

const Toolbar = ({ editor }: { editor: Editor }) => {
	return (
		<TooltipProvider>
			<div className="flex space-x-">
				<div className="flex-row flex items-center">
					<BlockTypeSelector editor={editor} />
					<Separator orientation="vertical" className="h-8 mx-2" />
				</div>
				<BIUS editor={editor} />
				<CB editor={editor} />
				<L editor={editor} />
			</div>
		</TooltipProvider>
	);
};

export default Toolbar;
