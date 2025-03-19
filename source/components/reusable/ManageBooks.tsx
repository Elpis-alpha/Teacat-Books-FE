"use client";

import { useEffect, useRef, useState } from "react";
import PaginatedItems from "./PaginatedItems";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { ClipLoader } from "react-spinners";
import { BookInterface } from "@/source/types/states";
import { useAppSelector } from "@/source/store/hooks";
import BookToManage from "./BookToManage";

const ManageBooks = ({ viewer }: { viewer: "author" | "admin" }) => {
  const userID = useAppSelector((state) => state.user.data?._id || "");
  const [searchValue, setSearchValue] = useState("");
  const processingState = useState({
    on: "" as "ticketing" | "",
    data: "",
  });
  const processing = !!processingState[0].on;

  const [data, setData] = useState({
    available: false,
    loading: true,
    error: "Failed to fetch books",
    books: [],
  });

  // pagination logic
  const _page = useRef(0);
  const [count, setCount] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  useEffect(() => {
    if (resetPagination) setResetPagination(false);
  }, [resetPagination]);

  useEffect(() => {
    const fetchBooks = async () => {
      setData({
        available: false,
        loading: true,
        error: "Failed to fetch books",
        books: [],
      });

      try {
        const response = await getApiJson(
          routes.book.all(
            limit,
            0,
            "createdAt:asc",
            null,
            viewer === "admin" ? null : userID,
            null,
            null
          )
        );
        if (response.error || !response.books) {
          setData({
            available: false,
            loading: false,
            error: response.errorMessage || "Failed to fetch books",
            books: [],
          });
        } else {
          setData({
            available: true,
            loading: false,
            error: "",
            books: response.books,
          });

          if (typeof response.count === "number") {
            setCount(response.count);
          }
        }
      } catch (e) {
        console.error(e);
        setData({
          available: false,
          loading: false,
          error: "Failed to fetch books",
          books: [],
        });
      }
    };

    fetchBooks();
  }, [userID, viewer]);

  const fetchBooks = async (page: number, text: string | null = null) => {
    setData({
      available: false,
      loading: true,
      error: "Failed to fetch books",
      books: [],
    });

    try {
      const response = await getApiJson(
        routes.book.all(
          limit,
          page * limit,
          "createdAt:desc",
          null,
          viewer === "admin" ? null : userID,
          text || null,
          null
        )
      );
      if (response.error || !response.books) {
        setData({
          available: false,
          loading: false,
          error: response.errorMessage || "Failed to fetch books",
          books: [],
        });
      } else {
        setData({
          available: true,
          loading: false,
          error: "",
          books: response.books,
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
        error: "Failed to fetch books",
        books: [],
      });
    }
  };

  const handleSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (searchValue.trim().length === 0) {
      setResetPagination(true);
      fetchBooks(0, null).catch(() => {});
      return;
    }

    const text = searchValue.trim() || null;

    setResetPagination(true);
    fetchBooks(0, text).catch(() => {});
  };

  return (
    <div className="w-full px-6 md:px-10 xl:px-16 py-4 sm:py-10 text-base sm:text-xl flex-1 flex flex-col font-proxima">
      <div className="max-w-[1640px] w-full flex-1 flex flex-col items-center justify-center gap-5 sm:gap-10 mx-auto">
        <h2 className="w-full font-proxima font-bold text-xl sm:text-4xl">
          Manage Books
        </h2>
        <div className="w-full">
          <form
            onSubmit={handleSearch}
            className="w-full flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              readOnly={data.loading || processing}
              name="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search titles e.g. Benefactor's Legacy"
              className="w-full flex-1 px-7 py-2.5 rounded-lg bg-white/5"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={data.loading || processing}
                className="bg-highlight hover:bg-highlight-dark py-2 sm:py-2.5 px-7 rounded-lg"
              >
                Search
              </button>
              <button
                type="button"
                disabled={data.loading || processing}
                onClick={() => {
                  setResetPagination(true);
                  setSearchValue("");
                  fetchBooks(0, null).catch(() => {});
                }}
                className="bg-transparent border-2 py-1.5 sm:py-2 px-7 rounded-lg hover:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="w-full flex-1">
          {data.loading ? (
            <div className="w-full items-center justify-center flex p-5">
              <ClipLoader color="#fff" size={40} />
            </div>
          ) : data.available ? (
            data.books.length === 0 ? (
              <div className="w-full items-center justify-center flex p-5">
                <p>No books found{_page.current > 0 && " on this page"}</p>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {data.books.map((book: BookInterface) => (
                  <BookToManage
                    key={book._id}
                    processingState={processingState}
                    book={book}
                    viewer={viewer}
                    refetch={() =>
                      fetchBooks(_page.current, searchValue.trim() || null)
                    }
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
            pageChange={(x) => fetchBooks(x, searchValue.trim() || null)}
            reset={resetPagination}
            disabled={data.loading || processing}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
const limit = 6;
