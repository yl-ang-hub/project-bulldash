import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import PortfolioModal from "./PortfolioCoinModal";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const PortfolioStockWatchCard = (props) => {
  const queryClient = useQueryClient();

  // let currentPrice = [];

  const currencyFormatter = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  const portfolioValCalculator = (quantity, currPrice) => {
    return parseFloat(quantity) * parseFloat(currPrice);
  };
  const calculateGain = (portfolioVal, totalPurchasePrice) => {
    return parseFloat(portfolioVal) / parseFloat(totalPurchasePrice) - 1;
  };
  const formatGain = (gain) => {
    const formattedPercentage = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(gain);
    if (gain > 0) {
      return "+" + formattedPercentage;
    } else {
      return formattedPercentage;
    }
  };

  // useEffect(() => {
  //   if (props.dataType === "stocks") {
  //     currentPrice = queryClient.getQueriesData({
  //       queryKey: ["qQuote"],
  //     });
  //     if (!currentPrice) {
  //       currentPrice = queryClient.refetchQueries(["qQuote"]);
  //     }
  //   } else {
  //     currentPrice = props.currentPrice;
  //   }
  // }, []);

  return (
    // <>
    //   <h1>{JSON.stringify(props.currentPrice)}</h1>
    //   <h1>
    //     {props.portfolioData?.records.map((record, idx) => {
    //       console.log("current price is ", props.currentPrice[idx]["c"]);
    //     })}
    //   </h1>
    // </>
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-1xl font-bold">{props.children}</h2>
        {/* <PortfolioStockModal
          dataType={props.dataType}
          headerRows={props.headerRows}
        /> */}
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table className="min-w-fit">
          <TableHeader>
            <TableRow>
              {props.headerRows.map((row, idx) => (
                <TableHead key={idx}>{row}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.portfolioData?.records.map((record, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    {record.fields.name}
                  </TableCell>
                  <TableCell>{record.fields.symbol}</TableCell>
                  <TableCell>{record.fields.quantity}</TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(props.currentPrice[idx]["c"])}
                  </TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(
                      portfolioValCalculator(
                        record.fields.quantity,
                        props.currentPrice[idx]["c"]
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {calculateGain(
                      portfolioValCalculator(
                        record.fields.quantity,
                        props.currentPrice[idx]["c"]
                      ),
                      record.fields.purchase_price
                    ) > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-green-500 text-green-50"
                      >
                        {formatGain(
                          calculateGain(
                            portfolioValCalculator(
                              record.fields.quantity,
                              props.currentPrice[idx]["c"]
                            ),
                            record.fields.purchase_price
                          )
                        )}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-500 text-red-50"
                      >
                        {formatGain(
                          calculateGain(
                            portfolioValCalculator(
                              record.fields.quantity,
                              props.currentPrice[idx]["c"]
                            ),
                            record.fields.purchase_price
                          )
                        )}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {/* <p>
          {props.dataType === "stocks" && JSON.stringify(props.currentPrice)}
        </p> */}
      </div>
    </div>
  );
};

const hello = [
  {
    c: 195.75,
    d: 5.8,
    dp: 3.0534,
    h: 196.08,
    l: 190.92,
    o: 191.175,
    pc: 189.95,
    t: 1754337600,
  },
  {
    c: 211.65,
    d: -3.1,
    dp: -1.4435,
    h: 217.44,
    l: 211.42,
    o: 217.4,
    pc: 214.75,
    t: 1754337600,
  },
  { c: 0, d: null, dp: null, h: 0, l: 0, o: 0, pc: 0, t: 0 },
  {
    c: 776.37,
    d: 26.36,
    dp: 3.5146,
    h: 776.85,
    l: 758.41,
    o: 760,
    pc: 750.01,
    t: 1754337600,
  },
  {
    c: 535.64,
    d: 11.53,
    dp: 2.1999,
    h: 538.25,
    l: 528.13,
    o: 528.27,
    pc: 524.11,
    t: 1754337600,
  },
  {
    c: 180,
    d: 6.28,
    dp: 3.615,
    h: 180.2,
    l: 174.52,
    o: 175.16,
    pc: 173.72,
    t: 1754337600,
  },
];
