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

const PortfolioWatchCard = (props) => {
  const queryClient = useQueryClient();

  const getCurrentPrice = (symbol) => {
    const result = props.currentPrice.filter(
      (row) => row.symbol.toUpperCase() === symbol.toUpperCase()
    );
    if (result.length === 0) {
      return 0;
    } else {
      return result[0]["current_price"];
    }
  };

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

  console.log(props.portfolioData);
  console.log(props.currentPrice);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-1xl font-bold">{props.children}</h2>
        <PortfolioModal
          dataType={props.dataType}
          headerRows={props.headerRows}
        />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
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
                  <TableCell>{record.fields.symbol.toUpperCase()}</TableCell>
                  <TableCell>{record.fields.quantity}</TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(getCurrentPrice(record.fields.symbol))}
                  </TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(
                      portfolioValCalculator(
                        record.fields.quantity,
                        getCurrentPrice(record.fields.symbol)
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {calculateGain(
                      portfolioValCalculator(
                        record.fields.quantity,
                        getCurrentPrice(record.fields.symbol)
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
                              getCurrentPrice(record.fields.symbol)
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
                              getCurrentPrice(record.fields.symbol)
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
        <p>
          {props.dataType === "stocks" && JSON.stringify(props.currentPrice)}
        </p>
      </div>
    </div>
  );
};

export default PortfolioWatchCard;
