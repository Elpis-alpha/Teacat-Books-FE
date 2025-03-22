// user
interface userDataType {
  _id: string;
  name: string;
  bio: string;
  avatar: string;
  isAdmin: boolean;

  author: {
    status:
      | "in-active"
      | "pending-approval"
      | "approved"
      | "rejected"
      | "pending-removal";
    wallet?: string;
    walletHelioID?: string;
    ticketID?: string;
  };

  // AUTHENTICATION
  mail: {
    email: string;
    authType: "password" | "google";
    googleID?: string;
  };

  twitter: {
    id?: string;
    username?: string;
    active: boolean;
  };

  discord: {
    active: boolean;
    id?: string;
    username?: string;
  };

  borrowLockdownEndsAt?: string;
  numberOfOverdueReturns?: number;

  createdAt: string;
  updatedAt: string;
}

interface UIStateType {
  modal:
    | {
        active: false;
      }
    | {
        active: true;
        type?: "borrow-book" | "buy-book" | "author-ticket" | "review-book" | "set-theme"
        data?: string;
      };
  changeTheme: number;
  hasReviewed: string;
}
