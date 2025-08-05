import { Suspense, useEffect } from "react";
import { PortfolioStockWatchCard } from "./PortfolioStockWatchCard";
import { useQueries, useSuspenseQuery } from "@tanstack/react-query";
import { readStocksFromPortfolioDBQueryOptions } from "@/services/DBApiService";

const PortfolioStock = () => {
  const headerRows = [
    "Company",
    "Ticker",
    "Quantity",
    "Price",
    "Portfolio Value",
    "Gain",
  ];

  const { data, isSuccess } = useSuspenseQuery(
    readStocksFromPortfolioDBQueryOptions()
  );

  // Sample data
  // const priceData = [
  //   {
  //     id: "MFST",
  //     symbol: "MSFT",
  //     name: "Microsoft Corporation",
  //     current_price: 4479.877725186266,
  //   },
  //   {
  //     id: "NVDA",
  //     symbol: "NVDA",
  //     name: "NVIDIA Corporation",
  //     current_price: 4124.314,
  //   },
  //   {
  //     id: "GOOG",
  //     symbol: "GOOG",
  //     name: "Alphabet Inc",
  //     current_price: 2198.3982,
  //   },
  //   {
  //     id: "AMZN",
  //     symbol: "AMZN",
  //     name: "Amazon.com, Inc.",
  //     current_price: 3812.3902,
  //   },
  //   {
  //     id: "AAPL",
  //     symbol: "AAPL",
  //     name: "Apple Inc",
  //     current_price: 3812.3902,
  //   },
  // ];

  const fetchStockQuote = async (ticker) => {
    const res = await fetch(
      import.meta.env.VITE_FINNHUB_API +
        "/quote?symbol=" +
        ticker +
        "&token=" +
        import.meta.env.VITE_FINNHUB_APIKEY
    );
    if (!res.ok) {
      throw new Error("Request error - stock cannot be found");
    }
    const data = await res.json();
    return data;
  };

  const qStockQuotes = useQueries({
    queries: data
      ? data.records.map((datum) => {
          return {
            queryKey: ["qQuote", datum.fields.symbol],
            queryFn: () => fetchStockQuote(datum.fields.symbol),
            retry: 0,
            staleTime: Infinity,
            enabled: !!data,
          };
        })
      : [],
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-1/2">
        <div>
          {isSuccess && (
            <PortfolioStockWatchCard
              dataType="stocks"
              headerRows={headerRows}
              portfolioData={data}
              currentPrice={qStockQuotes.map((query) => query.data)}
            >
              Stocks
            </PortfolioStockWatchCard>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default PortfolioStock;
