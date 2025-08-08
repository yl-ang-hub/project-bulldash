import PortfolioCoin from "./PortfolioCoin";
import PortfolioStock from "./PortfolioStock";
import PortfolioChart from "./PortfolioChart";

const Portfolio = () => {
  return (
    <div className="h-screen grid grid-cols-1 place-items-center">
      <div>
        <PortfolioCoin />
        <PortfolioStock />
      </div>
      <div>
        <PortfolioChart />
      </div>
    </div>
  );
};

export default Portfolio;
