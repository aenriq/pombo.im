"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isUsernameTaken } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { type User } from "firebase/auth";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function SignupFormDialog({
	open,
	setOpen,
	setUser,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
	const [loading, setLoading] = useState(false);
	const noSpecialCharsRegex = /^[a-zA-Z0-9]+$/;
	const displayNameRegex = /^[a-zA-Z0-9 .~$^+_\-]+$/;
	const formSchema = z.object({
		username: z
			.string()
			.min(3, { message: "Username must be at least 3 characters" })
			.max(12, { message: "Username must be at most 12 characters" })
			.toLowerCase()
			.refine((value) => displayNameRegex.test(value), {
				message:
					"Username can only contain alphanumeric characters and special characters .~$^+-_",
			}),
		displayName: z
			.string()
			.min(3, { message: "Display name must be at least 3 characters" })
			.max(15, { message: "Display name must be at most 15 characters" })
			.refine((value) => noSpecialCharsRegex.test(value), {
				message: "Username can only contain alphanumeric characters",
			}),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			displayName: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		if (await isUsernameTaken(values.username)) {
			form.setError("username", {
				type: "manual",
				message: "Username is already taken",
			});
		} else {
			const currentUser = auth.currentUser;
			if (!currentUser) return;
			const formData = new FormData();
			formData.append(
				"currentUser",
				JSON.stringify({
					uid: currentUser.uid,
					email: currentUser.email,
					photoURL: currentUser.photoURL || "",
					username: values.username,
					displayName: values.displayName,
				})
			);
			const res = await fetch("/api/user", {
				method: "POST",
				body: formData,
			});
			if (res.ok) {
				setOpen(false);
				setUser(currentUser);
			} else {
				form.setError("username", {
					type: "manual",
					message: "Error signing up. Try again.",
				});
			}
		}
		setLoading(false);
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<DialogHeader>
								<DialogTitle>Account Creation</DialogTitle>
								<DialogDescription>
									Edit your account info here. Click sign up when you&apos;re
									done.
								</DialogDescription>
							</DialogHeader>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="@username" {...field} />
										</FormControl>
										<FormDescription>
											This is your unique username.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="displayName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Display name</FormLabel>
										<FormControl>
											<Input placeholder=":o" {...field} />
										</FormControl>
										<FormDescription>
											This is your public display name.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								{loading ? (
									<Button disabled>
										<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
										Please wait
									</Button>
								) : (
									<Button type="submit">Sign Up</Button>
								)}
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
}
