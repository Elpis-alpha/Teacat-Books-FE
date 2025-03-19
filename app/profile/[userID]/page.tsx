import { getApiJson } from "@/source/api";
import { cookies } from "next/headers";
import routes from "@/source/api/routes";
import {
  ErrorPage,
  NormalPage,
} from "@/source/components/reusable/SimplePages";
import { tokenCookieName } from "@/source/config";
import PublicProfilePage from "@/source/components/profile/PublicProfilePage";

export default async function Home({
  params,
}: {
  params: Promise<{ userID: string }>;
}) {
  const cookieStore = await cookies();
  const myCookie = cookieStore.get(tokenCookieName);

  const { userID } = await params;
  if (!userID || userID.length !== 24) {
    return (
      <ErrorPage message="Invalid User" returnLink="/" returnText="go home" />
    );
  }

  const response = await getApiJson(routes.user.one(userID), myCookie?.value);
  if (response.error || !response.user || !response.user?.id) {
    console.error(response);
    return (
      <ErrorPage
        message={response.errorMessage || "User not found"}
        returnLink="/"
        returnText="go home"
      />
    );
  }

  return (
    <NormalPage useStart usePhysicalNavBar>
      <PublicProfilePage user={response.user} />
    </NormalPage>
  );
}
