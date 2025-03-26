import { getApiJson } from "@/source/api";
import { cookies } from "next/headers";
import routes from "@/source/api/routes";
import {
  ErrorPage,
  NormalPage,
} from "@/source/components/reusable/SimplePages";
import { host, tokenCookieName } from "@/source/config";
import BookPage from "@/source/components/books/BookPage";
import { Metadata, ResolvingMetadata } from "next";
import { BookInterface } from "@/source/types/states";
import { format } from "date-fns";

export async function generateMetadata(
  { params }: { params: Promise<{ bookID: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { bookID } = await params;

  if (!bookID || bookID.length !== 24) {
    return { title: "Invalid Book" };
  }

  const response = await getApiJson(routes.book.meta(bookID));
  if (response.error || !response.book) {
    console.error(response);
    return { title: response.errorMessage || "Book not found" };
  }

  const book = response.book as BookInterface;
  return {
    title: book.title,
    description: book.description,
    authors: [
      {
        name:
          book.author &&
          typeof book.author === "object" &&
          "name" in book.author
            ? book.author.name
            : "Author",
        url:
          book.author && typeof book.author === "object" && "_id" in book.author
            ? `${host}/profile/${book.author._id}`
            : `${host}/profile/${book.author}`,
      },
    ],
    category: "book",

    openGraph: {
      images: [book.mainImage, book.coverImage],
      type: "book",
      authors: [
        book.author && typeof book.author === "object" && "name" in book.author
          ? book.author.name
          : "Author",
      ],
      description: book.description,
      title: book.title,
      releaseDate: format(new Date(book.createdAt), "PPPP"),
    },
    applicationName: "Teacat Books",
  };
}

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
