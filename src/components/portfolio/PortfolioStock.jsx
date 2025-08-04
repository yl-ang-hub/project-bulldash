import PortfolioWatchCard from "./PortfolioWatchCard";

const PortfolioStock = () => {
  const headerRows = [
    "Symbol",
    "Company",
    "Price",
    "Quantity",
    "Portfolio Value",
    "Gain",
  ];
  return (
    <div className="w-1/2">
      <div>
        <PortfolioWatchCard headerRows={headerRows}>Stocks</PortfolioWatchCard>
      </div>
    </div>
  );
};

export default PortfolioStock;
