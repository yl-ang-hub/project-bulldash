import { Suspense } from "react";
import { useQueries, useSuspenseQuery } from "@tanstack/react-query";
import { PortfolioStockWatchCard } from "./PortfolioStockWatchCard";
import { readDB } from "@/services/DBApiService";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const PortfolioStock = () => {
  const headerRows = [
    "Company",
    "Ticker",
    "Quantity",
    "Price",
    "Portfolio Value",
    "Gain",
  ];

  const qStocksFromPortfolioDB = useSuspenseQuery({
    queryKey: ["readStocksFromPortfolioDB"],
    queryFn: () => readDB("StocksPortfolioDB?maxRecords=100&view=Grid%20view"),
    retry: 0,
  });

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
    queries: qStocksFromPortfolioDB.data
      ? qStocksFromPortfolioDB.data.records.map((datum) => {
          return {
            queryKey: [
              "qQuote",
              qStocksFromPortfolioDB.data,
              datum.fields.symbol,
            ],
            queryFn: () => fetchStockQuote(datum.fields.symbol),
            retry: 0,
            staleTime: Infinity,
          };
        })
      : [],
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="block">
        {qStocksFromPortfolioDB.isSuccess && (
          <PortfolioStockWatchCard
            dataType="stocks"
            headerRows={headerRows}
            portfolioData={qStocksFromPortfolioDB.data}
            currentPrice={qStockQuotes.map((query) => query.data)}
          >
            Stocks
          </PortfolioStockWatchCard>
        )}
      </div>
    </Suspense>
  );
};

export default PortfolioStock;
