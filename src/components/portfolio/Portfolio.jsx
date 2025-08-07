import { useQueryClient } from "@tanstack/react-query";
import PortfolioCoin from "./PortfolioCoin";
import PortfolioStock from "./PortfolioStock";
import PortfolioChart from "./PortfolioChart";

const Portfolio = () => {
  const queryClient = useQueryClient();

  return (
    <div className="container">
      <div className="container">
        <PortfolioCoin />
        <PortfolioStock />
      </div>
      <div className="container">
        <PortfolioChart />
      </div>
    </div>
  );
};

export default Portfolio;
