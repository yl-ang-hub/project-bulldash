import { useQueryClient } from "@tanstack/react-query";
import MarketCoin from "./MarketCoin";

const Market = () => {
  const queryClient = useQueryClient();

  return (
    <div className="h-screen grid grid-cols-1 place-items-center">
      <MarketCoin />
    </div>
  );
};

export default Market;
