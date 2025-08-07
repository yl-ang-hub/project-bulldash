"use client";
import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function PortfolioChartArea(props) {
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState("90d");

  console.log(props.isCoin, props.isStock);

  // COIN: API call to get data for charting
  const fetchCoinChartData = async (idTicker) => {
    console.log("Running fetchCoinChartData");
    const res = await fetch(
      `${import.meta.env.VITE_COINGECKO}coins/${idTicker}/market_chart?vs_currency=usd&days=90&interval=daily&precision=3`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Request error");
    }
    const data = await res.json();
    // console.log(JSON.stringify(data));
    const chartData = data.prices.map((point) => {
      // console.log(point);
      const dateObj = new Date(point[0]);
      const formattedDate = dateObj.toISOString().split("T")[0];
      return { date: formattedDate, price: point[1] };
    });
    return chartData;
  };
  const qCoinChartData = useQuery({
    queryKey: ["qCoinsUSDChartData", props.idTicker],
    queryFn: () => fetchCoinChartData(props.idTicker),
    retry: 0,
    staleTime: Infinity,
    enabled: props.isCoin,
  });

  // STOCK: API call to get data for charting
  const fetchStockChartData = async () => {
    console.log("Running qStockChartData");
    const res = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${props.idTicker}&apikey=${import.meta.env.VITE_ALPHAVANTAGE_APIKEY}`
    );
    if (!res.ok) {
      throw new Error("Request error");
    }
    const data = await res.json();
    console.log(JSON.stringify(data));
    const chartData = [];
    for (const [key, value] of Object.entries(data["Time Series (Daily)"])) {
      console.log(`Running ${key} and ${value}`);
      chartData.push({
        date: key,
        price: parseFloat(value["4. close"]),
      });
    }
    console.log(JSON.stringify(chartData));
    return chartData;
  };
  const qStockChartData = useQuery({
    queryKey: ["qStocksUSDChartData", props.idTicker],
    queryFn: () => fetchStockChartData(props.idTicker),
    retry: 0,
    staleTime: Infinity,
    enabled: props.isStock,
  });

  const chartFilter = (data) => {
    return data.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date("2025-08-07");
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);

      return date >= startDate;
    });
  };

  let filteredData = [],
    minY = 0,
    maxY = 0;
  if (props.isCoin) {
    if (qCoinChartData.data) {
      filteredData = chartFilter(qCoinChartData?.data);
      maxY = qCoinChartData.data?.reduce((acc, curr) => {
        return Math.max(acc, curr.price * 1.05);
      }, 0);
      minY = qCoinChartData.data?.reduce((acc, curr) => {
        return Math.min(acc, curr.price * 0.95);
      }, maxY);
    }
  } else {
    if (qStockChartData.data) {
      filteredData = chartFilter(qStockChartData?.data);
      maxY = qStockChartData.data?.reduce((acc, curr) => {
        return Math.max(acc, curr.price * 1.05);
      }, 0);
      minY = qStockChartData.data?.reduce((acc, curr) => {
        return Math.min(acc, curr.price * 0.95);
      }, maxY);
    }
  }

  const chartConfig = {
    price: {
      label: "Price (USD)",
      color: "var(--chart-5)",
    },
  };

  return (
    <Card className="pt-0 mb-20">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center pl-32">
          <CardTitle>Area Chart for {props.idTicker} - Interactive</CardTitle>
          <CardDescription>Showing price for the last 3 months</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[360px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              type="number"
              domain={[minY, maxY]}
              allowDataOverflow={true}
              hide
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke="var(--color-price)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
