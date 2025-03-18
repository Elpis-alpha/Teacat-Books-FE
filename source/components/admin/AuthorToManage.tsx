import { SimpleUser } from "@/source/types/states";
import Link from "next/link";
import toast from "react-hot-toast";
import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import SafeImage from "../reusable/SafeImage";
import { ClipLoader } from "react-spinners";

type AuthorToManageProps = {
  author: SimpleUser;
  processingState: [
    { on: "removing" | ""; data: string },
    React.Dispatch<
      React.SetStateAction<{
        on: "removing" | "";
        data: string;
      }>
    >
  ];
  refetch: () => void;
};
const AuthorToManage = (props: AuthorToManageProps) => {
  const { author, refetch } = props;
  const [processingState, setProcessingState] = props.processingState;

  const removeAuthor = async () => {
    if (processingState.on) return toast("Please wait");

    try {
      setProcessingState({ on: "removing", data: author._id });

      const response = await postApiJson(routes.user.removeAuthorStatus, {
        userID: author._id,
      });

      if (response.error || !response.message) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to remove author status");
      } else {
        toast.success("Author status removed successfully");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove author status");
    }
    setProcessingState({ on: "", data: "" });
  };

  return (
    <div className="bg-sub-bg rounded-3xl py-6 px-7 text-sm sm:text-base font-proxima flex flex-col gap-4">
      <div className="">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-lg sm:text-2xl">
            <Link
              target="_blank"
              rel="noreferrer"
              href={`/profile/${author._id}`}
            >
              {author.name}
            </Link>
          </h3>
          <SafeImage
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 sm:w-16 sm:h-16 rounded-full"
          />
        </div>
        <p className="line-clamp-1">{author.bio}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={!!processingState.on}
          onClick={removeAuthor}
          className="py-1.5 px-5 rounded-lg hover:opacity-50 bg-bad-red hover:bg-bad-red-dark text-white flex items-center gap-2"
        >
          {processingState.on === "removing" &&
          processingState.data === author._id
            ? "Removing"
            : "Remove Author Status"}
          {processingState.on === "removing" &&
            processingState.data === author._id && (
              <ClipLoader color="white" size={15} />
            )}
        </button>
      </div>
    </div>
  );
};
export default AuthorToManage;
