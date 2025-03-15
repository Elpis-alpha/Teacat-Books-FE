import { usePathname } from "next/navigation";

const Footer = () => {
  const path = usePathname();
  if (path.startsWith("/signin")) return <></>;

  return (
    <footer className="bg-sub-bg w-full">
      <div className="py-12 px-6 md:px-10 xl:px-16 max-w-[1920px] mx-auto flex gap-6 items-center justify-between">
        <div className="">
          <h1 className="font-proxima font-bold text-2xl sm:text-3xl">
            Teacat Books
          </h1>
          <p className="pt-1">
            Support new authors and find the next great novels
          </p>
          <p className="sm:hidden pt-6">@{new Date().getFullYear()}, Teacat Books.</p>
          <p className="sm:hidden pt-1">All rights reserved.</p>
        </div>
        <div className="max-sm:hidden text-right">
          <p>@{new Date().getFullYear()}, Teacat Books.</p>
          <p className="pt-1">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
