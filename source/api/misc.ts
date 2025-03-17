import Cookies from "universal-cookie";
import { tokenCookieName } from "../config";

export const getToken = () => {
  const cookie = new Cookies();
  return cookie.get(tokenCookieName);
};

export const saveToken = (token: string) => {
  const cookie = new Cookies();

  // stay logged in for 7 days
  cookie.set(tokenCookieName, token, { path: "/", maxAge: 60 * 60 * 24 * 7 });
};

export const removeToken = () => {
  const cookie = new Cookies();

  cookie.remove(tokenCookieName, { path: "/" });
};

export const generateLSSB = (limit = 10, skip = 0, sortBy = "createdAt:desc") =>
  `?limit=${limit}&skip=${skip}&sort=${sortBy}`;

export type APIFunctionType = () => Promise<Record<string | number, any>>;
export type ReqBodyType = Record<string | number, any>;
export type ReqDataBodyType = Record<string, string | Blob>;
