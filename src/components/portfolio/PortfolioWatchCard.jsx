import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import PortfolioModal from "./PortfolioModal";
import { useQueryClient } from "@tanstack/react-query";

const PortfolioWatchCard = (props) => {
  const queryClient = useQueryClient();
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
                  <TableCell>{record.fields.symbol}</TableCell>
                  <TableCell>{record.fields.quantity}</TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(
                      props.currentPrice.filter(
                        (coin) => coin.symbol === record.fields.symbol
                      )[0]["current_price"]
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(
                      portfolioValCalculator(
                        record.fields.quantity,
                        props.currentPrice.filter(
                          (coin) => coin.symbol === record.fields.symbol
                        )[0]["current_price"]
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {calculateGain(
                      portfolioValCalculator(
                        record.fields.quantity,
                        props.currentPrice.filter(
                          (coin) => coin.symbol === record.fields.symbol
                        )[0]["current_price"]
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
                              props.currentPrice.filter(
                                (coin) => coin.symbol === record.fields.symbol
                              )[0]["current_price"]
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
                              props.currentPrice.filter(
                                (coin) => coin.symbol === record.fields.symbol
                              )[0]["current_price"]
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
      </div>
    </div>
  );
};

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default PortfolioWatchCard;
