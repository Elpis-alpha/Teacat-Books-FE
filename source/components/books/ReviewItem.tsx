import { BookReviewNormalInterface } from "@/source/types/states";
import SafeImage from "../reusable/SafeImage";
import { ClipLoader } from "react-spinners";
import StarRating from "../reusable/StarRating";

type ReviewItemProps = {
  review: BookReviewNormalInterface;
};
const ReviewItem = (props: ReviewItemProps) => {
  const { review } = props;
  return (
    <div className="flex items-start flex-col sm:flex-row max-sm:gap-4">
      <div className="w-full sm:w-[300px] xl:w-[500px] flex items-center gap-y-0 gap-x-5 pr-8">
        <div className="xl:w-[100px] h-[65px] w-[65px] xl:h-[100px] rounded-full overflow-hidden">
          <SafeImage
            src={makeImageSmaller(review.user.avatar)}
            alt={review.user.name}
            className="w-full h-full z-20 absolute inset-0 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 w-full h-full flex items-center justify-center z-10">
            <ClipLoader color="#fff" size={30} />
          </div>
        </div>
        <div className="flex-1 w-full">
          <h4 className="line-clamp-1 font-bold text-sm xl:text-xl">
            {review.user.name}
          </h4>
          <p
            className={
              "text-sm xl:text-base line-clamp-1 mt-2 py-0.5 xl:py-0.5 xl:px-3 px-2 rounded-lg inline-flex " +
              (review.user.isAdmin
                ? "bg-[#FF00DD]/30"
                : review.user.isAuthor
                ? "bg-[#00E5FF]/30"
                : "bg-[#00FF00]/30")
            }
          >
            {review.user.isAdmin
              ? "Admin"
              : review.user.isAuthor
              ? "Author"
              : "Reader"}
          </p>
        </div>
      </div>
      <div className="flex-1 text-base xl:text-lg flex flex-col gap-2 xl:gap-3 w-full sm:pt-5 pb-5">
        <div className="">
          <StarRating
            value={review.stars}
            className="2xl:w-[26px] 2xl:text-2xl text-lg w-[20px]"
          />
        </div>
        <p>{review.reviewText || "No Review Text"}</p>
      </div>
    </div>
  );
};
export default ReviewItem;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_200/`);
};
