import React from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import MarketCoinWatchCard from "./MarketCoinWatchCard";

const MarketCoin = () => {
  const queryClient = useQueryClient();

  const qCoinsTrending = useSuspenseQuery({
    queryKey: ["qCoinsTrending"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_COINGECKO}search/trending`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_APIKEY,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Request error");
      }
      const data = await res.json();
      console.log(JSON.stringify(data.coins));
      return data.coins;
    },
    retry: 0,
    staleTime: Infinity,
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="block">
        {qCoinsTrending.isSuccess && (
          <MarketCoinWatchCard dataType="coin" trendData={qCoinsTrending?.data}>
            Trending Coins
          </MarketCoinWatchCard>
        )}
      </div>
    </Suspense>
  );
};

export default MarketCoin;
