import ManageTickets from "@/source/components/author/ManageTickets";
import AuthorProvider from "@/source/components/providers/AuthorProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <UserProvider>
      <AuthorProvider>
        <NormalPage usePhysicalNavBar useStart>
          <ManageTickets />
        </NormalPage>
      </AuthorProvider>
    </UserProvider>
  );
}
