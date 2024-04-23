import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const userRef = doc(db, "users", params.slug);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			return Response.json(
				{
					...(userSnap.data() as Object),
				},
				{ status: 200 }
			);
		} else {
			return Response.redirect("/404", 404);
		}
	} catch (e) {
		return Response.json({ e }, { status: 500 });
	}
}
