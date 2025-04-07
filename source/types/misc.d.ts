import { Dispatch, SetStateAction } from "react";
import { BookInterface } from "./states";

export type profileProcessing =
  | ""
  | "name"
  | "bio"
  | "keepBorrowHistoryPrivate"
  | "image"
  | "remove-image"
  | "changing-password"
  | "connecting-twitter"
  | "disconnecting-twitter"
  | "connecting-discord"
  | "disconnecting-discord"
  | "connecting-google"
  | "creating-author-ticket"
  | "canceling-author-ticket";
export type profileProcessingState = [
  profileProcessing,
  Dispatch<SetStateAction<profileProcessing>>
];

export type midProfileProps = {
  profileProcessing: profileProcessingState;
};

export type BookFilterType =
  | { type: null }
  | { type: "new-books" }
  | { type: "completed-books" }
  | { type: "ongoing-books" }
  | { type: "author"; authorID: string };

export type BookSortType =
  | { type: "averageRating"; order: "desc" | "asc" }
  | { type: "numberOfReviews"; order: "desc" | "asc" }
  | { type: "createdAt"; order: "desc" | "asc" }
  | { type: "epubUpdatedAt"; order: "desc" | "asc" }
  | { type: "title"; order: "desc" | "asc" }
  | { type: "wordCount"; order: "desc" | "asc" }
  | { type: "availableCopies"; order: "desc" | "asc" }
  | { type: "price"; order: "desc" | "asc" };

export interface BrowseBooksData {
  available: boolean;
  loading: boolean;
  error: string;
  books: BookInterface[];
  mine: Record<string, "bought" | "borrowed">;
}

export type fetchBooksType = (
  page: number,
  sort: BookSortType,
  filter: BookFilterType,
  searchValue: string | null,
  slugs: string[]
) => Promise<void>;
