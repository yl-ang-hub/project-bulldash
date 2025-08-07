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
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { readDB } from "@/services/DBApiService";

const PortfolioChart = () => {
  const queryClient = useQueryClient();
  // COIN: get portfolio data from cache
  const [coinIds, setCoinIds] = useState([]);
  const [stockIds, setStockIds] = useState([]);
  const [assetIds, setAssetIds] = useState([]);
  const [selectId, setSelectId] = useState("");

  const qCoinsFromPortfolioDB = useSuspenseQuery({
    queryKey: ["readCoinsFromPortfolioDB"],
    queryFn: () => readDB("CoinsPortfolioDB?maxRecords=100&view=Grid%20view"),
    retry: 0,
  });

  const qStocksFromPortfolioDB = useSuspenseQuery({
    queryKey: ["readStocksFromPortfolioDB"],
    queryFn: () => readDB("StocksPortfolioDB?maxRecords=100&view=Grid%20view"),
    retry: 0,
  });

  useEffect(() => {
    const coinIdTickerArray = qCoinsFromPortfolioDB.data?.records.map(
      (data) => data.fields.idTicker
    );
    setCoinIds(coinIdTickerArray);
    const stockIdTickerArray = qStocksFromPortfolioDB.data?.records.map(
      (data) => data.fields.idTicker
    );
    setStockIds(stockIdTickerArray);
    const idTickerArray = [...coinIdTickerArray];
    stockIdTickerArray.forEach((id) => idTickerArray.push(id));
    setAssetIds(idTickerArray);
    setSelectId(idTickerArray[0]);
  }, [qCoinsFromPortfolioDB.data, qStocksFromPortfolioDB.data]);

  // useEffect(() => {
  //   queryClient.invalidateQueries(["qCoinsUSDChartData"]);
  // }, [selectCoinId]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="w-[760px] justify-self-center">
        {/* <p>{coinPortfolio ? JSON.stringify(coinPortfolio) : ""}</p>
        <p>
          {coinPortfolio ? getFormattedCoinChartData() : "Didn't run formatter"}
        </p> */}
        <Select
          className="rounded"
          value={selectId}
          onValueChange={setSelectId}
        >
          <SelectTrigger className="w-[180px] rounded">
            <SelectValue placeholder="Select an asset">{selectId}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Coins</SelectLabel>
              {coinIds?.map((asset, idx) => {
                return (
                  <SelectItem key={idx} value={asset}>
                    {asset}
                  </SelectItem>
                );
              })}
              <SelectLabel>Stocks</SelectLabel>
              {stockIds?.map((asset, idx) => {
                return (
                  <SelectItem key={idx} value={asset}>
                    {asset}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-[760px] justify-self-center">
        <PortfolioChartArea
          idTicker={selectId}
          isCoin={coinIds.includes(selectId)}
          isStock={stockIds.includes(selectId)}
        />
      </div>
    </Suspense>
  );
};

export default PortfolioChart;
