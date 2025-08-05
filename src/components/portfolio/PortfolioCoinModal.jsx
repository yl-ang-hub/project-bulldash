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
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateCoinPortfolioDB } from "@/services/DBApiService";

const PortfolioCoinModal = (props) => {
  const queryClient = useQueryClient();
  // TODO: IMPLEMENT SEARCH
  const [searchTerm, setSearchTerm] = useState("");
  const [onEdit, setOnEdit] = useState({});
  const qtyRefs = useRef([]);
  const purchasePriceRefs = useRef([]);

  // Get portfolio data
  const qKey = props.dataType === "coin" ? ["readCoinsFromPortfolioDB"] : [];
  const data = queryClient.getQueryData(qKey);

  const editCoinInPortfolioDB = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        import.meta.env.VITE_AIRTABLE_API + "CoinsPortfolioDB/" + id,
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
      queryClient.invalidateQueries(["readCoinsFromPortfolioDB"]);
    },
    onSettled: () => {
      const newState = { ...onEdit };
      newState[id] = false;
      setOnEdit(newState);
    },
  });

  const deleteCoinInPortfolioDB = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        import.meta.env.VITE_AIRTABLE_API + "CoinsPortfolioDB/" + id,
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
      queryClient.invalidateQueries(["readCoinsFromPortfolioDB"]);
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
    editCoinInPortfolioDB.mutate(id);
    const newState = { ...onEdit };
    newState[id] = false;
    setOnEdit(newState);
  };

  const resetEditCoinState = () => {
    const newState = {};
    data?.records.forEach((datum) => (newState[datum.id] = false));
    setOnEdit(newState);
  };

  useEffect(() => {
    resetEditCoinState();
  }, []);

  return (
    <Dialog className="w-[800px] mx-auto py-8 px-4 md:px-6">
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
            <ScrollArea
              className="h-[400px] rounded-md border"
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
                  {data?.records.map((datum) => {
                    return (
                      <TableRow key={datum.id}>
                        <TableCell className="font-medium">
                          {datum.fields.name}
                        </TableCell>
                        <TableCell>{datum.fields.symbol}</TableCell>
                        <TableCell className="text-right min-w-[100px] justify-end">
                          {onEdit[datum.id] ? (
                            <Input
                              className="min-w-[100px]"
                              defaultValue={datum.fields.quantity}
                              onChange={(event) =>
                                (qtyRefs.current[datum.id] = event.target.value)
                              }
                            ></Input>
                          ) : (
                            datum.fields.quantity
                          )}
                        </TableCell>
                        <TableCell className="text-right min-w-[100px] justify-end">
                          {onEdit[datum.id] ? (
                            <Input
                              className="min-w-[100px] pr-0"
                              defaultValue={datum.fields.purchase_price}
                              onChange={(event) =>
                                (purchasePriceRefs.current[datum.id] =
                                  event.target.value)
                              }
                            ></Input>
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
                              deleteCoinInPortfolioDB.mutate(datum.id)
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
  );
};

export default PortfolioCoinModal;
