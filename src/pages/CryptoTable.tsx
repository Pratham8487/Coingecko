import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { fetchInfiniteCoins, SortOrderType } from "../api/coinQueries";
import Loader from "../components/common/Loader";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import {
  formatPercentage,
  formatNumber,
  getPercentageColor,
} from "../utils/Format.ts";
import SparklineChart from "../components/common/SparklineChart";

export default function CryptoTable() {
  const [perPage, setPerPage] = useState(25);
  const [sortOrder, setSortOrder] = useState<SortOrderType>("market_cap_desc");
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.8,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    queryKey: ["infiniteCoins", perPage, sortOrder],
    queryFn: ({ pageParam = 1 }) =>
      fetchInfiniteCoins({ pageParam, perPage, sortOrder }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === perPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60000,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleSort = () => {
    setSortOrder((prev) =>
      prev === "market_cap_desc" ? "market_cap_asc" : "market_cap_desc"
    );
  };

  const handleChange = (event: SelectChangeEvent) => {
    setPerPage(Number(event.target.value));
  };

  const handleRowClick = (id: string) => {
    navigate(`/coin/${id}`);
  };

  if (isPending) return <Loader />;
  if (error)
    return (
      <p className="text-center text-4xl text-red-500 mt-20">
        Error loading data...
      </p>
    );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-sm">
            <th
              className="p-2 font-medium text-xs flex items-center gap-1 cursor-pointer"
              onClick={toggleSort}
            >
              {sortOrder === "market_cap_asc" ? (
                <FaCaretUp className="text-xs text-gray-500" />
              ) : (
                <FaCaretDown className="text-xs text-gray-500" />
              )}
              #
            </th>
            <th className="p-2 font-medium text-xs">Coin</th>
            <th className="p-2 font-medium text-xs">Price</th>
            <th className="p-2 font-medium text-xs">1h</th>
            <th className="p-2 font-medium text-xs">24h</th>
            <th className="p-2 font-medium text-xs">7d</th>
            <th className="p-2 font-medium text-xs">24h Volume</th>
            <th className="p-2 font-medium text-xs">Market Cap</th>
            <th className="p-2 font-medium text-xs">7d Chart</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.flat().map((coin, index) => (
            <tr
              key={coin.id}
              onClick={() => handleRowClick(coin.id)}
              className="border-b border-gray-200 text-sm hover:bg-gray-200 cursor-pointer transition"
            >
              <td className="p-6 text-[#0F172A] font-medium">{index + 1}</td>
              <td className="p-6 flex items-center gap-4">
                <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                <span className="font-bold text-gray-700">{coin.name}</span>
                <span className="text-gray-500 text-xs font-bold">
                  ({coin.symbol.toUpperCase()})
                </span>
              </td>
              <td className="p-6 text-gray-900 font-medium">
                ${formatNumber(coin.current_price)}
              </td>
              <td
                className={`p-6 font-medium ${getPercentageColor(
                  coin.price_change_percentage_1h_in_currency
                )}`}
              >
                {formatPercentage(coin.price_change_percentage_1h_in_currency)}
              </td>
              <td
                className={`p-6 font-medium ${getPercentageColor(
                  coin.price_change_percentage_24h
                )}`}
              >
                {formatPercentage(coin.price_change_percentage_24h)}
              </td>
              <td
                className={`p-6 font-medium ${getPercentageColor(
                  coin.price_change_percentage_7d_in_currency
                )}`}
              >
                {formatPercentage(coin.price_change_percentage_7d_in_currency)}
              </td>
              <td className="p-6 font-medium text-gray-900">
                ${coin.total_volume.toLocaleString()}
              </td>
              <td className="p-6 font-medium text-gray-900">
                ${coin.market_cap.toLocaleString()}
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

      <div ref={ref} className="py-6 text-center">
        {isFetchingNextPage ? (
          <p className="text-sm text-gray-500">Loading more...</p>
        ) : hasNextPage ? (
          <p className="text-sm text-blue-500">Scroll to load more...</p>
        ) : (
          <p className="text-sm text-gray-400">No more data</p>
        )}
      </div>

      <div className="flex items-center justify-end px-6 pb-6">
        <FormControl size="small" className="min-w-[4rem]">
          <InputLabel>Rows</InputLabel>
          <Select
            value={perPage.toString()}
            onChange={handleChange}
            label="Rows"
          >
            {[25, 50, 100].map((num) => (
              <MenuItem key={num} value={num.toString()}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <ScrollToTopButton />
    </div>
  );
}
