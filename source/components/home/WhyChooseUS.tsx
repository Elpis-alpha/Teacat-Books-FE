import LazyImage from "../reusable/LazyImage";

const WhyChooseUS = () => {
  return (
    <div className="w-full py-[200px]">
      <div className="px-6 md:px-10 xl:px-16 max-w-[1920px] mx-auto">
        <h2 className="font-bold font-proxima text-2xl sm:text-3xl lg:text-4xl text-balance text-center">
          Why Choose <span className="text-highlight">Teacat Books?</span>
        </h2>
        <div className="pt-[50px] flex items-center justify-center text-center text-balance gap-14 slg:gap-10 flex-col slg:flex-row">
          <div className="max-w-[350px]">
            <LazyImage
              highSizeSrc="/images/borrow.png"
              lowSizeSrc="/images/small/borrow.png"
              alt="borrow"
              className="rounded-full w-[130px] mx-auto object-cover"
            />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-proxima font-bold mt-2">
              Borrow Books
            </h3>
            <p className="pt-1.5 text-base sm:text-lg lg:text-xl">
              Save money by borrowing books for a limited time period.
            </p>
          </div>
          <div className="max-w-[350px]">
            <LazyImage
              highSizeSrc="/images/buy.png"
              lowSizeSrc="/images/small/buy.png"
              alt="borrow"
              className="rounded-full w-[130px] mx-auto object-cover"
            />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-proxima font-bold mt-2">
              Buy Books
            </h3>
            <p className="pt-1.5 text-base sm:text-lg lg:text-xl">
              Skip the wait for borrowing by purchasing a book.
            </p>
          </div>
          <div className="max-w-[350px]">
            <LazyImage
              highSizeSrc="/images/track.png"
              lowSizeSrc="/images/small/track.png"
              alt="borrow"
              className="rounded-full w-[130px] mx-auto object-cover"
            />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-proxima font-bold mt-2">
              Track Orders
            </h3>
            <p className="pt-1.5 text-base sm:text-lg lg:text-xl">
              Keep track of your purchases and borrowed books in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhyChooseUS;
