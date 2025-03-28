"use client";
import { SimpleUser } from "@/source/types/states";
import { NormalPage } from "../reusable/SimplePages";
import BrowseBooks from "./BrowseBooks";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookFilterType,
  BookSortType,
  BrowseBooksData,
  fetchBooksType,
} from "@/source/types/misc";
import routes from "@/source/api/routes";
import { getApiJson } from "@/source/api";
import SideBar from "./SideBar";
import gsap from "gsap";
import ModalOverflow from "../modals/ModalOverflow";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const BrowseBooksHolder = ({
  authorData,
}: {
  authorData: SimpleUser | null;
}) => {
  const author = useRef(authorData);
  const [data, setData] = useState<BrowseBooksData>({
    available: false,
    loading: true,
    error: "Failed to fetch books",
    books: [],
    mine: {},
  });

  // pagination logic
  const _page = useRef(0);
  const [count, setCount] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  useEffect(() => {
    if (resetPagination) setResetPagination(false);
  }, [resetPagination]);

  // search, filter, sort logic
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<BookFilterType>(
    author.current
      ? { type: "author", authorID: author.current._id }
      : { type: null }
  );
  const [sort, setSort] = useState<BookSortType>({
    type: "numberOfReviews",
    order: "desc",
  });

  // initial fetch
  useEffect(() => {
    const fetchBooks = async () => {
      setData({
        available: false,
        loading: true,
        error: "Failed to fetch books",
        books: [],
        mine: {},
      });

      try {
        const response = await getApiJson(
          routes.book.all(
            limit,
            0,
            "numberOfReviews:desc",
            null,
            author.current ? author.current._id : null,
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
            mine: {},
          });
        } else {
          const mine: BrowseBooksData["mine"] = {};
          if (
            typeof response.borrowedBook === "object" &&
            response.borrowedBook
          ) {
            mine[response.borrowedBook?.book] = "borrowed";
          }
          if (
            typeof response.boughtBooks === "object" &&
            Array.isArray(response.boughtBooks)
          ) {
            response.boughtBooks?.forEach?.((book) => {
              if (book) mine[book?.book] = "bought";
            });
          }

          setData({
            available: true,
            loading: false,
            error: "",
            books: response.books,
            mine: mine,
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
          mine: {},
        });
      }
    };

    fetchBooks();
  }, []);

  // to refetch books
  const fetchBooks: fetchBooksType = useCallback(
    async (
      page: number,
      sort: BookSortType,
      filter: BookFilterType,
      searchValue: string | null
    ) => {
      if (data.loading) {
        toast.error("Please wait for the current request to finish.");
        return;
      }

      setData({
        available: false,
        loading: true,
        error: "Failed to fetch books",
        books: [],
        mine: {},
      });

      try {
        const response = await getApiJson(
          routes.book.all(
            limit,
            page * limit,
            `${sort.type}:${sort.order}`,
            filter.type === "author" ? null : filter.type,
            filter.type === "author" ? filter.authorID : null,
            searchValue,
            null
          )
        );
        if (response.error || !response.books) {
          setData({
            available: false,
            loading: false,
            error: response.errorMessage || "Failed to fetch books",
            books: [],
            mine: {},
          });
        } else {
          const mine: BrowseBooksData["mine"] = {};
          if (
            typeof response.borrowedBook === "object" &&
            response.borrowedBook
          ) {
            mine[response.borrowedBook?.book] = "borrowed";
          }
          if (
            typeof response.boughtBooks === "object" &&
            Array.isArray(response.boughtBooks)
          ) {
            response.boughtBooks?.forEach?.((book) => {
              if (book) mine[book?.book] = "bought";
            });
          }

          setData({
            available: true,
            loading: false,
            error: "",
            books: response.books,
            mine: mine,
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
          mine: {},
        });
      }
    },
    [data.loading]
  );

  // to search
  const handleSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (searchValue.trim().length === 0) {
      setResetPagination(true);
      fetchBooks(0, sort, filter, null).catch(() => {});
      return;
    }

    const text = searchValue.trim() || null;

    setResetPagination(true);
    fetchBooks(0, sort, filter, text).catch(() => {});
  };

  // ASIDE CODE
  const isChanging = useRef(false);
  const asideRef = useRef<HTMLDivElement>(null);
  const [asideIsOpen, setAsideIsOpen] = useState(false);
  const clickBlur: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const tar = e.target as HTMLDivElement | undefined;
    if (tar?.id === "aside-blur") toggleAside();
  };
  const toggleAside = () => {
    if (isChanging.current) return;
    if (!asideRef.current) return;
    const asideState = asideIsOpen;
    setAsideIsOpen((p) => !p);

    gsap
      .to(asideRef.current, {
        right: asideState ? "101vw" : "0vw",
        duration: 0.2,
        ease: "power1.inOut",
      })
      .then(() => {
        isChanging.current = false;
      });
  };

  return (
    <>
      <NormalPage useStart usePhysicalNavBar>
        <BrowseBooks
          _page={_page.current}
          data={data}
          sort={sort}
          filter={filter}
          author={author.current}
          disabled={data.loading}
          limit={limit}
          toggleAside={toggleAside}
          count={count}
          resetPagination={resetPagination}
          searchValueState={[searchValue, setSearchValue]}
          handleSearch={handleSearch}
          fetchViaPagination={(x) => {
            fetchBooks(x, sort, filter, searchValue.trim() || null);
          }}
          fetchViaFilter={(filter) => {
            setFilter(filter);
            setResetPagination(true);
            fetchBooks(0, sort, filter, searchValue.trim() || null).catch(
              () => {}
            );
          }}
          fetchViaSort={(sort) => {
            setSort(sort);
            setResetPagination(true);
            fetchBooks(0, sort, filter, searchValue.trim() || null).catch(
              () => {}
            );
          }}
          resetSearch={() => {
            setResetPagination(true);
            setSearchValue("");
            fetchBooks(0, sort, filter, null).catch(() => {});
          }}
        />
      </NormalPage>
      <aside
        ref={asideRef}
        onClick={clickBlur}
        className={`fixed slg:hidden block backdrop-blur w-full h-full top-0 bottom-0 z-60 right-[101vw] transition-all cursor-alias`}
        id="aside-blur"
      >
        <div
          className={
            "h-full w-[300px] max-w-[100vw] ml-0 mr-auto gap-[30px]  " +
            "bg-sub-bg cursor-auto"
          }
        >
          <SideBar
            sort={sort}
            filter={filter}
            author={author.current}
            disabled={data.loading}
            fetchViaFilter={(filter) => {
              toggleAside();
              setFilter(filter);
              setResetPagination(true);
              fetchBooks(0, sort, filter, searchValue.trim() || null).catch(
                () => {}
              );
            }}
            fetchViaSort={(sort) => {
              toggleAside();
              setSort(sort);
              setResetPagination(true);
              fetchBooks(0, sort, filter, searchValue.trim() || null).catch(
                () => {}
              );
            }}
          />
          <button
            onClick={toggleAside}
            className="absolute top-4 right-4 p-2 text-2xl text-red-500"
          >
            <FaTimes />
          </button>
        </div>
      </aside>
      {asideIsOpen && <ModalOverflow />}
    </>
  );
};

export default BrowseBooksHolder;
const limit = 8;
