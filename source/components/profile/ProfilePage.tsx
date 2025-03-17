"use client";
import { useState } from "react";
import EditNameImageBio from "./EditNameImageBio";
import { profileProcessing } from "@/source/types/misc";
import EditPassword from "./EditPassword";
import { useAppSelector } from "@/source/store/hooks";
import EditSocials from "./EditSocials";
import AuthorStatus from "./AuthorStatus";

const ProfilePage = () => {
  const profileProcessing = useState<profileProcessing>("");
  const userData = useAppSelector((state) => state.user).data!;

  return (
    <div className="w-full py-[60px] px-6 md:px-10 xl:px-16">
      <div className="max-w-[600px] mx-auto text-base sm:text-xl flex flex-col gap-8">
        <EditNameImageBio profileProcessing={profileProcessing} />
        {userData.mail.authType === "password" && (
          <EditPassword profileProcessing={profileProcessing} />
        )}
        <EditSocials profileProcessing={profileProcessing} />
        <AuthorStatus profileProcessing={profileProcessing} />
      </div>
    </div>
  );
};
export default ProfilePage;
