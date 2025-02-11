"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import editorConfig from "@/lib/editor.config";
import { useEffect, useState } from "react";
import "@/style/prose.css";
import { Separator } from "@/components/ui/separator";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Page({ params }: { params: { slug: string } }) {
	const editor = useEditor(editorConfig);
	const [response, setResponse] = useState<any | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/blog/${params.slug}`, { method: "GET" });
			const data = await res.json();
			setResponse(data);
		};
		fetchData();
	}, [params.slug]);
	editor?.commands.setContent(response?.content);
	editor?.setEditable(false);
	return (
		<>
			{!response ? (
				<div className="flex flex-col items-center justify-center grid2">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			) : (
				<>
					<Breadcrumb className="hidden sm:block">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href={`/u/${response?.username}`}>
									{response?.username}
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbPage>{response?.title}</BreadcrumbPage>
						</BreadcrumbList>
					</Breadcrumb>
					<div className="grid2">
						<h1 className="font-bold px-3 text-5xl py-2">{response.title}</h1>
						<Separator orientation="horizontal" className="w-full" />
						<EditorContent editor={editor} />
					</div>
				</>
			)}
		</>
	);
}
