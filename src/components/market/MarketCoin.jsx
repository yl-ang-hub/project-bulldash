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

  // const qCoinsTrending = useSuspenseQuery({
  //   queryKey: ["qCoinsTrending"],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `${import.meta.env.VITE_COINGECKO}search/trending`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_APIKEY,
  //         },
  //       }
  //     );
  //     if (!res.ok) {
  //       throw new Error("Request error");
  //     }
  //     const data = await res.json();
  //     console.log(JSON.stringify(data));
  //     return data;
  //   },
  //   retry: 0,
  //   staleTime: Infinity,
  //   enabled: !!qCoinsFromPortfolioDB.data,
  // });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="block">
        {/* {qCoinsFromPortfolioDB.isSuccess && (
          <PortfolioCoinWatchCard
            dataType="coin"
            headerRows={headerRows}
            portfolioData={qCoinsFromPortfolioDB.data}
            currentPrice={qCoinQuotes.data}
          >
            Coins
          </PortfolioCoinWatchCard>
        )} */}
      </div>
    </Suspense>
  );
};

export default PortfolioCoin;
