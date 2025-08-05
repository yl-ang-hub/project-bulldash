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
import { fullCoinList } from "@/data/fullCoinListing";

export function PortfolioCoinComboBox(props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? fullCoinList.find((coin) => coin.name === value)?.name
            : "Find coin"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Find coin" className="h-9" />
          <CommandList>
            <CommandEmpty>Coin not found.</CommandEmpty>
            <CommandGroup>
              {fullCoinList.map((coin, idx) => (
                <CommandItem
                  key={idx}
                  value={coin.name}
                  onSelect={(currVal) => {
                    console.log(coin.id, coin.name, coin.symbol);
                    props.showSymbolFn(coin.id, coin.name, coin.symbol);
                    setValue(currVal === value ? "" : currVal);
                    setOpen(false);
                  }}
                >
                  {coin.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === coin.name ? "opacity-100" : "opacity-0"
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
