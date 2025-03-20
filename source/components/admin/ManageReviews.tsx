"use client";
import { useEffect, useRef, useState } from "react";
import PaginatedItems from "../reusable/PaginatedItems";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { ClipLoader } from "react-spinners";
import { BookReviewInterface } from "@/source/types/states";
import ReviewToManage from "./ReviewToManage";
import toast from "react-hot-toast";

const ManageReviews = () => {
  const processingState = useState({
    on: "" as "approving" | "rejecting" | "",
    data: "",
  });
  const processing = !!processingState[0].on;

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
            "createdAt:asc",
            "pending",
            true,
            null,
            null
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
  }, []);

  const fetchReviews = async (page: number) => {
    if (data.loading)
      return toast.error("Please wait for the current request to finish");

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
          "createdAt:desc",
          "pending",
          true,
          null,
          null
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
    <div className="w-full px-6 md:px-10 xl:px-16 py-4 sm:py-10 text-base sm:text-xl flex-1 flex flex-col font-proxima">
      <div className="max-w-[1640px] w-full flex-1 flex flex-col items-center justify-center gap-5 sm:gap-10 mx-auto">
        <h2 className="w-full font-proxima font-bold text-xl sm:text-4xl">
          Manage Reviews
        </h2>
        <div className="w-full flex-1">
          {data.loading ? (
            <div className="w-full items-center justify-center flex p-5">
              <ClipLoader color="#fff" size={40} />
            </div>
          ) : data.available ? (
            data.reviews.length === 0 ? (
              <div className="w-full items-center justify-center flex p-5">
                <p>No reviews found{_page.current > 0 && " on this page"}</p>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {data.reviews.map((review: BookReviewInterface) => (
                  <ReviewToManage
                    key={review._id}
                    processingState={processingState}
                    review={review}
                    refetch={() => fetchReviews(_page.current)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="w-full items-center justify-center flex p-5">
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
            disabled={data.loading || processing}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
const limit = 6;
