import AuthorHome from "@/source/components/author/AuthorHome";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <NormalPage useStart usePhysicalNavBar>
      <AuthorHome />
    </NormalPage>
  );
}
