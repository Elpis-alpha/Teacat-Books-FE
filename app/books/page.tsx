import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import BrowseBooksHolder from "@/source/components/books/BrowseBooksHolder";
import { SimpleUser } from "@/source/types/states";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const _authorID = (await searchParams).author || "";
  const authorID =
    _authorID
      ?.toString()
      .trim()
      .replace("[", "")
      .replace("]", "")
      .replace(/"/g, "") || "";
  let authorData: SimpleUser | null = null;
  if (authorID.length === 24) {
    try {
      const response = await getApiJson(routes.user.one(authorID));
      if (response.error || !response.user) {
        console.error(response.errorMessage || "Failed to fetch author data");
      } else {
        authorData = {
          _id: response.user.id,
          name: response.user.name,
          bio: response.user.bio,
          avatar: response.user.avatar,
        };

        if (
          !authorData._id ||
          !authorData.name ||
          !authorData.avatar ||
          !authorData.bio
        ) {
          console.error("Author data is incomplete", authorData);
          authorData = null;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return <BrowseBooksHolder authorData={authorData} />;
}
