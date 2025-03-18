import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { validateAddress } from "@/source/helpers";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { setModal } from "@/source/store/slice/UIslice";
import { setUserAuthor } from "@/source/store/slice/userSlice";
import { midProfileProps } from "@/source/types/misc";
import { FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { FaInfo, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const AuthorStatus = ({ profileProcessing }: midProfileProps) => {
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = profileProcessing;
  const { status, ticketID } = useAppSelector((state) => state.user).data!
    .author;

  const [showForm, setShowForm] = useState(false);
  const [wallet, setWallet] = useState("");
  const [messageForReviewer, setMessageForReviewer] = useState("");
  const formHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (processing) return toast.error("Please wait for the current process");
    if (status === "pending-approval" || status === "pending-removal")
      return toast.error("Please wait for the admin to review your request");
    if (status === "rejected")
      return toast.error("Your previous author request has been rejected");
    if (!messageForReviewer.trim())
      return toast.error("Please enter a message for the reviewer");
    if (status === "in-active" && !wallet.trim())
      return toast.error("Please enter your wallet address");
    if (status === "in-active" && !validateAddress(wallet.trim()))
      return toast.error("Please enter a valid wallet address");

    try {
      setProcessing("creating-author-ticket");

      const response = await postApiJson(routes.ticket.author.create, {
        wallet: wallet.trim(),
        messageForReviewer: messageForReviewer.trim(),
      });

      if (response.error || !response.author) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to create author ticket");
      } else {
        dispatch(setUserAuthor(response.author));
        toast.success("Author ticket created successfully");

        setShowForm(false);
        setWallet("");
        setMessageForReviewer("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create author ticket");
    }

    setProcessing("");
  };

  const cancelAuthorTicket = async () => {
    if (processing) return toast.error("Please wait for the current process");
    if (status === "approved") return toast.error("You are already an author");
    if (status === "in-active")
      return toast.error("You do not have an active author ticket");
    if (status === "rejected")
      return toast.error("Your previous author request has been rejected");

    try {
      setProcessing("canceling-author-ticket");

      const response = await postApiJson(routes.ticket.author.cancel);
      if (response.error || !response.author) {
        console.error(response);
        toast.error(response.errorMessage || "Failed to cancel author ticket");
      } else {
        dispatch(setUserAuthor(response.author));
        toast.success("Author ticket cancel successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel author ticket");
    }

    setProcessing("");
  };

  return (
    <div className="w-full">
      <p className="block sm:hidden pb-2 text-right">
        {status === "approved" ? "You are an author" : "You are not an author"}
      </p>
      <div className="flex items-center gap-2.5 max-sm:justify-end">
        <p className="flex-1 max-sm:hidden">
          {status === "approved"
            ? "You are an author"
            : "You are not an author"}
        </p>
        {status === "pending-approval" || status === "pending-removal" ? (
          <button
            onClick={cancelAuthorTicket}
            disabled={!!processing}
            className="bg-highlight hover:bg-highlight-dark text-sm sm:text-base py-2 px-4 rounded-[10px] flex items-center gap-1.5 justify-center"
          >
            {status === "pending-approval"
              ? "Cancel Pending Approval"
              : "Cancel Pending Removal"}
            {processing === "canceling-author-ticket" && (
              <ClipLoader color="#fff" size={18} />
            )}
          </button>
        ) : !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            disabled={!!processing || status === "rejected"}
            className={
              "text-sm sm:text-base py-2 px-4 rounded-[10px] " +
              (status === "rejected"
                ? "bg-bad-red"
                : "bg-highlight hover:bg-highlight-dark")
            }
          >
            {status === "approved"
              ? "Revoke Authorship"
              : status === "rejected"
              ? "Rejected"
              : "Become an Author"}
          </button>
        ) : (
          <button
            onClick={() => setShowForm(false)}
            disabled={!!processing}
            className="bg-bad-red/20 hover:rotate-270 transition-transform duration-300 w-10 h-10 flex items-center justify-center rounded-full"
          >
            <FaTimes />
          </button>
        )}
        {ticketID && (
          <button
            title="View Current Author Ticket"
            onClick={() =>
              dispatch(setModal({ active: true, type: "author-ticket" }))
            }
            disabled={!!processing}
            className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/30"
          >
            <FaInfo />
          </button>
        )}
      </div>
      {showForm && (
        <form onSubmit={formHandler} className="mt-2 flex flex-col gap-1.5">
          {status === "in-active" && (
            <input
              type="text"
              placeholder="Solana USDC Wallet Address"
              readOnly={!!processing}
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="bg-white/20 px-5 py-3.5 w-full rounded-xl"
            />
          )}
          <textarea
            placeholder="Message for the reviewer"
            value={messageForReviewer}
            onChange={(e) => setMessageForReviewer(e.target.value)}
            readOnly={!!processing}
            rows={4}
            className="bg-white/20 px-5 py-3.5 w-full rounded-xl overflow-auto"
          />
          <button
            type="submit"
            disabled={!!processing}
            className="bg-highlight hover:bg-highlight-dark text-sm sm:text-base py-3 px-4 rounded-xl flex items-center justify-center gap-1.5"
          >
            Create Ticket
            {processing === "creating-author-ticket" && (
              <ClipLoader color="#fff" size={18} />
            )}
          </button>
        </form>
      )}
    </div>
  );
};
export default AuthorStatus;
