import { Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import Portfolio from "./components/portfolio/Portfolio";
import Market from "./components/market/Market";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import News from "./components/news/News";

function App() {
  const queryClient = useQueryClient();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="mx-auto mt-6 text-center">
        <h1 className="mb-4 text-8xl font-extrabold dark:text-white md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-500 via-green-500 to-indigo-400  hover:from-purple-600 hover:via-orange-600 hover:to-indigo-600 inline-block text-transparent bg-clip-text">
          BULLDASH
        </h1>
        <div>
          <Tabs defaultValue="portfolio" className="block my-6">
            <TabsList className="text-center font-bold rounded-xl bg-slate-300 my-1">
              <TabsTrigger
                value="portfolio"
                className="px-4 py-3 border-none rounded-xl  hover:bg-slate-200"
              >
                <NavLink
                  to="/portfolio"
                  className="w-[100px] !no-underline text-lg font-bold dark:text-blue-200"
                >
                  Portfolio
                </NavLink>
              </TabsTrigger>

              <TabsTrigger
                value="market"
                className="px-4 py-3 border-none rounded-xl  hover:bg-slate-200"
              >
                <NavLink
                  to="/market"
                  className="w-[100px] !no-underline text-lg font-bold dark:text-blue-200"
                >
                  Market
                </NavLink>
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="px-4 py-3 border-none rounded-xl  hover:bg-slate-200"
              >
                <NavLink
                  to="/news"
                  className="w-[100px] !no-underline text-lg font-bold dark:text-blue-200"
                >
                  News
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
                path="/market"
                element={
                  <TabsContent value="market">
                    <Market />
                  </TabsContent>
                }
              />
              <Route
                path="/news"
                element={
                  <TabsContent value="news">
                    <News />
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
