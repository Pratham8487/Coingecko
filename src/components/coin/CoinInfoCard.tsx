import { CoinTypes } from "../../types/Coin";
import {
  formatNumber,
  formatPercentage,
  getPercentageColor,
} from "../../utils/Format";
import { StatRow, EditButton } from "../../utils/UIHelpers";
import {
  FaAngleDown,
  FaCaretDown,
  FaCaretUp,
  FaChevronDown,
  FaInfoCircle,
} from "react-icons/fa";
import { useState } from "react";

interface CoinInfoCardProps {
  data: CoinTypes;
}

const CoinInfoCard = ({ data }: CoinInfoCardProps) => {
  const [solAmount, setSolAmount] = useState(1);
  const { name, symbol, image, market_data: md, market_cap_rank } = data;

  const solToUsdRate = md.current_price.usd;
  const usdValue = (solAmount * solToUsdRate).toFixed(2);

  const rangeWidth =
    ((md.current_price.usd - md.low_24h.usd) /
      (md.high_24h.usd - md.low_24h.usd)) *
    100;

  return (
    <div className="max-w-xl w-[40%] mx-auto p-4 bg-white rounded-2xl space-y-14 border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-2">
        <img src={image.large} alt={name} className="w-6 h-6" />
        <h1 className="text-xl font-bold">
          {name} <span className="uppercase text-gray-500">({symbol})</span>
        </h1>
        <span className="text-gray-500">{symbol.toUpperCase()} Price</span>
        <span className="bg-gray-100 text-xs px-2 py-1 rounded-xl font-semibold">
          #{market_cap_rank}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-end space-x-3">
        <h2 className="text-3xl font-bold">
          $ {formatPercentage(md.current_price.usd)}
        </h2>
        <span
          className={`flex items-center ${getPercentageColor(
            md.price_change_percentage_24h
          )}`}
        >
          {md.price_change_percentage_24h < 0 ? <FaCaretDown /> : <FaCaretUp />}
          {formatPercentage(md.price_change_percentage_24h)}
        </span>
        <FaInfoCircle className="text-gray-400" />
      </div>

      {/* Range bar */}
      <div className="w-full bg-gray-200 h-1 my-2 rounded-full">
        <div
          className="bg-green-500 h-1 rounded-full bg-gradient-to-r from-yellow-400 via-green-400 to-green-600 shadow-sm"
          style={{ width: `${rangeWidth}%` }}
        ></div>
      </div>

      {/* 24h range */}
      <div className="flex justify-between text-sm text-gray-950 mb-4 font-bold">
        <span>${formatPercentage(md.low_24h.usd)}</span>
        <span>24h Range</span>
        <span>${formatPercentage(md.high_24h.usd)}</span>
      </div>

      {/* Stats */}
      <div className="space-y-5 text-lg">
        <StatRow
          label="Market Cap"
          value={`$${formatNumber(md.market_cap.usd)}`}
        />
        <StatRow
          label="Fully Diluted Valuation"
          value={`$${formatNumber(md.fully_diluted_valuation.usd)}`}
        />
        <StatRow
          label="24 Hour Trading Volume"
          value={`$${formatNumber(md.total_volume.usd)}`}
        />
        <StatRow
          label="Circulating Supply"
          value={formatNumber(md.circulating_supply)}
        />
        <StatRow label="Total Supply" value={formatNumber(md.total_supply)} />
        <StatRow
          label="Max Supply"
          value={md.max_supply ? formatNumber(md.max_supply) : "-"}
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 mt-5">
        <EditButton label="Buy / Sell" icon={<FaAngleDown />} />
        <EditButton label="Wallet" icon={<FaAngleDown />} />
        <EditButton label="Earn Crypto" icon={<FaAngleDown />} />
      </div>

      {/* Converter */}
      <div className="max-w-full p-4 rounded-xl shadow-none">
        <h2 className="text-lg font-semibold mb-3">{name} Converter</h2>
        <div className="flex justify-between items-center border border-gray-400 rounded-lg px-4 py-2 mb-2">
          <input
            type="number"
            value={solAmount}
            onChange={(e) => setSolAmount(Number(e.target.value))}
            className="w-full outline-none"
          />
          <span className="ml-2 font-semibold text-gray-600">{name}</span>
        </div>
        <div className="flex justify-between items-center border border-gray-400 rounded-lg px-4 py-2">
          <span className="font-medium">{usdValue}</span>
          <div className="flex items-center gap-1 font-semibold text-gray-600">
            USD <FaChevronDown className="text-xs ml-1" />
          </div>
        </div>
      </div>

      {/* Historical */}
      <div>
        <h1 className="text-xl text-black font-bold uppercase p-2">
          {symbol} <span className="lowercase">Historical Price</span>
        </h1>
        <div className="space-y-3 text-md">
          <StatRow
            label="24h Range"
            value={`$${formatNumber(md.low_24h.usd)} - $${formatNumber(
              md.high_24h.usd
            )}`}
          />
          <StatRow
            label="7d Range"
            value={
              md.low_7d?.usd && md.high_7d?.usd
                ? `$${formatNumber(md.low_7d.usd)} - $${formatNumber(
                    md.high_7d.usd
                  )}`
                : "-"
            }
          />
          <StatRow
            label="All-Time High"
            value={md.high_24h?.usd ? `$${formatNumber(md.high_24h.usd)}` : "-"}
          />
          <StatRow
            label="All-Time Low"
            value={md.low_24h?.usd ? `$${formatNumber(md.low_24h.usd)}` : "-"}
          />
        </div>
        <EditButton label="Sign Up" />
      </div>
    </div>
  );
};

export default CoinInfoCard;
