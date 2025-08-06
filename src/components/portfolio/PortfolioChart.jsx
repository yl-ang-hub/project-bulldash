import React, { Suspense, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PortfolioChartArea } from "./PortfolioChartArea";
import {
  useQueryClient,
  useQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";

const PortfolioChart = () => {
  const queryClient = useQueryClient();

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
        // console.log(JSON.stringify(data));
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    retry: 0,
  });

  // COIN: get portfolio data from cache
  const [coinIds, setCoinIds] = useState([]);
  const [selectCoinId, setSelectCoinId] = useState("");

  useEffect(() => {
    const idTickerArray = qCoinsFromPortfolioDB.data?.records.map(
      (data) => data.fields.idTicker
    );
    setCoinIds(idTickerArray);
    setSelectCoinId(idTickerArray[0]);
  }, [qCoinsFromPortfolioDB.data]);

  // useEffect(() => {
  //   queryClient.invalidateQueries(["qCoinsUSDChartData"]);
  // }, [selectCoinId]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {/* <p>{coinPortfolio ? JSON.stringify(coinPortfolio) : ""}</p>
        <p>
          {coinPortfolio ? getFormattedCoinChartData() : "Didn't run formatter"}
        </p> */}
        <Select
          className="rounded"
          value={selectCoinId}
          onValueChange={setSelectCoinId}
        >
          <SelectTrigger className="w-[180px] rounded">
            <SelectValue placeholder="Select an asset">
              {selectCoinId}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Coins</SelectLabel>
              {coinIds?.map((coin, idx) => {
                return (
                  <SelectItem key={idx} value={coin}>
                    {coin}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <PortfolioChartArea idTicker={selectCoinId} />
      </div>
    </Suspense>
  );
};

export default PortfolioChart;
