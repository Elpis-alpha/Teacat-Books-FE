import { Dispatch, SetStateAction } from "react";

export type profileProcessing =
  | ""
  | "name"
  | "bio"
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
