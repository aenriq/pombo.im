"use client";

import { useEditor, EditorContent } from "@tiptap/react";

import Toolbar from "./Toolbar";
import { Separator } from "@/components/ui/separator";
import "@/style/prose.css";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import useAuth from "@/lib/useAuth";
import editorConfig, { limit } from "@/lib/editor.config";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { useState } from "react";

const Tiptap = () => {
	const { currentUser, loading } = useAuth();
	const editor = useEditor(editorConfig);
	const { toast } = useToast();
	const [value, setValue] = useState("");
	const formSchema = z.object({
		title: z
			.string()
			.trim()
			.min(2, { message: "Title must be at least 2 characters" }),
		content: z.any(),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});
	if (!editor) return null;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!editor || !currentUser) return null;
		if (editor.storage.characterCount.words() < 200) {
			form.setError("content", {
				type: "manual",
				message: "Post must have at least 200 words",
			});
			return;
		}
		const content = editor.getJSON();
		const token = await currentUser.getIdToken();
		const uid = currentUser.uid;
		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("content", JSON.stringify(content));
		formData.append("token", token);
		formData.append("uid", uid);
		formData.append("draft", "false");
		const res = await fetch("/api/blog", {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request. Please try again.",
			});
		}
		const result = await res.json();
		toast({
			title: "Congrats on your new post!",
			description: "You can view your post on your profile.",
			action: (
				<ToastAction altText="Goto new post">
					<Link href={`/blog/${result.docid}`}>Go to post</Link>
				</ToastAction>
			),
		});
	}

	async function saveAsDraft(values: z.infer<typeof formSchema>) {
		if (!editor || !currentUser) return null;
		const formData = new FormData();
		if (values.title.trim() === "") {
			formData.append("title", "Untitled");
		} else {
			formData.append("title", values.title);
		}
		const content = editor.getJSON();
		const token = await currentUser.getIdToken();
		const uid = currentUser.uid;
		formData.append("content", JSON.stringify(content));
		formData.append("token", token);
		formData.append("uid", uid);
		formData.append("draft", "true");
		const res = await fetch("/api/blog", {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request. Please try again.",
			});
		}
		const result = await res.json();
		toast({
			title: "Post saved to drafts",
			description: "You can view and edit your drafts on your profile.",
			action: (
				<ToastAction altText="Goto new post">
					<Link href={`/blog/${result.docid}`}>Go to post</Link>
				</ToastAction>
			),
		});
	}

	return (
		<>
			{loading ? (
				<div className="flex justify-center">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			) : (
				<>
					<Form {...form}>
						<form
							className="flex flex-col space-y-1"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter post title here..."
												className="text-4xl font-bold border-none break-words h-fit shadow-none focus-visible:ring-0 focus-visible:ring-0"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="sticky top-0 z-10 space-y-3 backdrop-blur-lg bg-opacity-60 pt-3">
								<Toolbar editor={editor} />
								<Separator orientation="horizontal" className="w-full" />
							</div>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<EditorContent editor={editor} />
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-row justify-between">
								<div className="text-muted-foreground text-xs cursor-default select-none">
									{editor.storage.characterCount.characters()}
									{editor.storage.characterCount.characters() / limit > 0.9
										? `/${limit} `
										: " "}
									characters
									<br />
									{editor.storage.characterCount.words()} words
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Button
										variant="secondary"
										type="button"
										className="col-span-1 col-start-2"
										onClick={async () => saveAsDraft(form.getValues())}
									>
										Save as Draft
									</Button>
									<Button type="submit" className="col-span-1 col-start-3">
										Publish
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</>
			)}
		</>
	);
};

export default Tiptap;
