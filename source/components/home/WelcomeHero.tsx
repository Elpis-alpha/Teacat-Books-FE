import { images } from "@/source/config";
import BigImage from "../reusable/BigImage";
import Link from "next/link";

const WelcomeHero = () => {
  return (
    <BigImage blackOpacity={50} src={images.landing}>
      <div className="z-30 py-6 px-6 md:px-10 xl:px-16 text-left w-full sm:text-center flex flex-col items-start sm:items-center text-base sm:text-xl">
        <h1 className="text-[44px] xsm:text-[48px] lg:text-[64px] font-proxima font-bold text-white text-balance leading-[1]">
          <span className="max-sm:text-[26px] max-sm:block">Welcome to</span>{" "}
          <span className="text-highlight">Teacat Books</span>
        </h1>
        <p className="">
          Discover, borrow, or buy your next favorite book
        </p>
        <Link
          href="/books"
          className="bg-highlight px-8 sm:px-14 py-1.5 sm:py-2.5 mt-2 sm:mt-4 rounded-xl hover:bg-highlight-dark"
        >
          Browse Books
        </Link>
      </div>
    </BigImage>
  );
};
export default WelcomeHero;
