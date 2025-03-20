"use client";
import {
  BookInterface,
  SimpleBookPageMyData,
  SimpleBookPageReview,
} from "@/source/types/states";
import { BarLoader } from "react-spinners";
import SafeImage from "../reusable/SafeImage";
import BigImage from "../reusable/BigImage";
import { useMemo } from "react";
import Link from "next/link";
import StarRating from "../reusable/StarRating";
import { useAppDispatch } from "@/source/store/hooks";
import { setModal } from "@/source/store/slice/UIslice";
import toast from "react-hot-toast";
import ReviewsContainer from "./ReviewsContainer";

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
    <>
      <BigImage blackOpacity={70} src={book.coverImage}>
        <div className="z-30 px-6 md:px-10 xl:px-16 w-full text-base sm:text-xl">
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
            <div className="flex-1 text-lg 2xl:text-2xl flex flex-col gap-4 2xl:gap-5 slg:py-10">
              <h2 className="font-bold text-5xl 2xl:text-7xl">{book.title}</h2>
              <p className="italic text-2xl 2xl:text-4xl">
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
                  className="2xl:w-[45px] 2xl:text-[40px] text-2xl w-[26px]"
                />
                <small className="opacity-50 text-base 2xl:text-xl">
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
                {(myData.bought || myData.borrowed) && (
                  <Link
                    href={`/read/${book._id}`}
                    className="bg-highlight hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
                  >
                    Read Book
                  </Link>
                )}
                {myData.borrowed && (
                  <button
                    disabled={
                      new Date(myData.borrowed.holdEndDate || "") < new Date()
                    }
                    className={
                      "bg-highlight hover:bg-highlight-dark py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl "
                    }
                  >
                    Return Book - (Due:{" "}
                    {new Date(
                      myData.borrowed.holdEndDate || ""
                    ).toLocaleDateString()}
                    )
                  </button>
                )}
                {!myData.bought && !myData.borrowed && (
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
                    onClick={() => {
                      dispatch(
                        setModal({
                          active: true,
                          type: "buy-book",
                          data: book._id,
                        })
                      );
                    }}
                    className="bg-[#871277] hover:bg-[#391634] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
                  >
                    Buy Book
                  </button>
                )}
                {typeof myData.canReview === "boolean" && (
                  <button
                    disabled={!myData.canReview}
                    onClick={() => {
                      if (!myData.canReview) {
                        return toast.error("You can't review this book");
                      }
                      dispatch(
                        setModal({
                          active: true,
                          type: "review-book",
                          data: book._id,
                        })
                      );
                    }}
                    className="bg-[#868100] hover:bg-[#565426] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
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
