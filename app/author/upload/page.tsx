import UploadHome from "@/source/components/author/UploadHome";
import AuthorProvider from "@/source/components/providers/AuthorProvider";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <UserProvider>
      <AuthorProvider>
        <NormalPage usePhysicalNavBar>
          <UploadHome />
        </NormalPage>
      </AuthorProvider>
    </UserProvider>
  );
}
