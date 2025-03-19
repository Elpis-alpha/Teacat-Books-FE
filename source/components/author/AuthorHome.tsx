import Link from "next/link";

const AuthorHome = () => {
  return (
    <div className="w-full px-6 md:px-10 xl:px-16 py-4 sm:py-10 text-center text-base sm:text-xl">
      <div className="max-w-[650px] flex flex-col items-center justify-center gap-4 mx-auto">
        <h3 className="font-proxima text-balance font-bold">
          Welcome Author, What do you want to do?
        </h3>
        <div className="flex gap-4 w-full flex-col sm:flex-row">
          <Link
            href="/author/upload"
            className="bg-good-green hover:bg-good-green-dark block py-2 sm:py-3 px-4 rounded-lg w-full"
          >
            Upload a New Book
          </Link>
          <Link
            href="/author/manage"
            className="bg-highlight hover:bg-highlight-dark block py-2 sm:py-3 px-4 rounded-lg w-full"
          >
            Manage Books
          </Link>
        </div>
        <Link
          href="/author/tickets"
          className="bg-weird-teal hover:bg-weird-teal-dark block py-2 sm:py-3 px-4 rounded-lg w-full"
        >
          View Tickets
        </Link>
      </div>
    </div>
  );
};
export default AuthorHome;
