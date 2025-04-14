// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// // import axiosInstance from "../../utils/axiosInstance";
// // import dayjs from "dayjs";
// import { fetchMarketChart } from "../../api/coinQueries";

// // const fetchMarketChart = async (id: string) => {
// //   const { data } = await axiosInstance.get(`/coins/${id}/market_chart`, {
// //     params: {
// //       vs_currency: "usd",
// //       days: 1,
// //     },
// //   });

// //   console.log(data.prices);

// //   return data.prices.map(([timestamp, price]: [number, number]) => ({
// //     time: dayjs(timestamp).format("HH:mm"),
// //     price: parseFloat(price.toFixed(2)),
// //   }));
// // };
// // const [days, setdays] = useState<"7d" | "24h" | "1m" | "3m" | "1y">("7d");

// interface CoinGraphProps {
//   id: string;
// }

// const CoinGraph: React.FC<CoinGraphProps> = ({ id }) => {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: [id, "market-chart"],
//     queryFn: () => fetchMarketChart(id, "24h"),
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-full bg-blue-50 text-blue-600 font-medium text-lg rounded-xl shadow-inner">
//         Loading chart...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center h-64 bg-red-50 text-red-600 font-medium text-lg rounded-xl shadow-inner">
//         Error loading chart. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-[40rem] p-6 bg-white rounded-2xl border border-gray-100">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">
//         {id.toUpperCase()} Price{" "}
//         <span className="text-sm font-medium text-gray-500">(Last 24h)</span>
//       </h2>
//       <div className="w-full h-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#e5e7eb"
//               vertical={false}
//             />
//             <XAxis
//               dataKey="time"
//               tick={{ fill: "#6b7280", fontSize: 12 }}
//               axisLine={{ stroke: "#d1d5db" }}
//               tickLine={false}
//             />
//             <YAxis
//               domain={["auto", "auto"]}
//               tickFormatter={(value) => `$${value}`}
//               tick={{ fill: "#6b7280", fontSize: 12 }}
//               axisLine={{ stroke: "#d1d5db" }}
//               tickLine={false}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#f9fafb",
//                 borderColor: "#d1d5db",
//               }}
//               labelStyle={{ color: "#374151" }}
//               formatter={(value: number) => `$${value}`}
//             />
//             <Line
//               type="monotone"
//               dataKey="price"
//               stroke="#4BCC00"
//               strokeWidth={3}
//               dot={false}
//               activeDot={{ stroke: "#246001", strokeWidth: 2, r: 5 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default CoinGraph;






import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchMarketChart } from "../../api/coinQueries";

interface CoinGraphProps {
  id: string;
}

const ranges = ["24h", "7d", "1m", "3m", "1y"] as const;
type Range = typeof ranges[number];

const CoinGraph: React.FC<CoinGraphProps> = ({ id }) => {
  const [days, setDays] = useState<Range>("7d");

  const { data, isLoading, isError } = useQuery({
    queryKey: [id, "market-chart", days],
    queryFn: () => fetchMarketChart(id, days),
  });

  return (
    <div className="w-full h-[40rem] p-6 bg-white rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
          {id.toUpperCase()} Price{" "}
          <span className="text-sm font-medium text-gray-500">(Last {days})</span>
        </h2>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setDays(range)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                days === range
                  ? "bg-white text-black shadow"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full bg-blue-50 text-blue-600 font-medium text-lg rounded-xl shadow-inner">
          Loading chart...
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-64 bg-red-50 text-red-600 font-medium text-lg rounded-xl shadow-inner">
          Error loading chart. Please try again later.
        </div>
      ) : (
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderColor: "#d1d5db",
                }}
                labelStyle={{ color: "#374151" }}
                formatter={(value: number) => `$${value}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4BCC00"
                strokeWidth={3}
                dot={false}
                activeDot={{ stroke: "#246001", strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CoinGraph;
