import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

const MarketCoinWatchCard = (props) => {
  const currencyFormatter = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
    <div className="w-[760px] my-8 mx-auto py-8 px-4 md:px-6 border rounded-lg shadow-md transition-all ease-in-out duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6 text-3xl font-bold text-blue-600 dark:text-white">
        {props.children}
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="!text-left">Name</TableHead>
              <TableHead className="!text-center">Symbol</TableHead>
              <TableHead className="!text-right">Price (USD)</TableHead>
              <TableHead className="!text-right">Gain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.trendData?.map((record, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell className="text-left font-medium">
                    {record.item.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.item.symbol.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(record.item.data.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {record.item.data.price_change_percentage_24h.usd > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-green-500 text-green-50"
                      >
                        {formatGain(
                          record.item.data.price_change_percentage_24h.usd / 100
                        )}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-500 text-red-50"
                      >
                        {formatGain(
                          record.item.data.price_change_percentage_24h.usd / 100
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

export default MarketCoinWatchCard;
