import { BookInterface } from "@/source/types/states";
import SafeImage from "../reusable/SafeImage";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import { useMemo } from "react";

interface BoughtBookProp {
  book: BookInterface;
  bought: {
    _id: string;
    createdAt: string;
  };
  disabled: boolean;
  epubURL?: string;
}
const BoughtBook = (props: BoughtBookProp) => {
  const { book, bought, disabled, epubURL } = props;

  const timestamp = useMemo(() => {
    const boughtDate = bought.createdAt ? new Date(bought.createdAt) : null;

    return boughtDate && !isNaN(boughtDate.getTime())
      ? format(boughtDate, "EEE, MMM d, h:mm a")
      : null;
  }, [bought.createdAt]);

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
        {timestamp && (
          <p className="text-xs sm:text-sm line-clamp-1 mt-1 flex items-center gap-x-2 justify-between font-bold flex-wrap">
            Bought on: {timestamp}
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
          {epubURL && (
            <a
              href={epubURL}
              target="_blank"
              rel="noopener noreferrer"
              download={book.title}
              className="bg-[#871277] hover:bg-[#391634] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
            >
              Download ePub
            </a>
          )}
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

export const BoughtBookSkeleton = () => {
  return (
    <div className="w-full flex items-start gap-2 ssm:gap-4 sm:gap-6 flex-col sm:flex-row sm:items-center text-transparent select-none">
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
            Bought on: Thu, Mar 20, 3:47 PM
          </span>
        </p>
        <div className="flex gap-x-3 gap-y-2 flex-wrap mt-3 text-sm sm:text-base">
          <div className="skeleton py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl">
            Read Book
          </div>
          <div className="skeleton py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl">
            Download ePub
          </div>
          <div className="skeleton py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl">
            View Book
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoughtBook;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_300/`);
};
