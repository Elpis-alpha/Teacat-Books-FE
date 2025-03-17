import { backendLocation as BE } from "../config";

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
    },
  },

  // getUser: () => `${BE}/user/get-me`,
};

export default routes;
