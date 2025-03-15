import { NormalPage } from "@/source/components/reusable/SimplePages";
import SignInModal from "@/source/components/signin/SignInModal";

export default function Home() {
  return (
    <NormalPage useStart>
      <SignInModal />
    </NormalPage>
  );
}
