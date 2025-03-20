import { getApiJson } from "@/source/api";
import { cookies } from "next/headers";
import routes from "@/source/api/routes";
import {
  ErrorPage,
  NormalPage,
} from "@/source/components/reusable/SimplePages";
import { tokenCookieName } from "@/source/config";
import BookPage from "@/source/components/books/BookPage";

export default async function Home({
  params,
}: {
  params: Promise<{ bookID: string }>;
}) {
  const cookieStore = await cookies();
  const myCookie = cookieStore.get(tokenCookieName);

  const { bookID } = await params;
  if (!bookID || bookID.length !== 24) {
    return (
      <ErrorPage message="Invalid Book" returnLink="/" returnText="go home" />
    );
  }
  // book
  // review
  // myData
  const response = await getApiJson(routes.book.one(bookID), myCookie?.value);
  if (
    response.error ||
    !response.book ||
    !response.review ||
    !response.myData
  ) {
    console.error(response);
    return (
      <ErrorPage
        message={response.errorMessage || "Book not found"}
        returnLink="/"
        returnText="go home"
      />
    );
  }

  return (
    <NormalPage useStart>
      <BookPage
        book={response.book}
        review={response.review}
        myData={response.myData}
      />
    </NormalPage>
  );
}
