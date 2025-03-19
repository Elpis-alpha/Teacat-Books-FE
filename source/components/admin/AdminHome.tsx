import Link from "next/link";

const AdminHome = () => {
  return (
    <div className="w-full px-6 md:px-10 xl:px-16 py-4 sm:py-10 text-center text-base sm:text-xl">
      <div className="max-w-[650px] flex flex-col items-center justify-center gap-4 mx-auto">
        <h3 className="font-proxima text-balance font-bold">
          Welcome Admin, What do you want to do?
        </h3>
        <div className="flex gap-4 w-full flex-col sm:flex-row">
          <Link
            href="/admin/authors"
            className="bg-highlight hover:bg-highlight-dark block py-2 sm:py-3 px-4 rounded-lg w-full"
          >
            Manage Authors
          </Link>
          <Link
            href="/admin/author-tickets"
            className="bg-weird-teal hover:bg-weird-teal-dark block py-2 sm:py-3 px-4 rounded-lg w-full"
          >
            Author Tickets
          </Link>
        </div>
        <div className="flex gap-4 w-full flex-col sm:flex-row">
          <Link
            href="/admin/books"
            className="bg-highlight hover:bg-highlight-dark block py-2 sm:py-3 px-4 rounded-lg w-full"
          >
            Manage Books
          </Link>
          <Link
            href="/admin/book-tickets"
            className="bg-weird-teal hover:bg-weird-teal-dark block py-2 sm:py-3 px-4 rounded-lg w-full"
          >
            Book Tickets
          </Link>
        </div>
        <Link
          href="/admin/reviews"
          className="bg-amber-800 hover:bg-amber-900 block py-2 sm:py-3 px-4 rounded-lg w-full"
        >
          Manage Reviews
        </Link>
      </div>
    </div>
  );
};
export default AdminHome;
