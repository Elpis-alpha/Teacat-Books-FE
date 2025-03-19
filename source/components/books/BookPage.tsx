"use client";
import {
  BookInterface,
  SimpleBookPageMyData,
  SimpleBookPageReview,
} from "@/source/types/states";
import { ClipLoader } from "react-spinners";
import SafeImage from "../reusable/SafeImage";

const BookPage = ({
  book,
}: {
  book: BookInterface;
  myData: SimpleBookPageMyData;
  review: SimpleBookPageReview;
}) => {
  return (
    <div className="w-full py-10 sm:py-[60px] px-6 md:px-10 xl:px-16 flex-1 flex items-center justify-center">
      <div className="max-w-[600px] mx-auto text-xl flex flex-col items-center">
        <div className="w-[200px] h-[200px] mx-auto">
          <SafeImage
            src={makeImageSmaller(book.mainImage)}
            alt={book.title + " Profile"}
            className="w-full h-full rounded-full z-10 absolute inset-0 object-cover border-white border-1"
          />
          <div className="bg-black/50 w-full h-full rounded-full absolute z-0 flex items-center justify-center">
            <ClipLoader color="#fff" size={30} />
          </div>
        </div>
        <div className="text-center mt-4">
          <h2 className="font-proxima font-bold text-2xl sm:text-4xl">
            {book.title}
          </h2>
          <p className="pt-1 text-base sm:text-lg">{book.description}</p>
        </div>
      </div>
    </div>
  );
};
export default BookPage;
const makeImageSmaller = (imageURL = "c") => {
  return imageURL.replace("/upload/", `/upload/c_scale,w_200/`);
};
