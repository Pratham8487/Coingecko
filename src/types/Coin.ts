export type CoinTypes = {
    id: string;
    symbol: string;
    name: string;
    image: {
      large: string;
      small: string;
      thumb: string;
    };
    market_data: {
      current_price: { usd: number };
      market_cap: { usd: number };
      fully_diluted_valuation: { usd: number };
      total_volume: { usd: number };
      circulating_supply: number;
      total_supply: number;
      max_supply: number;
      price_change_percentage_24h: number;
      price_change_percentage_1h_in_currency: number;
      high_24h: { usd: number };
      low_24h: { usd: number };
      high_7d: { usd: number };
      low_7d: { usd: number };
      sparkline_in_7d?: {
        price: number[];
      };
    };
    description: { en: string };
    market_cap_rank: number;
    
  };
