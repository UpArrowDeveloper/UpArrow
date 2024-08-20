import { useQuery } from "@tanstack/react-query";
import api from "../../apis";

const useStockList = () => {
  const { data, loading, error } = useQuery(["stockList"], api.stock.get);

  return { data, loading, error };
};

const StockModel = { useStockList };

export default StockModel;
