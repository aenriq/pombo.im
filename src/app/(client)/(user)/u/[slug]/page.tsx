"use client";
import { Separator } from "@/components/ui/separator";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type posts = {
	title: string;
	date: string;
	ref: any;
};

const postList = (postArray: Array<posts>) => {
	return postArray.length === 0 ? (
		<div>No posts</div>
	) : (
		postArray.map((post: any) => (
			<a
				key={post.ref._key.path.segments[6]}
				href={`/blog/${post.ref._key.path.segments[6]}`}
			>
				<h3 className="text-lg">{post.title}</h3>
				<p className="text-xs text-muted-foreground">
					{new Date(post.date.seconds * 1000).toLocaleDateString("en-US", {
						month: "2-digit",
						day: "2-digit",
						year: "numeric",
					})}
				</p>
				<Separator orientation="horizontal" className="w-full" />
			</a>
		))
	);
};

export default function Page({ params }: { params: { slug: string } }) {
	const [response, setResponse] = useState<any | null>(null);
	const router = useRouter();
	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/user/${params.slug}`, { method: "GET" });
			if (res.ok) {
				const data = await res.json();
				setResponse(data);
			} else {
				router.push("/404");
			}
		};
		fetchData();
	}, [params.slug, router]);
	return (
		<>
			{!response ? (
				<div className="flex flex-col items-center justify-center col-[2]">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			) : (
				<>
					<div className="col-[1]">
						<div className="flex flex-col justify-center">
							{/* <Image
									src={response?.photoURL}
									alt={response?.username}
									className="rounded-full h-24 w-24"
									width={30}
									height={30}
								/> */}
							<p className="text-foreground text-xl">{response.displayName}</p>
							<p className="text-muted-foreground text-sm">
								@{response.username}
							</p>
						</div>
					</div>
					<div className="col-[2]">{postList(response.publishedPosts)}</div>
				</>
			)}
		</>
	);
}
