"use client";
import store from "@/source/store/store";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import FetchAppData from "../general/FetchAppData";
import ModalsContainer from "../modals/ModalsContainer";
import NavBar from "../general/NavBar";
import Footer from "../general/Footer";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <NextTopLoader color="#ffffff" />
      <NavBar />
      {children}
      <Footer />
      <ModalsContainer />
      <Toaster position="top-center" />
      <FetchAppData />
    </Provider>
  );
};
export default AppProvider;
