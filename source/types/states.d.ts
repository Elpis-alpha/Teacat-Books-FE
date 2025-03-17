export interface AuthorTicket {
  action: "become-author" | "remove-author";
  author:
    | string
    | {
        id: string;
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
