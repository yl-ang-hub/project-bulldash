/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PqL1lYe8to7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("symbol");
  const [sortDirection, setSortDirection] = useState("asc");
  const watchlist = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 120.5,
      change: 2.5,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 250.75,
      change: -1.2,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com, Inc.",
      price: 3200.0,
      change: 0.8,
    },
    {
      symbol: "GOOG",
      name: "Alphabet Inc. (Class C)",
      price: 2500.25,
      change: -0.5,
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      price: 650.0,
      change: 3.1,
    },
    {
      symbol: "FB",
      name: "Meta Platforms, Inc.",
      price: 275.0,
      change: -0.9,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 550.75,
      change: 1.7,
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase & Co.",
      price: 150.25,
      change: -0.3,
    },
  ];
  const filteredWatchlist = useMemo(() => {
    return watchlist
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [watchlist, searchTerm, sortColumn, sortDirection]);
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
      </div>
      <div className="mb-6 md:mb-8">
        <Input
          type="search"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("symbol")}
              >
                Symbol
                {sortColumn === "symbol" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
                {sortColumn === "name" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("price")}
              >
                Price
                {sortColumn === "price" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("change")}
              >
                Change
                {sortColumn === "change" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
                  </span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWatchlist.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell className="text-right">
                  ${stock.price.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    stock.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.change >= 0 ? "+" : "-"}
                  {Math.abs(stock.change).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
