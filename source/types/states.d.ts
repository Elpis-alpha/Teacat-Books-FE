export interface AuthorTicket {
  action: "become-author" | "remove-author";
  author:
    | string
    | {
        _id: string;
        username: string;
        avatar: string;
      };
  messageForReviewer: string;
  status: "pending" | "approved" | "rejected" | "cancelled";

  reviewer?: string;
  reviewerFeedback?: string;
  dateReviewed?: Date;
  wallet?: string;

  createdAt: string;
  updatedAt: string;
}

export interface OneUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isAuthor: boolean;
  isAdmin: boolean;
  mail: string;
  twitter: {
    active: boolean;
    id?: string;
    username?: string;
  };
  discord: {
    active: boolean;
    id?: string;
    username?: string;
  };
}

export interface BookTicketInterface {
  _id: string;
  ticketNumber: number;
  action:
    | "new-book"
    | "update-image"
    | "update-meta"
    | "update-text"
    | "delete-book";

  author: string | { _id: string; name: string; avatar: string };

  bookID?: string;
  cachedBookName?: string;

  messageForReviewer: string;
  reviewerFeedback?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  dateReviewed?: string;

  newBook?: TicketNewBook;
  updateImage?: {
    imageType: "main" | "cover";
    oldImageURL: string;
    newImageURL: string;
  };
  updateMeta?: {
    textType: "title" | "description";
    oldText: string;
    newText: string;
  };
  updateText?: {
    oldEpubURL: string;
    newEpubURL: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface AuthorTicketInterface {
  _id: string;
  ticketNumber: number;
  action: "become-author" | "remove-author";
  author: string | { _id: string; name: string; avatar: string };
  messageForReviewer: string;
  status: "pending" | "approved" | "rejected" | "cancelled";

  reviewer?: string;
  reviewerFeedback?: string;
  dateReviewed?: string;
  wallet?: string;

  createdAt: string;
  updatedAt: string;
}

export interface TicketNewBook {
  title: string;
  description: string;
  price: number;
  borrowableCopies: number;
  mainImage: string;
  coverImage: string;
  epubURL?: string;
  allowsLLM: boolean;
  wallet: string;
}

export interface BookInterface {
  _id: string;

  author: string | { _id: string; name: string; avatar: string };
  title: string;
  description: string;
  price: number;
  mediaIDLength: number;

  mainImage: string;
  coverImage: string;

  featured?: boolean;

  epubUpdatedAt: Date;
  epubURL?: string;

  wordCount: number;
  isCompleted: boolean;

  helioPayLinkID: string;

  totalCopies: number;
  availableCopies: number;

  numberOfReviews: number;
  sumOfReviews: number;
  averageRating: number;

  allowsLLM: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface BookReviewInterface {
  _id: string;

  book: string | { _id: string; title: string };
  user: string | SimpleUser;

  stars: number;
  reviewText?: string;
  status: "pending" | "approved" | "rejected";

  createdAt: string;
  updatedAt: string;
}

export interface BookReviewNormalInterface {
  _id: string;
  reviewText: string;
  stars: number;
  user: {
    _id: string;
    name: string;
    avatar: string;
    isAdmin: boolean;
    isAuthor: boolean;
  };
}

export interface SimpleBookPageReview {
  "5": number;
  "4": number;
  "3": number;
  "2": number;
  "1": number;
  "has-text": number;
}

export interface SimpleBookPageMyData {
  bought?: {
    _id: string;
    createdAt: string;
  };
  borrowed?: {
    copyNumber: number;
    holdStartDate?: string;
    holdEndDate?: string;
  };
  canReview?: boolean;
  epubURL?: string;
}

export interface SimpleUser {
  _id: string;
  name: string;
  avatar: string;
  bio?: string;
}
