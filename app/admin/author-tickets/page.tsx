import ManageAuthorTickets from "@/source/components/admin/ManageAuthorTickets";
import AdminProvider from "@/source/components/providers/AdminProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <UserProvider>
      <AdminProvider>
        <NormalPage usePhysicalNavBar useStart>
          <ManageAuthorTickets />
        </NormalPage>
      </AdminProvider>
    </UserProvider>
  );
}
