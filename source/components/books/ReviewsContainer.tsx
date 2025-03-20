"use client";
import {
  BookInterface,
  BookReviewNormalInterface,
  SimpleBookPageReview,
} from "@/source/types/states";
import StarRating from "../reusable/StarRating";
import { useEffect, useRef, useState } from "react";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import PaginatedItems from "../reusable/PaginatedItems";
import { ClipLoader } from "react-spinners";
import ReviewItem from "./ReviewItem";

const ReviewsContainer = ({
  review,
  book,
}: {
  review: SimpleBookPageReview;
  book: BookInterface;
}) => {
  const [data, setData] = useState({
    available: false,
    loading: true,
    error: "Failed to fetch reviews",
    reviews: [],
  });

  // pagination logic
  const _page = useRef(0);
  const [count, setCount] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  useEffect(() => {
    if (resetPagination) setResetPagination(false);
  }, [resetPagination]);

  useEffect(() => {
    const fetchReviews = async () => {
      setData({
        available: false,
        loading: true,
        error: "Failed to fetch reviews",
        reviews: [],
      });

      try {
        const response = await getApiJson(
          routes.book.review.all(
            limit,
            0,
            "stars:desc",
            null,
            false,
            null,
            book._id
          )
        );
        if (response.error || !response.reviews) {
          setData({
            available: false,
            loading: false,
            error: response.errorMessage || "Failed to fetch reviews",
            reviews: [],
          });
        } else {
          setData({
            available: true,
            loading: false,
            error: "",
            reviews: response.reviews,
          });

          if (typeof response.count === "number") {
            setCount(response.count);
          }
        }
      } catch (e) {
        console.error(e);
        setData({
          available: false,
          loading: false,
          error: "Failed to fetch reviews",
          reviews: [],
        });
      }
    };

    fetchReviews();
  }, [book._id]);

  const fetchReviews = async (page: number) => {
    setData({
      available: false,
      loading: true,
      error: "Failed to fetch reviews",
      reviews: [],
    });

    try {
      const response = await getApiJson(
        routes.book.review.all(
          limit,
          page * limit,
          "stars:desc",
          null,
          false,
          null,
          book._id
        )
      );
      if (response.error || !response.reviews) {
        setData({
          available: false,
          loading: false,
          error: response.errorMessage || "Failed to fetch reviews",
          reviews: [],
        });
      } else {
        setData({
          available: true,
          loading: false,
          error: "",
          reviews: response.reviews,
        });

        _page.current = page;
        if (typeof response.count === "number") {
          setCount(response.count);
        }
      }
    } catch (e) {
      console.error(e);
      setData({
        available: false,
        loading: false,
        error: "Failed to fetch reviews",
        reviews: [],
      });
    }
  };

  return (
    <div className="py-[120px] w-full px-6 md:px-10 xl:px-16">
      <div className="max-w-[1640px] mx-auto">
        <div className="flex items-start flex-col sm:flex-row max-sm:gap-10">
          <div className="w-full sm:w-[300px] xl:w-[500px] flex flex-wrap flex-row sm:flex-col gap-y-0 gap-x-10">
            <p className="font-proxima font-bold text-8xl">
              {book.averageRating.toFixed(1)}
            </p>
            <div className="mt-5 flex-1">
              <StarRating
                value={book.averageRating}
                className="xl:w-[45px] xl:text-[40px] text-2xl w-[26px]"
              />
              <p className="text-xl xl:text-2xl line-clamp-1 mt-3">
                {book.numberOfReviews} review
                {book.numberOfReviews !== 1 && "s"}
              </p>
            </div>
          </div>
          <div className="flex-1 text-2xl xl:text-3xl flex flex-col gap-3 xl:gap-5 w-full">
            <button className="flex items-center gap-5 xl:gap-8">
              <p>5</p>
              <div className="w-full bg-white/40 h-4 xl:h-5 rounded-full">
                <div
                  className="h-full bg-[#ffd700] rounded-full max-w-full"
                  style={{
                    width: `${
                      book.numberOfReviews <= 0
                        ? 0
                        : (review[5] / book.numberOfReviews) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </button>
            <button className="flex items-center gap-5 xl:gap-8">
              <p>4</p>
              <div className="w-full bg-white/40 h-4 xl:h-5 rounded-full">
                <div
                  className="h-full bg-[#ffd700] rounded-full max-w-full"
                  style={{
                    width: `${
                      book.numberOfReviews <= 0
                        ? 0
                        : (review[4] / book.numberOfReviews) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </button>
            <button className="flex items-center gap-5 xl:gap-8">
              <p>3</p>
              <div className="w-full bg-white/40 h-4 xl:h-5 rounded-full">
                <div
                  className="h-full bg-[#ffd700] rounded-full max-w-full"
                  style={{
                    width: `${
                      book.numberOfReviews <= 0
                        ? 0
                        : (review[3] / book.numberOfReviews) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </button>
            <button className="flex items-center gap-5 xl:gap-8">
              <p>2</p>
              <div className="w-full bg-white/40 h-4 xl:h-5 rounded-full">
                <div
                  className="h-full bg-[#ffd700] rounded-full max-w-full"
                  style={{
                    width: `${
                      book.numberOfReviews <= 0
                        ? 0
                        : (review[2] / book.numberOfReviews) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </button>
            <button className="flex items-center gap-5 xl:gap-8">
              <p>1</p>
              <div className="w-full bg-white/40 h-4 xl:h-5 rounded-full">
                <div
                  className="h-full bg-[#ffd700] rounded-full max-w-full"
                  style={{
                    width: `${
                      book.numberOfReviews <= 0
                        ? 0
                        : (review[1] / book.numberOfReviews) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </button>
          </div>
        </div>
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-5 sm:gap-10 mx-auto mt-10 sm:mt-20">
          <div className="w-full flex-1">
            {data.loading ? (
              <div className="w-full items-center justify-center flex px-5 py-46">
                <ClipLoader color="#fff" size={40} />
              </div>
            ) : data.available ? (
              data.reviews.length === 0 ? (
                <div className="w-full items-center justify-center flex p-5">
                  <p>No reviews found{_page.current > 0 && " on this page"}</p>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4 sm:gap-6">
                  {data.reviews.map((review: BookReviewNormalInterface) => (
                    <ReviewItem key={review._id} review={review} />
                  ))}
                </div>
              )
            ) : (
              <div className="w-full items-center justify-center flex px-5 py-46">
                <p>{data.error || "An Error Occured"}</p>
              </div>
            )}
          </div>
          <div className="w-full ">
            <PaginatedItems
              count={count}
              itemsPerPage={limit}
              pageChange={(x) => fetchReviews(x)}
              reset={resetPagination}
              disabled={data.loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsContainer;
const limit = 5;
