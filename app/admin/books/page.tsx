import AdminProvider from "@/source/components/providers/AdminProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";
import ManageBooks from "@/source/components/reusable/ManageBooks";

export default function Home() {
  return (
    <UserProvider>
      <AdminProvider>
        <NormalPage usePhysicalNavBar useStart>
          <ManageBooks viewer="admin" />
        </NormalPage>
      </AdminProvider>
    </UserProvider>
  );
}
