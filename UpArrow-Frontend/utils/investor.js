import api from "../apis";

export const getInvestorProfileInfo = async (id) => {
  console.log("ididid: ", id);
  const investor = await api.user.getById(id)();
  const orderIds = investor.orderIds;
  const orders =
    orderIds?.length > 0 ? await api.order.getByIds(orderIds.join(","))() : [];
  console.log("investor : ", investor);

  const stockPurchaseInfos = orders.reduce((acc, order) => {
    if (acc[order.stockId]) {
      return {
        ...acc,
        [order.stockId]: {
          ...acc[order.stockId],
          id: order.stockId,
          quantity: acc[order.stockId].quantity + order.quantity,
          price: acc[order.stockId].price + order.price,
        },
      };
    }
    return {
      ...acc,
      [order.stockId]: {
        id: order.stockId,
        quantity: order.quantity,
        price: order.price,
      },
    };
  }, {});

  const userIdeas = await api.idea.getByUserId(id)();
  const userRank = await api.user.getRankById(id)();

  return {
    investor,
    stockPurchaseInfos,
    userIdeas,
    userRank: userRank.rank,
  };
};

let stocksCache = undefined;
export const getInvestorInvestInfo = async (id) => {
  const investor = await api.user.getById(id)();
  stocksCache = stocksCache ? stocksCache : await api.stock.get();
  const stocks = stocksCache;
  const orderIds = investor.orderIds;
  const orders =
    orderIds.length > 0 ? await api.order.getByIds(orderIds.join(","))() : [];

  const stockPurchaseInfos = orders.reduce((acc, order) => {
    const isBuy = order.type === "buy";
    if (acc[order.stockId]) {
      return {
        ...acc,
        [order.stockId]: {
          ...acc[order.stockId],
          id: order.stockId,
          quantity: isBuy
            ? acc[order.stockId].quantity + order.quantity
            : acc[order.stockId].quantity + order.quantity,
          price: isBuy
            ? (acc[order.stockId].price * acc[order.stockId].quantity +
                order.price * order.quantity) /
              (order.quantity + acc[order.stockId].quantity)
            : (acc[order.stockId].price * acc[order.stockId].quantity -
                order.price * order.quantity) /
              (order.quantity + acc[order.stockId].quantity),
        },
      };
    }
    return {
      ...acc,
      [order.stockId]: {
        id: order.stockId,
        quantity: order.quantity,
        price: (isBuy ? 1 : -1) * order.price,
      },
    };
  }, {});

  const totalInvestment = Object.entries(stockPurchaseInfos).reduce(
    (acc, [key, value]) => acc + value.price * value.quantity,
    0
  );

  const totalProfits = Object.entries(stockPurchaseInfos).reduce(
    (acc, [key, value]) =>
      acc +
      (stocks.find((stock) => stock._id === key)?.currentPrice || 0) *
        value.quantity -
      value.price * value.quantity,
    0
  );

  const currentTotalStockValue = Object.entries(stockPurchaseInfos).reduce(
    (acc, [key, value]) =>
      acc +
      (stocks.find((stock) => stock._id === key)?.currentPrice || 0) *
        value.quantity,
    0
  );

  return {
    totalInvestment,
    totalProfits,
    currentTotalStockValue,
  };
};
