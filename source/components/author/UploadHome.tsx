"use client";
import { FormEventHandler, useRef, useState } from "react";
import TextInput from "../reusable/TextInput";
import BooleanInput from "../reusable/BooleanInput";
import FileInput from "../reusable/FileInput";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { postApiFormData } from "@/source/api";
import routes from "@/source/api/routes";

const UploadHome = () => {
  const router = useRouter();
  const [processing, setProcessing] = useState<"" | "uploading">("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [messageForReviewer, setMessageForReviewer] = useState("");
  const [_price, setPrice] = useState("");
  const [_borrowableCopies, setBorrowableCopies] = useState("");
  const bookEpub = useRef<File | null>(null);
  const mainImage = useRef<File | null>(null);
  const coverImage = useRef<File | null>(null);
  const [allowLLM, setAllowLLM] = useState(false);

  const handleUpload: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const price = parseFloat(_price);
    const borrowableCopies = parseInt(_borrowableCopies);

    if (processing === "uploading") {
      toast.error("Please wait for the current upload to finish.");
      return;
    } else if (!title) {
      return toast.error("Please enter a title.");
    } else if (!description) {
      return toast.error("Please enter a description.");
    } else if (!messageForReviewer) {
      return toast.error("Please enter a message for the reviewer.");
    } else if (!price || isNaN(price) || price <= 0) {
      return toast.error("Please enter a valid price.");
    } else if (
      !borrowableCopies ||
      isNaN(borrowableCopies) ||
      borrowableCopies <= 0
    ) {
      return toast.error("Please enter a valid number of borrowable copies.");
    } else if (!bookEpub.current) {
      return toast.error("Please upload the book file.");
    } else if (!mainImage.current) {
      return toast.error("Please upload the main image.");
    } else if (!coverImage.current) {
      return toast.error("Please upload the cover image.");
    }

    try {
      setProcessing("uploading");
      // upload book
      const response = await postApiFormData(routes.ticket.book.newBook, {
        title,
        description,
        messageForReviewer,
        price: price.toString(),
        borrowableCopies: borrowableCopies.toString(),
        bookEpub: bookEpub.current,
        mainImage: mainImage.current,
        coverImage: coverImage.current,
        allowsLLM: allowLLM ? "true" : "false",
      });
      if (response.error || !response.message) {
        toast.error(
          response.errorMessage || "An error occurred while uploading."
        );
        setProcessing("");
      } else {
        toast.success("Book uploaded successfully.");
        setProcessing("");
        router.push("/author/tickets");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
      setProcessing("");
    }
  };

  return (
    <div className="w-full px-6 md:px-10 xl:px-16 py-10 text-base sm:text-xl">
      <form
        onSubmit={handleUpload}
        className="max-w-[700px] flex flex-col items-center justify-center gap-4 mx-auto"
      >
        <TextInput
          label="Title"
          value={title}
          onChange={setTitle}
          readonly={!!processing}
          placeholder="The Greatest Book Ever"
        />
        <TextInput
          label="Description"
          value={description}
          onChange={setDescription}
          readonly={!!processing}
          placeholder="This story is set in the time of..."
          isTextArea
          rows={5}
        />
        <TextInput
          label="Message for Reviewer"
          value={messageForReviewer}
          onChange={setMessageForReviewer}
          readonly={!!processing}
          placeholder="I would like to know if..."
          isTextArea
          rows={3}
        />
        <TextInput
          label="Price"
          value={_price}
          readonly={!!processing}
          onChange={setPrice}
          placeholder="$10.99"
        />
        <TextInput
          label="Borrowable Copies"
          value={_borrowableCopies}
          readonly={!!processing}
          onChange={setBorrowableCopies}
          placeholder="12 copies"
        />
        <FileInput
          label="Book (EPUB)"
          onInput={(val) => {
            bookEpub.current = val;
          }}
          readonly={!!processing}
          accept="application/epub+zip"
          placeholder="Upload EPUB"
        />
        <FileInput
          label="Main Image"
          onInput={(val) => {
            mainImage.current = val;
          }}
          readonly={!!processing}
          accept="image/*"
          placeholder="Upload Main Image"
        />
        <FileInput
          label="Cover Image"
          onInput={(val) => {
            coverImage.current = val;
          }}
          readonly={!!processing}
          accept="image/*"
          placeholder="Upload Cover Image"
        />
        <BooleanInput
          readonly={!!processing}
          label="I grant permission for this work to be used for training AI models and large language models (LLMs)."
          value={allowLLM}
          onToggle={() => setAllowLLM((p) => !p)}
        />
        <button
          type="submit"
          disabled={!!processing}
          className="bg-good-green hover:bg-good-green-dark text-white p-3 rounded-xl w-full flex items-center justify-center gap-2"
        >
          {processing === "uploading" ? "Uploading" : "Upload a New Book"}
          {processing === "uploading" && <ClipLoader size={20} color="#fff" />}
        </button>
      </form>
    </div>
  );
};
export default UploadHome;
