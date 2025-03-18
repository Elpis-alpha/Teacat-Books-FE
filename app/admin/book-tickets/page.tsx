import ManageTickets from "@/source/components/reusable/ManageTickets";
import AdminProvider from "@/source/components/providers/AdminProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <UserProvider>
      <AdminProvider>
        <NormalPage usePhysicalNavBar useStart>
          <ManageTickets viewer="admin" />
        </NormalPage>
      </AdminProvider>
    </UserProvider>
  );
}
