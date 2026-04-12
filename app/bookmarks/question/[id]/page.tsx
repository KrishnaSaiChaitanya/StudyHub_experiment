import BookmarkQuestionClient from "./BookmarkQuestionClient";

export default async function BookmarkQuestionPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <BookmarkQuestionClient id={id} />;
}
