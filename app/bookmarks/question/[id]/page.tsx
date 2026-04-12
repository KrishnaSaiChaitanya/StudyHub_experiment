import BookmarkQuestionClient from "./BookmarkQuestionClient";

export default function BookmarkQuestionPage({ params }: { params: { id: string } }) {
  return <BookmarkQuestionClient id={params.id} />;
}
