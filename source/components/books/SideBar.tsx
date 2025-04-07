import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { BookFilterType, BookSortType } from "@/source/types/misc";
import { SimpleUser, TagType } from "@/source/types/states";
import toast from "react-hot-toast";
import { FaCircleDown, FaCircleUp } from "react-icons/fa6";
import { Dispatch, SetStateAction } from "react";
import MultiTextInputV2 from "../reusable/MultiTextInputV2";

interface SideBarProps {
  disabled: boolean;
  filter: BookFilterType;
  sort: BookSortType;
  author: SimpleUser | null;
  fetchViaFilter: (filter: BookFilterType) => void;
  fetchViaSort: (sort: BookSortType) => void;
  fetchViaTags: (tags: TagType[]) => void;

  tags: TagType[];
  setTags: Dispatch<SetStateAction<TagType[]>>;
}
const SideBar = (props: SideBarProps) => {
  const { disabled, filter, sort, author } = props;

  return (
    <div className="block w-full h-full font-bold text-lg sm:text-xl max-slg:py-10 max-slg:px-8 overflow-auto">
      <h3 className="text-2xl mb-4">Tag</h3>
      <div className="">
        <MultiTextInputV2
          value={props.tags.map((x) => ({ id: x.slug, text: x.title }))}
          onChange={(val) => {
            props.setTags(val.map((x) => ({ slug: x.id, title: x.text })));
            props.fetchViaTags(val.map((x) => ({ slug: x.id, title: x.text })));
          }}
          readonly={disabled}
          getValue={async (q) => {
            if (!q || q.trim().length < 1) return null;
            const res = await getApiJson(routes.tag.one(q));

            const id = res?.tag?.slug;
            const text = res?.tag?.title;

            if (typeof id !== "string" || typeof text !== "string") {
              toast.error("Failed to add.");
              return null;
            }
            return { id, text };
          }}
          searchValue={async (q) => {
            if (!q || q.trim().length < 1) return null;
            const res = await getApiJson(routes.tag.search(q));

            const tags = res?.tags;

            if (typeof tags !== "object" || !Array.isArray(tags)) {
              return null;
            }
            return tags.map((x) => ({
              id: x.slug || "untitled",
              text: x.title || "Untitled",
            }));
          }}
          placeholder="Tag"
          smallerPaddings
        />
      </div>
      <h3 className="text-2xl mb-4 mt-8">Filters</h3>
      <div className="flex flex-col gap-3 items-start ">
        <button
          disabled={disabled}
          className={
            classes.filter +
            (filter.type === null ? classes.active : classes.inactive)
          }
          onClick={() => props.fetchViaFilter({ type: null })}
        >
          All Books
        </button>
        {author && (
          <button
            disabled={disabled}
            className={
              classes.filter +
              (filter.type === "author" ? classes.active : classes.inactive)
            }
            onClick={() =>
              props.fetchViaFilter({ type: "author", authorID: author._id })
            }
          >
            <span className={classes.inner}>{"Author: " + author.name}</span>
          </button>
        )}
        <button
          disabled={disabled}
          className={
            classes.filter +
            (filter.type === "new-books" ? classes.active : classes.inactive)
          }
          onClick={() => props.fetchViaFilter({ type: "new-books" })}
        >
          <span className={classes.inner}>New Books</span>
        </button>
        <button
          disabled={disabled}
          className={
            classes.filter +
            (filter.type === "ongoing-books"
              ? classes.active
              : classes.inactive)
          }
          onClick={() => props.fetchViaFilter({ type: "ongoing-books" })}
        >
          <span className={classes.inner}>Ongoing Books</span>
        </button>
        <button
          disabled={disabled}
          className={
            classes.filter +
            (filter.type === "completed-books"
              ? classes.active
              : classes.inactive)
          }
          onClick={() => props.fetchViaFilter({ type: "completed-books" })}
        >
          <span className={classes.inner}>Completed Books</span>
        </button>
      </div>
      <h3 className="text-2xl mb-4 mt-8">Sort</h3>
      <div className="flex flex-col gap-3 items-start ">
        <button // Title
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "title" ? classes.active : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "title",
              order:
                sort.type === "title" && sort.order === "asc" ? "desc" : "asc",
            });
          }}
        >
          <span className={classes.inner}>Title</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "title" && sort.order === "desc" ? (
            <FaCircleUp className="text-xl" />
          ) : (
            <FaCircleDown className="text-xl" />
          )}
        </button>
        <button // Price
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "price" ? classes.active : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "price",
              order:
                sort.type === "price" && sort.order === "asc" ? "desc" : "asc",
            });
          }}
        >
          <span className={classes.inner}>Price</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "price" && sort.order === "desc" ? (
            <FaCircleUp className="text-xl" />
          ) : (
            <FaCircleDown className="text-xl" />
          )}
        </button>
        <button // Recent
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "epubUpdatedAt" ? classes.active : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "epubUpdatedAt",
              order:
                sort.type === "epubUpdatedAt" && sort.order === "desc"
                  ? "asc"
                  : "desc",
            });
          }}
        >
          <span className={classes.inner}>Recent</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "epubUpdatedAt" && sort.order === "asc" ? (
            <FaCircleDown className="text-xl" />
          ) : (
            <FaCircleUp className="text-xl" />
          )}
        </button>
        <button // Rating
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "averageRating" ? classes.active : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "averageRating",
              order:
                sort.type === "averageRating" && sort.order === "desc"
                  ? "asc"
                  : "desc",
            });
          }}
        >
          <span className={classes.inner}>Rating</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "averageRating" && sort.order === "asc" ? (
            <FaCircleDown className="text-xl" />
          ) : (
            <FaCircleUp className="text-xl" />
          )}
        </button>
        <button // Reviews
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "numberOfReviews"
              ? classes.active
              : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "numberOfReviews",
              order:
                sort.type === "numberOfReviews" && sort.order === "desc"
                  ? "asc"
                  : "desc",
            });
          }}
        >
          <span className={classes.inner}>Reviews</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "numberOfReviews" && sort.order === "asc" ? (
            <FaCircleDown className="text-xl" />
          ) : (
            <FaCircleUp className="text-xl" />
          )}
        </button>
        <button // Published
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "createdAt" ? classes.active : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "createdAt",
              order:
                sort.type === "createdAt" && sort.order === "desc"
                  ? "asc"
                  : "desc",
            });
          }}
        >
          <span className={classes.inner}>Published</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "createdAt" && sort.order === "asc" ? (
            <FaCircleDown className="text-xl" />
          ) : (
            <FaCircleUp className="text-xl" />
          )}
        </button>
        <button // Availability
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "availableCopies"
              ? classes.active
              : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "availableCopies",
              order:
                sort.type === "availableCopies" && sort.order === "desc"
                  ? "asc"
                  : "desc",
            });
          }}
        >
          <span className={classes.inner}>Availability</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "availableCopies" && sort.order === "asc" ? (
            <FaCircleDown className="text-xl" />
          ) : (
            <FaCircleUp className="text-xl" />
          )}
        </button>
        <button // Word Count
          disabled={disabled}
          className={
            classes.initial +
            (sort.type === "wordCount" ? classes.active : classes.inactive)
          }
          onClick={() => {
            props.fetchViaSort({
              type: "wordCount",
              order:
                sort.type === "wordCount" && sort.order === "desc"
                  ? "asc"
                  : "desc",
            });
          }}
        >
          <span className={classes.inner}>Word Count</span>
          <span className="bg-current h-5 w-[3px]" />
          {sort.type === "wordCount" && sort.order === "asc" ? (
            <FaCircleDown className="text-xl" />
          ) : (
            <FaCircleUp className="text-xl" />
          )}
        </button>
      </div>
    </div>
  );
};
export default SideBar;

// export type BookSortType =
//   | { type: "averageRating"; order: "desc" | "asc" }
//   | { type: "numberOfReviews"; order: "desc" | "asc" }
//   | { type: "createdAt"; order: "desc" | "asc" }
//   | { type: "epubUpdatedAt"; order: "desc" | "asc" }
//   | { type: "title"; order: "desc" | "asc" }
//   | { type: "wordCount"; order: "desc" | "asc" }
//   | { type: "availableCopies"; order: "desc" | "asc" }
//   | { type: "price"; order: "desc" | "asc" };

// export type BookFilterType =
//   | { type: null }
//   | { type: "new-books" }
//   | { type: "completed-books" }
//   | { type: "ongoing-books" }

//   | { type: "author"; authorID: string };
const classes = {
  initial:
    "px-5 py-2 rounded-lg border-white border-3 transition  duration-300 flex items-center justify-start gap-3 text-left ",
  active: "bg-white text-black",
  inactive: "bg-transparent text-white",
  inner: "line-clamp-1",
  filter:
    "px-5 py-2 rounded-lg border-white border-3 transition duration-300 line-clamp-1 text-left ",
};
