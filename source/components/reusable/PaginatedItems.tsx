import { useEffect, useMemo, useRef, useState } from "react";
import ReactPaginate from "react-paginate";

const PaginatedItems = ({
  itemsPerPage,
  count,
  pageChange,
  reset,
  disabled,
}: {
  itemsPerPage: number;
  count: number;
  pageChange: (page: number) => void;
  reset: boolean;
  disabled: boolean;
}) => {
  const currentPage = useRef(0);
  const [forcePageTo, setForcePageTo] = useState<undefined | number>(undefined);
  useEffect(() => {
    if (typeof forcePageTo === "number") {
      setForcePageTo(undefined);
    }
  }, [forcePageTo]);

  useEffect(() => {
    if (reset) currentPage.current = 0;
  }, [reset]);

  const pageCount = useMemo(
    () => Math.ceil(count / itemsPerPage),
    [count, itemsPerPage]
  );

  return (
    <ReactPaginate
      breakLabel="-"
      nextLabel="Next"
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={
        reset ? 0 : typeof forcePageTo === "number" ? forcePageTo : undefined
      }
      onPageChange={({ selected }) => {
        console.log("disabled", { disabled, selected, c: currentPage.current });
        if (disabled) {
          setForcePageTo(currentPage.current);
          return;
        }
        console.log("meeeeee");
        currentPage.current = selected;
        pageChange(selected);
      }}
      previousLabel="Prev"
      renderOnZeroPageCount={null}
      containerClassName={
        "flex justify-center items-center sm:gap-4 smm:gap-2 font-proxima text-base flex-wrap " +
        (disabled ? "opacity-50" : "")
      }
      pageLinkClassName="px-3.5 py-2.5 bg-white/5 smm:rounded-lg hover:bg-white/20 cursor-pointer duration-200 block"
      previousLinkClassName="px-3.5 py-2.5 bg-white/10 smm:rounded-lg hover:bg-white/25 cursor-pointer duration-200 hidden sm:block"
      nextLinkClassName="px-3.5 py-2.5 bg-white/10 smm:rounded-lg hover:bg-white/25 cursor-pointer duration-200 hidden sm:block"
      activeLinkClassName="bg-white/100 text-black hover:bg-white/80"
      disabledLinkClassName="bg-white/10 hover:bg-white/10 hover:cursor-not-allowed "
      breakLinkClassName="max-smm:px-1 max-xsm:px-0 max-xsm:opacity-0"
    />
  );
};
export default PaginatedItems;
