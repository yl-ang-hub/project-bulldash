import { Suspense } from "react";
import {
  useQueryClient,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  fullCoinListingQueryOptions,
  qCoinUSDChartQueryOptions,
  qCoinsUSDPriceQueryOptions,
} from "./services/CoinApiService";
import { buildRecordsFromJS, createDB } from "./services/DBApiService";
import { bitcoin60dChartSGD } from "./data/bitcoin60dChart";
import { getDate } from "./services/DatetimeService";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import Portfolio from "./components/portfolio/Portfolio";
import Watchlist from "./components/watchlist/Watchlist";
import Market from "./components/market/Market";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto w-[500px] text-center">
        <h1>BullDash</h1>
        <div className="container mx-auto">
          <Tabs defaultValue="portfolio" className="row mx-auto">
            <TabsList>
              <TabsTrigger value="portfolio">
                <NavLink to="/portfolio">Portfolio</NavLink>
              </TabsTrigger>
              <TabsTrigger value="watchlist">
                <NavLink to="/watchlist">Watchlist</NavLink>
              </TabsTrigger>
              <TabsTrigger value="market">
                <NavLink to="/market">Market</NavLink>
              </TabsTrigger>
            </TabsList>
            <Routes>
              <Route path="/" element={<Navigate replace to="/portfolio" />} />
              <Route
                path="/portfolio"
                element={
                  <TabsContent value="portfolio">
                    <Portfolio />
                  </TabsContent>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <TabsContent value="watchlist">
                    <Watchlist />
                  </TabsContent>
                }
              />
              <Route
                path="/market"
                element={
                  <TabsContent value="market">
                    <Market />
                  </TabsContent>
                }
              />
            </Routes>
          </Tabs>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
