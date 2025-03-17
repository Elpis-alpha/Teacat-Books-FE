import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ModalOverflow from "./ModalOverflow";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { animateModal } from "@/source/helpers/gsap.config";
import { setModal } from "@/source/store/slice/UIslice";
import { AuthorTicket } from "@/source/types/states";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { FaTimes } from "react-icons/fa";
import gsap from "gsap";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";

const CurrentAuthorTicket = () => {
  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state) => state.ui);
  const { data: userData } = useAppSelector((state) => state.user);

  const mainRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    if (!modal.active || modal.type !== "author-ticket") {
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
        setTicket({
          status: "loading",
          error: "Failed to fetch ticket",
          data: null,
        });
        dispatch(setModal({ active: false }));
      },
    });
  };

  const [ticket, setTicket] = useState<{
    status: "loading" | "error" | "success";
    error: string;
    data?: AuthorTicket | null;
  }>({
    status: "loading",
    error: "Failed to fetch ticket",
    data: null,
  });

  const hasFetchedBefore = useRef(false);
  useEffect(() => {
    const fetchTicket = async () => {
      setTicket((p) => ({ ...p, status: "loading", data: null }));

      try {
        const response = await getApiJson(routes.ticket.author.myTicket);
        if (response.error || !response.ticket) {
          console.error(response);
          setTicket({
            status: "error",
            error: response.errorMessage || "Failed to fetch ticket",
          });
        } else {
          setTicket({
            status: "success",
            data: response.ticket,
            error: "All is good",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (
      modal.active &&
      modal.type === "author-ticket" &&
      !hasFetchedBefore.current
    ) {
      hasFetchedBefore.current = true;
      fetchTicket();
    }
  }, [modal]);

  if (!modal.active) return <></>;
  if (modal.type !== "author-ticket") return <></>;

  return (
    <div className="fixed left-0 right-0 bottom-0 top-[0px] bg-[#DBDBDB]/[0.01] backdrop-blur-[10px] z-[90] flex justify-center p-5">
      <div
        ref={mainRef}
        className="gsap-init m-auto w-full max-w-[458px] rounded-[24px] bg-sub-bg shadow-lg py-12 pl-6 pr-3"
      >
        {ticket.data && ticket.status === "success" ? (
          <div className="pr-3 overflow-auto max-h-[70vh] text-lg">
            <div className="">
              <p></p>
              <p className="font-bold">
                {ticket.data.action === "become-author"
                  ? "Become an author"
                  : "Remove author status"}
              </p>
              <p className="text-sm ">
                Status:{" "}
                {ticket.data.status === "pending"
                  ? "Pending approval"
                  : ticket.data.status === "approved"
                  ? "Approved"
                  : ticket.data.status === "rejected"
                  ? "Rejected"
                  : "Cancelled"}
              </p>
            </div>
            <div className="pt-4">
              <p className="font-bold">Message for reviewer</p>
              <p className="text-sm">{ticket.data.messageForReviewer}</p>
            </div>
            <div className="pt-4">
              <p className="font-bold">Date requested</p>
              <p className="text-sm">
                {format(new Date(ticket.data.createdAt), "PPPP")}
              </p>
            </div>
            {ticket.data.wallet ? (
              <div className="pt-4">
                <p className="font-bold">
                  Wallet{" "}
                  <span className="text-xs font-normal">(from ticket)</span>
                </p>
                <p className="text-sm">{ticket.data.wallet}</p>
              </div>
            ) : userData?.author?.wallet ? (
              <div className="pt-4">
                <p className="font-bold">
                  Wallet{" "}
                  <span className="text-xs font-normal">(from profile)</span>
                </p>
                <p className="text-sm">{userData.author.wallet}</p>
              </div>
            ) : null}
            {ticket.data.reviewerFeedback && (
              <div className="pt-4">
                <p className="font-bold">Reviewer feedback</p>
                <p className="text-sm">{ticket.data.reviewerFeedback}</p>
              </div>
            )}
            {ticket.data.dateReviewed && (
              <div className="pt-4">
                <p className="font-bold">Date reviewed</p>
                <p className="text-sm">
                  {format(new Date(ticket.data.dateReviewed), "PPPP")}
                </p>
              </div>
            )}
          </div>
        ) : ticket.status === "loading" ? (
          <div className="w-full flex justify-center items-center p-5">
            <ClipLoader color="#fff" size={18} />
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-center p-5">
            <p>{ticket.error}</p>
          </div>
        )}

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

export default CurrentAuthorTicket;
