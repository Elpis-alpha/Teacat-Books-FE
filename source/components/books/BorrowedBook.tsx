import { BookCopyInterface, BookInterface } from "@/source/types/states";
import SafeImage from "../reusable/SafeImage";
import { BarLoader } from "react-spinners";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { format } from "date-fns";
import { setModal } from "@/source/store/slice/UIslice";
import { useAppDispatch } from "@/source/store/hooks";
import toast from "react-hot-toast";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";

interface BorrowedBookProp {
  book: BookInterface;
  copy: BookCopyInterface;
  refetch: () => void;
  setProcessing: (value: "returning" | "") => void;
  disabled: boolean;
}
const BorrowedBook = (props: BorrowedBookProp) => {
  const dispatch = useAppDispatch();
  const { book, copy, disabled, setProcessing, refetch } = props;

  const { start, end } = useMemo(() => {
    const holdStartDate = copy.holdStartDate
      ? new Date(copy.holdStartDate)
      : null;
    const holdEndDate = copy.holdEndDate ? new Date(copy.holdEndDate) : null;

    return {
      start:
        holdStartDate && !isNaN(holdStartDate.getTime())
          ? format(holdStartDate, "EEE, MMM d, h:mm a")
          : null,
      end:
        holdEndDate && !isNaN(holdEndDate.getTime())
          ? format(holdEndDate, "EEE, MMM d, h:mm a")
          : null,
    };
  }, [copy.holdEndDate, copy.holdStartDate]);

  const { current: holdEndDate } = useRef(
    copy?.holdEndDate
      ? !isNaN(new Date(copy.holdEndDate).getTime())
        ? new Date(copy.holdEndDate)
        : null
      : null
  );

  const returnBook = async () => {
    if (disabled) return;
    if (!holdEndDate) {
      return toast.error("You can't return this book.");
    }
    if (new Date(holdEndDate) < new Date()) {
      return toast.error("You can't return this book after the due date.");
    }
    setProcessing("returning");

    try {
      const response = await postApiJson(routes.book.return, {
        bookID: book._id,
        copyNumber: copy.copyNumber,
      });
      if (response.error || !response.bookCopy) {
        toast.error(
          response.errorMessage || "An error occurred while returning the book."
        );
        console.error(response);
        setProcessing("");
      } else {
        toast.success("Book returned successfully.");
        setProcessing("");
        refetch();
      }
    } catch (error) {
      toast.error("An error occurred while returning the book.");
      console.error(error);
      setProcessing("");
    }
  };

  return (
    <div className="w-full flex items-start gap-2 ssm:gap-4 sm:gap-6 flex-col sm:flex-row sm:items-center">
      <div className="w-[87.5px] h-[140px] sm:w-[125px] sm:h-[200px] lg:w-[150px] lg:h-[240px]">
        <SafeImage
          src={makeImageSmaller(book.mainImage)}
          alt={book.title}
          className="w-full h-full object-cover z-20"
        />
        <div className="absolute inset-0 bg-black/30 w-full h-full flex items-center justify-center z-10">
          <BarLoader color="#fff" width={40} height={1} />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl sm:text-3xl font-bold">
          <Link className="hover:text-blue-300" href={`/book/${book._id}`}>
            {book.title}
          </Link>
        </h3>
        <p className="text-sm sm:text-base line-clamp-3 mt-2">
          {book.description}
        </p>
        {(start || end) && (
          <p className="text-xs sm:text-sm line-clamp-1 mt-1 flex items-center gap-x-2 justify-between font-bold flex-wrap">
            {start && (
              <span className="line-clamp-1">Borrowed on: {start}</span>
            )}
            {end && <span className="line-clamp-1">Due on: {end}</span>}
          </p>
        )}
        <div className="flex gap-x-3 gap-y-2 flex-wrap mt-3 text-sm sm:text-base">
          <Link
            aria-disabled={disabled}
            target="_blank"
            rel="noopener noreferrer"
            href={`/read/${book._id}`}
            className="bg-highlight hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
          >
            Read Book
          </Link>
          {holdEndDate && (
            <button
              onClick={returnBook}
              disabled={holdEndDate < new Date() || disabled}
              className={
                "bg-yellow-700 not-disabled:hover:bg-amber-900 py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl line-clamp-1 "
              }
            >
              Return Book
            </button>
          )}
          <button
            disabled={disabled}
            onClick={() => {
              dispatch(
                setModal({
                  active: true,
                  type: "buy-book",
                  data: `${book._id}:${book.helioPayLinkID}`,
                })
              );
            }}
            className="bg-[#871277] hover:bg-[#391634] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
          >
            Buy Book
          </button>
          <Link
            aria-disabled={disabled}
            href={`/book/${book._id}`}
            className="bg-weird-teal hover:bg-weird-teal-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
          >
            View Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export const BorrowedBookSkeleton = () => {
  return (
    <div className="w-full flex items-start gap-2 ssm:gap-4 sm:gap-6 flex-col sm:flex-row sm:items-center user-select-none text-transparent">
      <div className="w-[87.5px] h-[140px] sm:w-[125px] sm:h-[200px] lg:w-[150px] lg:h-[240px] skeleton"></div>
      <div className="flex-1">
        <h3 className="text-xl sm:text-3xl font-bold skeleton rounded-md max-w-[250px]">
          Title{" "}
        </h3>
        <p className="text-sm sm:text-base line-clamp-3 mt-2 skeleton rounded-md">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
          molestiae animi quos impedit obcaecati! Enim deleniti, inventore ex
          culpa excepturi ab quos officia? Quasi eligendi ipsam quaerat ad
          temporibus vero. Lorem ipsum dolor sit, amet consectetur adipisicing
          elit. Excepturi molestiae animi quos impedit obcaecati! Enim deleniti,
          inventore ex culpa excepturi ab quos officia? Quasi eligendi ipsam
          quaerat ad temporibus vero. Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Excepturi molestiae animi quos impedit obcaecati!
          Enim deleniti, inventore ex culpa excepturi ab quos officia? Quasi
          eligendi ipsam quaerat ad temporibus vero.
        </p>
        <p className="text-xs sm:text-sm line-clamp-1 mt-1 flex items-center gap-x-2 justify-between font-bold flex-wrap">
          <span className="line-clamp-1 skeleton rounded-md">
            Borrowed on: Thu, Mar 20, 5:23 PM
          </span>
          <span className="line-clamp-1 skeleton rounded-md">
            Due on: Fri, Apr 4, 1:00 AM
          </span>
        </p>
        <div className="flex gap-x-3 gap-y-2 flex-wrap mt-3 text-sm sm:text-base">
          <div className="skeleton py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl">
            Read Book
          </div>
          <div
            className={
              "skeleton py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl line-clamp-1 "
            }
          >
            Return Book
          </div>
          <div className="skeleton py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl">
            Buy Book
          </div>
          <div className="skeleton py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl">
            View Book
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBook;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_300/`);
};
