import { BookInterface } from "@/source/types/states";
import SafeImage from "../reusable/SafeImage";
import { BarLoader } from "react-spinners";
import ReactStars from "react-stars";
import Link from "next/link";
import { useAppDispatch } from "@/source/store/hooks";
import { setModal } from "@/source/store/slice/UIslice";

const BookSearchItem = ({ book }: { book: BookInterface }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full flex items-stretch gap-2 ssm:gap-4 sm:gap-6">
      <div className="w-[87.5px] h-[140px] smm:w-[125px] smm:h-[200px]">
        <SafeImage
          src={makeImageSmaller(book.mainImage)}
          alt={book.title}
          className="w-full h-full object-cover z-20"
        />
        <div className="absolute inset-0 bg-black/30 w-full h-full flex items-center justify-center z-10">
          <BarLoader color="#fff" width={40} height={1} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-0">
        <h3 className="text-lg sm:text-xl font-bold">
          <Link className="hover:text-blue-300" href={`/book/${book._id}`}>
            {book.title}
          </Link>
        </h3>
        <div className="items-center gap-2 hidden sm:flex">
          <ReactStars
            count={5}
            edit={false}
            size={24}
            half={true}
            value={Math.round(book.averageRating * 2) / 2}
            color2={"#ffd700"}
          />
          <small className="opacity-50 text-sm">
            ({book.numberOfReviews} review{book.numberOfReviews !== 1 && "s"})
          </small>
        </div>
        <div className="items-center gap-2 flex sm:hidden">
          <ReactStars
            count={5}
            edit={false}
            size={18}
            half={true}
            value={Math.round(book.averageRating * 2) / 2}
            color2={"#ffd700"}
          />
          <small className="opacity-50 text-xs line-clamp-1 flex-1">
            ({book.numberOfReviews} review{book.numberOfReviews !== 1 && "s"})
          </small>
        </div>
        <p className="text-sm sm:text-base line-clamp-4 smm:line-clamp-5 sm:line-clamp-3">
          {book.description}
        </p>
        <div className="flex items-end gap-3 mt-3 flex-1 pb-2 flex-wrap text-xs smm:text-sm sm:text-base">
          <button
            onClick={() => {
              dispatch(
                setModal({ active: true, type: "borrow-book", data: book._id })
              );
            }}
            className={
              "bg-highlight py-1 sm:py-1.5 px-2 sm:px-4 rounded-md hover:bg-highlight-dark " +
              (book.availableCopies === 0 ? "opacity-70" : "")
            }
          >
            Borrow {book.totalCopies - book.availableCopies}/{book.totalCopies}
          </button>
          <div className="bg-white text-black rounded-md py-px sm:py-0.5 px-1 sm:px-2">
            ${book.price.toFixed(2)}
          </div>
          <div className="ssm:flex-1 inline-block text-right underline">
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

export const BookSearchItemSkeleton = () => {
  return (
    <div className="w-full flex items-stretch gap-2 ssm:gap-4 sm:gap-6 select-none text-transparent">
      <div className="w-[87.5px] h-[140px] smm:w-[125px] smm:h-[200px] skeleton"></div>

      <div className="flex-1 flex flex-col gap-0">
        <h3 className="text-lg sm:text-xl font-bold rounded-lg skeleton max-w-[220px]">
          Title
        </h3>
        <div className="items-center gap-2 hidden sm:flex">
          <span style={{ color: "hsla(201, 20%, 80%, 0.4)", fontSize: "24px" }}>
            ★★★★★
          </span>
          <small className="skeleton rounded-lg text-sm">(0 reviews)</small>
        </div>
        <div className="items-center gap-2 flex sm:hidden">
          <span style={{ color: "hsla(201, 20%, 80%, 0.4)", fontSize: "18px" }}>
            ★★★★★
          </span>
          <span className="text-xs line-clamp-1 flex-1">
            <span className="rounded-lg skeleton">({0} reviews)</span>
          </span>
        </div>
        <p className="text-sm sm:text-base line-clamp-4 smm:line-clamp-5 sm:line-clamp-3 skeleton rounded-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores
          tempore repellat corporis qui, magni veritatis a ab eos dolor
          doloribus quae dicta incidunt? Cum ut earum dolor iure facilis
          reiciendis! Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Asperiores tempore repellat corporis qui, magni veritatis a ab eos
          dolor doloribus quae dicta incidunt? Cum ut earum dolor iure facilis
          reiciendis!
        </p>
        <div className="flex items-end gap-3 mt-3 flex-1 pb-2 flex-wrap text-xs smm:text-sm sm:text-base">
          <button className="skeleton py-1 sm:py-1.5 px-2 sm:px-4 rounded-md">
            Borrow 1/5
          </button>
          <div className="skeleton rounded-md py-px sm:py-0.5 px-1 sm:px-2">
            $0.00
          </div>
          <div className="ssm:flex-1 text-right underline flex justify-end">
            <span className="line-clamp-1 hover:text-blue-300 skeleton rounded-lg ">
              View Details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookSearchItem;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_200/`);
};
