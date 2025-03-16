import { useAppSelector } from "@/source/store/hooks";
import ClientRender from "../reusable/ClientRender";
import { ErrorPage, LoadingPage } from "../reusable/SimplePages";

type AdminProviderProps = {
  children: React.ReactNode;
};
const AdminProvider = ({ children }: AdminProviderProps) => {
  const { data: userData } = useAppSelector((state) => state.user);

  return (
    <ClientRender initial={<LoadingPage message="Authenticating" />}>
      {userData?.isAdmin === true ? (
        <>{children}</>
      ) : (
        <ErrorPage
          message="Admins only"
          returnLink="/profile"
          returnText="Go to Profile"
        />
      )}
    </ClientRender>
  );
};
export default AdminProvider;
