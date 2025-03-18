import { backendLocation as BE } from "../config";
import { generateLSSB } from "./misc";

const routes = {
  user: {
    me: `${BE}/user/get-me`,
    edit: `${BE}/user/edit-user`,
    logout: `${BE}/user/logout`,
    getSigninOtp: `${BE}/user/password-auth`,
    signin: `${BE}/user/otp-auth`,
    getResetOtp: `${BE}/user/forget-password`,
    reset: `${BE}/user/forget-password-otp`,
    changePassword: `${BE}/user/change-password`,

    uploadAvatar: `${BE}/user/upload-image`,
    resetAvatar: `${BE}/user/reset-image`,
    one: (userID: string) => `${BE}/user/get-one?userID=${userID}`,
  },

  oauth: {
    twitter: `${BE}/oauth/twitter`,
    discord: `${BE}/oauth/discord`,
    google: `${BE}/oauth/google`,
    twitterLogin: `${BE}/oauth/twitter/login`,
    discordLogin: `${BE}/oauth/discord/login`,
    googleLogin: `${BE}/oauth/google/login`,
    twitterDisconnect: `${BE}/oauth/twitter/disconnect`,
    discordDisconnect: `${BE}/oauth/discord/disconnect`,
  },

  ticket: {
    author: {
      create: `${BE}/ticket/author/create`,
      cancel: `${BE}/ticket/author/cancel`,
      myTicket: `${BE}/ticket/author/my-ticket`,
      // tickets: `${BE}/ticket/author/tickets`,
    },
    book: {
      newBook: `${BE}/ticket/book/create-new-book-ticket`,
      updateImage: `${BE}/ticket/book/create-update-image-ticket`,
      updateBook: `${BE}/ticket/book/create-update-text-ticket`,
      updateMeta: `${BE}/ticket/book/create-update-meta-ticket`,
      deleteBook: `${BE}/ticket/book/create-delete-book-ticket`,
      get: (
        limit: number,
        skip: number,
        sort: string,
        showReviewed: boolean,
        showAll: boolean,
        ticketNumber?: number
      ) =>
        `${BE}/ticket/book/tickets${generateLSSB(
          limit,
          skip,
          sort
        )}&showReviewed=${tt(showReviewed)}&showAll=${tt(showAll)}${
          typeof ticketNumber === "number"
            ? `&ticketNumber=${ticketNumber}`
            : ""
        }`,
      cancel: `${BE}/ticket/book/cancel`,
    },
    admin: {
      reviewAuthor: `${BE}/ticket/admin/review-author`,
      reviewBook: `${BE}/ticket/admin/review-book`,
    },
  },

  book: {
    // all: `${BE}/book/all`,
    all: (
      limit: number,
      skip: number,
      sort: string,
      status: null | "new-books" | "completed-books" | "ongoing-books",
      author: string | null,
      text: string | null,
      featured: "true" | null
    ) =>
      `${BE}/book/all${generateLSSB(limit, skip, sort)}${
        status ? `&status=${status}` : ""
      }${author ? `&author=${author}` : ""}${text ? `&text=${text}` : ""}${
        featured ? `&featured=${featured}` : ""
      }`,
  },

  // getUser: () => `${BE}/user/get-me`,
};

const tt = (val: boolean) => (val ? "true" : "false");

export default routes;
