import { BookInterface, ReadingSessionInterface } from "@/source/types/states";
import SafeImage from "../reusable/SafeImage";
import { setModal } from "@/source/store/slice/UIslice";
import { useAppDispatch } from "@/source/store/hooks";

const LandingBook = ({
  book,
  lastRead,
  scrollToChapter,
}: {
  book: BookInterface;
  readingSession: ReadingSessionInterface;
  lastRead: number;
  scrollToChapter: (chapterNumber: number) => void;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div data-chapter="0" id="my-chapter-0">
      <SafeImage
        src={makeImageSmaller(book.mainImage)}
        alt={book.title}
        className="w-[200px] sm:w-[250px] epub-special-image"
      />
      <div className="flex-1 text-lg 2xl:text-2xl flex flex-col gap-4 2xl:gap-5 py-10">
        <h2 className="font-bold text-5xl 2xl:text-7xl">{book.title}</h2>
        <p className="whitespace-pre-wrap">{book.description}</p>
        <div className="flex gap-3 flex-wrap text-white justify-epub">
          <button
            onClick={() => scrollToChapter(lastRead)}
            className={
              "bg-highlight hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl flex items-center justify-center gap-1.5"
            }
          >
            Continue Reading ({lastRead})
          </button>
          <button
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
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_250/`);
};
