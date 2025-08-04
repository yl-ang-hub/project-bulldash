import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";
import { useState } from "react";

const PortfolioModal = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Dialog className="w-full mx-auto py-8 px-4 md:px-6">
      <form>
        <DialogTrigger asChild>
          <Button variant="default" className="rounded">
            Add / Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your portfolio and click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-1 md:mb-2">
            <Input
              type="search"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md"
            />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{props.headerRows[0]}</TableHead>
                  <TableHead>{props.headerRows[1]}</TableHead>
                  <TableHead>{props.headerRows[2]}</TableHead>

                  <TableHead className="text-right">
                    Total Purchase Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">AAPL</TableCell>
                  <TableCell>Apple Inc.</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-green-500 text-green-50"
                    >
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
                    <Badge
                      variant="outline"
                      className="bg-green-500 text-green-50"
                    >
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
                    <Badge
                      variant="outline"
                      className="bg-green-500 text-green-50"
                    >
                      +3.2%
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
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

export default PortfolioModal;
