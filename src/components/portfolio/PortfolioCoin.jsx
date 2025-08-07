import React from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
const PortfolioCoinWatchCard = React.lazy(
  () => import("./PortfolioCoinWatchCard")
);

const PortfolioCoin = () => {
  const queryClient = useQueryClient();
  const headerRows = [
    "Name",
    "Symbol",
    "Quantity",
    "Price",
    "Portfolio Value",
    "Gain",
  ];

  const qCoinsFromPortfolioDB = useSuspenseQuery({
    queryKey: ["readCoinsFromPortfolioDB"],
    queryFn: async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_AIRTABLE_API +
            "CoinsPortfolioDB?maxRecords=100&view=Grid%20view",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + import.meta.env.VITE_AIRTABLE_TOKEN,
            },
          }
        );
        const data = await res.json();
        // console.log(JSON.stringify(data));
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    retry: 0,
  });

  const qCoinQuotes = useSuspenseQuery({
    queryKey: ["qCoinsUSDPrice"],
    queryFn: async () => {
      const symbols = qCoinsFromPortfolioDB.data.records.map(
        (coin) => coin.fields.symbol
      );
      const endpoint =
        "coins/markets?vs_currency=usd&symbols=" +
        symbols.join("%2C") +
        "&include_tokens=top&order=market_cap_desc&per_page=250&sparkline=true&price_change_percentage=1h&locale=en&precision=full";
      const res = await fetch(import.meta.env.VITE_COINGECKO + endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_APIKEY,
        },
      });
      if (!res.ok) {
        throw new Error("Request error");
      }
      const data = await res.json();
      // console.log(JSON.stringify(data));
      return data;
    },
    retry: 0,
    staleTime: Infinity,
    enabled: !!qCoinsFromPortfolioDB.data,
  });

  // console.log(qCoinQuotes.data);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="block">
        {qCoinsFromPortfolioDB.isSuccess && (
          <PortfolioCoinWatchCard
            dataType="coin"
            headerRows={headerRows}
            portfolioData={qCoinsFromPortfolioDB.data}
            currentPrice={qCoinQuotes.data}
          >
            Coins
          </PortfolioCoinWatchCard>
        )}
      </div>
    </Suspense>
  );
};

export default PortfolioCoin;
