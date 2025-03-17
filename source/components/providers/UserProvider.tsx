"use client";
import { useAppSelector } from "@/source/store/hooks";
import ClientRender from "../reusable/ClientRender";
import { ErrorPage, LoadingPage } from "../reusable/SimplePages";

type UserProviderProps = {
  children: React.ReactNode;
};
const UserProvider = ({ children }: UserProviderProps) => {
  const { available, loading, tested, data } = useAppSelector(
    (state) => state.user
  );

  return (
    <ClientRender initial={<LoadingPage message="Authenticating" />}>
      {loading ? (
        <LoadingPage message="Authenticating" />
      ) : !tested ? (
        <LoadingPage message="Authenticating" />
      ) : !available ? (
        <ErrorPage
          message="You are not authenticated"
          returnLink="/signin"
          returnText="Go to Sign-In"
        />
      ) : available && data ? (
        <>{children}</>
      ) : (
        <ErrorPage
          message="You are not authenticated"
          returnLink="/signin"
          returnText="Go to Sign-In"
        />
      )}
    </ClientRender>
  );
};
export default UserProvider;
