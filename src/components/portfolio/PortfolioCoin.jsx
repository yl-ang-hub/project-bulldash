import React, { useState } from "react";
import {
  useSuspenseQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { coinsSGDPrice } from "@/data/qCoinsSGDPrice";
import { qCoinsUSDPriceQueryOptions } from "@/services/CoinApiService";
const PortfolioCoinWatchCard = React.lazy(
  () => import("./PortfolioCoinWatchCard")
);

const PortfolioCoin = () => {
  const queryClient = useQueryClient();
  const [portfolioSymbols, setPortfolioSymbols] = useState([]);
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
        console.log(JSON.stringify(data));
        const symbolsList = data.records.map((coin) => coin.fields.symbol);
        console.log(symbolsList.join("%2C"));
        setPortfolioSymbols(symbolsList.join("%2C"));
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    retry: 0,
  });

  const qCoinQuotes = useSuspenseQuery(
    qCoinsUSDPriceQueryOptions(portfolioSymbols)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-1/2">
        <div>
          {qCoinsFromPortfolioDB.isSuccess && (
            <PortfolioCoinWatchCard
              dataType="coin"
              headerRows={headerRows}
              portfolioData={qCoinsFromPortfolioDB.data}
              // currentPrice={priceData}
              currentPrice={qCoinQuotes.data}
            >
              Coins
            </PortfolioCoinWatchCard>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default PortfolioCoin;
