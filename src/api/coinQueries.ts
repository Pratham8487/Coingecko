import axiosInstance from "../utils/axiosInstance";
import { CoinTypes } from "../types/Coin";
import dayjs from "dayjs";

export type SortOrderType =
  | "market_cap_desc"
  | "market_cap_asc"
  | "volume_desc"
  | "volume_asc"
  | "id_asc"
  | "id_desc";

export type Crypto = {
  sparkline_in_7d: any;
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  total_volume: number;
  market_cap: number;
};

export const fetchCoinTable = async (
  page: number,
  perPage: number,
  sortOrder: SortOrderType = "market_cap_desc"
): Promise<Crypto[]> => {
  const response = await axiosInstance.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      order: sortOrder,
      per_page: perPage,
      page,
      sparkline: false,
      price_change_percentage: "1h,24h,7d,14d,30d,1y",
    },
  });
    

  return response.data.map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price,
    price_change_percentage_1h_in_currency:
      coin.price_change_percentage_1h_in_currency,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    price_change_percentage_7d_in_currency:
      coin.price_change_percentage_7d_in_currency,
    total_volume: coin.total_volume,
    market_cap: coin.market_cap,
  }));
};

interface FetchInfiniteCoinsParams {
  pageParam?: number;
  perPage: number;
  sortOrder: SortOrderType;
}

export const fetchInfiniteCoins = async ({
  pageParam = 1,
  perPage,
  sortOrder,
}: FetchInfiniteCoinsParams): Promise<Crypto[]> => {
  const response = await axiosInstance.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      order: sortOrder,
      per_page: perPage,
      page: pageParam,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
  });

  return response.data;
};

export const fetchCoinDetail = async (id: string): Promise<CoinTypes> => {
  const params = {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  };

  const response = await axiosInstance.get(`/coins/${id}`, { params });
  return response.data;
};


export const fetchMarketChart = async (id: string, range: "24h" | "7d" | "1m" | "3m" | "1y") => {
  // Mapping custom ranges to CoinGecko 'days' values
  const rangeMap: Record<typeof range, number | string> = {
    "24h": 1,
    "7d": 7,
    "1m": 30,
    "3m": 90,
    "1y": 365,
  };

  const days = rangeMap[range];

  const { data } = await axiosInstance.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: "usd",
      days,
    },
  });

  console.log(data.prices);

  return data.prices.map(([timestamp, price]: [number, number]) => ({
    time: dayjs(timestamp).format(range === "24h" ? "HH:mm" : "DD MMM"),
    price: parseFloat(price.toFixed(2)),
  }));
};
