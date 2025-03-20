import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";
import MyBooksPage from "@/source/components/books/MyBooksPage";

export default function Home() {
  return (
    <UserProvider>
      <NormalPage usePhysicalNavBar useStart>
        <MyBooksPage />
      </NormalPage>
    </UserProvider>
  );
}
