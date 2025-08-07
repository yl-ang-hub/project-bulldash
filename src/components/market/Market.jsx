import { useQueryClient } from "@tanstack/react-query";
import MarketCoin from "./MarketCoin";
import MarketStock from "./MarketStock";

const Market = () => {
  const queryClient = useQueryClient();

  return (
    <>
      <div className="h-screen grid grid-cols-1 place-items-center">
        <MarketCoin />
      </div>
      <div className="h-screen grid grid-cols-1 place-items-center">
        <MarketStock />
      </div>
    </>
  );
};

export default Market;
