"use client";
import {
  BookInterface,
  SimpleBookPageMyData,
  SimpleBookPageReview,
} from "@/source/types/states";
import { BarLoader } from "react-spinners";
import SafeImage from "../reusable/SafeImage";
import BigImage from "../reusable/BigImage";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import StarRating from "../reusable/StarRating";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { setModal } from "@/source/store/slice/UIslice";
import toast from "react-hot-toast";
import ReviewsContainer from "./ReviewsContainer";
import { format } from "date-fns";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";

const BookPage = ({
  book,
  myData,
  review,
}: {
  book: BookInterface;
  myData: SimpleBookPageMyData;
  review: SimpleBookPageReview;
}) => {
  const dispatch = useAppDispatch();
  const { current: holdEndDate } = useRef(
    myData.borrowed?.holdEndDate
      ? !isNaN(new Date(myData.borrowed.holdEndDate).getTime())
        ? new Date(myData.borrowed.holdEndDate)
        : null
      : null
  );
  const [processing, setProcessing] = useState<"" | "returning">("");
  const [bookReturned, setBookReturned] = useState(false);
  const hasReviewed = useAppSelector((store) => store.ui.hasReviewed);

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

  const returnBook = async () => {
    if (processing) return;
    if (!myData.borrowed || !holdEndDate) {
      return toast.error("You can't return this book");
    }
    if (new Date(holdEndDate) < new Date()) {
      return toast.error("You can't return this book after the due date");
    }
    setProcessing("returning");

    try {
      const response = await postApiJson(routes.book.return, {
        bookID: book._id,
        copyNumber: myData.borrowed.copyNumber,
      });
      if (response.error || !response.bookCopy) {
        toast.error(
          response.errorMessage || "An error occurred while returning the book"
        );
        console.error(response);
      } else {
        setBookReturned(true);
        toast.success("Book returned successfully");
      }
    } catch (error) {
      toast.error("An error occurred while returning the book");
      console.error(error);
    }

    setProcessing("");
  };

  return (
    <>
      <BigImage blackOpacity={70} src={book.coverImage}>
        <div className="z-30 px-6 md:px-10 xl:px-16 w-full text-xl sm:text-base">
          <div className="max-w-[1640px] mx-auto flex items-start justify-center flex-col slg:flex-row gap-15 lg:gap-[46px]">
            <div className="w-[250px] h-[400px] sm:w-[350px] sm:h-[560px] 2xl:w-[500px] 2xl:h-[800px] mx-auto">
              <SafeImage
                src={makeImageSmaller(book.mainImage)}
                alt={book.title}
                className="w-full h-full z-20 absolute inset-0 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 w-full h-full flex items-center justify-center z-10">
                <BarLoader color="#fff" width={40} height={1} />
              </div>
            </div>
            <div className="flex-1 text-sm 2xl:text-xl flex flex-col gap-4 2xl:gap-5 slg:py-10">
              <h2 className="font-bold text-4xl 2xl:text-6xl">{book.title}</h2>
              <p className="italic text-xl 2xl:text-3xl">
                <Link
                  className="hover:text-blue-300"
                  href={`/profile/${authorID}`}
                >
                  By {authorName}
                </Link>
              </p>
              <div className="items-center gap-2 flex">
                <StarRating
                  value={book.averageRating}
                  className="2xl:w-[35px] 2xl:text-3xl text-xl w-[22px]"
                />
                <small className="opacity-50 text-sm 2xl:text-lg">
                  ({book.numberOfReviews} review
                  {book.numberOfReviews !== 1 && "s"})
                </small>
              </div>
              <div className="">
                <div className="bg-white text-black inline-block rounded-md py-0.5 2xl:py-1 px-3 2xl:px-4">
                  ${book.price.toFixed(2)}
                </div>
              </div>
              <p className="whitespace-pre-wrap">{book.description}</p>
              <div className="flex gap-3 flex-wrap">
                {(myData.bought || myData.borrowed) && !bookReturned && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`/read/${book._id}`}
                    className="bg-highlight hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
                  >
                    Read Book
                  </Link>
                )}
                {myData.borrowed && holdEndDate && (
                  <button
                    onClick={returnBook}
                    disabled={
                      holdEndDate < new Date() || bookReturned || !!processing
                    }
                    className={
                      "bg-highlight not-disabled:hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl line-clamp-1 "
                    }
                  >
                    {bookReturned
                      ? "Book Returned"
                      : `Return - (Due: ${format(
                          holdEndDate,
                          "EEE, MMM d, h:mm a"
                        )})`}
                  </button>
                )}
                {!myData.bought && !myData.borrowed && (
                  <button
                    disabled={!!processing}
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
                      "bg-highlight hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl " +
                      (book.availableCopies === 0 ? "opacity-70" : "")
                    }
                  >
                    Borrow {book.totalCopies - book.availableCopies}/
                    {book.totalCopies}
                  </button>
                )}
                {myData.bought && myData.epubURL && (
                  <a
                    href={myData.epubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={book.title}
                    className="bg-[#871277] hover:bg-[#391634] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
                  >
                    Download ePub
                  </a>
                )}
                {!myData.bought && (
                  <button
                    disabled={!!processing}
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
                )}
                {myData.canReview && (
                  <button
                    disabled={!myData.canReview || !!processing}
                    onClick={() => {
                      if (typeof myData.canReview === "string") {
                        return toast(myData.canReview);
                      } else if (hasReviewed === book._id) {
                        return toast("You have already reviewed this book");
                      }

                      dispatch(
                        setModal({
                          active: true,
                          type: "review-book",
                          data: book._id,
                        })
                      );
                    }}
                    className="bg-[#868100] not-disabled:hover:bg-[#565426] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
                  >
                    Leave a Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </BigImage>
      <ReviewsContainer review={review} book={book} />
    </>
  );
};
export default BookPage;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_500/`);
};
