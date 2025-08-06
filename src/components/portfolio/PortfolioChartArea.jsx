"use client";
import React, { useEffect, useState } from "react";
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

export const description = "An interactive area chart";

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

// // STOCK: get portfolio data from cache
// const stockPortfolio = queryClient.getQueryData([
//   "readStocksFromPortfolioDB",
// ]);
// // STOCK: API call to get data for charting
// const fetchStockChartData = async (symbol) => {
//   console.log("Running fetchStockChartData");
//   const res = await fetch(
//     `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=demo`
//   );
//   if (!res.ok) {
//     throw new Error("Request error");
//   }
//   const data = await res.json();
//   const chartData = {};
//   for (const [key, value] of Object.entries(data["Time Series (Daily)"])) {
//     chartData["date"] = key;
//     chartData["price"] = value["4. close"];
//   }
//   return { symbol: chartData };
// };

export function PortfolioChartArea(props) {
  const queryClient = useQueryClient();
  // const [displayedSymbol, setDisplayedSymbol] = useState("");
  const [timeRange, setTimeRange] = React.useState("90d");

  const qCoinChartData = useQuery({
    queryKey: ["qCoinsUSDChartData", props.idTicker],
    queryFn: () => fetchCoinChartData(props.idTicker),
    retry: 0,
    staleTime: Infinity,
  });

  const filteredData = qCoinChartData.data?.filter((item) => {
    // const filteredData = chartData.filter((item) => {
    console.log(JSON.stringify(qCoinChartData.data));
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

  const maxY = qCoinChartData.data?.reduce((acc, curr) => {
    return Math.max(acc, curr.price * 1.05);
  }, 0);
  const minY = qCoinChartData.data?.reduce((acc, curr) => {
    return Math.min(acc, curr.price * 0.95);
  }, maxY);
  console.log(minY);
  console.log(maxY);

  // useEffect(() => {
  //   setDisplayedSymbol(props.idTicker);
  //   queryClient.invalidateQueries(["qCoinsUSDChartData", props.idTicker]);
  // }, [props.idTicker]);

  const chartConfig = {
    // visitors: {
    //   label: "Visitors",
    // },
    // price: {
    //   label: "Price",
    //   color: "var(--chart-1)",
    // },
    price: {
      label: "Price (USD)",
      color: "var(--chart-5)",
    },
  };

  return (
    <Card className="pt-0 mb-20">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
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
              {/* <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient> */}
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
            {/* <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            /> */}
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

// const chartData = [
//   { date: "2024-04-01", price: 222, mobile: 150 },
//   { date: "2024-04-02", price: 97, mobile: 180 },
//   { date: "2024-04-03", price: 167, mobile: 120 },
//   { date: "2024-04-04", price: 242, mobile: 260 },
//   { date: "2024-04-05", price: 373, mobile: 290 },
//   { date: "2024-04-06", price: 301, mobile: 340 },
//   { date: "2024-04-07", price: 245, mobile: 180 },
//   { date: "2024-04-08", price: 409, mobile: 320 },
//   { date: "2024-04-09", price: 59, mobile: 110 },
//   { date: "2024-04-10", price: 261, mobile: 190 },
//   { date: "2024-04-11", price: 327, mobile: 350 },
//   { date: "2024-04-12", price: 292, mobile: 210 },
//   { date: "2024-04-13", price: 342, mobile: 380 },
//   { date: "2024-04-14", price: 137, mobile: 220 },
//   { date: "2024-04-15", price: 120, mobile: 170 },
//   { date: "2024-04-16", price: 138, mobile: 190 },
//   { date: "2024-04-17", price: 446, mobile: 360 },
//   { date: "2024-04-18", price: 364, mobile: 410 },
//   { date: "2024-04-19", price: 243, mobile: 180 },
//   { date: "2024-04-20", price: 89, mobile: 150 },
//   { date: "2024-04-21", price: 137, mobile: 200 },
//   { date: "2024-04-22", price: 224, mobile: 170 },
//   { date: "2024-04-23", price: 138, mobile: 230 },
//   { date: "2024-04-24", price: 387, mobile: 290 },
//   { date: "2024-04-25", price: 215, mobile: 250 },
//   { date: "2024-04-26", price: 75, mobile: 130 },
//   { date: "2024-04-27", price: 383, mobile: 420 },
//   { date: "2024-04-28", price: 122, mobile: 180 },
//   { date: "2024-04-29", price: 315, mobile: 240 },
//   { date: "2024-04-30", price: 454, mobile: 380 },
//   { date: "2024-05-01", price: 165, mobile: 220 },
//   { date: "2024-05-02", price: 293, mobile: 310 },
//   { date: "2024-05-03", price: 247, mobile: 190 },
//   { date: "2024-05-04", price: 385, mobile: 420 },
//   { date: "2024-05-05", price: 481, mobile: 390 },
//   { date: "2024-05-06", price: 498, mobile: 520 },
//   { date: "2024-05-07", price: 388, mobile: 300 },
//   { date: "2024-05-08", price: 149, mobile: 210 },
//   { date: "2024-05-09", price: 227, mobile: 180 },
//   { date: "2024-05-10", price: 293, mobile: 330 },
//   { date: "2024-05-11", price: 335, mobile: 270 },
//   { date: "2024-05-12", price: 197, mobile: 240 },
//   { date: "2024-05-13", price: 197, mobile: 160 },
//   { date: "2024-05-14", price: 448, mobile: 490 },
//   { date: "2024-05-15", price: 473, mobile: 380 },
//   { date: "2024-05-16", price: 338, mobile: 400 },
//   { date: "2024-05-17", price: 499, mobile: 420 },
//   { date: "2024-05-18", price: 315, mobile: 350 },
//   { date: "2024-05-19", price: 235, mobile: 180 },
//   { date: "2024-05-20", price: 177, mobile: 230 },
//   { date: "2024-05-21", price: 82, mobile: 140 },
//   { date: "2024-05-22", price: 81, mobile: 120 },
//   { date: "2024-05-23", price: 252, mobile: 290 },
//   { date: "2024-05-24", price: 294, mobile: 220 },
//   { date: "2024-05-25", price: 201, mobile: 250 },
//   { date: "2024-05-26", price: 213, mobile: 170 },
//   { date: "2024-05-27", price: 420, mobile: 460 },
//   { date: "2024-05-28", price: 233, mobile: 190 },
//   { date: "2024-05-29", price: 78, mobile: 130 },
//   { date: "2024-05-30", price: 340, mobile: 280 },
//   { date: "2024-05-31", price: 178, mobile: 230 },
//   { date: "2024-06-01", price: 178, mobile: 200 },
//   { date: "2024-06-02", price: 470, mobile: 410 },
//   { date: "2024-06-03", price: 103, mobile: 160 },
//   { date: "2024-06-04", price: 439, mobile: 380 },
//   { date: "2024-06-05", price: 88, mobile: 140 },
//   { date: "2024-06-06", price: 294, mobile: 250 },
//   { date: "2024-06-07", price: 323, mobile: 370 },
//   { date: "2024-06-08", price: 385, mobile: 320 },
//   { date: "2024-06-09", price: 438, mobile: 480 },
//   { date: "2024-06-10", price: 155, mobile: 200 },
//   { date: "2024-06-11", price: 92, mobile: 150 },
//   { date: "2024-06-12", price: 492, mobile: 420 },
//   { date: "2024-06-13", price: 81, mobile: 130 },
//   { date: "2024-06-14", price: 426, mobile: 380 },
//   { date: "2024-06-15", price: 307, mobile: 350 },
//   { date: "2024-06-16", price: 371, mobile: 310 },
//   { date: "2024-06-17", price: 475, mobile: 520 },
//   { date: "2024-06-18", price: 107, mobile: 170 },
//   { date: "2024-06-19", price: 341, mobile: 290 },
//   { date: "2024-06-20", price: 408, mobile: 450 },
//   { date: "2024-06-21", price: 169, mobile: 210 },
//   { date: "2024-06-22", price: 317, mobile: 270 },
//   { date: "2024-06-23", price: 480, mobile: 530 },
//   { date: "2024-06-24", price: 132, mobile: 180 },
//   { date: "2024-06-25", price: 141, mobile: 190 },
//   { date: "2024-06-26", price: 434, mobile: 380 },
//   { date: "2024-06-27", price: 448, mobile: 490 },
//   { date: "2024-06-28", price: 149, mobile: 200 },
//   { date: "2024-06-29", price: 103, mobile: 160 },
//   { date: "2024-06-30", price: 446, mobile: 400 },
// ];

// const chartData = [
//   { date: "2025-05-09", price: 103076.27555512934 },
//   { date: "2025-05-10", price: 102962.54045692299 },
//   { date: "2025-05-11", price: 104630.8792994166 },
//   { date: "2025-05-12", price: 103994.061616746 },
//   { date: "2025-05-13", price: 102876.8304286011 },
//   { date: "2025-05-14", price: 104184.49039270742 },
//   { date: "2025-05-15", price: 103594.42575090709 },
//   { date: "2025-05-16", price: 103708.85136423641 },
//   { date: "2025-05-17", price: 103556.03493982446 },
//   { date: "2025-05-18", price: 103212.36483885496 },
//   { date: "2025-05-19", price: 106030.6376831359 },
//   { date: "2025-05-20", price: 105629.41580436694 },
//   { date: "2025-05-21", price: 106786.71995834043 },
//   { date: "2025-05-22", price: 109665.86371625263 },
//   { date: "2025-05-23", price: 111560.356938144 },
//   { date: "2025-05-24", price: 107216.66856870624 },
//   { date: "2025-05-25", price: 107831.36374380375 },
//   { date: "2025-05-26", price: 108861.81037744327 },
//   { date: "2025-05-27", price: 109377.71513263129 },
//   { date: "2025-05-28", price: 109068.45694901445 },
//   { date: "2025-05-29", price: 107838.18431100152 },
//   { date: "2025-05-30", price: 105745.41660358038 },
//   { date: "2025-05-31", price: 104010.91956242644 },
//   { date: "2025-06-01", price: 104687.50742934884 },
//   { date: "2025-06-02", price: 105710.00593822816 },
//   { date: "2025-06-03", price: 105884.74263221149 },
//   { date: "2025-06-04", price: 105434.47745144971 },
//   { date: "2025-06-05", price: 104812.9182188067 },
//   { date: "2025-06-06", price: 101650.7387545425 },
//   { date: "2025-06-07", price: 104409.74967959142 },
//   { date: "2025-06-08", price: 105681.4546141758 },
//   { date: "2025-06-09", price: 105692.24740699006 },
//   { date: "2025-06-10", price: 110261.57485948496 },
//   { date: "2025-06-11", price: 110212.73252109604 },
//   { date: "2025-06-12", price: 108679.9760916168 },
//   { date: "2025-06-13", price: 105979.22902375912 },
//   { date: "2025-06-14", price: 106045.56440819203 },
//   { date: "2025-06-15", price: 105482.90611628917 },
//   { date: "2025-06-16", price: 105554.49383061715 },
//   { date: "2025-06-17", price: 106951.2720181497 },
//   { date: "2025-06-18", price: 104683.42479835715 },
//   { date: "2025-06-19", price: 104722.695052907 },
//   { date: "2025-06-20", price: 104690.65002458123 },
//   { date: "2025-06-21", price: 103290.105144757 },
//   { date: "2025-06-22", price: 101532.5683847329 },
//   { date: "2025-06-23", price: 100852.58264648831 },
//   { date: "2025-06-24", price: 105511.62437933135 },
//   { date: "2025-06-25", price: 105976.06929808448 },
//   { date: "2025-06-26", price: 107238.53045016268 },
//   { date: "2025-06-27", price: 106984.01253775663 },
//   { date: "2025-06-28", price: 107078.91560644074 },
//   { date: "2025-06-29", price: 107331.58548463577 },
//   { date: "2025-06-30", price: 108396.61631317894 },
//   { date: "2025-07-01", price: 107132.79910701896 },
//   { date: "2025-07-02", price: 105613.39974163055 },
//   { date: "2025-07-03", price: 108824.44423167943 },
//   { date: "2025-07-04", price: 109602.20483914016 },
//   { date: "2025-07-05", price: 108040.8919400104 },
//   { date: "2025-07-06", price: 108217.46849992426 },
//   { date: "2025-07-07", price: 109215.19771840284 },
//   { date: "2025-07-08", price: 108300.71675785031 },
//   { date: "2025-07-09", price: 108953.19187727802 },
//   { date: "2025-07-10", price: 111327.53054245669 },
//   { date: "2025-07-11", price: 115879.65030112496 },
//   { date: "2025-07-12", price: 117571.02510036016 },
//   { date: "2025-07-13", price: 117418.95745007684 },
//   { date: "2025-07-14", price: 119117.55666327637 },
//   { date: "2025-07-15", price: 119833.67446712355 },
//   { date: "2025-07-16", price: 117678.19493404306 },
//   { date: "2025-07-17", price: 118748.1627367753 },
//   { date: "2025-07-18", price: 119445.36520434043 },
//   { date: "2025-07-19", price: 117988.94664455787 },
//   { date: "2025-07-20", price: 117901.62655900871 },
//   { date: "2025-07-21", price: 117256.9208222684 },
//   { date: "2025-07-22", price: 117482.46977767294 },
//   { date: "2025-07-23", price: 119955.79570607653 },
//   { date: "2025-07-24", price: 118629.05588130427 },
//   { date: "2025-07-25", price: 118354.43517438594 },
//   { date: "2025-07-26", price: 117540.80837085741 },
//   { date: "2025-07-27", price: 117959.54234360624 },
//   { date: "2025-07-28", price: 119418.91405141471 },
//   { date: "2025-07-29", price: 118003.30201607826 },
//   { date: "2025-07-30", price: 117853.30892863822 },
//   { date: "2025-07-31", price: 117833.24087995925 },
//   { date: "2025-08-01", price: 115700.00243915782 },
//   { date: "2025-08-02", price: 113234.6051343189 },
//   { date: "2025-08-03", price: 112554.90232221723 },
//   { date: "2025-08-04", price: 114199.10966460757 },
//   { date: "2025-08-05", price: 115138.68613070177 },
//   { date: "2025-08-06", price: 114128.35408881678 },
//   { date: "2025-08-06", price: 115389.78344511235 },
// ];
