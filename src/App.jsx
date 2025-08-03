import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fullCoinListingQueryOptions,
  qCoinSGDChartQueryOptions,
  qCoinsSGDPriceQueryOptions,
} from "./services/CoinApiService";
import { buildRecords, createDB } from "./services/DBApiService";
import { bitcoin60dChartSGD } from "../data/bitcoin60dChart";
import { getDate } from "./services/DatetimeService";
import { useEffect } from "react";

function App() {
  const queryClient = useQueryClient();

  const parseEpochData = () => {
    bitcoin60dChartSGD.prices.forEach((datum) =>
      console.log(datum[0], getDate(datum[0]), datum[1])
    );
  };

  // API CALLS - Coin Gecko

  // Get coin listing on CoinGecko
  // const qCoinListing = useQuery(fullCoinListingQueryOptions());

  // get current price for list of coins
  // coinIds must be comma-separated
  const top10Coins =
    "bnb%2Cbtc%2Cada%2Cdoge%2Ceth%2Cxrp%2Csol%2Cusdt%2Ctrx%2Cusdc";
  const qCoinsSGDPrice = useQuery(qCoinsSGDPriceQueryOptions(top10Coins));

  // Get 60 days price of a Coin for charting - ran once for btc
  // const qCoinChart = useQuery(qCoinSGDChartQueryOptions());

  // get top 15 coins (by user search) in last 24h

  useEffect(() => {
    parseEpochData();
  });

  return (
    <div>
      <h1>Hello World</h1>
      {/* <h2>{qCoinListing.isSuccess && JSON.stringify(qCoinListing.data)}</h2> */}
      {/*<h2>{JSON.stringify(state)}</h2> */}
    </div>
  );
}

export default App;
