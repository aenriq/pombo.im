"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Toolbar from "./Toolbar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import useAuth from "@/lib/useAuth";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";

const formSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	content: z.string().refine(
		(content) => {
			const wordCount = content.trim().split(/\s+/).length;
			return wordCount >= 200;
		},
		{ message: "Content must have at least 200 words" }
	),
});

const Tiptap = () => {
	const { currentUser, loading } = useAuth();
	const editor = useEditor({
		extensions: [], // Add your extensions here
		content: "",
	});
	const { toast } = useToast();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	// Sync editor content with form state
	useEffect(() => {
		if (!editor) return;

		const updateContent = () => {
			setValue("content", editor.getHTML(), { shouldValidate: true });
		};

		editor.on("update", updateContent);
		return () => editor.off("update", updateContent);
	}, [editor, setValue]);

	const onSubmit = async (data) => {
		if (!currentUser) return;
		const token = await currentUser.getIdToken();
		const uid = currentUser.uid;
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("content", data.content);
		formData.append("token", token);
		formData.append("uid", uid);

		const res = await fetch("/api/blog", {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			throw new Error(`error: ${res.status}`);
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
	};

	return (
		<>
			{loading ? (
				<div className="flex justify-center">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			) : (
				<Form>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-auto">
						<Toolbar editor={editor} />
						<FormField name="title" control={{}}>
							<FormItem>
								<FormControl>
									<Input
										{...register("title")}
										placeholder="Enter post title here..."
										className="text-4xl font-bold border-none break-words h-fit shadow-none"
									/>
								</FormControl>
								<FormMessage>{errors.title?.message}</FormMessage>
							</FormItem>
						</FormField>
						<EditorContent editor={editor} />
						<FormMessage>{errors.content?.message}</FormMessage>
						<Button type="submit" disabled={Object.keys(errors).length > 0}>
							Save
						</Button>
					</form>
				</Form>
			)}
		</>
	);
};

export default Tiptap;
