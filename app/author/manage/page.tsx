import ManageBooks from "@/source/components/author/ManageBooks";
import AuthorProvider from "@/source/components/providers/AuthorProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <UserProvider>
      <AuthorProvider>
        <NormalPage usePhysicalNavBar useStart>
          <ManageBooks />
        </NormalPage>
      </AuthorProvider>
    </UserProvider>
  );
}
