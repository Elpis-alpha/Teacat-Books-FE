import { BookInterface, ReadingSessionInterface } from "@/source/types/states";
import SafeImage from "../reusable/SafeImage";
import { setModal } from "@/source/store/slice/UIslice";
import { useAppDispatch } from "@/source/store/hooks";
import { ClipLoader } from "react-spinners";

const LandingBook = ({
  book,
  lastRead,
  fetching,
  fetchChapter,
  toggleNav,
}: {
  book: BookInterface;
  readingSession: ReadingSessionInterface;
  fetching: number | null;
  lastRead: number;
  fetchChapter: (chapterNumber: number) => Promise<void>;
  toggleNav: (action?: "open" | "close") => void;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="">
      <SafeImage
        src={book.mainImage}
        alt={book.title}
        className="w-[200px] sm:w-[250px] epub-special-image"
      />
      <div className="flex-1 text-lg 2xl:text-2xl flex flex-col gap-4 2xl:gap-5 py-10">
        <h2 className="font-bold text-5xl 2xl:text-7xl">{book.title}</h2>
        <p className="whitespace-pre-wrap">{book.description}</p>
        <div className="flex gap-3 flex-wrap text-white justify-epub">
          <button
            disabled={typeof fetching === "number"}
            onClick={async () => {
              await fetchChapter(lastRead);
            }}
            className={
              "bg-highlight hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl flex items-center justify-center gap-1.5"
            }
          >
            Continue Reading ({lastRead})
            {fetching === lastRead && <ClipLoader color="#ffffff" size={16} />}
          </button>
          <button
            disabled={typeof fetching === "number"}
            onClick={() => toggleNav("open")}
            className={
              "bg-amber-800 hover:bg-amber-950 py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl "
            }
          >
            View Chapters
          </button>
          <button
            disabled={typeof fetching === "number"}
            onClick={() => {
              dispatch(
                setModal({
                  active: true,
                  type: "set-theme",
                })
              );
            }}
            className={
              "bg-weird-teal hover:bg-weird-teal-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl "
            }
          >
            Change Theme
          </button>
        </div>
      </div>
    </div>
  );
};
export default LandingBook;
