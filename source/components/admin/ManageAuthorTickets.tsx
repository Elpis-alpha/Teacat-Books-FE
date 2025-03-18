"use client";

import { useEffect, useRef, useState } from "react";
import PaginatedItems from "../reusable/PaginatedItems";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { AuthorTicketInterface } from "@/source/types/states";
import AuthorTicket from "./AuthorTicket";

const ManageAuthorTickets = () => {
  const [showReviewed, setShowReviewed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const processingState = useState({
    on: "" as "accepting" | "rejecting" | "",
    data: "",
  });
  const processing = !!processingState[0].on;

  const [data, setData] = useState({
    available: false,
    loading: true,
    error: "Failed to fetch tickets",
    tickets: [],
  });

  // pagination logic
  const _page = useRef(0);
  const [count, setCount] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  useEffect(() => {
    if (resetPagination) setResetPagination(false);
  }, [resetPagination]);

  useEffect(() => {
    const fetchTickets = async () => {
      setData({
        available: false,
        loading: true,
        error: "Failed to fetch tickets",
        tickets: [],
      });

      try {
        const response = await getApiJson(
          routes.ticket.author.tickets(limit, 0, "createdAt:asc", false, true)
        );
        if (response.error || !response.tickets) {
          setData({
            available: false,
            loading: false,
            error: response.errorMessage || "Failed to fetch tickets",
            tickets: [],
          });
        } else {
          setData({
            available: true,
            loading: false,
            error: "",
            tickets: response.tickets,
          });

          if (typeof response.count === "number") {
            setCount(response.count);
          }
        }
      } catch (e) {
        console.error(e);
        setData({
          available: false,
          loading: false,
          error: "Failed to fetch tickets",
          tickets: [],
        });
      }
    };

    fetchTickets();
  }, []);

  const fetchTickets = async (
    page: number,
    showReviewed: boolean,
    ticketNumber?: number
  ) => {
    setData({
      available: false,
      loading: true,
      error: "Failed to fetch tickets",
      tickets: [],
    });

    try {
      const response = await getApiJson(
        routes.ticket.author.tickets(
          limit,
          page * limit,
          showReviewed ? "dateReviewed:desc" : "createdAt:desc",
          showReviewed,
          true,
          ticketNumber
        )
      );
      if (response.error || !response.tickets) {
        setData({
          available: false,
          loading: false,
          error: response.errorMessage || "Failed to fetch tickets",
          tickets: [],
        });
      } else {
        setData({
          available: true,
          loading: false,
          error: "",
          tickets: response.tickets,
        });

        _page.current = page;
        if (typeof response.count === "number") {
          setCount(response.count);
        }
      }
    } catch (e) {
      console.error(e);
      setData({
        available: false,
        loading: false,
        error: "Failed to fetch tickets",
        tickets: [],
      });
    }
  };

  const handleSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (searchValue.trim().length === 0) {
      setResetPagination(true);
      return fetchTickets(0, showReviewed).catch(() => {});
    }

    const ticketNumber = parseInt(searchValue);
    if (isNaN(ticketNumber) || ticketNumber < 0)
      return toast.error("Invalid ticket number");

    setResetPagination(true);
    fetchTickets(0, showReviewed, ticketNumber).catch(() => {});
  };

  return (
    <div className="w-full px-6 md:px-10 xl:px-16 py-10 text-base sm:text-xl flex-1 flex flex-col font-proxima">
      <div className="max-w-[1640px] w-full flex-1 flex flex-col items-center justify-center gap-5 sm:gap-10 mx-auto">
        <h2 className="w-full font-proxima font-bold text-xl sm:text-4xl">
          Manage Author Tickets
        </h2>
        <div className="w-full">
          <form
            onSubmit={handleSearch}
            className="w-full flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              readOnly={data.loading || processing}
              name="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search tickets e.g. 239478692323498"
              className="w-full flex-1 px-7 py-2.5 rounded-lg bg-white/5"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={data.loading || processing}
                className="bg-highlight hover:bg-highlight-dark py-2 sm:py-2.5 px-7 rounded-lg"
              >
                Search
              </button>
              <button
                type="button"
                disabled={data.loading || processing}
                onClick={() => {
                  setResetPagination(true);
                  setSearchValue("");
                  fetchTickets(0, showReviewed).catch(() => {});
                }}
                className="bg-transparent border-2 py-1.5 sm:py-2 px-7 rounded-lg hover:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
          <div className="font-proxima flex gap-4 w-full mt-4">
            <button
              disabled={data.loading || processing}
              onClick={() => {
                if (showReviewed) {
                  setSearchValue("");
                  setResetPagination(true);
                  fetchTickets(0, false).catch(() => {});
                  setShowReviewed(false);
                }
              }}
              className={`${
                showReviewed
                  ? "bg-white/10 hover:bg-white/40"
                  : "bg-white text-black"
              } py-1 px-5 sm:px-7 rounded-lg text-base block`}
            >
              Unreviewed
            </button>
            <button
              disabled={data.loading || processing}
              onClick={() => {
                if (!showReviewed) {
                  setSearchValue("");
                  setResetPagination(true);
                  fetchTickets(0, true).catch(() => {});
                  setShowReviewed(true);
                }
              }}
              className={`${
                showReviewed
                  ? "bg-white text-black"
                  : "bg-white/10 hover:bg-white/40"
              } py-1 px-5 sm:px-7 rounded-lg text-base block`}
            >
              Reviewed
            </button>
          </div>
        </div>
        <div className="w-full flex-1">
          {data.loading ? (
            <div className="w-full items-center justify-center flex p-5">
              <ClipLoader color="#fff" size={40} />
            </div>
          ) : data.available ? (
            data.tickets.length === 0 ? (
              <div className="w-full items-center justify-center flex p-5">
                <p>No tickets found{_page.current > 0 && " on this page"}</p>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {data.tickets.map((ticket: AuthorTicketInterface) => (
                  <AuthorTicket
                    key={ticket._id}
                    processingState={processingState}
                    ticket={ticket}
                    refetch={() =>
                      fetchTickets(
                        _page.current,
                        showReviewed,
                        (!isNaN(parseInt(searchValue)) &&
                          parseInt(searchValue)) ||
                          undefined
                      )
                    }
                  />
                ))}
              </div>
            )
          ) : (
            <div className="w-full items-center justify-center flex p-5">
              <p>{data.error || "An Error Occured"}</p>
            </div>
          )}
        </div>
        <div className="w-full ">
          <PaginatedItems
            count={count}
            itemsPerPage={limit}
            pageChange={(x) => fetchTickets(x, showReviewed)}
            reset={resetPagination}
            disabled={data.loading || processing}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageAuthorTickets;
const limit = 6;
