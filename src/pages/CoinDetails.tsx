import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/common/Loader";
import CoinGraph from "../components/coin/CoinGraph";
import CoinInfoCard from "../components/coin/CoinInfoCard";
import { CoinTypes } from "../types/Coin";
import ScrollToTopButton from "../components/common/ScrollToTopButton";

import { fetchCoinDetail } from "../api/coinQueries";

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();


  // const { data, isLoading, error } = useQuery<CoinTypes>({
  //   queryKey: ["coinDetail", id],
  //   queryFn: async () => {
  //     const response = await axiosInstance.get(
  //       `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  //     );
  //     return response.data;
  //   },
  //   staleTime: 60000,
  //   enabled: !!id,
  // });
  if (!id) return <div>Invalid coin ID</div>;
  const { data, isLoading, error } = useQuery<CoinTypes>({
    queryKey: ["coinDetail", id],
    queryFn: () => fetchCoinDetail(id),
    staleTime: 60000,
    enabled: !!id,
  });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-red-500 font-bold m-auto text-3xl">
        Error loading coin details...
      </div>
    );
  if (!data) return null;

  return (
    <>
      <div className="flex flex-col md:flex-row items-start justify-center mt-10 space-x-4">
        <CoinInfoCard data={data} />
        <div className="w-[60%] pl-10">{id && <CoinGraph id={id} />}</div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
