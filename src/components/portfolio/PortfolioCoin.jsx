import {
  useSuspenseQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import PortfolioWatchCard from "./PortfolioWatchCard";
import { readCoinsFromDBQueryOptions } from "@/services/DBApiService";
import { Suspense } from "react";
import { coinsSGDPrice } from "@/data/qCoinsSGDPrice";

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

  const { data, isSuccess } = useSuspenseQuery(readCoinsFromDBQueryOptions());
  // TODO: Link to live coin pricing @ CoinGecko
  const priceData = coinsSGDPrice;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-1/2">
        <div>
          {isSuccess && (
            <PortfolioWatchCard
              headerRows={headerRows}
              portfolioData={data}
              currentPrice={priceData}
            >
              Coins
            </PortfolioWatchCard>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default PortfolioCoin;
