"use server";
import {
	addDoc,
	getDoc,
	deleteDoc,
	doc,
	updateDoc,
	arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const docRef = doc(db, "blogs", params.slug);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const userSnap = await getDoc(docSnap.data().authorId);
			const userData = userSnap.data() as { username: string };
			return Response.json(
				{
					...docSnap.data(),
					username: userData.username,
				},
				{ status: 200 }
			);
		} else {
			return Response.redirect("/404", 404);
		}
	} catch (e) {
		return Response.json({}, { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const formData = await request.formData();
		const uid = formData.get("uid") as string;
		const docRef = doc(db, "blogs", params.slug);
		await deleteDoc(docRef);
		await updateDoc(doc(db, "users", uid), { posts: arrayRemove(docRef) });
		return Response.json({}, { status: 204 });
	} catch (e) {
		return Response.json({}, { status: 500 });
	}
}
