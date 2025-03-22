import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import crypto from "crypto";
import { addMinutes } from "date-fns";

export const randomAmong = (num1: number, num2: number) => {
  return Math.floor(Math.random() * (num2 - num1 + 1)) + num1;
};

export const chooseFrom = <T>(arr: T[]) => {
  return arr[randomAmong(0, arr.length - 1)];
};

export const multiplyArray: <T>(arr: T[], times: number) => T[] = (
  arr,
  times
) => {
  return Array(times).fill(arr).flat();
};

export const shuffle = <T>(arr: T[]) => {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const makeArray = <T>(func: () => T, count = 1) => {
  const array = Array(count)
    .fill("")
    .map(() => func());
  return array;
};

export const getCookie = (name: string) => {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

        break;
      }
    }
  }

  return cookieValue;
};

export const copyText = async (text: string) => {
  const normalCopy = () => {
    const textArea = document.createElement("textarea");

    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.bottom = "0";
    textArea.style.width = "2rem";
    textArea.style.height = "2rem";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.overflow = "hidden";
    textArea.style.opacity = "0";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    textArea.value = text;
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      normalCopy();
    }
  } catch {
    normalCopy();
  }

  toast.success("Copied to clipboard");
};

export const requestFullScreen = (exit?: boolean) => {
  if (exit) {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
    }
    return false;
  }

  const element = document.documentElement;

  const requestMethod =
    element.requestFullscreen ||
    // @ts-expect-error: is a method
    element.requestFullScreen ||
    // @ts-expect-error: is a method
    element.webkitRequestFullScreen ||
    // @ts-expect-error: is a method
    element.mozRequestFullScreen ||
    // @ts-expect-error: is a method
    element.msRequestFullscreen;

  if (requestMethod) {
    requestMethod.call(element);

    // @ts-expect-error: is valid
  } else if (typeof window.ActiveXObject !== "undefined") {
    // IE work

    // @ts-expect-error: is valid
    const wscript = new ActiveXObject("WScript.Shell");

    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }

  // document.exitFullscreen()  Use this to exit
};

export const scrollThrough = (vertical: number, horisontal = 0) => {
  window.scrollBy({ top: vertical, left: horisontal, behavior: "smooth" });
};

export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

export const splitCapital = (str: string) => {
  let li = str.split("");

  li = li.map((s) => {
    if (s === s.toUpperCase()) {
      return `-${s.toLowerCase()}`;
    } else return s;
  });

  return li.join("");
};

export const apostrophifyName = (name: string) => {
  const end = name.length - 1;

  if (name[end] === "s") return name + "'";
  else return name + "'s";
};

export const createQueryString = (
  queryObject: Record<string, string | number | boolean>
) => {
  let queryString = "?";

  const queryKeys = Object.keys(queryObject).filter(
    (key: string) => queryObject[key]
  );

  for (const queryName of queryKeys) {
    const queryValue = queryObject[queryName];

    if (queryKeys.indexOf(queryName) === 0) {
      queryString = queryString + encodeURI(`${queryName}=${queryValue}`);
    } else {
      queryString = queryString + encodeURI(`&${queryName}=${queryValue}`);
    }
  }

  return queryString;
};

export const formatNumber = (num: number) => {
  return num
    .toString()
    .split(/(?=(?:\d{3})+(?:\.|$))/g)
    .join(",");
};

export const shortenNumber = (number: number) => {
  const SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
  const sign = number < 0 ? "-1" : "";
  const absNumber = Math.abs(number);
  const tier = (Math.log10(absNumber) / 3) | 0;
  // if zero, we don't need a prefix
  if (tier == 0) return `${absNumber}`;
  // get postfix and determine scale
  const postfix = SI_POSTFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  // scale the number
  const scaled = absNumber / scale;
  const floored = Math.floor(scaled * 10) / 10;
  // format number and add postfix as suffix
  let str = floored.toFixed(1);
  // remove '.0' case
  str = /\.0$/.test(str) ? str.substr(0, str.length - 2) : str;
  if (number > 900000000000000000000) return "∞";
  return `${sign}${str}${postfix}`;
};

export const padZeros = (stuff: number | string, size: number = 8) => {
  stuff = stuff.toString();
  return stuff.padStart(size, "0");
};

export const formatWallet = (wallet: string, num = 5) => {
  wallet = wallet.slice(0, num) + "..." + wallet.slice(wallet.length - num);
  return wallet;
};

export const waitFor = async <T>(milliseconds: number, back?: T) => {
  return await new Promise((resolve: (value?: T) => void) =>
    setTimeout(() => {
      resolve(back);
    }, milliseconds)
  );
};

export const validatePassword = (password: string) => {
  if (password.length < 6) return "Minimum of 6 characters.";
  else if (password.search(/[a-z]/) < 0)
    return "Minimum of one lowercase letter.";
  else if (password.search(/[A-Z]/) < 0)
    return "Minimum of one uppercase letter.";
  else if (password.search(/[0-9]/) < 0) return "Minimum of one number.";
  else return "";
};

export const trimContent = (content: string, length = 100) => {
  if (content.length > length) {
    return content.slice(0, length) + "...";
  } else return content;
};

export const openWithPost = (
  url: string,
  data: Record<string, string | number | boolean>,
  windowFeatures?: {
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    additionalFeatures?: string;
  }
): Window | null => {
  try {
    const width = windowFeatures?.width ?? 600;
    const height = windowFeatures?.height ?? 600;
    const top =
      windowFeatures?.top ?? Math.max(0, (window.screen.height - height) / 2);
    const left =
      windowFeatures?.left ?? Math.max(0, (window.screen.width - width) / 2);

    const features = [
      `width=${width}`,
      `height=${height}`,
      `top=${top}`,
      `left=${left}`,
      windowFeatures?.additionalFeatures ?? "popup=yes,noopener,noreferrer",
    ].join(",");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.target = "_parent";

    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    const newWindow = window.open("", "_blank", features);
    if (!newWindow) {
      return null;
    }

    newWindow.document.body.appendChild(form);
    form.submit();

    return newWindow;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const openWithGet = (
  url: string,
  windowFeatures?: {
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    additionalFeatures?: string;
  }
): Window | null => {
  try {
    const width = windowFeatures?.width ?? 600;
    const height = windowFeatures?.height ?? 600;
    const top =
      windowFeatures?.top ?? Math.max(0, (window.screen.height - height) / 2);
    const left =
      windowFeatures?.left ?? Math.max(0, (window.screen.width - width) / 2);

    const features = [
      `width=${width}`,
      `height=${height}`,
      `top=${top}`,
      `left=${left}`,
      windowFeatures?.additionalFeatures ?? "popup=yes",
    ].join(",");

    const newWindow = window.open(url, "_blank", features);
    if (!newWindow) {
      return null;
    }

    return newWindow;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const validateAddress = (wallet: string) => {
  try {
    new PublicKey(wallet);
    return true;
  } catch {
    return false;
  }
};

export const validateNumber = (value: string | number, positive = false) => {
  if (isNaN(Number(value))) return false;
  else if (Number(value) <= 0 && positive) return false;
  return true;
};

export const changeImageSize = (original: string, width: "small" | "large") => {
  let newUrl = original;
  if (original.startsWith("https://res.cloudinary.com/")) {
    if (width === "small") {
      newUrl = original.replace("/upload/", `/upload/c_scale,w_50/`);
    } else newUrl = original;
  } else if (original.startsWith("https://pbs.twimg.com/")) {
    if (width === "large") {
      newUrl = original.replace("_normal", "");
    } else newUrl = original;
  }
  return newUrl;
};

export const randomNumber = (
  min: number,
  max: number,
  withDecimals = false
) => {
  if (withDecimals) {
    return Math.floor(Math.random() * (max - min + 1)) + min + Math.random();
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomString = (
  lenfth: number,
  enc: "hex" | "base64" | "utf8" = "hex"
) => {
  return crypto.randomBytes(lenfth).toString(enc);
};

export const getOauthToken = () => {
  return (
    randomString(82, "base64") +
    ":" +
    addMinutes(new Date(), 3).getTime().toString()
  );
};

export const generateHelioLink = (
  paylinkID: string,
  userID: string,
  email: string
) => {
  return `https://app.dev.hel.io/pay/${paylinkID}?email=${email}&productValue=${userID}`;
};
