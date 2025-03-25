import { BookCopyInterface } from "@/source/types/states";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/source/store/hooks";
import { format } from "date-fns";

type BookCopyProps = {
  copy: BookCopyInterface;
  processingState: [
    { on: "borrowing" | ""; data: string },
    React.Dispatch<
      React.SetStateAction<{
        on: "borrowing" | "";
        data: string;
      }>
    >
  ];
  exit: () => void;
};
const BookCopy = (props: BookCopyProps) => {
  const { copy, exit } = props;
  const router = useRouter();
  const [processing, setProcessing] = props.processingState;
  const available = useAppSelector((state) => state.user.available);

  const holder = useMemo(() => {
    if (!copy.holder) return null;

    if (typeof copy.holder === "string") {
      if (copy.holder === "private")
        return { holderName: "Private", holderID: "" };
      return { holderName: "Holder", holderID: copy.holder };
    } else if (copy.holder) {
      return {
        holderName: copy?.holder?.name || "Holder",
        holderID: copy?.holder?._id || "",
      };
    } else {
      return null;
    }
  }, [copy.holder]);

  const timestamps = useMemo(() => {
    const holdStartDate = copy.holdStartDate
      ? new Date(copy.holdStartDate)
      : null;
    const holdEndDate = copy.holdEndDate ? new Date(copy.holdEndDate) : null;

    return {
      start:
        holdStartDate && !isNaN(holdStartDate.getTime())
          ? format(holdStartDate, "EEE, MMM d, h:mm a")
          : null,
      end:
        holdEndDate && !isNaN(holdEndDate.getTime())
          ? format(holdEndDate, "EEE, MMM d, h:mm a")
          : null,
    };
  }, [copy.holdEndDate, copy.holdStartDate]);

  const borrowBook = async () => {
    if (!available) return toast.error("Please sign in to borrow a book");
    if (copy.holder) return toast.error("Book is already borrowed");
    if (copy.cooldownReleaseDate) return toast.error("Book is on cooldown");

    try {
      setProcessing({ on: "borrowing", data: copy._id });

      const response = await postApiJson(routes.book.borrow, {
        bookID: copy.book,
        copyNumber: copy.copyNumber,
      });

      if (response.error || !response.bookCopy) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to borrow book");
      } else {
        toast.success("Book Borrowed successfully");
        exit();
        router.push("/my-books");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to borrow book");
    }
    setProcessing({ on: "", data: "" });
  };

  return (
    <div className="text-sm sm:text-base font-proxima flex flex-col gap-y-1">
      <div className="flex items-center justify-between gap-x-5 gap-y-1">
        <h3 className="font-bold text-base sm:text-xl">
          Copy #{copy.copyNumber}
        </h3>
        {!copy.holder ? (
          <div className="flex-1 flex">
            <button
              onClick={borrowBook}
              disabled={!!processing.on || !!copy.cooldownReleaseDate}
              className="text-white bg-highlight hover:opacity-50 py-1 px-2 sm:px-3 rounded-lg flex items-center gap-1.5 max-w-[150px] sm:max-w-[200px] ml-auto"
            >
              <span className="line-clamp-1">
                {copy.cooldownReleaseDate ? "On Cooldown" : "Borrow"}
              </span>
              {processing.on === "borrowing" &&
                processing.data === copy._id && (
                  <ClipLoader color="#fff" size={15} />
                )}
            </button>
          </div>
        ) : !!holder ? (
          <div className="flex-1 flex">
            {holder.holderID ? (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`/profile/${holder.holderID}`}
                className="text-white bg-bad-red/40 py-1 px-2 sm:px-3 rounded-lg flex items-center gap-1.5 max-w-[150px] sm:max-w-[200px] ml-auto"
              >
                <span className="line-clamp-1">
                  Taken by {holder.holderName}
                </span>
              </Link>
            ) : (
              <button
                disabled={true}
                className="text-white bg-bad-red/40 py-1 px-2 sm:px-3 rounded-lg flex items-center gap-1.5 max-w-[150px] sm:max-w-[200px] ml-auto"
              >
                <span className="line-clamp-1">Private</span>
              </button>
            )}
          </div>
        ) : null}
      </div>
      {(timestamps.start || timestamps.end) && (
        <div className="flex justify-between gap-1.5 text-xs sm:text-sm">
          {timestamps.start && (
            <p className="line-clamp-1">{timestamps.start}</p>
          )}
          {timestamps.start && timestamps.end && <p>-</p>}
          {timestamps.end && <p className="line-clamp-1">{timestamps.end}</p>}
        </div>
      )}
    </div>
  );
};
export default BookCopy;
