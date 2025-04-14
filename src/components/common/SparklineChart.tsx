// components/SparklineChart.tsx
import {
    Sparklines,
    SparklinesLine,
  } from "react-sparklines";
  
  interface Props {
    prices: number[];
  }
  
  export default function SparklineChart({ prices }: Props) {
    const isPositive = prices[prices.length - 1] - prices[0] >= 0;
  
    return (
      <div className="w-[100px] h-[40px]">
        <Sparklines data={prices} width={100} height={40} margin={0}>
          <SparklinesLine
            color={isPositive ? "#16a34a" : "#dc2626"}
            style={{ strokeWidth: 1, fill: "none" }}
          />
        </Sparklines>
      </div>
    );
  }
  