export default function Page({ params }: { params: { blogid: string } }) {
	return <div>blog: {params.blogid}</div>;
}
