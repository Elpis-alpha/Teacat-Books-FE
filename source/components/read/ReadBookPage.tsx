"use client";
import {
  getTheme,
  parseFontFamily,
  ThemeInterface,
} from "@/source/helpers/read";
import {
  BookInterface,
  ChapterClientInterface,
  ChapterInterface,
  PreChapterInterface,
  ReadingSessionInterface,
} from "@/source/types/states";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { FaBookmark, FaCog, FaRegBookmark } from "react-icons/fa";
import { setModal } from "@/source/store/slice/UIslice";
import { FaEllipsisVertical } from "react-icons/fa6";
import Link from "next/link";
import { requestFullScreen } from "@/source/helpers";

interface ReadBookPageProps {
  initialTheme: ThemeInterface;
  book: BookInterface;
  chapters: ChapterInterface[];
  readingSession: ReadingSessionInterface;
  bookmarks: number[];
  preChapters: PreChapterInterface[];
}
const ReadBookPage = (props: ReadBookPageProps) => {
  const dispatch = useAppDispatch();
  const scrollToTopRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState(props.initialTheme);

  // const [chapter, setChapter] = useState<ReadInterface | null>(null);
  // const [fetching, setFetching] = useState<number | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [lastRead, setLastRead] = useState(props.readingSession.currentChapter);
  const [revealDropDown, setRevealDropDown] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const activeChapterTitle = useMemo(() => {
    if (activeChapter === 0) return "Book Cover";
    if (activeChapter === -1) return "Book End";
    if (!activeChapter) return null;

    const chapter = props.chapters.find(
      (c) => c.chapterNumber === activeChapter
    );
    if (!chapter) return null;
    return chapter.chapterNumber + ". " + chapter.title;
  }, [activeChapter, props.chapters]);

  const [bookmarks, setBookmarks] = useState(props.bookmarks);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  const [chapters, setChapters] = useState<ChapterClientInterface[]>(
    props.chapters.map((c) => {
      const preChapter =
        c.chapterNumber > 10
          ? null
          : props.preChapters.find((p) => p.chapterNumber === c.chapterNumber);

      if (preChapter) {
        return {
          _id: preChapter._id,
          chapterNumber: c.chapterNumber,
          title: c.title,
          text: preChapter.text,
          bookmarked: bookmarks.includes(c.chapterNumber),
        };
      }

      return {
        _id: c._id,
        chapterNumber: c.chapterNumber,
        title: c.title,
        bookmarked: bookmarks.includes(c.chapterNumber),
        loading: false,
      };
    })
  );
  const chaptersRef = useRef(chapters);

  const fetchChapter = useCallback(
    async (chapterNumber: number, sendBack?: boolean) => {
      if (chapterNumber === 0) setActiveChapter(0);
      if (chapterNumber <= 0) return;

      const chapter = chaptersRef.current.find(
        (c) => c.chapterNumber === chapterNumber
      );
      if (!chapter) return;

      if ("loading" in chapter && chapter.loading) return;
      if ("text" in chapter && chapter.text) return;

      try {
        setChapters((p) => {
          const res = p.map((c) =>
            c.chapterNumber === chapterNumber ? { ...c, loading: true } : c
          );
          chaptersRef.current = res;
          return res;
        });
        console.log(`Chapter ${chapterNumber} is fetching...`);

        const response = await getApiJson(
          routes.book.chapter(props.book._id, chapterNumber)
        );
        if (
          response.error ||
          !response.chapter ||
          typeof response.text !== "string"
        ) {
          toast.error(response.errorMessage || "Failed to fetch chapter.");
          console.error(response);
          setChapters((p) => {
            const res = p.map((c) =>
              c.chapterNumber === chapterNumber ? { ...c, loading: false } : c
            );
            chaptersRef.current = res;
            return res;
          });
        } else {
          const prevScrollHeight = mainRef.current?.scrollHeight;
          const prevY = window.scrollY;

          setChapters((p) => {
            const res = p.map((c) =>
              c.chapterNumber === chapterNumber
                ? {
                    _id: c._id,
                    chapterNumber: c.chapterNumber,
                    title: c.title,
                    text: response.text,
                    bookmarked: c.bookmarked,
                  }
                : c
            );
            chaptersRef.current = res;
            return res;
          });

          setTimeout(() => {
            const newScrollHeight = mainRef.current?.scrollHeight;

            if (mainRef.current && prevScrollHeight && newScrollHeight) {
              const scrollDiff = newScrollHeight - prevScrollHeight;
              mainRef.current.scrollTop += scrollDiff;

              if (sendBack) {
                const YDiff = window.scrollY - prevY;
                // console.log("diff", {
                //   chapterNumber,
                //   scrollDiff,
                //   scrollY: window.scrollY,
                //   prevScrollHeight,
                //   newScrollHeight,
                //   YDiff,
                // });

                window.scrollTo({
                  top: window.scrollY + scrollDiff - YDiff,
                  left: 0,
                  behavior: "instant",
                });
              }
            }
          }, 1);
        }
      } catch (err) {
        toast.error("Failed to fetch chapter.");
        console.error(err);
      }
      setOnlyBookmarked(false);
    },
    [props.book._id]
  );

  const makeChapterActive = useCallback(
    async (chapterNumber: number) => {
      if (chapterNumber === 0) setActiveChapter(0);
      if (chapterNumber <= 0) return;

      const chapter = chaptersRef.current.find(
        (c) => c.chapterNumber === chapterNumber
      );
      if (!chapter) return;

      try {
        const response = await postApiJson(routes.book.currentChapter, {
          bookID: props.book._id,
          chapterNumber,
        });
        if (response.error) {
          console.error(response);
        } else {
          setLastRead(chapterNumber);
          setActiveChapter(chapterNumber);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [props.book._id]
  );

  const bookmarkChapter = async (chapterNumber: number, mark: boolean) => {
    if (chapterNumber <= 0) return;
    const isValid = props.chapters.some(
      (c) => c.chapterNumber === chapterNumber
    );
    if (!isValid) {
      toast.error("This chapter is out of bounds.");
      return;
    }

    try {
      setBookmarking(true);

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
        toast.error(response.errorMessage || "Failed to bookmark.");
        console.error(response);
      } else {
        if (response.bookmark) {
          setBookmarks((prev) => {
            const newBookmarks = [...prev, chapterNumber];
            return [...new Set(newBookmarks)];
          });
          setChapters((p) => {
            const res = p.map((c) =>
              c.chapterNumber === chapterNumber ? { ...c, bookmarked: true } : c
            );

            chaptersRef.current = res;
            return res;
          });
          toast.success("Bookmarked.");
        } else {
          setBookmarks((prev) => prev.filter((b) => b !== chapterNumber));
          setChapters((p) => {
            const res = p.map((c) =>
              c.chapterNumber === chapterNumber
                ? { ...c, bookmarked: false }
                : c
            );
            chaptersRef.current = res;
            return res;
          });
          toast.success("Removed bookmark.");
        }
      }
    } catch (err) {
      toast.error("Failed to bookmark.");
      console.error(err);
    }
    setBookmarking(false);
  };

  const scrollToChapter = (chapterNumber: number) => {
    if (typeof window === "undefined") return;

    const chapterID = "my-chapter1-" + chapterNumber;
    const chapter = document.getElementById(chapterID);
    if (chapter) {
      chapter.scrollIntoView({
        behavior: "instant",
        block: "start",
        // inline: "start",
      });
    }

    const chapterID2 = "my-chapter2-" + chapterNumber;
    const chapter2 = document.getElementById(chapterID2);
    if (chapter2) {
      chapter2.scrollIntoView({
        behavior: "instant",
        block: "start",
        // inline: "start",
      });
    }
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

  // Scroll Restoration
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

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

    scrollChapterListTo(activeChapter || 0);

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

  const isBookmarked = useMemo(() => {
    return activeChapter ? bookmarks.includes(activeChapter) : false;
  }, [activeChapter, bookmarks]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-3 sm:px-4 flex items-center gap-2 sm:gap-4 bg-main-bg text-xl sm:text-2xl">
        <button
          className="flex items-center justify-center"
          onClick={() => toggleNav("open")}
        >
          <Hamburger toggled={navIsOpen} size={24} distance="sm" rounded />
        </button>
        <div className="flex-1">
          <button
            onClick={() => {
              if (scrollToTopRef.current) {
                scrollToTopRef.current.scrollIntoView({
                  behavior: "instant",
                  block: "start",
                  inline: "start",
                });
              }
            }}
            className="flex-1 line-clamp-1 text-lg text-left"
          >
            {props.book.title}
          </button>
          {activeChapterTitle && (
            <button
              onClick={() => {
                scrollToChapter(activeChapter);
              }}
              className=" line-clamp-1 text-xs text-left"
            >
              {activeChapterTitle}
            </button>
          )}
        </div>
        <div className="flex items-center sm:gap-1">
          {activeChapter > 0 && (
            <button
              disabled={bookmarking}
              className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 hover:text-blue-300"
              onClick={() => {
                bookmarkChapter(activeChapter, !isBookmarked);
              }}
            >
              {isBookmarked ? (
                <FaBookmark className="text-yellow-300" />
              ) : (
                <FaRegBookmark />
              )}
            </button>
          )}
          <button
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
          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-white/30 bg-white/5 rounded-full text-lg sm:text-xl"
            onClick={() => setRevealDropDown((p) => !p)}
          >
            <FaEllipsisVertical />
          </button>
        </div>
        {revealDropDown && (
          <div className="absolute right-4 top-16 bg-main-bg/80 text-white backdrop-blur-sm rounded-lg shadow-md min-w-[200px] overflow-hidden">
            <button
              className="flex items-center gap-2 text-lg hover:bg-white/10 px-6 py-4 w-full"
              onClick={() => {
                setRevealDropDown(false);
                toggleNav("open");
              }}
            >
              <span>Chapters</span>
            </button>
            <button
              className="flex items-center gap-2 text-lg hover:bg-white/10 p-2 px-6 py-4 w-full"
              onClick={() => {
                setRevealDropDown(false);
                if (scrollToTopRef.current) {
                  scrollToTopRef.current.scrollIntoView({
                    behavior: "instant",
                    block: "start",
                    inline: "start",
                  });
                }
              }}
            >
              <span>Go to top</span>
            </button>
            <button
              className="flex items-center gap-2 text-lg hover:bg-white/10 p-2 px-6 py-4 w-full"
              onClick={() => {
                requestFullScreen();
                setRevealDropDown(false);
              }}
            >
              <span>Full Screen</span>
            </button>
            <Link
              href="/my-books"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg hover:bg-white/10 p-2 px-6 py-4 w-full"
              onClick={() => {
                setRevealDropDown(false);
              }}
            >
              <span>Back to Library</span>
            </Link>
          </div>
        )}
      </nav>
      <div ref={scrollToTopRef} className="w-full h-[80px]"></div>
      <main
        ref={mainRef}
        className={
          "flex-1 w-full font-miller flex base-theme-transition overflow-auto py-4 px-5 sm:px-20 " +
          (theme.textAlignment === "center"
            ? "epub-img-center"
            : theme.textAlignment === "right"
            ? "epub-img-right"
            : "epub-img-left")
        }
        style={{
          color: theme.textColor,
          fontFamily: parseFontFamily(theme.fontFamily),
          lineHeight: theme.lineHeight,
          textAlign: theme.textAlignment,
        }}
      >
        <div
          className="hidden sm:flex flex-1 flex-col items-center justify-center w-full max-w-[1400px] mx-auto mid-theme-transition"
          style={{
            backgroundColor: theme.backgroundColor,
            padding: 40 * (theme.paddingPercentage / 100),
            fontSize: 20 * (theme.fontPercentage / 100),
          }}
        >
          <ReadBook
            lastRead={lastRead}
            book={props.book}
            color={theme.textColor}
            chapters={chapters}
            readingSession={props.readingSession}
            scrollToChapter={scrollToChapter}
            fetchChapter={fetchChapter}
            makeChapterActive={makeChapterActive}
            special="1"
          />
        </div>
        <div
          className="flex sm:hidden flex-1 flex-col items-center justify-center w-full max-w-[1400px] mx-auto mid-theme-transition"
          style={{
            backgroundColor: theme.backgroundColor,
            padding: 24 * (theme.paddingPercentage / 100),
            fontSize: 16 * (theme.fontPercentage / 100),
          }}
        >
          <ReadBook
            lastRead={lastRead}
            book={props.book}
            color={theme.textColor}
            chapters={chapters}
            readingSession={props.readingSession}
            scrollToChapter={scrollToChapter}
            fetchChapter={fetchChapter}
            makeChapterActive={makeChapterActive}
            special="2"
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
            id=""
            onClick={async () => {
              if (scrollToTopRef.current) {
                scrollToTopRef.current.scrollIntoView({
                  behavior: "instant",
                  block: "start",
                  inline: "start",
                });
              }
              toggleNav("close");
            }}
            className="px-8 text-left hover:bg-white/20 py-5"
          >
            <h1 className="text-2xl font-bold">{props.book.title}</h1>
          </button>
          <div className="flex gap-2 w-full px-8 my-4">
            <button
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
                  onClick={async () => {
                    scrollToChapter(cc.chapterNumber);
                    toggleNav("close");
                  }}
                  className={
                    "p-1 hover:bg-white/20 flex items-center gap-2 px-8 py-5 text-left " +
                    (cc.chapterNumber === activeChapter ? "bg-white/10" : "")
                  }
                >
                  <span className="line-clamp-1">
                    {cc.chapterNumber}: {cc.title}
                  </span>
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
        // backgroundColor: theme.backgroundColor,
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
