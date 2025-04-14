import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { SortOrderType } from "../api/coinQueries";
import Loader from "../components/common/Loader"; // Assuming you have this component
import { useInView } from "react-intersection-observer";
import SparklineChart from "../components/common/SparklineChart";


export default function CryptoDashboard() {
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrderType>("market_cap_desc");
  // const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [allCoins, setAllCoins] = useState<any[]>([]);
  const isLoadingRef = useRef(false);
  const navigate = useNavigate();

  const fetchCoinsPage = async (pageNum: number) => {
    const response = await axiosInstance.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: sortOrder,
        per_page: perPage,
        page: pageNum,
        sparkline: true,
        price_change_percentage: "1h,24h,7d",
      },
    });
    return response.data;
  };

  const {
    data: currentPageData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["cryptoData", page, perPage, sortOrder],
    queryFn: () => fetchCoinsPage(page),
    staleTime: 60000,
  });

  // Update allCoins when new data comes in
  useEffect(() => {
    if (currentPageData) {
      if (page === 1) {
        // Reset data when filters change
        setAllCoins(currentPageData);
      } else {
        // Append data for infinite scroll
        setAllCoins((prev) => [...prev, ...currentPageData]);
      }
      // setIsFetchingMore(false);
      isLoadingRef.current = false;
    }
  }, [currentPageData, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setAllCoins([]);
  }, [perPage, sortOrder]);

  // const observerRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const target = entries[0];
  //       if (
  //         target.isIntersecting &&
  //         // !isFetchingMore &&
  //         !isPending &&
  //         currentPageData?.length === perPage
  //       ) {
  //         // setIsFetchingMore(true);
  //         setPage((prev) => prev + 1);
  //       }
  //     },
  //     { root: null, rootMargin: "200px", threshold: 1.0 }
  //   );

  //   if (observerRef.current) {
  //     observer.observe(observerRef.current);
  //   }

  //   return () => {
  //     if (observerRef.current) {
  //       observer.unobserve(observerRef.current);
  //     }
  //   };
  // }, [isPending, currentPageData, perPage]);

  const { ref, inView } = useInView({
    rootMargin: "200px", // start loading earlier
    threshold: 1.0, // fully in view
  });

  useEffect(() => {
    if (
      inView &&
      !isPending &&
      currentPageData?.length === perPage &&
      !isLoadingRef.current
    ) {
      isLoadingRef.current = true;
      setPage((prev) => prev + 1);
    }
  }, [inView, isPending, currentPageData, perPage]);

  // Format percentage with color
  const formatPercentage = (value: number | null | undefined) => {
    if (value === undefined || value === null) return "N/A";

    const formattedValue = value.toFixed(2) + "%";
    const colorClass = value >= 0 ? "text-green-600" : "text-red-600";

    return <span className={colorClass}>{formattedValue}</span>;
  };

  if (isPending && page === 1) return <Loader />;
  if (error)
    return (
      <div className="text-center text-red-500 font-light text-5xl mt-40">
        Error loading data...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Crypto Dashboard</h1> */}

      {/* <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="perPage" className="text-sm font-medium mb-1">
            Coins per page:
          </label>
          <select
            id="perPage"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="sortOrder" className="text-sm font-medium mb-1">
            Sort Order:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
            className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="market_cap_desc">Market Cap Descending</option>
            <option value="market_cap_asc">Market Cap Ascending</option>
            <option value="volume_desc">Volume Descending</option>
            <option value="volume_asc">Volume Ascending</option>
          </select>
        </div>
      </div> */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b shadow-2xl border-gray-300 text-sm">
              <th className="p-2 font-medium text-xs">#</th>
              <th className="p-2 font-medium text-xs">Coin</th>
              <th className="p-2 font-medium text-xs">Price</th>
              <th className="p-2 font-medium text-xs">1h %</th>
              <th className="p-2 font-medium text-xs">24h %</th>
              <th className="p-2 font-medium text-xs">7d %</th>
              <th className="p-2 font-medium text-xs">Last 7 days</th>
            </tr>
          </thead>
          <tbody>
            {allCoins.map((coin, index) => (
              <tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className="border-b border-gray-200 text-sm hover:bg-gray-200 cursor-pointer transition"
              >
                <td className="p-6 text-[#0F172A] font-medium">{index + 1}</td>
                <td className="p-6 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                  <span className="font-bold text-gray-700">{coin.name}</span>
                  <span className="uppercase font-bold text-gray-500 text-xs">
                    ({coin.symbol})
                  </span>
                </td>
                <td className="p-6 text-gray-900 font-medium">
                  ${coin.current_price}
                </td>
                <td className="p-6 text-right">
                  {formatPercentage(
                    coin.price_change_percentage_1h_in_currency
                  )}
                </td>
                <td className="p-6 text-right">
                  {formatPercentage(coin.price_change_percentage_24h)}
                </td>
                <td className="p-6 text-right">
                  {formatPercentage(
                    coin.price_change_percentage_7d_in_currency
                  )}
                </td>
                <td className="p-6">
                  {coin.sparkline_in_7d?.price ? (
                    <SparklineChart prices={coin.sparkline_in_7d.price} />
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div
          ref={observerRef}
          className="text-center py-4 text-gray-400   rounded-full border-blue-400"
        >
          Loading more data coins...
        </div> */}
        <div
          ref={ref}
          className="text-center py-4 text-gray-400 rounded-full border-blue-400"
        >
          Loading more data coins...
        </div>
      </div>
    </div>
  );
}
