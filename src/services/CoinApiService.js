import { queryOptions } from "@tanstack/react-query";

// curr staleTime, gcTime, refetchOnWindowFocus aims to reduce API calls
// TODO: reset all staleTime and gcTime during demo

const fetchData = async (endpoint, args) => {
  const defaultArgs = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_APIKEY,
    },
  };
  const finalArgs = args || defaultArgs;
  console.log(endpoint, finalArgs);
  const res = await fetch(import.meta.env.VITE_COINGECKO + endpoint, finalArgs);
  console.log(JSON.stringify(res));
  if (!res.ok) {
    throw new Error("Request error");
  }
  const data = await res.json();
  console.log(JSON.stringify(data));
  return data;
};

// export const fullCoinListingQueryOptions = () => {
//   const endpoint = "coins/list?include_platform=true";
//   return queryOptions({
//     queryKey: ["fullCoinList"],
//     queryFn: () => fetchData(endpoint),
//     staleTime: Infinity,
//     gcTime: Infinity,
//   });
// };

export const qCoinUSDChartQueryOptions = (coinId, days) => {
  const endpoint =
    "coins/" + coinId + "/market_chart?vs_currency=usd&days=" + days;
  return queryOptions({
    queryKey: ["qCoinUSDChart"],
    queryFn: () => fetchData(endpoint),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// top 15 trending coins (by user search) in last 24h
export const qCoinTrendingQueryOptions = () => {
  const endpoint = "search/trending";
  return queryOptions({
    queryKey: ["qCoinTrending"],
    queryFn: () => fetchData(endpoint),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

const qCoinsUSDPriceQueryOptions = (coinSymbols) => {
  const endpoint =
    "coins/markets?vs_currency=usd&symbols=" +
    coinSymbols +
    "&include_tokens=top&order=market_cap_desc&per_page=250&sparkline=true&price_change_percentage=1h&locale=en&precision=full";
  console.log(endpoint);
  return queryOptions({
    queryKey: ["qCoinsUSDPrice"],
    queryFn: () => fetchData(endpoint),
    retry: 0,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
