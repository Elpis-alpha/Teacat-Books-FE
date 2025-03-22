import {
  BookInterface,
  ChapterInterface,
  ReadingSessionInterface,
  ReadInterface,
} from "@/source/types/states";
import LandingBook from "./LandingBook";
import { useEffect } from "react";
import { getLastPosition, setLastPosition } from "@/source/helpers/read";
import { ClipLoader } from "react-spinners";

interface ReadBookPageProps {
  book: BookInterface;
  prevChapter: number | undefined;
  nextChapter: number | undefined;
  lastRead: number;
  fetching: number | null;
  chapters: ChapterInterface[];
  readingSession: ReadingSessionInterface;
  bookmarks: number[];
  chapter: ReadInterface | null;
  fetchChapter: (chapterNumber: number) => Promise<void>;
  toggleNav: (action?: "open" | "close") => void;
}
const ReadBook = (props: ReadBookPageProps) => {
  const { chapter, fetching, nextChapter, prevChapter } = props;

  useEffect(() => {
    if (!chapter?.chapterNumber) return;
    if (typeof chapter?.chapterNumber !== "number") return;
    if (isNaN(chapter?.chapterNumber)) return;

    const interval = setInterval(() => {
      const currentPosition = window.scrollY;
      const storedPosition = getLastPosition(chapter.chapterNumber);

      if (currentPosition !== storedPosition) {
        setLastPosition(chapter.chapterNumber);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [chapter?.chapterNumber]);

  if (!chapter)
    return (
      <LandingBook
        lastRead={props.lastRead}
        book={props.book}
        readingSession={props.readingSession}
        fetching={fetching}
        fetchChapter={props.fetchChapter}
        toggleNav={props.toggleNav}
      />
    );

  return (
    <div className="w-full select-none">
      <h3 className="font-bold text-2xl">{chapter.title}</h3>
      <div className=" whitespace-pre-wrap">
        <div dangerouslySetInnerHTML={{ __html: chapter.text }}></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 mx-auto mt-5 text-xs smm:text-base sm:text-xl">
        {prevChapter && (
          <button
            disabled={typeof fetching === "number"}
            className="py-2 px-3 sm:px-7 rounded-md sm:rounded-xl bg-highlight hover:bg-highlight-dark text-white w-full flex items-center justify-center gap-1.5"
            onClick={() => props.fetchChapter(prevChapter)}
          >
            <span className="line-clamp-1">Previous Chapter</span>
            {fetching === prevChapter && (
              <span className="flex items-center">
                <ClipLoader color="#ffffff" size={16} />
              </span>
            )}
          </button>
        )}
        {nextChapter && (
          <button
            disabled={typeof fetching === "number"}
            className="py-2 px-3 sm:px-7 rounded-md sm:rounded-xl bg-highlight hover:bg-highlight-dark text-white w-full flex items-center justify-center gap-1.5"
            onClick={() => props.fetchChapter(nextChapter)}
          >
            Next Chapter
            {fetching === nextChapter && (
              <span className="flex items-center">
                <ClipLoader color="#ffffff" size={16} />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default ReadBook;
