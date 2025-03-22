import { PreReadBookPage } from "@/source/components/read/ReadBookPage";
import { getTheme } from "@/source/helpers/read";
import { cookies } from "next/headers";

export default async function NotFound() {
  const cookieStore = await cookies();
  const _theme = cookieStore.get("read-theme");
  const theme = getTheme(_theme?.value);
  return <PreReadBookPage theme={theme} />;
}
