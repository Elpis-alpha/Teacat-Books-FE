import { useAppSelector } from "@/source/store/hooks";
import { BookTicketInterface } from "@/source/types/states";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useState } from "react";
import DownTrans from "./DownTrans";
import SafeImage from "./SafeImage";
import { FaFileDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import TextInput from "./TextInput";

type BookTicketProps = {
  ticket: BookTicketInterface;
  viewer: "author" | "admin";
  processingState: [
    { on: "accepting" | "rejecting" | "canceling" | ""; data: string },
    React.Dispatch<
      React.SetStateAction<{
        on: "accepting" | "rejecting" | "canceling" | "";
        data: string;
      }>
    >
  ];
  refetch: () => void;
};
const BookTicket = (props: BookTicketProps) => {
  const { ticket, viewer, refetch } = props;
  const ticketType = ticket.action;
  const [expanded, setExpanded] = useState(false);
  const [expandReview, setExpandReview] = useState(false);
  const [reviewerFeedback, setReviewerFeedback] = useState("");
  const userData = useAppSelector((state) => state.user).data!;
  const [processingState, setProcessingState] = props.processingState;

  const { authorName, authorID } = useMemo(() => {
    if (typeof ticket.author === "string") {
      return ticket.author === userData._id
        ? { authorName: userData.name, authorID: ticket.author }
        : { authorName: "Author", authorID: ticket.author };
    } else if (ticket.author) {
      return {
        authorName: ticket?.author?.name || "Author",
        authorID: ticket?.author?._id || "",
      };
    } else {
      return { authorName: "Author", authorID: "" };
    }
  }, [ticket.author, userData._id, userData.name]);

  const timestamp = useMemo(() => {
    const createdAt = new Date(ticket.createdAt);
    const dateReviewed = ticket.dateReviewed
      ? new Date(ticket.dateReviewed)
      : null;
    return `${format(createdAt, "PPPP")}${
      dateReviewed ? ` - ${format(dateReviewed, "PPPP")}` : ""
    }`;
  }, [ticket.createdAt, ticket.dateReviewed]);

  const cancelTicket = async () => {
    if (viewer !== "author") return toast.error("You are not in author mode.");
    if (ticket.status !== "pending")
      return toast.error("Ticket is not pending.");
    if (ticket.author !== userData._id)
      return toast.error("You are not the author of this ticket.");

    try {
      setProcessingState({ on: "canceling", data: ticket._id });

      const response = await postApiJson(routes.ticket.book.cancel, {
        ticketID: ticket._id,
      });

      if (response.error || !response.message) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to cancel ticket.");
      } else {
        toast.success("Ticket canceled successfully.");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel ticket.");
    }
    setProcessingState({ on: "", data: "" });
  };

  const approveTicket = async () => {
    if (viewer !== "admin") return toast.error("You are not in admin mode.");
    if (ticket.status !== "pending")
      return toast.error("Ticket is not pending.");
    if (!userData.isAdmin) return toast.error("You are not an admin.");
    if (!reviewerFeedback) return toast.error("Feedback is required.");

    try {
      setProcessingState({ on: "accepting", data: ticket._id });

      const response = await postApiJson(routes.ticket.admin.reviewBook, {
        ticketID: ticket._id,
        reviewerFeedback: reviewerFeedback,
        approveTicket: true,
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
    if (viewer !== "admin") return toast.error("You are not in admin mode.");
    if (ticket.status !== "pending")
      return toast.error("Ticket is not pending.");
    if (!userData.isAdmin) return toast.error("You are not an admin.");
    if (!reviewerFeedback) return toast.error("Feedback is required.");

    try {
      setProcessingState({ on: "rejecting", data: ticket._id });

      const response = await postApiJson(routes.ticket.admin.reviewBook, {
        ticketID: ticket._id,
        reviewerFeedback: reviewerFeedback,
        approveTicket: false,
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
        {ticketType === "new-book"
          ? "New Book"
          : ticketType === "update-image"
          ? ticket?.updateImage?.imageType === "main"
            ? "Main Image Update"
            : "Cover Image Update"
          : ticketType === "update-text"
          ? "Book Update"
          : ticketType === "update-meta"
          ? ticket?.updateMeta?.textType === "title"
            ? "Title Update"
            : "Description Update"
          : "Delete Book"}
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
        {ticket.bookID && (
          <>
            <span>-</span>
            <Link
              target="_blank"
              rel="noreferrer"
              href={`/book/${ticket.bookID}`}
              className="underline"
            >
              {ticket.cachedBookName || "Book"}
            </Link>
          </>
        )}
      </div>
      {ticketType !== "delete-book" && (
        <div className="flex items-start justify-start w-full flex-col gap-2">
          {ticketType === "update-meta" ? (
            <>
              <p className="opacity-50">{ticket.updateMeta?.oldText}</p>
              <div className="py-1 px-2.5">
                <DownTrans className="w-[17px]" />
              </div>
              <p>{ticket.updateMeta?.newText}</p>
            </>
          ) : ticketType === "update-image" ? (
            <div
              className={
                "flex items-center gap-2 " +
                (ticket.updateImage?.imageType === "main"
                  ? "flex-row"
                  : "flex-col")
              }
            >
              <SafeImage
                src={makeImageSmaller(ticket.updateImage?.oldImageURL)}
                alt="Old Image"
                className={
                  "object-cover border-1 border-white " +
                  (ticket.updateImage?.imageType === "main"
                    ? "sm:w-[150px] sm:h-[240px] w-[105px] h-[168px]"
                    : "sm:w-[250px] sm:h-[140px] w-[175px] h-[98px]")
                }
              />
              <div
                className={
                  "py-1 px-2.5 " +
                  (ticket.updateImage?.imageType === "main" ? "-rotate-90" : "")
                }
              >
                <DownTrans className="w-[17px]" />
              </div>
              <SafeImage
                src={makeImageSmaller(ticket.updateImage?.newImageURL)}
                alt="Old Image"
                className={
                  "object-cover border-1 border-white " +
                  (ticket.updateImage?.imageType === "main"
                    ? "sm:w-[150px] sm:h-[240px] w-[105px] h-[168px]"
                    : "sm:w-[250px] sm:h-[140px] w-[175px] h-[98px]")
                }
              />
            </div>
          ) : ticketType === "update-text" ? (
            <div className="flex items-center gap-2 ">
              <div className="px-5 py-3.5 bg-white/20 rounded-xl flex items-center gap-3">
                <p>Old Epub</p>
                <a
                  href={ticket.updateText?.oldEpubURL}
                  download={"old.epub"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-blue-300"
                >
                  <FaFileDownload />
                </a>
              </div>
              <div className="px-2.5 -rotate-90">
                <DownTrans className="w-[17px]" />
              </div>
              <div className="px-5 py-3.5 bg-white/20 rounded-xl flex items-center gap-3">
                <p>New Epub</p>
                <a
                  href={ticket.updateText?.newEpubURL}
                  download={"new.epub"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-blue-300"
                >
                  <FaFileDownload />
                </a>
              </div>
            </div>
          ) : ticketType === "new-book" ? (
            expanded ? (
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="">
                  <p className="font-bold text-base sm:text-lg ">Title</p>
                  <p className="">{ticket.newBook?.title}</p>
                </div>
                <div className="">
                  <p className="font-bold text-base sm:text-lg ">Description</p>
                  <p className="">{ticket.newBook?.description}</p>
                </div>
                <div className="">
                  <p className="font-bold text-base sm:text-lg ">Price ($)</p>
                  <p className="">{ticket.newBook?.price}</p>
                </div>
                <div className="">
                  <p className="font-bold text-base sm:text-lg ">
                    Borrowable Copies
                  </p>
                  <p className="">{ticket.newBook?.borrowableCopies}</p>
                </div>
                <div className="">
                  <p className="font-bold text-base sm:text-lg ">Book</p>
                  <div className="px-5 py-3.5 bg-white/20 rounded-xl items-center gap-3 mr-auto inline-flex">
                    <p>Book Epub</p>
                    <a
                      href={ticket.newBook?.epubURL}
                      download={"new.epub"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl hover:text-blue-300"
                    >
                      <FaFileDownload />
                    </a>
                  </div>
                </div>
                <div className="">
                  <p className="font-bold text-base sm:text-lg ">Main Image</p>
                  <SafeImage
                    src={makeImageSmaller(ticket.newBook?.mainImage)}
                    alt="Main Image"
                    className="object-cover border-1 border-white sm:w-[150px] sm:h-[240px] w-[105px] h-[168px]"
                  />
                </div>
                <div className="">
                  <p className="font-bold text-base sm:text-lg ">Cover Image</p>
                  <SafeImage
                    src={makeImageSmaller(ticket.newBook?.coverImage)}
                    alt="Cover Image"
                    className="object-cover border-1 border-white sm:w-[250px] sm:h-[140px] w-[175px] h-[98px]"
                  />
                </div>
              </div>
            ) : (
              <p>BOOK: {ticket.newBook?.title}</p>
            )
          ) : (
            "Unknown ticket type"
          )}
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
        {ticketType === "new-book" && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-white bg-highlight py-1.5 px-5 rounded-lg hover:opacity-50"
          >
            {expanded ? "Hide" : "Show"} Details
          </button>
        )}
        {viewer === "author" && ticket.status === "pending" && (
          <button
            onClick={cancelTicket}
            disabled={!!processingState.on}
            className="text-white bg-red-500 py-1.5 px-5 rounded-lg hover:opacity-50 flex items-center gap-1.5"
          >
            Cancel
            {processingState.on === "canceling" &&
              processingState.data === ticket._id && (
                <ClipLoader color="#fff" size={15} />
              )}
          </button>
        )}
        {viewer === "admin" && ticket.status === "pending" && !expandReview && (
          <button
            onClick={() => setExpandReview(true)}
            className="text-white bg-highlight py-1.5 px-5 rounded-lg hover:opacity-50"
            disabled={!!processingState.on}
          >
            Review
          </button>
        )}
        {viewer === "admin" && ticket.status === "pending" && expandReview && (
          <button
            onClick={() => setExpandReview(false)}
            className="text-black bg-white py-1.5 px-5 rounded-lg hover:opacity-50"
            disabled={!!processingState.on}
          >
            Cancel Review
          </button>
        )}
      </div>
      {viewer === "admin" && ticket.status === "pending" && expandReview && (
        <div className="">
          <TextInput
            label="Reviewer feedback"
            onChange={setReviewerFeedback}
            value={reviewerFeedback}
            readonly={!!processingState.on}
            isTextArea
            placeholder="Feedback for author"
            rows={5}
          />
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
export default BookTicket;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_250/`);
};
