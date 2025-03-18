import AdminProvider from "@/source/components/providers/AdminProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";
import ManageAuthors from "@/source/components/admin/ManageAuthors";

export default function Home() {
  return (
    <UserProvider>
      <AdminProvider>
        <NormalPage usePhysicalNavBar useStart>
          <ManageAuthors />
        </NormalPage>
      </AdminProvider>
    </UserProvider>
  );
}
