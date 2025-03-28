"use client";

import { FormEventHandler, useRef, useState } from "react";
import toast from "react-hot-toast";
import SafeImage from "./SafeImage";

type FileInputProps = {
  label: string;
  onInput: (value: File | null) => void;
  readonly: boolean;
  accept: string;
  placeholder: string;
};

const FileInput = (props: FileInputProps) => {
  const { label, onInput, placeholder, readonly, accept } = props;
  const [imageViewURL, setImageViewURL] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<null | string>(null);

  const handleImageInput: FormEventHandler<HTMLInputElement> = (e) => {
    if (readonly) {
      e.preventDefault();
      return toast("Please wait...");
    }
    const input = e.currentTarget;
    const img = input?.files?.[0];

    if (img && img?.type?.includes?.("image") && accept === "image/*") {
      const reader = new FileReader();

      reader.onload = function (e) {
        if (typeof e?.target?.result !== "string") {
          toast.error("Invalid File.");
          removeImage();
          return;
        }

        setImageViewURL(e?.target?.result);
        onInput(img);
        setFileName(img.name);
      };

      reader.onerror = () => {
        toast.error("Invalid File.");
        removeImage();
      };

      reader.readAsDataURL(img);
    } else if (
      img &&
      accept === "application/epub+zip" &&
      img?.type?.includes("epub")
    ) {
      onInput(img);
      setFileName(img.name);
      return;
    } else {
      toast.error("Invalid File.");
      removeImage();
    }
  };

  const removeImage = () => {
    if (imageInputRef.current) imageInputRef.current.value = "";
    setImageViewURL("");
    onInput(null);
    setFileName(null);
  };

  return (
    <div className="w-full">
      <label className="font-bold block">{label}</label>
      <div
        className={
          "w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl mt-1.5 bg-white/20 justify-between items-center flex " +
          (readonly ? "readonly-input" : "")
        }
      >
        <input
          ref={imageInputRef}
          type="file"
          accept={accept}
          onInput={handleImageInput}
          placeholder={placeholder}
          onClick={(e) => {
            if (readonly) {
              e.preventDefault();
            }
          }}
          className="cursor-pointer w-full h-full absolute inset-0 opacity-0 z-30"
        />
        <p
          className={
            "select-none line-clamp-1 " +
            (fileName ? "opacity-100" : "opacity-30")
          }
        >
          {fileName ?? placeholder}
        </p>
        {imageViewURL && fileName && (
          <SafeImage
            src={imageViewURL}
            alt={fileName}
            className="h-full object-cover max-w-[50%] absolute right-5"
          />
        )}
      </div>
    </div>
  );
};

export default FileInput;
