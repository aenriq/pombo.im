"use server";

import {
	collection,
	addDoc,
	updateDoc,
	arrayUnion,
	doc,
	getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebaseAdmin";

/*
 * @TODO: Implement handling drafts and published posts
 */
export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const token = formData.get("token");
		const content = JSON.parse(formData.get("content") as string);
		const uid = formData.get("uid") as string;
		const title = formData.get("title") as string;
		const draft = formData.get("draft") as string;
		if (token === null || content === null) {
			return Response.json({}, { status: 400 });
		}
		await auth.verifyIdToken(token as string).catch((error) => {
			return Response.json({}, { status: 401 });
		});
		const uidref = await getDoc(doc(db, "uidrefs", uid));
		if (!uidref.exists()) {
			return Response.json({}, { status: 404 });
		}
		const username = uidref.data().username;
		const date = new Date();
		let docRef;
		if (draft === "false") {
			docRef = await addDoc(collection(db, "blogs"), {
				title: title,
				content,
				authorId: doc(db, "users", username),
				createdAt: date,
			});
			await updateDoc(doc(db, "users", username), {
				publishedPosts: arrayUnion({ ref: docRef, title: title, date: date }),
			});
		} else {
			docRef = await addDoc(collection(db, "drafts"), {
				title: title,
				content,
				authorId: doc(db, "users", username),
				createdAt: date,
			});
			await updateDoc(doc(db, "users", username), {
				draftPosts: arrayUnion({ ref: docRef, title: title, date: date }),
			});
		}

		// console.log("Document written with ID: ", docRef.id);

		return Response.json({ docid: docRef.id }, { status: 201 });
	} catch (e) {
		console.error("Error adding document: ", e);
		return Response.json({}, { status: 500 });
	}
}
