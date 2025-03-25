import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ModalOverflow from "./ModalOverflow";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { animateModal } from "@/source/helpers/gsap.config";
import { setModal } from "@/source/store/slice/UIslice";
import { BookCopyInterface } from "@/source/types/states";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { FaTimes } from "react-icons/fa";
import gsap from "gsap";
import { ClipLoader } from "react-spinners";
import BookCopy from "../reusable/BookCopy";
import PaginatedItems from "../reusable/PaginatedItems";
import { format } from "date-fns";
import toast from "react-hot-toast";

const BorrowBookModal = () => {
  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state) => state.ui);

  const mainRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const [lockdown, setLockdown] = useState<null | number>(null);
  const [hasBorrowed, setHasBorrowed] = useState(false);
  const userID = useAppSelector((state) => state.user.data?._id);

  const [showTaken, setShowTaken] = useState(false);
  const [processing, setProcessing] = useState({
    on: "" as "borrowing" | "",
    data: "",
  });

  // pagination logic
  const _page = useRef(0);
  const [count, setCount] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  useEffect(() => {
    if (resetPagination) setResetPagination(false);
  }, [resetPagination]);

  const [data, setData] = useState({
    available: false,
    loading: true,
    error: "Failed to fetch book copies",
    copies: [],
  });

  useLayoutEffect(() => {
    if (!modal.active || modal.type !== "borrow-book" || !modal.data) {
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
        setResetPagination(true);
        _page.current = 0;
        setCount(0);
        setShowTaken(false);
        setProcessing({ on: "", data: "" });
        setLockdown(null);
        setData({
          error: "Failed to fetch book copies",
          available: false,
          loading: true,
          copies: [],
        });
        dispatch(setModal({ active: false }));
      },
    });
  };

  const hasFetchedBefore = useRef(false);
  useEffect(() => {
    const fetchCopies = async (bookID: string) => {
      setData({
        available: false,
        loading: true,
        error: "Failed to fetch tickets",
        copies: [],
      });

      try {
        const response = await getApiJson(
          routes.book.copies(
            limit,
            0,
            // "cooldownReleaseDate:asc || copyNumber:asc",
            "copyNumber:asc",
            bookID,
            false,
            userID || null
          )
        );
        if (response.error || !response.copies) {
          console.error(response);
          setData({
            available: false,
            loading: false,
            error: response.errorMessage || "Failed to fetch book copies",
            copies: [],
          });
        } else {
          setData({
            available: true,
            loading: false,
            error: "",
            copies: response.copies,
          });

          if (typeof response.count === "number") {
            setCount(response.count);
          }

          if (response.lockdown) {
            const ll = new Date(response.lockdown).getTime();
            if (!isNaN(ll)) setLockdown(ll);
          }

          if (response.hasBorrowed) {
            setHasBorrowed(true);
          }
        }
      } catch (error) {
        console.error(error);
        setData({
          available: false,
          loading: false,
          error: "Failed to fetch book copies",
          copies: [],
        });
      }
    };

    if (
      modal.active &&
      modal.type === "borrow-book" &&
      modal.data &&
      !hasFetchedBefore.current
    ) {
      hasFetchedBefore.current = true;
      fetchCopies(modal.data);
    }
  }, [modal, userID]);

  const fetchCopies = async (page: number, bookID: string, taken: boolean) => {
    if (data.loading)
      return toast.error("Please wait for the current request to finish");

    setData({
      available: false,
      loading: true,
      error: "Failed to fetch book copies",
      copies: [],
    });

    try {
      const response = await getApiJson(
        routes.book.copies(
          limit,
          page * limit,
          // "cooldownReleaseDate:asc || copyNumber:asc",
          "copyNumber:asc",
          bookID,
          taken,
          null
        )
      );
      if (response.error || !response.copies) {
        setData({
          available: false,
          loading: false,
          error: response.errorMessage || "Failed to fetch book copies",
          copies: [],
        });
      } else {
        setData({
          available: true,
          loading: false,
          error: "",
          copies: response.copies,
        });

        _page.current = page;
        if (typeof response.count === "number") {
          setCount(response.count);
        }
      }
    } catch (e) {
      console.error(e);
      setData({
        available: false,
        loading: false,
        error: "Failed to fetch book copies",
        copies: [],
      });
    }
  };

  if (!modal.active) return <></>;
  if (modal.type !== "borrow-book") return <></>;
  if (!modal.data) return <></>;

  return (
    <div className="fixed left-0 right-0 bottom-0 top-[0px] bg-[#DBDBDB]/[0.01] backdrop-blur-[10px] z-[90] flex justify-center p-5">
      <div
        ref={mainRef}
        className="gsap-init m-auto w-full max-w-[458px] rounded-[24px] bg-sub-bg shadow-lg py-8 px-6"
      >
        <div className="w-full font-proxima flex gap-4">
          <button
            disabled={data.loading || !!processing.on || !showTaken}
            onClick={() => {
              if (showTaken) {
                setResetPagination(true);
                fetchCopies(0, modal.data || "", false).catch(() => {});
                setShowTaken(false);
              }
            }}
            className={`${
              showTaken
                ? "bg-white/10 hover:bg-white/40"
                : "bg-white text-black"
            } py-1 px-5 sm:px-7 rounded-lg text-base block`}
          >
            Available
          </button>
          <button
            disabled={data.loading || !!processing.on || showTaken}
            onClick={() => {
              if (!showTaken) {
                setResetPagination(true);
                fetchCopies(0, modal.data || "", true).catch(() => {});
                setShowTaken(true);
              }
            }}
            className={`${
              showTaken
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/40"
            } py-1 px-5 sm:px-7 rounded-lg text-base block`}
          >
            Taken
          </button>
        </div>
        {lockdown && lockdown > Date.now() && (
          <div className="w-full items-center justify-center flex pt-5 px-4">
            <p>
              You are on borrowing cooldown. Please wait until{" "}
              <span className="font-bold">
                {format(lockdown, "MMMM d 'at' h:mm a")}
              </span>
            </p>
          </div>
        )}
        {hasBorrowed && (
          <div className="w-full items-center justify-center flex pt-5 px-4">
            <p>
              You are already borrowing a book. Please return the book you are
              borrowing to borrow another.
            </p>
          </div>
        )}
        <div className="w-full flex-1 py-6 px-4">
          {data.loading ? (
            <div className="w-full items-center justify-center flex p-5">
              <ClipLoader color="#fff" size={40} />
            </div>
          ) : data.available ? (
            data.copies.length === 0 ? (
              <div className="w-full items-center justify-center flex p-5">
                <p>
                  No book copies found{_page.current > 0 && " on this page"}
                </p>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 gap-4 sm:gap-6">
                {data.copies.map((copy: BookCopyInterface) => (
                  <BookCopy
                    key={copy._id}
                    processingState={[processing, setProcessing]}
                    copy={copy}
                    exit={exitWithAnimation}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="w-full items-center justify-center flex p-5">
              <p>{data.error || "An Error Occured"}</p>
            </div>
          )}
        </div>
        <div className="w-full ">
          <PaginatedItems
            count={count}
            itemsPerPage={limit}
            pageChange={(x) => fetchCopies(x, modal.data || "", showTaken)}
            reset={resetPagination}
            disabled={data.loading || !!processing.on}
          />
        </div>
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

export default BorrowBookModal;
const limit = 5;
