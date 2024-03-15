export default function Page({ params }: { params: { userid: string } }) {
	return <div>{params.userid}</div>;
}
