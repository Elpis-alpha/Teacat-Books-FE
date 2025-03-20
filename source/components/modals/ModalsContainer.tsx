"use client";
import ClientRender from "../reusable/ClientRender";
import AuthorTicketModal from "./AuthorTicketModal";
import BorrowBookModal from "./BorrowBookModal";
import BuyBookModal from "./BuyBookModal";
import ReviewBookModal from "./ReviewBookModal";

const ModalsContainer = () => {
  return (
    <ClientRender>
      <AuthorTicketModal />
      <BorrowBookModal />
      <BuyBookModal />
      <ReviewBookModal />
    </ClientRender>
  );
};
export default ModalsContainer;
