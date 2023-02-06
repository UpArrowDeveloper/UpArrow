import api from '../apis';
import stock from '../apis/stock';

export const getInvestorProfileInfo = async (id) => {
  const investor = await api.user.getById(id)();
  const orderIds = investor.orderIds;
  const orders =
    orderIds?.length > 0 ? await api.order.getByIds(orderIds.join(','))() : [];

  const prices = (await api.config.get()).prices;

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
    prices,
    stockPurchaseInfos,
    userIdeas,
    userRank: userRank.rank,
  };
};

export const getInvestorInvestInfo = async (id) => {
  const investor = await api.user.getById(id)();
  const stocks = await api.stock.get();
  const orderIds = investor.orderIds;
  const orders =
    orderIds.length > 0 ? await api.order.getByIds(orderIds.join(','))() : [];

  const stockPurchaseInfos = orders.reduce((acc, order) => {
    const isBuy = order.type === 'buy';
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
        price: isBuy ? 1 : -1 * order.price,
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
        value.price * value.quantity -
        stocks.find((stock) => stock._id === key)?.currentPrice ||
      0 * value.quantity,
    0
  );
  console.log('*****\n\n\n\ntotalProfits : ', totalProfits);

  return {
    totalInvestment,
    totalProfits,
  };
};
