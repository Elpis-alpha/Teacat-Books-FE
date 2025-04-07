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
    removeAuthorStatus: `${BE}/user/remove-author-status`,
    one: (userID: string) => `${BE}/user/get-one?userID=${userID}`,
    all: (
      limit: number,
      skip: number,
      sort: string,
      authorsOnly: boolean,
      search: string | null
    ) =>
      `${BE}/user/search-user${generateLSSB(limit, skip, sort)}&authors=${tt(
        authorsOnly
      )}${search ? `&search=${search}` : ""}`,
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
      tickets: (
        limit: number,
        skip: number,
        sort: string,
        showReviewed: boolean,
        showAll: boolean,
        ticketNumber?: number
      ) =>
        `${BE}/ticket/author/tickets${generateLSSB(
          limit,
          skip,
          sort
        )}&showReviewed=${tt(showReviewed)}&showAll=${tt(showAll)}${
          typeof ticketNumber === "number"
            ? `&ticketNumber=${ticketNumber}`
            : ""
        }`,
    },
    book: {
      newBook: `${BE}/ticket/book/create-new-book-ticket`,
      updateImage: `${BE}/ticket/book/create-update-image-ticket`,
      updateBook: `${BE}/ticket/book/create-update-text-ticket`,
      updateMeta: `${BE}/ticket/book/create-update-meta-ticket`,
      updateTags: `${BE}/ticket/book/create-update-tags-ticket`,
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
      changeFeatured: `${BE}/ticket/admin/change-featured`,
    },
  },

  book: {
    borrow: `${BE}/book/borrow`,
    return: `${BE}/book/return`,
    all: (
      limit: number,
      skip: number,
      sort: string,
      status: null | "new-books" | "completed-books" | "ongoing-books",
      author: string | null,
      text: string | null,
      featured: "true" | null,
      slugs?: string[]
    ) =>
      `${BE}/book/all${generateLSSB(limit, skip, sort)}${
        status ? `&status=${status}` : ""
      }${author ? `&author=${author}` : ""}${text ? `&text=${text}` : ""}${
        featured ? `&featured=${featured}` : ""
      }${slugs && slugs.length > 0 ? `&slugs=${slugs.join(" -||- ")}` : ""}`,
    meta: (bookID: string) => `${BE}/book/meta?bookID=${bookID}`,
    one: (bookID: string) => `${BE}/book/one?bookID=${bookID}`,
    chapter: (bookID: string, chapterNumber: number) =>
      `${BE}/book/chapter?bookID=${bookID}&chapterNumber=${chapterNumber}`,
    currentChapter: `${BE}/book/current-chapter`,
    bookmark: `${BE}/book/bookmark`,
    copies: (
      limit: number,
      skip: number,
      sort: string,
      bookID: string,
      taken: boolean,
      userID: string | null
    ) =>
      `${BE}/book/copies${generateLSSB(
        limit,
        skip,
        sort
      )}&bookID=${bookID}&taken=${tt(taken)}${
        userID ? `&userID=${userID}` : ""
      }`,
    mine: (limit: number, skip: number, sort: string, onlyBought: boolean) =>
      `${BE}/book/mine${generateLSSB(limit, skip, sort)}&onlyBought=${tt(
        onlyBought
      )}`,

    review: {
      review: `${BE}/book/review`,
      process: `${BE}/book/process-review`,
      all: (
        limit: number,
        skip: number,
        sort: string,
        status: null | "approved" | "pending" | "rejected",
        isAdminRequest: boolean,
        stars: number | null,
        bookID: string | null
      ) =>
        `${BE}/book/reviews${generateLSSB(limit, skip, sort)}${
          status ? `&status=${status}` : ""
        }&isAdminRequest=${tt(isAdminRequest)}${
          stars ? `&stars=${stars}` : ""
        }${bookID ? `&bookID=${bookID}` : ""}`,
    },
  },

  helio: {
    check: `${BE}/helio/check-payment`,
  },

  tag: {
    one: (q: string) => `${BE}/tag/one?q=${q}`,
    search: (q: string) => `${BE}/tag/search?q=${q}`,
  },
};

const tt = (val: boolean) => (val ? "true" : "false");

export default routes;
