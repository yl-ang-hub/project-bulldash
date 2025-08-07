import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import MarketStockWatchCard from "./MarketStockWatchCard";

const MarketStock = () => {
  const queryClient = useQueryClient();

  const qStocksMovers = useSuspenseQuery({
    queryKey: ["qStocksMovers"],
    queryFn: async () => {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${import.meta.env.VITE_ALPHAVANTAGE_APIKEY}`
      );
      if (!res.ok) {
        throw new Error("Request error");
      }
      return await res.json();
    },
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div>
        {qStocksMovers.isSuccess && (
          <MarketStockWatchCard
            dataType="stocks"
            stocksMoversData={qStocksMovers.data.top_gainers}
          >
            US Stocks - Top Gainers
          </MarketStockWatchCard>
        )}
      </div>
      <div>
        {qStocksMovers.isSuccess && (
          <MarketStockWatchCard
            dataType="stocks"
            stocksMoversData={qStocksMovers.data.top_losers}
          >
            US Stocks - Top Losers
          </MarketStockWatchCard>
        )}
      </div>
      <div>
        {qStocksMovers.isSuccess && (
          <MarketStockWatchCard
            dataType="stocks"
            stocksMoversData={qStocksMovers.data.most_actively_traded}
          >
            US Stocks - Most Actively Traded
          </MarketStockWatchCard>
        )}
      </div>
    </Suspense>
  );
};

export default MarketStock;
