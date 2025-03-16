"use client";
import ProfilePage from "@/source/components/profile/ProfilePage";
import UserProvider from "@/source/components/providers/UserProvider";
import { NormalPage } from "@/source/components/reusable/SimplePages";

export default function Home() {
  return (
    <UserProvider>
      <NormalPage useStart usePhysicalNavBar>
        <ProfilePage />
      </NormalPage>
    </UserProvider>
  );
}
