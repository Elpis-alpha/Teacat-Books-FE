"use client";
import SideBar from "./SideBar";
import PaginatedItems from "../reusable/PaginatedItems";
import { Dispatch, FormEventHandler, SetStateAction } from "react";
import {
  BookFilterType,
  BookSortType,
  BrowseBooksData,
} from "@/source/types/misc";
import { SimpleUser, TagType } from "@/source/types/states";
import BookSearchItem, { BookSearchItemSkeleton } from "./BookSearchItem";

interface BrowseBookProps {
  _page: number;
  data: BrowseBooksData;
  disabled: boolean;
  count: number;
  limit: number;
  filter: BookFilterType;
  sort: BookSortType;
  resetPagination: boolean;
  author: SimpleUser | null;
  fetchViaPagination: (page: number) => void;
  handleSearch: FormEventHandler<HTMLFormElement>;
  toggleAside: () => void;
  resetSearch: () => void;
  fetchViaSort: (sort: BookSortType) => void;
  fetchViaFilter: (filter: BookFilterType) => void;
  tags: TagType[];
  setTags: Dispatch<SetStateAction<TagType[]>>;
  searchValueState: [string, React.Dispatch<React.SetStateAction<string>>];
  fetchViaTags: (tags: TagType[]) => void;
}

const BrowseBooks = (props: BrowseBookProps) => {
  const {
    _page,
    data,
    disabled,
    count,
    limit,
    author,
    filter,
    sort,
    resetPagination,
    fetchViaPagination,
    handleSearch,
    toggleAside,
    resetSearch,
    fetchViaFilter,
    fetchViaSort,
  } = props;
  const [searchValue, setSearchValue] = props.searchValueState;

  return (
    <>
      <div className="w-full px-6 md:px-10 xl:px-16 py-4 sm:py-10 text-base sm:text-xl flex-1 flex">
        <div className="max-w-[1640px] w-full flex-1 flex justify-center gap-5 sm:gap-10 mx-auto">
          <div className="w-[210px] hidden slg:block">
            <SideBar
              author={author}
              sort={sort}
              filter={filter}
              disabled={disabled}
              fetchViaFilter={fetchViaFilter}
              fetchViaSort={fetchViaSort}
              tags={props.tags}
              setTags={props.setTags}
              fetchViaTags={props.fetchViaTags}
            />
          </div>
          <div className="flex-1 flex flex-col gap-8">
            <div className="w-full">
              <form
                onSubmit={handleSearch}
                className="w-full flex flex-col slg:flex-row gap-4"
              >
                <input
                  type="text"
                  readOnly={disabled}
                  name="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search titles e.g. Benefactor's Legacy"
                  className="w-full flex-1 px-7 py-2.5 rounded-lg bg-white/5"
                  autoComplete="off"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={disabled}
                    className="bg-highlight hover:bg-highlight-dark py-1 ssm:py-2 sm:py-2.5 px-4 ssm:px-6 sm:px-7 rounded-lg"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={toggleAside}
                    className="bg-white text-black hover:opacity-50 py-1 ssm:py-2 sm:py-2.5 px-4 ssm:px-6 sm:px-7 rounded-lg block slg:hidden"
                  >
                    Filters
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={resetSearch}
                    className="bg-transparent border-2 py-1 ssm:py-1.5 sm:py-2 px-4 ssm:px-6 sm:px-7 rounded-lg hover:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
            <div className="w-full flex-1">
              {data.loading ? (
                <div className="w-full grid grid-cols-1 1_5xl:grid-cols-2 gap-4 sm:gap-6">
                  {Array(limit)
                    .fill("")
                    .map((_, i) => (
                      <BookSearchItemSkeleton key={"limit-browse-books-" + i} />
                    ))}
                </div>
              ) : data.available ? (
                data.books.length === 0 ? (
                  <div className="w-full items-center justify-center flex p-5">
                    <p>No books found{_page > 0 && " on this page"}</p>
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-1 1_5xl:grid-cols-2 gap-4 sm:gap-6">
                    {data.books.map((book) => (
                      <BookSearchItem
                        key={book._id + "jas"}
                        book={book}
                        mine={data.mine[book._id] || null}
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
            <div className="w-full">
              <PaginatedItems
                count={count}
                itemsPerPage={limit}
                pageChange={fetchViaPagination}
                reset={resetPagination}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BrowseBooks;
