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
