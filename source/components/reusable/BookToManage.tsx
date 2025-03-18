import { useAppSelector } from "@/source/store/hooks";
import { BookInterface } from "@/source/types/states";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { postApiFormData, postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import TextInput from "./TextInput";
import FileInput from "./FileInput";

type BookToManageProps = {
  book: BookInterface;
  viewer: "author" | "admin";
  processingState: [
    { on: "ticketing" | ""; data: string },
    React.Dispatch<
      React.SetStateAction<{
        on: "ticketing" | "";
        data: string;
      }>
    >
  ];
  refetch: () => void;
};
const BookToManage = (props: BookToManageProps) => {
  const { book, viewer, refetch } = props;
  const [editing, setEditing] = useState<
    | ""
    | "title"
    | "description"
    | "mainImage"
    | "coverImage"
    | "epub"
    | "remove"
  >("");
  const [adminApproving, setAdminApproving] = useState(false); // for admin [viewer], approves immediately the ticket is created

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const newBookEpub = useRef<File | null>(null);
  const newMainImage = useRef<File | null>(null);
  const newCoverImage = useRef<File | null>(null);
  const [_messageForReviewer, setMessageForReviewer] = useState("");

  const userData = useAppSelector((state) => state.user).data!;
  const [processingState, setProcessingState] = props.processingState;

  const { authorName, authorID } = useMemo(() => {
    if (typeof book.author === "string") {
      return book.author === userData._id
        ? { authorName: userData.name, authorID: book.author }
        : { authorName: "Author", authorID: book.author };
    } else {
      return {
        authorName: book.author?.name || "Author",
        authorID: book.author._id,
      };
    }
  }, [book.author, userData._id, userData.name]);

  const timestamp = useMemo(() => {
    const createdAt = new Date(book.createdAt);
    return `${format(createdAt, "PPPP")}`;
  }, [book.createdAt]);

  const _approveTicket = async (ticketID: string) => {
    if (typeof ticketID !== "string") return toast.error("Invalid ticket ID");
    setAdminApproving(true);
    try {
      const response = await postApiJson(routes.ticket.admin.reviewBook, {
        ticketID,
        reviewerFeedback: "Admin Update",
        approveTicket: true,
      });

      if (response.error || !response.message) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to approve ticket");
        toast("Please approve the ticket manually");
      } else {
        toast.success("Ticket approved successfully");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve ticket");
    }
    setAdminApproving(false);
  };

  const updateMeta = async (type: "title" | "description") => {
    const text = type === "title" ? newTitle.trim() : newDescription.trim();
    const messageForReviewer =
      viewer === "admin" ? "Admin Update" : _messageForReviewer;
    if (!messageForReviewer)
      return toast.error("Message for reviewer is required");
    if (!text) return toast.error("New Text is required");

    try {
      setProcessingState({ on: "ticketing", data: book._id });

      const response = await postApiJson(routes.ticket.book.updateMeta, {
        messageForReviewer: messageForReviewer,
        bookID: book._id,
        textType: type === "title" ? "title" : "description",
        newText: text,
        automaticMode: viewer === "admin" ? "true" : null,
      });

      if (response.error || !response.ticket || !response.ticket._id) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to create ticket");
      } else {
        toast.success("Ticket created successfully");
        if (viewer === "admin") await _approveTicket(response.ticket._id);

        if (type === "title") setNewTitle("");
        else setNewDescription("");
        setEditing("");
        setMessageForReviewer("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket");
    }
    setProcessingState({ on: "", data: "" });
  };

  const updateImageTicket = async (type: "main" | "cover") => {
    const image =
      type === "main" ? newMainImage.current : newCoverImage.current;
    const messageForReviewer =
      viewer === "admin" ? "Admin Update" : _messageForReviewer;
    if (!messageForReviewer)
      return toast.error("Message for reviewer is required");
    if (!image) return toast.error("Image is required");

    try {
      setProcessingState({ on: "ticketing", data: book._id });

      const response = await postApiFormData(routes.ticket.book.updateImage, {
        messageForReviewer: messageForReviewer,
        bookID: book._id,
        imageType: type === "main" ? "main" : "cover",
        automaticMode: viewer === "admin" ? "true" : "",
        image: image,
      });

      if (response.error || !response.ticket || !response.ticket._id) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to create ticket");
      } else {
        toast.success("Ticket created successfully");
        if (viewer === "admin") await _approveTicket(response.ticket._id);

        if (type === "main") newMainImage.current = null;
        else newCoverImage.current = null;
        setEditing("");
        setMessageForReviewer("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket");
    }
    setProcessingState({ on: "", data: "" });
  };

  const updateEpubTicket = async () => {
    const messageForReviewer =
      viewer === "admin" ? "Admin Update" : _messageForReviewer;
    if (!messageForReviewer)
      return toast.error("Message for reviewer is required");
    if (!newBookEpub.current) return toast.error("New Epub is required");

    try {
      setProcessingState({ on: "ticketing", data: book._id });

      const response = await postApiFormData(routes.ticket.book.updateBook, {
        messageForReviewer: messageForReviewer,
        bookID: book._id,
        automaticMode: viewer === "admin" ? "true" : "",
        image: newBookEpub.current,
      });

      if (response.error || !response.ticket || !response.ticket._id) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to create ticket");
      } else {
        toast.success("Ticket created successfully");
        if (viewer === "admin") await _approveTicket(response.ticket._id);

        newBookEpub.current = null;
        setEditing("");
        setMessageForReviewer("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket");
    }

    setProcessingState({ on: "", data: "" });
  };

  const deleteBookTicket = async () => {
    const messageForReviewer =
      viewer === "admin" ? "Admin Update" : _messageForReviewer;
    if (!messageForReviewer)
      return toast.error("Message for reviewer is required");

    try {
      setProcessingState({ on: "ticketing", data: book._id });

      const response = await postApiJson(routes.ticket.book.deleteBook, {
        messageForReviewer: messageForReviewer,
        bookID: book._id,
        automaticMode: viewer === "admin" ? "true" : null,
      });

      if (response.error || !response.ticket || !response.ticket._id) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to create ticket");
      } else {
        toast.success("Ticket created successfully");
        if (viewer === "admin") await _approveTicket(response.ticket._id);

        setEditing("");
        setMessageForReviewer("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket");
    }
    setProcessingState({ on: "", data: "" });
  };

  return (
    <div className="bg-sub-bg rounded-3xl py-6 px-7 text-sm sm:text-base font-proxima flex flex-col gap-4 sm:gap-6">
      <div className="">
        <h3 className="font-bold text-lg sm:text-2xl flex items-start justify-between gap-2">
          <Link href={`/book/${book._id}`}>{book.title}</Link>
          {book.epubURL && (
            <a
              href={book.epubURL}
              download={"book.epub"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base hover:text-blue-300"
            >
              <FaFileDownload />
            </a>
          )}
        </h3>
        <p className="line-clamp-1">{book.description}</p>
        <p className="text-xs sm:text-sm pt-2">
          {timestamp}
          {viewer === "admin" && (
            <>
              {" ---- "}
              <Link className="underline" href={`/profile/${authorID}`}>
                {authorName}
              </Link>
            </>
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={!!processingState.on}
          onClick={() => setEditing((p) => (p === "title" ? "" : "title"))}
          className={`py-1.5 px-5 rounded-lg hover:opacity-50 ${
            editing === "title"
              ? "bg-white text-black"
              : "bg-highlight text-white"
          }`}
        >
          {editing === "title" ? "Cancel" : "Edit Title"}
        </button>
        <button
          disabled={!!processingState.on}
          onClick={() =>
            setEditing((p) => (p === "description" ? "" : "description"))
          }
          className={`py-1.5 px-5 rounded-lg hover:opacity-50 ${
            editing === "description"
              ? "bg-white text-black"
              : "bg-highlight text-white"
          }`}
        >
          {editing === "description" ? "Cancel" : "Edit Description"}
        </button>
        <button
          disabled={!!processingState.on}
          onClick={() =>
            setEditing((p) => (p === "mainImage" ? "" : "mainImage"))
          }
          className={`py-1.5 px-5 rounded-lg hover:opacity-50 ${
            editing === "mainImage"
              ? "bg-white text-black"
              : "bg-highlight text-white"
          }`}
        >
          {editing === "mainImage" ? "Cancel" : "Edit Main Image"}
        </button>
        <button
          disabled={!!processingState.on}
          onClick={() =>
            setEditing((p) => (p === "coverImage" ? "" : "coverImage"))
          }
          className={`py-1.5 px-5 rounded-lg hover:opacity-50 ${
            editing === "coverImage"
              ? "bg-white text-black"
              : "bg-highlight text-white"
          }`}
        >
          {editing === "coverImage" ? "Cancel" : "Edit Cover Image"}
        </button>
        <button
          disabled={!!processingState.on}
          onClick={() => setEditing((p) => (p === "epub" ? "" : "epub"))}
          className={`py-1.5 px-5 rounded-lg hover:opacity-50 ${
            editing === "epub"
              ? "bg-white text-black"
              : "bg-good-green text-white"
          }`}
        >
          {editing === "epub" ? "Cancel" : "Edit Epub"}
        </button>
        <button
          disabled={!!processingState.on}
          onClick={() => setEditing((p) => (p === "remove" ? "" : "remove"))}
          className={`py-1.5 px-5 rounded-lg hover:opacity-50 ${
            editing === "remove"
              ? "bg-white text-black"
              : "bg-bad-red text-white"
          }`}
        >
          {editing === "remove" ? "Cancel" : "Remove Book"}
        </button>
      </div>
      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (processingState.on) return toast("Please wait");

            if (editing === "title") updateMeta("title");
            if (editing === "description") updateMeta("description");
            if (editing === "mainImage") updateImageTicket("main");
            if (editing === "coverImage") updateImageTicket("cover");
            if (editing === "epub") updateEpubTicket();
            if (editing === "remove") deleteBookTicket();
          }}
          className="flex flex-col items-center justify-center gap-4 w-full"
        >
          {editing === "title" && (
            <TextInput
              label="New Title"
              onChange={setNewTitle}
              value={newTitle}
              readonly={!!processingState.on}
              placeholder="New Title"
            />
          )}
          {editing === "description" && (
            <TextInput
              label="New Description"
              onChange={setNewDescription}
              value={newDescription}
              readonly={!!processingState.on}
              isTextArea
              placeholder="New Description"
              rows={5}
            />
          )}
          {editing === "mainImage" && (
            <FileInput
              label="New Main Image"
              onInput={(val) => {
                newMainImage.current = val;
              }}
              readonly={!!processingState.on}
              accept="image/*"
              placeholder="Upload New Main Image"
            />
          )}
          {editing === "coverImage" && (
            <FileInput
              label="New Cover Image"
              onInput={(val) => {
                newCoverImage.current = val;
              }}
              readonly={!!processingState.on}
              accept="image/*"
              placeholder="Upload New Cover Image"
            />
          )}
          {editing === "epub" && (
            <FileInput
              label="New Epub"
              onInput={(val) => {
                newBookEpub.current = val;
              }}
              readonly={!!processingState.on}
              accept="application/epub+zip"
              placeholder="Upload New Epub"
            />
          )}
          {viewer !== "admin" && (
            <TextInput
              label="Message for Reviewer"
              onChange={setMessageForReviewer}
              value={_messageForReviewer}
              readonly={!!processingState.on}
              isTextArea
              placeholder="Feedback for author"
              rows={5}
            />
          )}
          <button
            disabled={!!processingState.on}
            type="submit"
            className="bg-highlight hover:bg-highlight-dark text-white p-3 rounded-xl w-full flex items-center justify-center gap-2 -mt-2"
          >
            {processingState.on === "ticketing" &&
            processingState.data === book._id
              ? adminApproving
                ? "Approving Ticket"
                : "Creating Ticket"
              : `Create Ticket${viewer === "admin" ? " & Approve" : ""}`}
            {processingState.on === "ticketing" &&
              processingState.data === book._id && (
                <ClipLoader color="#fff" size={15} />
              )}
          </button>
        </form>
      )}
    </div>
  );
};
export default BookToManage;
