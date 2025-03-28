"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PaginatedItems from "../reusable/PaginatedItems";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { MyBookPageData } from "@/source/types/states";
import BoughtBook, { BoughtBookSkeleton } from "./BoughtBook";
import BorrowedBook, { BorrowedBookSkeleton } from "./BorrowedBook";
import toast from "react-hot-toast";
import { useAppSelector } from "@/source/store/hooks";

const MyBooksPage = () => {
  const [processing, setProcessing] = useState("" as "returning" | "");

  const [data, setData] = useState({
    available: "none" as "none" | "all" | "borrowed",
    loading: "all" as "all" | "bought" | "none",
    error: "Failed to fetch your books",
    mine: null as MyBookPageData | null,
  });

  // pagination logic
  const _page = useRef(0);
  const [count, setCount] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  useEffect(() => {
    if (resetPagination) setResetPagination(false);
  }, [resetPagination]);

  const updateMyBooks = useAppSelector((store) => store.ui.updateMyBooks);
  const previousChaged = useRef(updateMyBooks - 1);

  useEffect(() => {
    const fetchMyBooks = async () => {
      setData({
        available: "none",
        loading: "all",
        error: "Failed to fetch your books",
        mine: null,
      });

      try {
        const response = await getApiJson(
          routes.book.mine(limit, 0, "createdAt:desc", false)
        );
        if (response.error || !response.books) {
          setData({
            available: "none",
            loading: "none",
            error: response.errorMessage || "Failed to fetch your books",
            mine: null,
          });
        } else {
          setData({
            available: "all",
            loading: "none",
            error: "",
            mine: response.books,
          });

          if (typeof response.count === "number") {
            setCount(response.count);
          }
        }
      } catch (e) {
        console.error(e);
        setData({
          available: "none",
          loading: "none",
          error: "Failed to fetch your books",
          mine: null,
        });
      }
    };

    if (previousChaged.current !== updateMyBooks) {
      previousChaged.current = updateMyBooks;
      fetchMyBooks();
    }
  }, [updateMyBooks]);

  const fetchMyBooks = async (page: number, all: boolean) => {
    if (data.loading !== "none")
      return toast.error("Please wait for the current request to finish.");

    setData((p) => ({
      available: all ? "all" : "borrowed",
      loading: all ? "all" : "bought",
      error: "Failed to fetch your books",
      mine: all
        ? null
        : {
            borrowed: p.mine?.borrowed || null,
            bought: [],
          },
    }));

    try {
      const response = await getApiJson(
        routes.book.mine(limit, page * limit, "createdAt:desc", !all)
      );
      if (response.error || !response.books) {
        setData((p) => ({
          available: all ? "all" : "borrowed",
          loading: "none",
          error: response.errorMessage || "Failed to fetch your books",
          mine: all
            ? null
            : {
                borrowed: p.mine?.borrowed || null,
                bought: [],
              },
        }));
      } else {
        setData((p) => ({
          available: "all",
          loading: "none",
          error: "",
          mine: all
            ? response.books
            : {
                borrowed: p.mine?.borrowed || null,
                bought: response?.books?.bought || [],
              },
        }));

        _page.current = page;
        if (typeof response.count === "number") {
          setCount(response.count);
        }
      }
    } catch (e) {
      console.error(e);
      setData((p) => ({
        available: all ? "all" : "borrowed",
        loading: "none",
        error: "Failed to fetch your books",
        mine: all
          ? null
          : {
              borrowed: p.mine?.borrowed || null,
              bought: [],
            },
      }));
    }
  };

  const { borrowedLoading, boughtLoading, borrowedAvailable, boughtAvailable } =
    useMemo(() => {
      return {
        borrowedLoading: data.loading === "all",
        boughtLoading: data.loading === "bought" || data.loading === "all",
        borrowedAvailable:
          data.available === "all" || data.available === "borrowed",
        boughtAvailable: data.available === "all",
      };
    }, [data.loading, data.available]);

  return (
    <div className="w-full px-6 md:px-10 xl:px-16 py-4 sm:py-10 text-base sm:text-xl flex-1 flex flex-col font-proxima">
      <div className="max-w-[1640px] w-full flex-1 flex flex-col items-center justify-center gap-5 sm:gap-10 mx-auto">
        <h2 className="w-full font-proxima font-bold text-xl sm:text-4xl">
          Borrowed Book
        </h2>
        <div className="w-full">
          {borrowedLoading ? (
            <div className="w-full">
              <BorrowedBookSkeleton />
            </div>
          ) : borrowedAvailable && data.mine ? (
            !data.mine.borrowed ? (
              <div className="w-full items-center justify-center flex p-5">
                <p>You have not borrowed any book</p>
              </div>
            ) : (
              <div className="w-full ">
                <BorrowedBook
                  refetch={() => fetchMyBooks(_page.current, true)}
                  book={data.mine.borrowed.book}
                  copy={data.mine.borrowed.copy}
                  setProcessing={(x) => setProcessing(x)}
                  disabled={data.loading !== "none" || !!processing}
                />
              </div>
            )
          ) : (
            <div className="w-full items-center justify-center flex p-5">
              <p>{data.error || "An Error Occured"}</p>
            </div>
          )}
        </div>
        <h2 className="w-full font-proxima font-bold text-xl sm:text-4xl mt-5 sm:mt-10">
          Purchased Books
        </h2>
        <div className="w-full flex-1">
          {boughtLoading ? (
            <div className="w-full flex flex-col gap-4 sm:gap-6">
              {Array(limit)
                .fill("")
                .map((_, i) => (
                  <BoughtBookSkeleton key={"limit-kldjldsf-=-" + i} />
                ))}
            </div>
          ) : boughtAvailable && data.mine ? (
            data.mine.bought.length === 0 ? (
              <div className="w-full items-center justify-center flex p-5">
                <p>You have not bought any book.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4 sm:gap-6">
                {data.mine.bought.map((item) => (
                  <BoughtBook
                    key={item.bought._id}
                    book={item.book}
                    bought={item.bought}
                    epubURL={item.epubURL}
                    disabled={data.loading !== "none" || !!processing}
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
            pageChange={(x) => fetchMyBooks(x, false)}
            reset={resetPagination}
            disabled={data.loading !== "none" || !!processing}
          />
        </div>
      </div>
    </div>
  );
};

export default MyBooksPage;
const limit = 5;
