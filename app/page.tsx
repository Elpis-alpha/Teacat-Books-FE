import { NormalPage } from "@/source/components/reusable/SimplePages";
import WelcomeHero from "@/source/components/home/WelcomeHero";
import FeaturedBooks from "@/source/components/home/FeaturedBooks";
import WhyChooseUS from "@/source/components/home/WhyChooseUS";

export default function Home() {
  return (
    <NormalPage useStart>
      <WelcomeHero />
      <FeaturedBooks />
      <WhyChooseUS />
    </NormalPage>
  );
}