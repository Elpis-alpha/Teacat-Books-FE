import AdminProvider from "@/source/components/providers/AdminProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";
import ManageReviews from "@/source/components/admin/ManageReviews";

export default function Home() {
  return (
    <UserProvider>
      <AdminProvider>
        <NormalPage usePhysicalNavBar useStart>
          <ManageReviews />
        </NormalPage>
      </AdminProvider>
    </UserProvider>
  );
}
