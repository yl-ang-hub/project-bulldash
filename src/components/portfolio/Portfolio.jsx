import PortfolioCoin from "./PortfolioCoin";
import PortfolioStock from "./PortfolioStock";

// get current price for list of coins
const top10CoinsByCap =
  "bnb%2Cbtc%2Cada%2Cdoge%2Ceth%2Cxrp%2Csol%2Cusdt%2Ctrx%2Cusdc";
// const qCoinsUSDPrice = useSuspenseQuery(
//   qCoinsUSDPriceQueryOptions(top10CoinsByCap)
// );

// Get 60 days price of a Coin for charting - ran once for btc
// const qCoinChart = useQuery(qCoinUSDChartQueryOptions());

const Portfolio = () => {
  return (
    <div className="container flex justify-between">
      <PortfolioCoin />
      {/* <PortfolioStock /> */}
    </div>
  );
};

export default Portfolio;
