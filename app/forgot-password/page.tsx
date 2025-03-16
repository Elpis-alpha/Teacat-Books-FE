import { NormalPage } from "@/source/components/reusable/SimplePages";
import ForgotPassword from "@/source/components/signin/ForgotPassword";

export default function Home() {
  return (
    <NormalPage useStart>
      <ForgotPassword />
    </NormalPage>
  );
}
