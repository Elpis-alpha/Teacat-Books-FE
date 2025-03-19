"use client";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { BrowseBooksData } from "@/source/types/misc";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import Swiper2 from "swiper";
import { SwiperSlide, Swiper, useSwiper } from "swiper/react";
import FeaturedBook, { FeaturedBookSkeleton } from "./FeaturedBook";

const FeaturedBooks = () => {
  const [swiper, setSwiper] = useState<Swiper2 | null>(null);
  const [swiperConfig, setSwiperConfig] = useState({
    isBeginning: true,
    isEnd: true,
  });

  const [data, setData] = useState<BrowseBooksData>({
    available: false,
    loading: true,
    error: "Failed to fetch books",
    books: [],
    mine: {},
  });

  // initial fetch
  useEffect(() => {
    const fetchBooks = async () => {
      setData({
        available: false,
        loading: true,
        error: "Failed to fetch books",
        books: [],
        mine: {},
      });

      try {
        const response = await getApiJson(
          routes.book.all(
            20,
            0,
            "numberOfReviews:desc",
            null,
            null,
            null,
            "true"
          )
        );
        if (response.error || !response.books) {
          setData({
            available: false,
            loading: false,
            error: response.errorMessage || "Failed to fetch books",
            books: [],
            mine: {},
          });
        } else {
          const mine: BrowseBooksData["mine"] = {};
          if (
            typeof response.borrowedBook === "object" &&
            response.borrowedBook
          ) {
            mine[response.borrowedBook?._id] = "borrowed";
          }
          if (
            typeof response.boughtBooks === "object" &&
            Array.isArray(response.boughtBooks)
          ) {
            response.boughtBooks?.forEach?.((book) => {
              if (book) mine[book?._id] = "bought";
            });
          }

          setData({
            available: true,
            loading: false,
            error: "",
            books: response.books,
            mine: mine,
          });
        }
      } catch (e) {
        console.error(e);
        setData({
          available: false,
          loading: false,
          error: "Failed to fetch books",
          books: [],
          mine: {},
        });
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className="w-full pt-40 pb-10">
      <div className="px-6 md:px-10 xl:px-16 max-w-[1920px] mx-auto">
        <h2 className="font-bold font-proxima text-2xl sm:text-3xl lg:text-4xl text-balance text-center">
          Featured <span className="text-highlight">Books</span>
        </h2>
        <div className="mt-8">
          {data.available && data.books.length >= 1 ? (
            <Swiper
              spaceBetween={200}
              slidesPerView={3}
              style={{ zIndex: 20 }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
            >
              {data.books.map((book) => (
                <SwiperSlide
                  style={{ height: "auto", display: "flex" }}
                  key={book._id + "ljsdf"}
                >
                  <FeaturedBook book={book} />
                </SwiperSlide>
              ))}
              <SwiperSetup
                setSwiper={setSwiper}
                setSwiperConfig={setSwiperConfig}
              />
            </Swiper>
          ) : data.loading ? (
            <div className="flex w-full flex-1 justify-center gap-5">
              <FeaturedBookSkeleton className="" />
              <FeaturedBookSkeleton className="max-sm:hidden" />
              <FeaturedBookSkeleton className="max-lg:hidden" />
            </div>
          ) : (
            <div className="flex w-full flex-1 items-center justify-center p-30 ">
              <p className="text-center text-lg text-balance">
                {data.error || "There are no featured books at the moment"}
              </p>
            </div>
          )}
          {data.available && data.books.length >= 1 && (
            <>
              <button
                onClick={() => swiper?.slidePrev?.()}
                disabled={swiperConfig?.isBeginning}
                className="w-6 pr-0.5 sm:pr-1 text-base sm:text-2xl flex items-center justify-end cursor-pointer absolute top-1/2 -translate-y-1/2 -left-6"
              >
                <FaCircleChevronLeft />
              </button>
              <button
                onClick={() => swiper?.slideNext?.()}
                disabled={swiperConfig?.isEnd}
                className="w-6 pl-0.5 sm:pl-1 text-base sm:text-2xl flex items-center justify-start cursor-pointer absolute top-1/2 -translate-y-1/2 -right-6"
              >
                <FaCircleChevronRight />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default FeaturedBooks;

const SwiperSetup = ({
  setSwiperConfig,
  setSwiper,
}: {
  setSwiperConfig: Dispatch<
    SetStateAction<{
      isBeginning: boolean;
      isEnd: boolean;
    }>
  >;
  setSwiper: Dispatch<SetStateAction<Swiper2 | null>>;
}) => {
  const swiper = useSwiper();

  useEffect(() => {
    setSwiper(swiper);
    setSwiperConfig({ isBeginning: swiper?.isBeginning, isEnd: swiper?.isEnd });
    swiper.on("slideChange", (swipe) => {
      setSwiperConfig({ isBeginning: swipe.isBeginning, isEnd: swipe.isEnd });
      setSwiper(swiper);
    });
  }, [swiper, setSwiperConfig, setSwiper]);

  return <></>;
};
