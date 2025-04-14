import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

const useCoinChartData = (id: string) => {
  return useQuery({
    queryKey: ["coinChart", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/coins/${id}/market_chart`, {
        params: {
          vs_currency: "usd",
          days: 1,
          interval: "hourly",
        },
      });
      return response.data;
    },
    staleTime: 60000,
    enabled: !!id,
  });
};

export default useCoinChartData;
