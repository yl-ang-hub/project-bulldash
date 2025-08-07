"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function PortfolioStockComboBox(props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const qSymbol = useQuery({
    queryKey: ["qSymbol", props.dropdownValue],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_FINNHUB_APIURL}/search?q=${props.dropdownValue}&exchange=US&token=${import.meta.env.VITE_FINNHUB_APIKEY}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Request error");
      }
      const data = await res.json();
      return data;
    },
    retry: 0,
    staleTime: Infinity,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {props.dropdownValue ? props.dropdownValue : "Find stock"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Find stock"
            className="h-9"
            value={props.dropdownValue}
            // ISSUE: this state change doesn't work
            onValueChange={props.setDropdownValue}
          />
          <CommandList>
            <CommandEmpty>Stock not found.</CommandEmpty>
            <CommandGroup>
              {qSymbol.isSuccess &&
                qSymbol?.data.result.map((result, idx) => (
                  <CommandItem
                    key={idx}
                    value={result.description}
                    onSelect={(currVal) => {
                      props.showSymbolFn(
                        result.symbol,
                        result.description,
                        result.symbol
                      );
                      props.setDropdownValue(
                        currVal === props.dropdownValue ? "" : currVal
                      );
                      setOpen(false);
                    }}
                  >
                    {result.description}
                    <Check
                      className={cn(
                        "ml-auto",
                        props.dropdownValue === result.symbol
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
