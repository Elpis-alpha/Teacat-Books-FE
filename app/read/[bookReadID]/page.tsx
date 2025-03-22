import { getApiJson } from "@/source/api";
import { cookies } from "next/headers";
import routes from "@/source/api/routes";
import { ErrorPage } from "@/source/components/reusable/SimplePages";
import { tokenCookieName } from "@/source/config";
import ClientRender from "@/source/components/reusable/ClientRender";
import ReadBookPage, {
  PreReadBookPage,
} from "@/source/components/read/ReadBookPage";
import { getTheme } from "@/source/helpers/read";

export default async function Home({
  params,
}: {
  params: Promise<{ bookReadID: string }>;
}) {
  const cookieStore = await cookies();
  const myCookie = cookieStore.get(tokenCookieName);

  const _theme = cookieStore.get("read-theme");
  const theme = getTheme(_theme?.value);

  const { bookReadID } = await params;
  if (!bookReadID || bookReadID.length !== 24) {
    return (
      <ErrorPage message="Invalid Book" returnLink="/" returnText="go home" />
    );
  }

  const response = await getApiJson(
    routes.book.chapter(bookReadID, 0),
    myCookie?.value
  );
  if (
    response.error ||
    !response.book ||
    !response.chapters ||
    !response.readingSession ||
    !response.bookmarks
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
    <ClientRender initial={<PreReadBookPage theme={theme} />}>
      <ReadBookPage
        initialTheme={theme}
        book={response.book}
        chapters={response.chapters}
        readingSession={response.readingSession}
        bookmarks={response.bookmarks}
      />
    </ClientRender>
  );
}
