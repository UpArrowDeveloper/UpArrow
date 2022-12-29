import axios from 'axios';

export const getInvestorProfileInfo = async (id) => {
  const investor = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${id}`
  );
  const purchaseIds = investor.data.purchases;
  const purchases = (
    await Promise.all(
      purchaseIds?.map((id) =>
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/purchase/${id}`)
      ) || []
    )
  ).map((v) => v.data);
  const prices = (
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/config`)
  ).data.prices;

  const stockPurchaseInfos = purchases.reduce((acc, purchase) => {
    if (acc[purchase.stockId]) {
      return {
        ...acc,
        [acc[purchase.stockId]]: {
          ...acc[purchase.stockId],
          id: purchase.stockId,
          quantity: acc[purchase.stockId].quantity + purchase.quantity,
          averagePrice:
            acc[purchase.stockId].averagePrice + purchase.averagePrice,
        },
      };
    }
    return {
      ...acc,
      [purchase.stockId]: {
        id: purchase.stockId,
        quantity: purchase.quantity,
      },
    };
  }, {});

  const userPosts = (
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${id}/userId`)
  ).data;

  const userRank = (
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/${id}/rank`)
  ).data.rank;

  return {
    investor,
    prices,
    stockPurchaseInfos,
    userPosts,
    userRank,
  };
};
