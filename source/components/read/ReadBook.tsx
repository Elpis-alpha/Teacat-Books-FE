import {
  BookInterface,
  ChapterClientInterface,
  ReadingSessionInterface,
} from "@/source/types/states";
import LandingBook from "./LandingBook";
import { ClipLoader } from "react-spinners";
import { useEffect, useRef } from "react";

interface ReadBookPageProps {
  book: BookInterface;
  lastRead: number;
  color: string;
  chapters: ChapterClientInterface[];
  readingSession: ReadingSessionInterface;
  scrollToChapter: (chapterNumber: number) => void;
  fetchChapter: (chapterNumber: number, sendBack?: boolean) => Promise<void>;
  makeChapterActive: (chapterNumber: number) => Promise<void>;
  special: "1" | "2";
}
const ReadBook = (props: ReadBookPageProps) => {
  const chaptersContainer = useRef<HTMLDivElement>(null);
  const fetchChapter = props.fetchChapter;
  const makeChapterActive = props.makeChapterActive;

  useEffect(() => {
    if (!chaptersContainer.current) return;
    console.log("Setting up Intersection Observer...");
    let current = 0;
    let current2 = 0;

    const handleChapterInView = (_chapterNumber: string | undefined) => {
      if (!_chapterNumber) return;
      const chapterNumber = parseInt(_chapterNumber);
      if (isNaN(chapterNumber)) return;

      fetchChapter(chapterNumber, chapterNumber < current)
        .then(async () => {
          await fetchChapter(chapterNumber - 1, true);

          await fetchChapter(chapterNumber + 1);
          await fetchChapter(chapterNumber + 2);
          if (chapterNumber > 1) {
            await fetchChapter(chapterNumber + 3);
            await fetchChapter(chapterNumber + 4);
            await fetchChapter(chapterNumber + 5);
          }
        })
        .catch((error) => {
          console.error("Error fetching chapter:", error);
        });

      current = chapterNumber;
    };

    const handleActiveChapterInView = (_chapterNumber: string | undefined) => {
      if (!_chapterNumber) return;
      const chapterNumber = parseInt(_chapterNumber);
      if (isNaN(chapterNumber)) return;
      if (chapterNumber < 0) return;
      if (chapterNumber === current2) return;

      current2 = chapterNumber;
      makeChapterActive(chapterNumber).catch((error) => {
        console.error("Error making chapter active:", error);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapterNumber = (entry?.target as HTMLElement)?.dataset
              ?.chapter;
            handleChapterInView(chapterNumber);
          }
        });
      },
      { threshold: 0, rootMargin: "-30px 0px -30px 0px" }
    );
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapterNumber = (entry?.target as HTMLElement)?.dataset
              ?.chapter;
            handleActiveChapterInView(chapterNumber);
          }
        });
      },
      { threshold: 0, rootMargin: "-30px 0px -30px 0px" }
    );

    const chapters = chaptersContainer.current.children;
    for (let i = 0; i < chapters.length; i++) {
      const chapterElement = chapters[i];
      observer.observe(chapterElement);
      activeObserver.observe(chapterElement);
    }

    return () => {
      console.log("Cleaning up Intersection Observer...");
      observer.disconnect();
      activeObserver.disconnect();
    };
  }, [fetchChapter, makeChapterActive]);

  return (
    <div ref={chaptersContainer} className="w-full select-none">
      <LandingBook
        lastRead={props.lastRead}
        book={props.book}
        readingSession={props.readingSession}
        scrollToChapter={props.scrollToChapter}
      />
      {props.chapters.map((chap) => {
        function escapeRegExp(string: string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

        const title =
          chap.title.toLowerCase() === "untitled" ? "New Chapter" : chap.title;
        const preContent = "text" in chap ? chap.text : "";
        const titleRegex = new RegExp(
          `^${escapeRegExp(title)}[\\s\\r\\n]*`,
          "i"
        );
        const content = preContent.replace(titleRegex, "").trim();

        return (
          <div
            key={"my-chapter" + props.special + "-" + chap.chapterNumber}
            id={"my-chapter" + props.special + "-" + chap.chapterNumber}
            data-chapter={chap.chapterNumber}
            className="w-full py-28"
          >
            <h3 className="font-bold text-2xl">{title}</h3>

            {"loading" in chap && chap.loading ? (
              <div className="w-full mt-5 min-h-[70vh]">
                <ClipLoader color={props.color} size={20} />
              </div>
            ) : "loading" in chap && !chap.loading ? (
              <div className="mt-5 justify-epub flex min-h-[70vh] items-start">
                <button
                  onClick={() => props.scrollToChapter(chap.chapterNumber)}
                  className="bg-highlight hover:bg-highlight-dark py-1 px-4 rounded-md 2xl:rounded-xl "
                >
                  Fetch Chapter
                </button>
              </div>
            ) : "text" in chap ? (
              <div className=" whitespace-pre-wrap mt-5">
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </div>
            ) : (
              <div className="mt-5 justify-epub flex min-h-[70vh] items-start">
                <button
                  onClick={() => props.scrollToChapter(chap.chapterNumber)}
                  className="bg-highlight hover:bg-highlight-dark py-1 px-4 rounded-md 2xl:rounded-xl "
                >
                  Fetch Chapter (ERROR)
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default ReadBook;
