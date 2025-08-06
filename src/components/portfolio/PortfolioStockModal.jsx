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
import { Input } from "../ui/input";
import { Suspense, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PortfolioStockComboBox } from "./PortfolioStockComboBox";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export const PortfolioStockModal = (props) => {
  const queryClient = useQueryClient();
  // TODO: IMPLEMENT SEARCH
  const [onEdit, setOnEdit] = useState({});
  const [symbolOnAdd, setSymbolOnAdd] = useState("");
  const [nameOnAdd, setNameOnAdd] = useState("");
  const [idTickerOnAdd, setIdTickerOnAdd] = useState("");
  const qtyRefs = useRef([]);
  const purchasePriceRefs = useRef([]);
  const newQty = useRef(0);
  const newPurchasePrice = useRef(0);
  const [dropdownValue, setDropdownValue] = useState("");

  // Get portfolio data
  const qKey = props.dataType === "stocks" ? ["readStocksFromPortfolioDB"] : [];
  const portfolioData = queryClient.getQueryData(qKey);

  const editAssetInPortfolioDB = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        import.meta.env.VITE_AIRTABLE_API + "StocksPortfolioDB/" + id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_AIRTABLE_TOKEN,
          },
          body: JSON.stringify({
            fields: {
              quantity: parseFloat(qtyRefs.current[id]),
              purchase_price: parseFloat(purchasePriceRefs.current[id]),
            },
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Request error - coin not updated");
      }
      return await res.json();
    },
    retry: 0,
    onError: (error) => {
      console.log("error has occurred", error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["readStocksFromPortfolioDB"]);
    },
    onSettled: () => {
      const newState = { ...onEdit };
      newState[id] = false;
      setOnEdit(newState);
    },
  });

  const deleteAssetInPortfolioDB = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        import.meta.env.VITE_AIRTABLE_API + "StocksPortfolioDB/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_AIRTABLE_TOKEN,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Request error - coin not updated");
      }
      return await res.json();
    },
    retry: 0,
    onError: (error) => {
      console.log("Request error - ", error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["readStocksFromPortfolioDB"]);
    },
  });

  // ISSUE: Does not re-render WatchCard & ComboBox components
  const addAssetInPortfolioDB = useMutation({
    mutationFn: async ({ id, symbol, name, qty, price }) => {
      const res = await fetch(
        import.meta.env.VITE_AIRTABLE_API + "StocksPortfolioDB",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_AIRTABLE_TOKEN,
          },
          body: JSON.stringify({
            fields: {
              idTicker: id,
              symbol: symbol,
              name: name,
              quantity: qty,
              purchase_price: price,
            },
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Request error - coin not updated");
      }
      return await res.json();
    },
    retry: 0,
    onError: (error) => {
      console.log("error has occurred", error.message);
    },
    onSuccess: async () => {
      console.log("add stock is successful, callback running");
      await queryClient.invalidateQueries(["readStocksFromPortfolioDB"]);
      await queryClient.invalidateQueries(["qQuote"]);
      // ISSUE: No re-render of component + child despite state change or query invalidation
      // ComboBox & useRefs not cleared & price/quantity not updated in WatchCard
      newQty.current = 0;
      newPurchasePrice.current = 0;
      setIdTickerOnAdd("");
      setNameOnAdd("");
      setSymbolOnAdd("");
      setDropdownValue("");
    },
  });

  const handleEdit = (id) => {
    console.log(JSON.stringify(onEdit));
    const newState = { ...onEdit };
    newState[id] = true;
    setOnEdit(newState);
  };

  const handleSubmit = (id, qty, price) => {
    if (!qtyRefs.current[id]) {
      qtyRefs.current[id] = qty;
    }
    if (!purchasePriceRefs.current[id]) {
      purchasePriceRefs.current[id] = price;
    }
    editAssetInPortfolioDB.mutate(id);
    const newState = { ...onEdit };
    newState[id] = false;
    setOnEdit(newState);
  };

  const resetEditAssetState = () => {
    const newState = {};
    portfolioData?.records.forEach((datum) => (newState[datum.id] = false));
    setOnEdit(newState);
  };

  const showAssetSymbolOnAdd = (id, name, symbol) => {
    setIdTickerOnAdd(id);
    setNameOnAdd(name);
    setSymbolOnAdd(symbol.toUpperCase());
  };

  useEffect(() => {
    resetEditAssetState();
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div>
        <Dialog className="w-[1200px] mx-auto py-4 px-4 md:px-6">
          <form>
            <DialogTrigger asChild>
              <Button variant="default" className="rounded">
                Add / Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[1200px]">
              <DialogHeader>
                <DialogTitle>Edit Portfolio</DialogTitle>
                <DialogDescription>
                  Make changes to your portfolio here.
                </DialogDescription>
              </DialogHeader>
              <div className="border rounded-lg overflow-hidden">
                <ScrollArea
                  className="h-[360px] rounded-md border"
                  orientation="both"
                >
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>{props.headerRows[0]}</TableHead>
                        <TableHead>{props.headerRows[1]}</TableHead>
                        <TableHead>{props.headerRows[2]}</TableHead>
                        <TableHead>Total Purchase Price</TableHead>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioData?.records.map((datum) => {
                        return (
                          <TableRow key={datum.id}>
                            <TableCell className="font-medium">
                              {datum.fields.name}
                            </TableCell>
                            <TableCell>{datum.fields.symbol}</TableCell>
                            <TableCell className="text-right min-w-[100px] justify-end">
                              {onEdit[datum.id] ? (
                                <Input
                                  className="min-w-[100px] text-right"
                                  defaultValue={datum.fields.quantity}
                                  onChange={(event) =>
                                    (qtyRefs.current[datum.id] =
                                      event.target.value)
                                  }
                                />
                              ) : (
                                datum.fields.quantity
                              )}
                            </TableCell>
                            <TableCell className="text-right min-w-[100px] justify-end">
                              {onEdit[datum.id] ? (
                                <Input
                                  className="min-w-[100px] pr-0 text-right"
                                  defaultValue={datum.fields.purchase_price}
                                  onChange={(event) =>
                                    (purchasePriceRefs.current[datum.id] =
                                      event.target.value)
                                  }
                                />
                              ) : (
                                datum.fields.purchase_price
                              )}
                            </TableCell>
                            <TableCell>
                              {onEdit[datum.id] ? (
                                <Button
                                  className="rounded max-w-[70px]"
                                  onClick={() =>
                                    handleSubmit(
                                      datum.id,
                                      datum.fields.quantity,
                                      datum.fields.purchase_price
                                    )
                                  }
                                >
                                  Submit
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="rounded max-w-[70px]"
                                  onClick={() => handleEdit(datum.id)}
                                >
                                  Edit
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                className="rounded max-w-[70px]"
                                onClick={() =>
                                  deleteAssetInPortfolioDB.mutate(datum.id)
                                }
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell>
                          {/* TODO: Optimise and Solve long loading time */}
                          <PortfolioStockComboBox
                            className="max-w-[100px]"
                            showSymbolFn={showAssetSymbolOnAdd}
                            dropdownValue={dropdownValue}
                            setDropdownValue={setDropdownValue}
                          />
                        </TableCell>
                        <TableCell>{symbolOnAdd}</TableCell>
                        <TableCell className="text-right min-w-[100px] justify-end">
                          {/* TODO: Validate that it is Float */}
                          <Input
                            className="min-w-[100px] pr-0 text-right"
                            defaultValue={newQty.current}
                            onChange={(event) =>
                              (newQty.current = parseFloat(event.target.value))
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[100px] justify-end">
                          {/* TODO: Validate that it is Float */}
                          <Input
                            className="min-w-[100px] pr-0 text-right"
                            defaultValue={newPurchasePrice.current}
                            onChange={(event) =>
                              (newPurchasePrice.current = parseFloat(
                                event.target.value
                              ))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            className="rounded max-w-[70px]"
                            onClick={() => {
                              console.log(
                                idTickerOnAdd,
                                nameOnAdd,
                                symbolOnAdd,
                                newQty.current,
                                newPurchasePrice.current
                              );
                              addAssetInPortfolioDB.mutate({
                                id: idTickerOnAdd,
                                name: nameOnAdd,
                                symbol: symbolOnAdd,
                                qty: newQty.current,
                                price: newPurchasePrice.current,
                              });
                            }}
                          >
                            Add
                          </Button>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="rounded">
                    Return
                  </Button>
                </DialogClose>
                {/* <Button type="" className="rounded">
              Save changes
            </Button> */}
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </Suspense>
  );
};
