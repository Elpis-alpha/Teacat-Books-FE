"use client";
import {
  getLastPosition,
  getTheme,
  parseFontFamily,
  ThemeInterface,
} from "@/source/helpers/read";
import {
  BookInterface,
  ChapterInterface,
  ReadingSessionInterface,
  ReadInterface,
} from "@/source/types/states";
import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import ReadBook from "./ReadBook";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import gsap from "gsap";
import SafeImage from "../reusable/SafeImage";
import toast from "react-hot-toast";
import { getApiJson, postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import Hamburger from "hamburger-react";
import ModalOverflow from "../modals/ModalOverflow";
import {
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaRegBookmark,
} from "react-icons/fa";
import { setModal } from "@/source/store/slice/UIslice";

interface ReadBookPageProps {
  initialTheme: ThemeInterface;
  book: BookInterface;
  chapters: ChapterInterface[];
  readingSession: ReadingSessionInterface;
  bookmarks: number[];
}
const ReadBookPage = (props: ReadBookPageProps) => {
  const dispatch = useAppDispatch();
  const [theme, setTheme] = useState(props.initialTheme);

  const [chapter, setChapter] = useState<ReadInterface | null>(null);
  const [fetching, setFetching] = useState<number | null>(null);
  const [lastRead, setLastRead] = useState(props.readingSession.currentChapter);
  const [bookmarks, setBookmarks] = useState(props.bookmarks);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const fetchChapter = async (chapterNumber: number) => {
    if (chapterNumber <= 0) {
      scrollBackToTopOrLastPosition(chapterNumber);
      return setChapter(null);
    }
    const isValid = props.chapters.some(
      (c) => c.chapterNumber === chapterNumber
    );
    if (!isValid) {
      toast.error("This chapter is out of bounds");
      return;
    }

    try {
      setFetching(chapterNumber);

      const response = await getApiJson(
        routes.book.chapter(props.book._id, chapterNumber)
      );
      if (
        response.error ||
        !response.chapter ||
        typeof response.text !== "string"
      ) {
        toast.error(response.errorMessage || "Failed to fetch chapter");
        console.error(response);
      } else {
        setLastRead(chapterNumber);
        setChapter({
          _id: response.chapter._id,
          chapterNumber: response.chapter.chapterNumber,
          text: response.text,
          title: response.chapter.title,
        });
        scrollBackToTopOrLastPosition(chapterNumber);
      }
    } catch (err) {
      toast.error("Failed to fetch chapter");
      console.error(err);
    }
    setFetching(null);
    setOnlyBookmarked(false);
  };

  const bookmarkChapter = async (chapterNumber: number, mark: boolean) => {
    if (chapterNumber <= 0) return;
    const isValid = props.chapters.some(
      (c) => c.chapterNumber === chapterNumber
    );
    if (!isValid) {
      toast.error("This chapter is out of bounds");
      return;
    }

    try {
      setFetching(Infinity);

      const response = await postApiJson(routes.book.bookmark, {
        bookID: props.book._id,
        chapterNumber,
        bookmark: mark,
      });
      if (
        response.error ||
        !response.message ||
        typeof response.bookmark !== "boolean"
      ) {
        toast.error(response.errorMessage || "Failed to bookmark");
        console.error(response);
      } else {
        if (response.bookmark) {
          setBookmarks([
            ...bookmarks.filter((b) => b !== chapterNumber),
            chapterNumber,
          ]);
        } else {
          setBookmarks([...bookmarks.filter((b) => b !== chapterNumber)]);
        }
      }
    } catch (err) {
      toast.error("Failed to bookmark");
      console.error(err);
    }
    setFetching(null);
  };

  const scrollBackToTopOrLastPosition = async (chapterNumber: number) => {
    if (typeof window === "undefined") return;

    scrollChapterListTo(chapterNumber);
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (chapterNumber === 0 || getLastPosition(chapterNumber) === 0) {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const lastPosition = getLastPosition(chapterNumber);
    window.scroll({
      top: lastPosition,
      behavior: "smooth",
    });
  };

  const scrollChapterListTo = (chapterNumber: number) => {
    if (typeof window === "undefined") return;

    const navChapterID = chapterNumber + "-chapter_to_scroll";
    const navChapter = document.getElementById(navChapterID);
    if (navChapter) {
      navChapter.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const changeTheme = useAppSelector((state) => state.ui.changeTheme);
  const lastChangedTheme = useRef(changeTheme);

  useEffect(() => {
    if (lastChangedTheme.current !== changeTheme) {
      lastChangedTheme.current = changeTheme;
      setTheme(getTheme());
    }
  }, [changeTheme]);

  // NAV CODE
  const isChanging = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [navIsOpen, setNavIsOpen] = useState(false);
  const navIsOpenRef = useRef(navIsOpen);
  const clickBlur: MouseEventHandler<HTMLDivElement> = (e) => {
    const tar = e.target as HTMLDivElement | undefined;
    if (tar?.id === "read-nav-blur") toggleNav();
  };
  const toggleNav = (action?: "open" | "close") => {
    if (isChanging.current) return;
    if (!navRef.current) return;

    if (action === "open" && navIsOpenRef.current) return;
    if (action === "close" && !navIsOpenRef.current) return;

    const navState = navIsOpen;
    setNavIsOpen((p) => {
      navIsOpenRef.current = !p;
      return navIsOpenRef.current;
    });

    gsap
      .to(navRef.current, {
        left: navState ? "101vw" : "0vw",
        duration: 0.2,
        ease: "power1.inOut",
      })
      .then(() => {
        isChanging.current = false;
      });
  };

  const prevChapter = useMemo(() => {
    return props.chapters.find(
      (x) =>
        chapter?.chapterNumber && x.chapterNumber === chapter.chapterNumber - 1
    )?.chapterNumber;
  }, [chapter?.chapterNumber, props.chapters]);
  const nextChapter = useMemo(() => {
    return props.chapters.find(
      (x) =>
        chapter?.chapterNumber && x.chapterNumber === chapter.chapterNumber + 1
    )?.chapterNumber;
  }, [chapter?.chapterNumber, props.chapters]);
  const isBookmarked = useMemo(() => {
    return chapter?.chapterNumber
      ? bookmarks.includes(chapter.chapterNumber)
      : false;
  }, [chapter?.chapterNumber, bookmarks]);

  return (
    <>
      {chapter && (
        <div className="py-4 px-3 sm:px-4 flex items-center gap-2 sm:gap-4 bg-main-bg text-xl sm:text-2xl">
          <button
            disabled={typeof fetching === "number"}
            className="flex items-center justify-center"
            onClick={() => toggleNav("open")}
          >
            <Hamburger toggled={navIsOpen} size={24} distance="sm" rounded />
          </button>
          <button
            disabled={typeof fetching === "number"}
            onClick={() => fetchChapter(0)}
            className="flex-1 line-clamp-1 text-lg text-left"
          >
            {props.book.title}
          </button>
          <div className="flex items-center sm:gap-1">
            <button
              disabled={typeof fetching === "number"}
              className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 hover:text-blue-300"
              onClick={() => {
                bookmarkChapter(chapter.chapterNumber, !isBookmarked);
              }}
            >
              {isBookmarked ? (
                <FaBookmark className="text-yellow-300" />
              ) : (
                <FaRegBookmark />
              )}
            </button>
            <button
              disabled={typeof fetching === "number"}
              className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 hover:text-blue-300"
              onClick={() => {
                dispatch(
                  setModal({
                    active: true,
                    type: "set-theme",
                  })
                );
              }}
            >
              <FaCog />
            </button>
            {prevChapter && (
              <button
                disabled={typeof fetching === "number"}
                className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 hover:text-blue-300"
                onClick={() => fetchChapter(prevChapter)}
              >
                {fetching !== prevChapter ? (
                  <FaChevronLeft />
                ) : (
                  <ClipLoader color="#ffffff" size={20} />
                )}
              </button>
            )}
            {nextChapter && (
              <button
                disabled={typeof fetching === "number"}
                className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 hover:text-blue-300"
                onClick={() => fetchChapter(nextChapter)}
              >
                {fetching !== nextChapter ? (
                  <FaChevronRight />
                ) : (
                  <ClipLoader color="#ffffff" size={20} />
                )}
              </button>
            )}
          </div>
        </div>
      )}
      <main
        className={
          "flex-1 w-full font-miller flex base-theme-transition overflow-auto py-4 " +
          (theme.textAlignment === "center"
            ? "epub-img-center"
            : theme.textAlignment === "right"
            ? "epub-img-right"
            : "epub-img-left")
        }
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: parseFontFamily(theme.fontFamily),
          lineHeight: theme.lineHeight,
          textAlign: theme.textAlignment,
        }}
      >
        <div
          className="hidden sm:flex flex-1 flex-col items-center justify-center w-full mid-theme-transition"
          style={{
            padding: 40 * (theme.paddingPercentage / 100),
            fontSize: 20 * (theme.fontPercentage / 100),
          }}
        >
          <ReadBook
            lastRead={lastRead}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
            toggleNav={toggleNav}
            chapter={chapter}
            fetching={fetching}
            fetchChapter={fetchChapter}
            book={props.book}
            chapters={props.chapters}
            readingSession={props.readingSession}
            bookmarks={props.bookmarks}
          />
        </div>
        <div
          className="flex sm:hidden flex-1 flex-col items-center justify-center w-full"
          style={{
            padding: 24 * (theme.paddingPercentage / 100),
            fontSize: 16 * (theme.fontPercentage / 100),
          }}
        >
          <ReadBook
            lastRead={lastRead}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
            toggleNav={toggleNav}
            chapter={chapter}
            fetching={fetching}
            fetchChapter={fetchChapter}
            book={props.book}
            chapters={props.chapters}
            readingSession={props.readingSession}
            bookmarks={props.bookmarks}
          />
        </div>
      </main>
      <div
        ref={navRef}
        onClick={clickBlur}
        className={`fixed block backdrop-blur-sm w-full h-full top-0 bottom-0 z-70 left-[101vw] transition-all cursor-alias`}
        id="read-nav-blur"
      >
        <div
          className={
            "h-full w-[300px] max-w-[100vw]  mr-0 ml-auto overflow-auto flex flex-col  " +
            "bg-sub-bg cursor-auto font-proxima py-8"
          }
        >
          <div className="px-8 pb-5">
            <SafeImage
              src={makeImageSmaller(props.book.mainImage)}
              alt={props.book.title}
              className="w-[100px]"
            />
          </div>
          <button
            onClick={async () => {
              await fetchChapter(0);
              toggleNav("close");
            }}
            className="px-8 text-left hover:bg-white/20 py-5"
          >
            <h1 className="text-2xl font-bold">{props.book.title}</h1>
          </button>
          <div className="flex gap-2 w-full px-8 my-4">
            <button
              disabled={typeof fetching === "number"}
              onClick={() => {
                setOnlyBookmarked(false);
              }}
              className={`${
                onlyBookmarked
                  ? "bg-white/10 hover:bg-white/40"
                  : "bg-white text-black"
              } py-1 px-4 rounded-lg text-base block`}
            >
              All
            </button>
            <button
              disabled={typeof fetching === "number"}
              onClick={() => {
                setOnlyBookmarked(true);
              }}
              className={`${
                onlyBookmarked
                  ? "bg-white text-black"
                  : "bg-white/10 hover:bg-white/40"
              } py-1 px-4 rounded-lg text-base block`}
            >
              Bookmarked
            </button>
          </div>

          <div className="flex flex-col gap-0 text-left">
            {props.chapters
              .filter(
                (cc) => !onlyBookmarked || bookmarks.includes(cc.chapterNumber)
              )
              .map((cc) => (
                <button
                  id={cc.chapterNumber + "-chapter_to_scroll"}
                  key={cc._id}
                  disabled={typeof fetching === "number"}
                  onClick={async () => {
                    await fetchChapter(cc.chapterNumber);
                    toggleNav("close");
                  }}
                  className={
                    "p-1 hover:bg-white/20 flex items-center gap-2 px-8 py-5 text-left " +
                    (cc.chapterNumber === chapter?.chapterNumber
                      ? "bg-white/10"
                      : "")
                  }
                >
                  <span className="line-clamp-1">
                    {cc.chapterNumber}: {cc.title}
                  </span>
                  {fetching === cc.chapterNumber && (
                    <span className="flex items-center">
                      <ClipLoader color="white" size={16} />
                    </span>
                  )}
                </button>
              ))}
            {props.chapters.filter(
              (cc) => !onlyBookmarked || bookmarks.includes(cc.chapterNumber)
            ).length === 0 && (
              <div className="px-8 py-5 text-center text-white">
                No chapters found
              </div>
            )}
          </div>
        </div>
        {navIsOpen && <ModalOverflow />}
      </div>
    </>
  );
};

export default ReadBookPage;

export const PreReadBookPage = ({ theme }: { theme: ThemeInterface }) => {
  return (
    <main
      className="flex-1 w-full flex items-center justify-center p-5"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <ClipLoader color={theme.textColor} size={36} />
    </main>
  );
};
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_100/`);
};
