import { useQueryClient } from "@tanstack/react-query";

const Market = () => {
  const queryClient = useQueryClient();

  return (
    <div className="container">
      <div className="container">Market coin card here</div>
      <div className="container"></div>
    </div>
  );
};

export default Market;
