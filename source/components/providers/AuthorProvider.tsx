"use client";
import { useAppSelector } from "@/source/store/hooks";
import ClientRender from "../reusable/ClientRender";
import { ErrorPage, LoadingPage } from "../reusable/SimplePages";

type AuthorProviderProps = {
  children: React.ReactNode;
};
const AuthorProvider = ({ children }: AuthorProviderProps) => {
  const { data: userData } = useAppSelector((state) => state.user);

  return (
    <ClientRender initial={<LoadingPage message="Authenticating" />}>
      {userData?.author?.status === "approved" ||
      userData?.author?.status === "pending-removal" ? (
        <>{children}</>
      ) : (
        <ErrorPage
          message="Authors only"
          returnLink="/profile"
          returnText="Go to Profile"
        />
      )}
    </ClientRender>
  );
};
export default AuthorProvider;
