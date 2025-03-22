import {
  FormEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ModalOverflow from "./ModalOverflow";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { animateModal } from "@/source/helpers/gsap.config";
import { setHasReviewed, setModal } from "@/source/store/slice/UIslice";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { FaTimes } from "react-icons/fa";
import gsap from "gsap";
import toast from "react-hot-toast";
import StarRating from "../reusable/StarRating";
import TextInput from "../reusable/TextInput";
import { ClipLoader } from "react-spinners";

const ReviewBookModal = () => {
  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state) => state.ui);

  const mainRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const [stars, setStars] = useState(0);
  const [_reviewText, setReviewText] = useState("");
  const [processing, setProcessing] = useState({
    on: "" as "reviewing" | "",
    data: "",
  });

  useLayoutEffect(() => {
    if (!modal.active || modal.type !== "review-book" || !modal.data) {
      hasAnimated.current = false;
      return;
    }
    if (hasAnimated.current) return;
    if (!mainRef.current) return;

    hasAnimated.current = true;
    gsap.fromTo(mainRef.current, animateModal.in.from, animateModal.in.to);
  }, [modal]);

  const exitWithAnimation = () => {
    if (!mainRef.current) return;

    gsap.to(mainRef.current, {
      ...animateModal.out,
      onComplete: () => {
        hasFetchedBefore.current = false;
        setStars(0);
        setReviewText("");
        dispatch(setModal({ active: false }));
      },
    });
  };

  const hasFetchedBefore = useRef(false);
  useEffect(() => {
    if (
      modal.active &&
      modal.type === "review-book" &&
      modal.data &&
      !hasFetchedBefore.current
    ) {
      hasFetchedBefore.current = true;
      // do something
    }
  }, [modal]);

  const reviewBook: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const reviewText = _reviewText.trim();

    if (stars < 1) {
      toast.error("Please rate the book before submitting your review");
      return;
    } else if (stars > 5) {
      toast.error("You can't rate a book more than 5 stars");
      return;
    } else if (!modal.active) {
      toast.error("Modal is not active");
      return;
    } else if (modal.type !== "review-book") {
      toast.error("Invalid modal type");
      return;
    } else if (!modal.data) {
      toast.error("Invalid Book");
      return;
    }

    setProcessing({ on: "reviewing", data: "" });

    try {
      const response = await postApiJson(routes.book.review.review, {
        bookID: modal.data,
        rating: stars,
        reviewText: reviewText,
      });
      if (response.error || !response.review) {
        toast.error(response.errorMessage || "Failed to review book");
      } else {
        toast.success("Book reviewed successfully");
        dispatch(setHasReviewed(modal.data));
        exitWithAnimation();
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to review book");
    }

    setProcessing({ on: "", data: "" });
  };

  if (!modal.active) return <></>;
  if (modal.type !== "review-book") return <></>;
  if (!modal.data) return <></>;

  return (
    <div className="fixed left-0 right-0 bottom-0 top-[0px] bg-[#DBDBDB]/[0.01] backdrop-blur-[10px] z-[90] flex justify-center p-5">
      <div
        ref={mainRef}
        className="gsap-init m-auto w-full max-w-[458px] rounded-[24px] bg-sub-bg shadow-lg py-8 px-6"
      >
        <div className="">
          <h1 className="text-2xl font-bold text-sub-head">Review Book</h1>
          <form
            onSubmit={reviewBook}
            className="flex flex-col items-center justify-center gap-2 mt-4"
          >
            <div className="w-full pb-2">
              <StarRating
                value={stars}
                onInput={processing.on ? undefined : setStars}
                max={5}
                className="text-3xl w-[35px]"
              />
            </div>
            <TextInput
              label="Review"
              placeholder="Write a review"
              value={_reviewText}
              onChange={setReviewText}
              isTextArea
              rows={5}
              readonly={!!processing.on}
            />
            <button
              type="submit"
              disabled={!!processing.on}
              className="bg-highlight hover:bg-highlight-dark text-white p-3 rounded-xl w-full flex items-center justify-center gap-2"
            >
              {processing.on === "reviewing" ? "Reviewing" : "Reveiw"}
              {processing.on === "reviewing" && (
                <ClipLoader size={20} color="#fff" />
              )}
            </button>
          </form>
        </div>

        <button
          onClick={() => exitWithAnimation()}
          className="absolute shake top-4 right-4 text-2xl"
        >
          <FaTimes />
        </button>
      </div>
      <ModalOverflow />
    </div>
  );
};

export default ReviewBookModal;
