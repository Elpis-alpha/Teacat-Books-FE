import { AuthorTicketInterface } from "@/source/types/states";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import TextInput from "../reusable/TextInput";
import BooleanInput from "../reusable/BooleanInput";

type AuthorTicketProps = {
  ticket: AuthorTicketInterface;
  processingState: [
    { on: "accepting" | "rejecting" | ""; data: string },
    React.Dispatch<
      React.SetStateAction<{
        on: "accepting" | "rejecting" | "";
        data: string;
      }>
    >
  ];
  refetch: () => void;
};
const AuthorTicket = (props: AuthorTicketProps) => {
  const { ticket, refetch } = props;
  const ticketType = ticket.action;
  const [expandReview, setExpandReview] = useState(false);
  const [reviewerFeedback, setReviewerFeedback] = useState("");
  const [processingState, setProcessingState] = props.processingState;
  const [walletHelioID, setWalletHelioID] = useState("");
  const [rejectForever, setRejectForever] = useState(false);

  const { authorName, authorID } = useMemo(() => {
    if (typeof ticket.author === "string") {
      return { authorName: "Author", authorID: ticket.author };
    } else if (ticket.author) {
      return {
        authorName: ticket?.author?.name || "Author",
        authorID: ticket?.author?._id || "",
      };
    } else {
      return { authorName: "Author", authorID: "" };
    }
  }, [ticket.author]);

  const timestamp = useMemo(() => {
    const createdAt = new Date(ticket.createdAt);
    const dateReviewed = ticket.dateReviewed
      ? new Date(ticket.dateReviewed)
      : null;
    return `${format(createdAt, "PPPP")}${
      dateReviewed ? ` - ${format(dateReviewed, "PPPP")}` : ""
    }`;
  }, [ticket.createdAt, ticket.dateReviewed]);

  const approveTicket = async () => {
    if (ticket.status !== "pending")
      return toast.error("Ticket is not pending.");
    if (!reviewerFeedback) return toast.error("Feedback is required.");
    if (ticketType === "become-author") {
      if (!walletHelioID) return toast.error("Wallet Helio ID is required.");
      if (walletHelioID.length !== 24)
        return toast.error("Wallet Helio ID is invalid.");
    }

    try {
      setProcessingState({ on: "accepting", data: ticket._id });

      const response = await postApiJson(routes.ticket.admin.reviewAuthor, {
        ticketID: ticket._id,
        reviewerFeedback: reviewerFeedback,
        approveTicket: true,
        walletHelioID:
          ticketType === "become-author" ? walletHelioID : undefined,
      });

      if (response.error || !response.message) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to approve ticket.");
      } else {
        toast.success("Ticket approved successfully.");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve ticket.");
    }
    setProcessingState({ on: "", data: "" });
  };

  const rejectTicket = async () => {
    if (ticket.status !== "pending")
      return toast.error("Ticket is not pending.");
    if (!reviewerFeedback) return toast.error("Feedback is required.");

    try {
      setProcessingState({ on: "rejecting", data: ticket._id });

      const response = await postApiJson(routes.ticket.admin.reviewAuthor, {
        ticketID: ticket._id,
        reviewerFeedback: reviewerFeedback,
        approveTicket: false,
        rejectForever:
          ticketType === "become-author"
            ? rejectForever
              ? "true"
              : null
            : null,
      });

      if (response.error || !response.message) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to reject ticket.");
      } else {
        toast.success("Ticket rejected successfully.");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject ticket.");
    }
    setProcessingState({ on: "", data: "" });
  };

  return (
    <div className="bg-sub-bg rounded-3xl py-6 px-7 text-sm sm:text-base font-proxima flex flex-col gap-4 sm:gap-6">
      <h3 className="font-bold text-lg sm:text-2xl flex items-center gap-x-3 gap-y-1 flex-wrap">
        Ticket #{ticket.ticketNumber} -{" "}
        {ticketType === "become-author"
          ? "Requesting Authorship"
          : "Removing Authorship"}
        <span
          className="inline-block mr-2 font-normal text-sm py-0.5 px-3 rounded-lg uppercase"
          style={{
            backgroundColor:
              ticket.status === "pending"
                ? "#775900"
                : ticket.status === "approved"
                ? "#006a04"
                : "#6e0000",
          }}
        >
          {ticket.status}
        </span>
      </h3>
      <div className="flex items-center gap-2">
        <Link
          target="_blank"
          rel="noreferrer"
          href={`/profile/${authorID}`}
          className="underline"
        >
          {authorName}
        </Link>
      </div>
      {ticketType === "become-author" && (
        <div className="">
          <p className="font-bold text-base sm:text-lg ">{"Author's"} Wallet</p>
          <p className="">{ticket.wallet || "Not Provided"}</p>
        </div>
      )}
      <div className="">
        <p className="font-bold text-base sm:text-lg ">Message for reviewer</p>
        <p className="">{ticket.messageForReviewer}</p>
      </div>
      {ticket.reviewerFeedback && (
        <div className="">
          <p className="font-bold text-base sm:text-lg ">Reviewer feedback</p>
          <p className="">{ticket.reviewerFeedback}</p>
        </div>
      )}
      <p className="text-xs sm:text-sm">{timestamp}</p>
      <div className="flex flex-wrap gap-2">
        {ticket.status === "pending" && !expandReview && (
          <button
            onClick={() => setExpandReview(true)}
            className="text-white bg-highlight py-1.5 px-5 rounded-lg hover:opacity-50"
            disabled={!!processingState.on}
          >
            Review
          </button>
        )}
        {ticket.status === "pending" && expandReview && (
          <button
            onClick={() => setExpandReview(false)}
            className="text-black bg-white py-1.5 px-5 rounded-lg hover:opacity-50"
            disabled={!!processingState.on}
          >
            Cancel Review
          </button>
        )}
      </div>
      {ticket.status === "pending" && expandReview && (
        <div className="flex flex-col gap-4">
          {ticketType === "become-author" && (
            <TextInput
              label="Author's Wallet Helio ID"
              onChange={setWalletHelioID}
              value={walletHelioID}
              readonly={!!processingState.on}
              placeholder="Wallet Helio ID"
              extraText={
                <>
                  Please generate a helio ID for the author wallet at{" "}
                  <a
                    href="https://app.dev.hel.io/settings/manage-wallets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-300"
                  >
                    helio
                  </a>{" "}
                  and paste it here. The author will receive the payment in this
                  wallet.
                </>
              }
            />
          )}
          <TextInput
            label="Reviewer feedback"
            onChange={setReviewerFeedback}
            value={reviewerFeedback}
            readonly={!!processingState.on}
            isTextArea
            placeholder="Feedback for author"
            rows={5}
          />
          {ticketType === "become-author" && (
            <BooleanInput
              label="Reject forever (author cannot request authorship again)"
              onToggle={() => setRejectForever((p) => !p)}
              value={rejectForever}
              readonly={!!processingState.on}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={approveTicket}
              disabled={!!processingState.on}
              className="text-white bg-good-green py-1.5 px-5 rounded-lg hover:opacity-50 flex items-center gap-1.5"
            >
              Approve
              {processingState.on === "accepting" &&
                processingState.data === ticket._id && (
                  <ClipLoader color="#fff" size={15} />
                )}
            </button>
            <button
              onClick={rejectTicket}
              disabled={!!processingState.on}
              className="text-white bg-bad-red py-1.5 px-5 rounded-lg hover:opacity-50 flex items-center gap-1.5"
            >
              Reject
              {processingState.on === "rejecting" &&
                processingState.data === ticket._id && (
                  <ClipLoader color="#fff" size={15} />
                )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AuthorTicket;
