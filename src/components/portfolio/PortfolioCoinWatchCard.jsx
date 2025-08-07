import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import PortfolioCoinModal from "./PortfolioCoinModal";
import { useQueryClient } from "@tanstack/react-query";

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

  // console.log(props.portfolioData);
  // console.log(props.currentPrice);

  return (
    <div className="w-[760px] my-8 mx-auto py-8 px-4 md:px-6 border rounded">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-1xl font-bold">{props.children}</h2>
        <PortfolioCoinModal
          dataType={props.dataType}
          headerRows={props.headerRows}
        />
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="!text-left">Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="!text-right">Price</TableHead>
              <TableHead className="!text-right">Portfolio Value</TableHead>
              <TableHead className="!text-right">Gain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.portfolioData?.records.map((record, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell className="text-left font-medium">
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
