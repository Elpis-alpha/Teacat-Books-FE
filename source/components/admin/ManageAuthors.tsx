"use client";
import { useEffect, useRef, useState } from "react";
import PaginatedItems from "../reusable/PaginatedItems";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { SimpleUser } from "@/source/types/states";
import AuthorToManage from "./AuthorToManage";

const ManageAuthors = () => {
  const [searchValue, setSearchValue] = useState("");
  const processingState = useState({
    on: "" as "removing" | "",
    data: "",
  });
  const processing = !!processingState[0].on;

  const [data, setData] = useState({
    available: false,
    loading: true,
    error: "Failed to fetch authors",
    authors: [],
  });

  // pagination logic
  const _page = useRef(0);
  const [count, setCount] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  useEffect(() => {
    if (resetPagination) setResetPagination(false);
  }, [resetPagination]);

  useEffect(() => {
    const fetchAuthors = async () => {
      setData({
        available: false,
        loading: true,
        error: "Failed to fetch authors",
        authors: [],
      });

      try {
        const response = await getApiJson(
          routes.user.all(limit, 0, "createdAt:asc", true, null)
        );
        if (response.error || !response.users) {
          setData({
            available: false,
            loading: false,
            error: response.errorMessage || "Failed to fetch authors",
            authors: [],
          });
        } else {
          setData({
            available: true,
            loading: false,
            error: "",
            authors: response.users,
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
          error: "Failed to fetch authors",
          authors: [],
        });
      }
    };

    fetchAuthors();
  }, []);

  const fetchAuthors = async (page: number, text: string | null = null) => {
    if (data.loading)
      return toast.error("Please wait for the current request to finish");

    setData({
      available: false,
      loading: true,
      error: "Failed to fetch authors",
      authors: [],
    });

    try {
      const response = await getApiJson(
        routes.user.all(limit, page * limit, "createdAt:desc", true, text)
      );
      if (response.error || !response.users) {
        setData({
          available: false,
          loading: false,
          error: response.errorMessage || "Failed to fetch authors",
          authors: [],
        });
      } else {
        setData({
          available: true,
          loading: false,
          error: "",
          authors: response.users,
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
        error: "Failed to fetch authors",
        authors: [],
      });
    }
  };

  const handleSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!searchValue) return toast.error("Please enter a search text");

    const text = searchValue.trim() || null;

    setResetPagination(true);
    fetchAuthors(0, text).catch(() => {});
  };

  return (
    <div className="w-full px-6 md:px-10 xl:px-16 py-4 sm:py-10 text-base sm:text-xl flex-1 flex flex-col font-proxima">
      <div className="max-w-[1640px] w-full flex-1 flex flex-col items-center justify-center gap-5 sm:gap-10 mx-auto">
        <h2 className="w-full font-proxima font-bold text-xl sm:text-4xl">
          Manage Authors
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
              placeholder="Search authors e.g. Alex Cinder"
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
                  fetchAuthors(0, null).catch(() => {});
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
            data.authors.length === 0 ? (
              <div className="w-full items-center justify-center flex p-5">
                <p>No authors found{_page.current > 0 && " on this page"}</p>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {data.authors.map((author: SimpleUser) => (
                  <AuthorToManage
                    key={author._id}
                    processingState={processingState}
                    author={author}
                    refetch={() =>
                      fetchAuthors(_page.current, searchValue.trim() || null)
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
            pageChange={(x) => fetchAuthors(x, searchValue.trim() || null)}
            reset={resetPagination}
            disabled={data.loading || processing}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageAuthors;
const limit = 6;
