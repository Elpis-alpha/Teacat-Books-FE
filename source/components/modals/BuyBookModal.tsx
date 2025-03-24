import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ModalOverflow from "./ModalOverflow";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { animateModal } from "@/source/helpers/gsap.config";
import { setModal, updateMyBooks } from "@/source/store/slice/UIslice";
import { FaCheckCircle, FaTimes, FaTimesCircle } from "react-icons/fa";
import gsap from "gsap";
import TextInput from "../reusable/TextInput";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { generateHelioLink, openWithGet } from "@/source/helpers";
import { isEmail } from "validator";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { usePathname, useRouter } from "next/navigation";

const BuyBookModal = () => {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state) => state.ui);
  const userID = useAppSelector((state) => state.user.data?._id);
  const userEmail = useAppSelector((state) => state.user.data?.mail?.email);

  const mainRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const { bookID, helioPayLinkID } = useMemo(() => {
    if (!modal.active || modal.type !== "buy-book" || !modal.data) {
      return {
        bookID: "",
        helioPayLinkID: "",
      };
    }
    const [bookID, helioPayLinkID] = modal.data.split(":");
    return { bookID: bookID || "", helioPayLinkID: helioPayLinkID || "" };
  }, [modal]);

  const [transactionID, setTransactionID] = useState("");
  const [transactionSignature, setTransactionSignature] = useState("");
  const [senderPublickey, setSenderPublickey] = useState("");

  const [stage, setStage] = useState<
    | "ask-to-redirect-or-restore"
    | "redirecting-waiting-for-payment"
    | "post-redirect-verifying-payment"
    | "payment-verified"
    | "payment-failed"
    | "showing-restore-fields"
    | "restoring-payment"
    | "payment-restored"
  >("ask-to-redirect-or-restore");

  useLayoutEffect(() => {
    if (!modal.active || modal.type !== "buy-book" || !modal.data) {
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
        setStage("ask-to-redirect-or-restore");
        setTransactionID("");
        setTransactionSignature("");
        setSenderPublickey("");
        dispatch(setModal({ active: false }));
      },
    });
  };

  const hasFetchedBefore = useRef(false);
  useEffect(() => {
    if (
      modal.active &&
      modal.type === "buy-book" &&
      modal.data &&
      !hasFetchedBefore.current
    ) {
      hasFetchedBefore.current = true;
      // do something
    }
  }, [modal]);

  if (!modal.active) return <></>;
  if (modal.type !== "buy-book") return <></>;
  if (!modal.data) return <></>;

  const redirectToHelio = () => {
    if (!userID) return toast.error("Please login to buy the book.");
    if (!userEmail) return toast.error("Please login to buy the book.");
    if (!isEmail(userEmail))
      return toast.error("Invalid email. Please try again.");
    if (!bookID) return toast.error("Invalid book. Please try again.");
    if (!helioPayLinkID) return toast.error("Invalid book. Please try again.");
    if (stage !== "ask-to-redirect-or-restore")
      return toast.error("Invalid stage. Please try again.");

    const url = generateHelioLink(helioPayLinkID, userID, userEmail);
    const handle = openWithGet(url);
    if (!handle) return toast.error("Please enable browser popup!");

    setStage("redirecting-waiting-for-payment");
  };

  const validateRedirect = async () => {
    if (!userID) return toast.error("Please login to buy the book.");
    if (!userEmail) return toast.error("Please login to buy the book.");
    if (!isEmail(userEmail))
      return toast.error("Invalid email. Please try again.");
    if (!bookID) return toast.error("Invalid book. Please try again.");
    if (!helioPayLinkID) return toast.error("Invalid book. Please try again.");
    if (stage !== "redirecting-waiting-for-payment")
      return toast.error("Invalid stage. Please try again.");

    setStage("post-redirect-verifying-payment");
    // wait for 5 seconds before checking because the payment might not have been processed or the webhooks might not have been called
    const validate = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await postApiJson(routes.helio.check, {
        helioPayLinkID: helioPayLinkID,
      });
      if (response.error || !response.status) {
        return {
          error: response.errorMessage || "Failed to validate purchase",
        };
      } else {
        return "success" as const;
      }
    };

    // Check 2 times
    let error = "";
    for (let i = 0; i < 2; i++) {
      const result = await validate();
      if (result === "success") {
        setStage("payment-verified");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!path.includes("/my-books")) {
          console.log("pushing");
          router.push("/my-books");
        } else {
          console.log("refreshing");
          dispatch(updateMyBooks());
        }
        exitWithAnimation();
        return;
      } else {
        error = result.error;
      }
    }

    setStage("payment-failed");
    return toast.error(error);
  };

  const restorePurchase = async () => {
    if (!userID) return toast.error("Please login to buy the book.");
    if (!userEmail) return toast.error("Please login to buy the book.");
    if (!isEmail(userEmail))
      return toast.error("Invalid email. Please try again.");
    if (!bookID) return toast.error("Invalid book. Please try again.");
    if (!helioPayLinkID) return toast.error("Invalid book. Please try again.");
    if (stage !== "showing-restore-fields")
      return toast.error("Invalid stage. Please try again.");

    setStage("restoring-payment");
    // wait for 5 seconds before checking because the payment might not have been processed or the webhooks might not have been called
    const validate = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await postApiJson(routes.helio.check, {
        helioPayLinkID: helioPayLinkID,
        transactionID: transactionID.trim() || undefined,
        transactionSignature: transactionSignature.trim() || undefined,
        senderPublickey: senderPublickey.trim() || undefined,
      });
      if (response.error || !response.status) {
        return {
          error: response.errorMessage || "Failed to validate purchase",
        };
      } else {
        return "success" as const;
      }
    };

    // Check 2 times
    let error = "";
    for (let i = 0; i < 2; i++) {
      const result = await validate();
      if (result === "success") {
        setStage("payment-restored");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!path.includes("/my-books")) {
          router.push("/my-books");
        } else {
          console.log("refreshing");
          dispatch(updateMyBooks());
        }
        exitWithAnimation();
        return;
      } else {
        error = result.error;
      }
    }

    setStage("payment-failed");
    return toast.error(error);
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 top-[0px] bg-[#DBDBDB]/[0.01] backdrop-blur-[10px] z-[90] flex justify-center p-5">
      <div
        ref={mainRef}
        className="gsap-init m-auto w-full max-w-[458px] rounded-[24px] bg-sub-bg shadow-lg py-8 px-6 font-proxima"
      >
        <div className="flex flex-col gap-5 text-center">
          <h3 className="text-2xl font-bold text-sub-head">Buy Book</h3>
          {stage === "ask-to-redirect-or-restore" && (
            <div className="flex flex-col gap-3">
              <button
                onClick={redirectToHelio}
                className="bg-[#871277] hover:bg-[#391634] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
              >
                Redirect to Helio For Payment
              </button>
              <p>OR</p>
              <button
                onClick={() => setStage("showing-restore-fields")}
                className="bg-[#871245] hover:bg-[#451d2e] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
              >
                Already Paid? Verify Purchase
              </button>
            </div>
          )}
          {stage === "redirecting-waiting-for-payment" && (
            <div className="flex flex-col gap-3 items-center">
              <ClipLoader color="#ffffff" size={40} />
              <p className="text-balance">
                Redirecting to Helio for payment. Please click the button below
                after you have completed the payment.
              </p>
              <button
                onClick={validateRedirect}
                className="bg-[#871245] hover:bg-[#451d2e] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
              >
                Verify Payment
              </button>
            </div>
          )}
          {stage === "post-redirect-verifying-payment" && (
            <div className="flex flex-col gap-4 items-center py-5">
              <ClipLoader color="#ffffff" size={40} />
              <p className="text-balance">
                Verifying payment. Please wait. This might take a few seconds.
              </p>
            </div>
          )}
          {stage === "payment-verified" && (
            <div className="flex flex-col gap-4 items-center">
              <FaCheckCircle color="#22d207" size={50} />
              <p className="text-balance">
                Payment verified. Redirecting you to your books. Please wait.
              </p>
            </div>
          )}
          {stage === "payment-restored" && (
            <div className="flex flex-col gap-4 items-center">
              <FaCheckCircle color="#22d207" size={50} />
              <p className="text-balance">
                Payment restored. Redirecting you to your books. Please wait.
              </p>
            </div>
          )}
          {stage === "payment-failed" && (
            <div className="flex flex-col gap-4 items-center">
              <FaTimesCircle color="#d22c07" size={50} />
              <p className="text-balance">
                Payment verification failed. Please try again or contact
                support.
              </p>
            </div>
          )}

          {stage === "showing-restore-fields" && (
            <div className="flex flex-col gap-2.5 text-left">
              <TextInput
                label="Transaction ID"
                value={transactionID}
                onChange={setTransactionID}
                placeholder="Transaction ID"
                readonly={stage !== "showing-restore-fields"}
                extraText="You can find this in your email receipt. It is not required."
                smallerPaddings
              />
              <TextInput
                label="Transaction Signature"
                value={transactionSignature}
                onChange={setTransactionSignature}
                placeholder="Transaction Signature"
                readonly={stage !== "showing-restore-fields"}
                extraText="The transaction signature of the purchase. It is not required."
                smallerPaddings
              />
              <TextInput
                label="Sender Public Key"
                value={senderPublickey}
                onChange={setSenderPublickey}
                placeholder="Sender Public Key"
                readonly={stage !== "showing-restore-fields"}
                extraText="The address you used to make the payment. It is not required."
                smallerPaddings
              />
              <button
                onClick={restorePurchase}
                className="bg-[#871245] hover:bg-[#451d2e] py-1.5 2xl:py-2.5 px-5 2xl:px-7 rounded-md 2xl:rounded-xl"
              >
                Restore Purchase
              </button>
            </div>
          )}
          {stage === "restoring-payment" && (
            <div className="flex flex-col gap-4 items-center py-5">
              <ClipLoader color="#ffffff" size={40} />
              <p className="text-balance">
                Verifying payment to restore purchase. Please wait. This might
                take a few seconds.
              </p>
            </div>
          )}
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

export default BuyBookModal;
