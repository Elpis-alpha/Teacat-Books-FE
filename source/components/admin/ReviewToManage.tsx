import { BookReviewInterface } from "@/source/types/states";
import Link from "next/link";
import toast from "react-hot-toast";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { ClipLoader } from "react-spinners";
import { useMemo } from "react";
import { format } from "date-fns";
import ReactStars from "react-stars";

type ReviewToManageProps = {
  review: BookReviewInterface;
  processingState: [
    { on: "approving" | "rejecting" | ""; data: string },
    React.Dispatch<
      React.SetStateAction<{
        on: "approving" | "rejecting" | "";
        data: string;
      }>
    >
  ];
  refetch: () => void;
};
const ReviewToManage = (props: ReviewToManageProps) => {
  const { review, refetch } = props;
  const [processingState, setProcessingState] = props.processingState;

  const { userName, userID } = useMemo(() => {
    if (typeof review.user === "string") {
      return { userName: "User", userID: review.user };
    } else if (review.user) {
      return {
        userName: review?.user?.name || "User",
        userID: review?.user?._id || "",
      };
    } else {
      return { userName: "User", userID: "" };
    }
  }, [review.user]);

  const { title, bookID } = useMemo(() => {
    if (typeof review.book === "string") {
      return { title: "Book", bookID: review.book };
    } else if (review.book) {
      return {
        title: review?.book?.title || "Book",
        bookID: review?.book?._id || "",
      };
    } else {
      return { title: "Book", bookID: "" };
    }
  }, [review.book]);

  const timestamp = useMemo(() => {
    const createdAt = new Date(review.createdAt);
    return `${format(createdAt, "PPPP")}`;
  }, [review.createdAt]);

  const approveReview = async () => {
    if (processingState.on) return toast("Please wait");

    try {
      setProcessingState({ on: "approving", data: review._id });

      const response = await postApiJson(routes.book.review.process, {
        reviewID: review._id,
        approve: true,
      });

      if (response.error || !response.message) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to approve review");
      } else {
        toast.success("Review approved successfully");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve review");
    }
    setProcessingState({ on: "", data: "" });
  };

  const rejectReview = async () => {
    if (processingState.on) return toast("Please wait");

    try {
      setProcessingState({ on: "rejecting", data: review._id });

      const response = await postApiJson(routes.book.review.process, {
        reviewID: review._id,
        approve: false,
      });

      if (response.error || !response.message) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to reject review");
      } else {
        toast.success("Review rejected successfully");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject review");
    }
    setProcessingState({ on: "", data: "" });
  };

  return (
    <div className="bg-sub-bg rounded-3xl py-6 px-7 text-sm sm:text-base font-proxima flex flex-col gap-3">
      <div className="">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-lg sm:text-2xl">{title}</h3>
          <Link
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline text-sm sm:text-base"
            href={`/book/${bookID}`}
          >
            View Book
          </Link>
        </div>
        <div className="">
          <ReactStars
            count={5}
            edit={false}
            size={24}
            value={review.stars}
            color2={"#ffd700"}
          />
        </div>
        <p className="text-sm sm:text-base mt-1">
          {review.reviewText || "No review available"}
        </p>
        <p className="text-xs sm:text-sm">
          By{" "}
          <Link
            target="_blank"
            className="text-blue-300"
            rel="noreferrer"
            href={`/profile/${userID}`}
          >
            {userName}
          </Link>
        </p>
        <p className="text-xs sm:text-sm mt-2">{timestamp}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={!!processingState.on}
          onClick={approveReview}
          className="py-1.5 px-5 rounded-lg hover:opacity-50 bg-good-green hover:bg-good-green-dark text-white flex items-center gap-2"
        >
          {processingState.on === "approving" &&
          processingState.data === review._id
            ? "Approving"
            : "Approve"}
          {processingState.on === "approving" &&
            processingState.data === review._id && (
              <ClipLoader color="white" size={15} />
            )}
        </button>
        <button
          disabled={!!processingState.on}
          onClick={rejectReview}
          className="py-1.5 px-5 rounded-lg hover:opacity-50 bg-bad-red hover:bg-bad-red-dark text-white flex items-center gap-2"
        >
          {processingState.on === "rejecting" &&
          processingState.data === review._id
            ? "Rejecting"
            : "Reject"}
          {processingState.on === "rejecting" &&
            processingState.data === review._id && (
              <ClipLoader color="white" size={15} />
            )}
        </button>
      </div>
    </div>
  );
};
export default ReviewToManage;
