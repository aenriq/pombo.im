"use client";
import Tiptap from "@/components/editor/Tiptap";
import useAuth from "@/lib/useAuth";

export default function Home() {
	return (
		<>
			<div className="col-[2]">
				<Tiptap />
			</div>
		</>
	);
}
