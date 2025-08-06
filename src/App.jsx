import { Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { bitcoin60dChartSGD } from "./data/bitcoin60dChart";
import { getDate } from "./services/DatetimeService";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import Portfolio from "./components/portfolio/Portfolio";
import Watchlist from "./components/watchlist/Watchlist";
import Market from "./components/market/Market";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

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
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto mt-6 w-[500px] text-center">
        <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          BULLDASH
        </h1>
        <div>
          <Tabs defaultValue="portfolio" className="block my-6">
            <TabsList className="">
              <TabsTrigger
                value="portfolio"
                className="px-4 py-3 border-none rounded  hover:bg-gray-50"
              >
                <NavLink
                  to="/portfolio"
                  className="text-black font-normal !no-underline"
                >
                  Portfolio
                </NavLink>
              </TabsTrigger>
              <TabsTrigger
                value="watchlist"
                className="px-4 py-3 border-none rounded  hover:bg-gray-50"
              >
                <NavLink
                  to="/watchlist"
                  className="text-black font-normal !no-underline"
                >
                  Watchlist
                </NavLink>
              </TabsTrigger>
              <TabsTrigger
                value="market"
                className="px-4 py-3 border-none rounded  hover:bg-gray-50"
              >
                <NavLink
                  to="/market"
                  className="text-black font-normal !no-underline"
                >
                  Market
                </NavLink>
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
