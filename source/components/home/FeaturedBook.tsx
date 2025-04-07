import { BarLoader } from "react-spinners";
import SafeImage from "../reusable/SafeImage";
import { BookInterface } from "@/source/types/states";
import Link from "next/link";
import { useMemo } from "react";
import { setModal } from "@/source/store/slice/UIslice";
import { useAppDispatch } from "@/source/store/hooks";

const FeaturedBook = ({
  book,
  mine,
}: {
  book: BookInterface;
  mine: "bought" | "borrowed" | null;
}) => {
  const dispatch = useAppDispatch();
  const { authorName, authorID } = useMemo(() => {
    if (typeof book.author === "string") {
      return { authorName: "author", authorID: book.author };
    } else if (book.author) {
      return {
        authorName: book?.author?.name || "author",
        authorID: book?.author?._id || "",
      };
    } else {
      return { authorName: "author", authorID: "" };
    }
  }, [book.author]);

  return (
    <div className="flex w-full flex-1 bg-sub-bg flex-col items-center justify-center shadow-2xl">
      <div className="w-full overflow-hidden">
        <div className="w-full pt-[160%]" />
        <SafeImage
          src={makeImageSmaller(book.mainImage)}
          alt={book.title}
          className="w-full h-full object-cover z-20 absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/50 w-full h-full flex items-center justify-center z-10">
          <BarLoader color="#fff" width={40} height={1} />
        </div>
      </div>
      <div className="py-6 xl:py-10 px-5 xl:px-9 flex-1 flex items-baseline flex-col">
        <h3 className="text-2xl xl:text-3xl font-bold">
          <Link className="hover:text-blue-300" href={`/book/${book._id}`}>
            {book.title}
          </Link>
        </h3>
        <p className="py-2.5 text-xl xl:text-lg text-balance italic">
          <Link className="hover:text-blue-300" href={`/profile/${authorID}`}>
            By {authorName}
          </Link>
        </p>
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm mb-2">
            {book.tags?.map?.((tag) => (
              <div
                key={book._id + tag.slug}
                className="sm:px-2 px-1.5 sm:py-1 py-0.5 bg-white/20 rounded-md"
              >
                {tag.title}
              </div>
            ))}
          </div>
        )}
        <div className="text-base xl:text-lg line-clamp-4">
          {book.description}
        </div>
        <div className="flex flex-1 items-end gap-3 mt-5 flex-wrap text-xs ssm:text-base sm:text-sm md:text-base w-full">
          {mine === null && (
            <button
              onClick={() => {
                dispatch(
                  setModal({
                    active: true,
                    type: "borrow-book",
                    data: book._id,
                  })
                );
              }}
              className={
                "bg-highlight py-1 sm:py-1.5 px-2 sm:px-4 rounded-md hover:bg-highlight-dark " +
                (book.availableCopies === 0 ? "opacity-70" : "")
              }
            >
              Borrow {book.totalCopies - book.availableCopies}/
              {book.totalCopies}
            </button>
          )}
          {(mine === "borrowed" || mine === "bought") && (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`/read/${book._id}`}
              className="bg-white text-black hover:opacity-70 py-1 sm:py-1.5 px-2 sm:px-4 rounded-md"
            >
              {mine === "borrowed" ? "Borrowed" : "Bought"}
            </Link>
          )}
          {mine !== "bought" && (
            <div className="bg-white text-black rounded-md py-px sm:py-0.5 px-1 sm:px-2">
              ${book.price.toFixed(2)}
            </div>
          )}
          <div className="flex-1 inline-block text-right underline">
            <Link
              href={`/book/${book._id}`}
              className="line-clamp-1 hover:text-blue-300"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedBookSkeleton = ({ className }: { className: string }) => {
  return (
    <div
      className={
        "flex w-full flex-1 bg-sub-bg flex-col items-center justify-center shadow-2xl text-transparent select-none " +
        className
      }
    >
      <div className="w-full max-h-[60vh] overflow-hidden skeleton">
        <div className="w-full pt-[160%]" />
      </div>
      <div className="py-6 xl:py-10 px-5 xl:px-9 flex-1 flex items-baseline flex-col">
        <h3 className="text-2xl xl:text-3xl font-bold skeleton rounded-md min-w-[150px] xsm:min-w-[200px]">
          Title
        </h3>
        <p className="my-2.5 text-xl xl:text-lg text-balance italic skeleton rounded-md">
          By Author
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm mb-2">
          <div className="sm:px-2 px-1.5 sm:py-1 py-0.5 skeleton rounded-md">Tag1</div>
          <div className="sm:px-2 px-1.5 sm:py-1 py-0.5 skeleton rounded-md">Tag2</div>
          <div className="sm:px-2 px-1.5 sm:py-1 py-0.5 skeleton rounded-md">Tag3</div>
        </div>
        <div className="text-base xl:text-lg line-clamp-4 skeleton rounded-md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
          voluptatibus a quod eveniet, suscipit quam voluptas expedita
          temporibus nostrum illo sunt inventore distinctio eum nihil tempora
          voluptates accusamus sit quos! Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Ea voluptatibus a quod eveniet, suscipit quam
          voluptas expedita temporibus nostrum illo sunt inventore distinctio
          eum nihil tempora voluptates accusamus sit quos!
        </div>
        <div className="flex flex-1 items-end gap-3 mt-5 flex-wrap text-xs ssm:text-base sm:text-sm md:text-base w-full">
          <button className="py-1 sm:py-1.5 px-2 sm:px-4 rounded-md skeleton">
            Borrow 0/10
          </button>
          <div className="rounded-md py-px sm:py-0.5 px-1 sm:px-2 skeleton">
            $0.00
          </div>
          <div className="flex-1 inline-block text-right underline">
            <span className="skeleton rounded-md">View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FeaturedBook;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_600/`);
};
