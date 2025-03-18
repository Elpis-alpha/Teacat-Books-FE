import AdminHome from "@/source/components/admin/AdminHome";
import AdminProvider from "@/source/components/providers/AdminProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <UserProvider>
      <AdminProvider>
        <NormalPage usePhysicalNavBar>
          <AdminHome />
        </NormalPage>
      </AdminProvider>
    </UserProvider>
  );
}
