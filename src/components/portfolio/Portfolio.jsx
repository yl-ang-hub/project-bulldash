import PortfolioCoin from "./PortfolioCoin";
import PortfolioStock from "./PortfolioStock";

// Get 60 days price of a Coin for charting - ran once for btc
// const qCoinChart = useQuery(qCoinUSDChartQueryOptions());

const Portfolio = () => {
  return (
    <div className="container flex justify-between">
      <PortfolioCoin />
      <PortfolioStock />
    </div>
  );
};

export default Portfolio;
