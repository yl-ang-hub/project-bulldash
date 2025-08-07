import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { PortfolioStockModal } from "./PortfolioStockModal";

export const PortfolioStockWatchCard = (props) => {
  const queryClient = useQueryClient();

  const getCurrentPrice = (idx) => {
    // console.log(JSON.stringify(props.currentPrice));
    const result = props.currentPrice.at(idx)?.c;
    if (!result) {
      return 0;
    } else {
      return result;
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

  return (
    <>
      <div className="w-[760px] my-8 mt-12 mx-auto py-8 px-4 md:px-6 border rounded">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-1xl font-bold">{props.children}</h2>
          <PortfolioStockModal
            dataType={props.dataType}
            headerRows={props.headerRows}
          />
        </div>
        <div className="overflow-hidden">
          <Table className="min-w-fit">
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
                    <TableCell>{record.fields.symbol}</TableCell>
                    <TableCell>{record.fields.quantity}</TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter(getCurrentPrice(idx))}
                    </TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter(
                        portfolioValCalculator(
                          record.fields.quantity,
                          getCurrentPrice(idx)
                        )
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {calculateGain(
                        portfolioValCalculator(
                          record.fields.quantity,
                          getCurrentPrice(idx)
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
                                getCurrentPrice(idx)
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
                                getCurrentPrice(idx)
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

          {/* {props.dataType === "stocks" &&
            console.log(JSON.stringify(props.currentPrice))} */}
        </div>
      </div>
    </>
  );
};
