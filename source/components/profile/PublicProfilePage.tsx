"use client";
import { OneUser } from "@/source/types/states";
import { ClipLoader } from "react-spinners";
import SafeImage from "../reusable/SafeImage";
import Link from "next/link";

const PublicProfilePage = ({ user }: { user: OneUser }) => {
  return (
    <div className="w-full py-[60px] px-6 md:px-10 xl:px-16 flex-1 flex items-center justify-center">
      <div className="max-w-[600px] mx-auto text-xl flex flex-col items-center">
        <div className="w-[200px] h-[200px] mx-auto">
          <SafeImage
            src={user.avatar + "khsasdf"}
            alt={user.name + " Profile"}
            className="w-full h-full rounded-full z-10 absolute inset-0 object-cover border-white border-1"
          />
          <div className="bg-black/50 w-full h-full rounded-full absolute z-0 flex items-center justify-center">
            <ClipLoader color="#fff" size={30} />
          </div>
        </div>
        <div className="text-center mt-4">
          <h2 className="font-proxima font-bold text-2xl sm:text-4xl">
            {user.name}
          </h2>
          <p className="pt-1 text-base sm:text-lg">{user.bio}</p>
        </div>
        {(user.mail || user.twitter || user.discord) && (
          <div className="mx-auto flex gap-4 mt-2.5 text-sm sm:text-base underline">
            {user.mail && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`mailto:${user.mail}`}
                className="hover:text-blue-300"
              >
                Mail
              </a>
            )}
            {user.twitter.active && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://twitter.com/intent/user?user_id=${user.twitter.id}`}
                className="hover:text-blue-300"
              >
                Twitter
              </a>
            )}
            {user.discord.active && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://discordapp.com/users/${user.discord.id}`}
                className="hover:text-blue-300"
              >
                Discord
              </a>
            )}
          </div>
        )}
        {user.isAuthor && (
          <div className="mt-4">
            <Link
              href={`/books?authorID=${user.id}`}
              className="text-sm sm:text-base px-8 py-2 rounded-lg bg-highlight hover:bg-highlight-dark flex"
            >
              My Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default PublicProfilePage;
