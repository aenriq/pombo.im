import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type User = {
	uid: string;
	email: string;
	username: string;
	photoURL: string;
};

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const currentUser = JSON.parse(
			formData.get("currentUser") as string
		) as User;
		await setDoc(doc(db, "users", currentUser.username), {
			...currentUser,
		});
		await setDoc(doc(db, "uidrefs", currentUser.uid), {
			ref: doc(db, "users", currentUser.username),
			username: currentUser.username,
		});

		return Response.json({ userid: currentUser.username }, { status: 201 });
	} catch (e) {
		console.error("Error adding document: ", e);
		return Response.json({}, { status: 500 });
	}
}
