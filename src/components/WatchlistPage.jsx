/**
 * v0 by Vercel.
 * @see https://v0.dev/t/T2SokMgzjjj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function WatchlistPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        <Button size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">AAPL</TableCell>
              <TableCell>Apple Inc.</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-green-500 text-green-50">
                  +2.5%
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">MSFT</TableCell>
              <TableCell>Microsoft Corporation</TableCell>
              <TableCell className="text-right">$300.00</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-red-500 text-red-50">
                  -1.2%
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">AMZN</TableCell>
              <TableCell>Amazon.com, Inc.</TableCell>
              <TableCell className="text-right">$3,500.00</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-green-500 text-green-50">
                  +0.8%
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">GOOG</TableCell>
              <TableCell>Alphabet Inc.</TableCell>
              <TableCell className="text-right">$2,800.00</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-red-500 text-red-50">
                  -0.5%
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">TSLA</TableCell>
              <TableCell>Tesla, Inc.</TableCell>
              <TableCell className="text-right">$800.00</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-green-500 text-green-50">
                  +3.2%
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

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
