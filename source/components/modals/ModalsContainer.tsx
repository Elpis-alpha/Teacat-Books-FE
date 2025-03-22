"use client";
import ClientRender from "../reusable/ClientRender";
import AuthorTicketModal from "./AuthorTicketModal";
import BorrowBookModal from "./BorrowBookModal";
import BuyBookModal from "./BuyBookModal";
import ReadThemeModal from "./ReadThemeModal";
import ReviewBookModal from "./ReviewBookModal";

const ModalsContainer = () => {
  return (
    <ClientRender>
      <AuthorTicketModal />
      <BorrowBookModal />
      <BuyBookModal />
      <ReviewBookModal />
      <ReadThemeModal />
    </ClientRender>
  );
};
export default ModalsContainer;
