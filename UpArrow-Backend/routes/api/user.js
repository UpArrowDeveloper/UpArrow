const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Stock = require("../../models/Stock");
const Order = require("../../models/Order");
const ObjectId = require("mongodb").ObjectId;
const {
  getTop3StocksByUserId,
  addUser,
  updateUserById,
} = require("../../services/user");
const { getIdeasByUserId } = require("../../services/idea");
const { USER_ALREADY_EXIST, UserAlreadyExist } = require("../../error/user");
const { validUser } = require("../../middlewares/auth");
const { getCalculatedOrdersByUser } = require("../../services/order");

let stocksCache = undefined;
const getInvestorInvestInfo = async (id) => {
  const _id = id;

  const investor = await User.findOne({ _id });
  stocksCache = stocksCache ? stocksCache : await Stock.find();
  const stocks = stocksCache;
  const orderIds = investor.orderIds;
  const orders =
    orderIds.length > 0 ? await Order.find({ _id: { $in: orderIds } }) : [];

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

const getProfitPercentageById = async (id) => {
  const userId = id;
  const user = await User.findById(userId);

  // const orderList = await Promise.all(
  //   user.orderIds.map((orderId) => {
  //     return Order.findById(orderId);
  //   })
  // );
  const orderList = await Order.find({ _id: { $in: user.orderIds } });
  // const stockList = await Promise.all(
  //   orderList.map((order) => Stock.findById(order.stockId))
  // );
  const stockList = await Stock.find({
    _id: { $in: orderList.map((order) => order.stockId) },
  });
  const finalPurchaseList = orderList
    .filter((order, index) => {
      return stockList[index];
    })
    .map((order, index) => {
      return {
        _id: order._id,
        userId: order.userId,
        stockId: order.stockId,
        quantity: order.quantity,
        price: order.price,
        stock: stockList[index],
      };
    })
    .reduce((acc, cur) => {
      const stockId = cur.stockId;
      const quantity = cur.quantity;
      const price = cur.price;
      const stock = cur.stock;
      const stockIndex = acc.findIndex(
        (loopStock) => loopStock.stock.ticker === stock.ticker
      );

      if (stockIndex === -1) {
        return [
          ...acc,
          {
            stockId,
            quantity,
            price,
            stock,
          },
        ];
      } else {
        acc[stockIndex].quantity += quantity;
        acc[stockIndex].price += price;
        return acc;
      }
    }, []);

  const profitPercentageList = finalPurchaseList.map((purchase) => {
    const quantity = purchase.quantity;
    const currentAmount = purchase.stock.currentPrice * quantity;
    const boughtAmount = purchase.price * quantity;
    const profitAmount = boughtAmount - currentAmount;
    const profitPercentage = (profitAmount + currentAmount) / currentAmount;
    return {
      stockName: purchase.stock.name,
      ticker: purchase.stock.ticker,
      percent: Math.floor(profitPercentage * 10000) / 100,
    };
  });

  return profitPercentageList;
};
router.get("/", async (req, res) => {
  try {
    const userList = await User.find();
    return res.status(200).json(userList);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

let joinCache = undefined;
setInterval(async () => {
  joinCache = undefined;
}, 1000 * 60 * 10);
router.get("/join", async (req, res) => {
  try {
    if (joinCache) {
      return res.status(200).json(joinCache);
    }
    const investorList = await User.find();
    const investorProfitPercentageList = await Promise.all(
      investorList.map((investor) => getProfitPercentageById(investor._id))
    );

    const totalProfitAttached = [];
    for await (const v of investorList) {
      totalProfitAttached.push({
        ...v._doc,
        ...(await getInvestorInvestInfo(v._id)),
      });
    }

    const percentBindDataList = totalProfitAttached.map((investor, index) => {
      return {
        ...investor,
        percentList: investorProfitPercentageList[index],
      };
    });

    joinCache = percentBindDataList;
    return res.status(200).json(percentBindDataList);
  } catch (err) {
    console.log("err : ", err);
    return res.status(500).json({ error: err });
  }
});

router.get("/:id/top3stocks", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await getTop3StocksByUserId(id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("error : ", err);
    return res.status(500).json({ error: err });
  }
});

router.get("/:id/stock-info/:stockId", async (req, res) => {
  const id = req.params.id;
  const stockId = req.params.stockId;
  try {
    const result = await getCalculatedOrdersByUser(id);
    const emptyResult = { userId: id, stockId, quantity: 0, price: 0 };
    return res.status(200).json(result[stockId] || emptyResult);
  } catch (err) {
    console.error("error : ", err);
    return res.status(500).json({ error: err });
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    email,
    profileImageUrl,
    username,
    investmentPhilosophy,
    websiteUrl,
    isAdmin,
    cash,
  } = req.body;
  try {
    const newUser = await addUser({
      name,
      email,
      profileImageUrl,
      username,
      investmentPhilosophy,
      websiteUrl,
      isAdmin,
      cash: cash || 100000,
    });
    return res.status(200).send(newUser);
  } catch (error) {
    if (error.errorType === USER_ALREADY_EXIST) {
      return UserAlreadyExist.responseError();
    }
    return res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const {
    name,
    email,
    profileImageUrl,
    username,
    investmentPhilosophy,
    websiteUrl,
    isAdmin,
    cash,
  } = req.body;
  try {
    const updateUser = await updateUserById(id, {
      name,
      email,
      profileImageUrl,
      username,
      investmentPhilosophy,
      websiteUrl,
      isAdmin,
      cash,
    });
    return res.status(200).send(updateUser);
  } catch (error) {
    if (error.errorType === USER_ALREADY_EXIST) {
      return UserAlreadyExist.responseError();
    }
    return res.status(500).json(error);
  }
});

router.post("/:id/reset-over-ten", async (req, res) => {
  const id = req.params.id;
  await User.findOneAndUpdate({ _id: id }, { overTen: false });
  return res.status(200).json({ message: "success" });
});

// a user getting a user data using email
router.get("/me", validUser, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findOne({ _id });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/:id/rank", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.find();
    const sortedUser = user.sort((a, b) => b.totalAssets - a.totalAssets);
    const rank = sortedUser.findIndex((user) => {
      return user._id.toString() === _id;
    });

    return res.status(200).json({ userId: _id, rank: rank + 1 });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/:email/email", async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(400).send({ message: "no user" });
  }
});

router.get("/:userId/profile", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const userDocument = await User.findById(userObjectId);

    if (!userDocument) {
      return res.status(404).send({});
    } else {
      return res.status(200).send(userDocument);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

router.get("/:userId/profit-percentage", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const orderList = await Promise.all(
      user.orderIds.map((orderId) => {
        return Order.findById(orderId);
      })
    );
    const stockList = await Promise.all(
      orderList.map((order) => Stock.findById(order.stockId))
    );
    const finalPurchaseList = orderList
      .filter((order, index) => {
        return stockList[index];
      })
      .map((order, index) => {
        return {
          _id: order._id,
          userId: order.userId,
          stockId: order.stockId,
          quantity: order.quantity,
          price: order.price,
          stock: stockList[index],
        };
      })
      .reduce((acc, cur) => {
        const stockId = cur.stockId;
        const quantity = cur.quantity;
        const price = cur.price;
        const stock = cur.stock;
        const stockIndex = acc.findIndex(
          (loopStock) => loopStock.stock.ticker === stock.ticker
        );

        if (stockIndex === -1) {
          return [
            ...acc,
            {
              stockId,
              quantity,
              price,
              stock,
            },
          ];
        } else {
          acc[stockIndex].quantity += quantity;
          acc[stockIndex].price += price;
          return acc;
        }
      }, []);

    const profitPercentageList = finalPurchaseList.map((purchase) => {
      const quantity = purchase.quantity;
      const currentAmount = purchase.stock.currentPrice * quantity;
      const boughtAmount = purchase.price * quantity;
      const profitAmount = boughtAmount - currentAmount;
      const profitPercentage = (profitAmount + currentAmount) / currentAmount;
      return {
        stockName: purchase.stock.name,
        ticker: purchase.stock.ticker,
        percent: Math.floor(profitPercentage * 10000) / 100,
      };
    });

    return res.status(200).send(profitPercentageList);
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).send({ error: JSON.stringify(error) });
  }
});

router.get("/:email/search", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const userDocument = await User.findOne({ email: userEmail });

    if (!userDocument) {
      return res.status(404).send({});
    } else {
      return res.status(200).send(userDocument);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

router.get("/:id/ideas", async (req, res) => {
  const id = req.params.id;
  const ideas = await getIdeasByUserId(id);
  res.json(ideas);
});

router.put("/:id/follow", validUser, async (req, res) => {
  const user = req.user;
  const currentUserId = user.id;
  const targetUserId = req.params.id;

  const hasTargetUserInFollowing = user.followings.find(
    (following) => following === targetUserId
  );
  if (hasTargetUserInFollowing) {
    await User.updateOne(
      { _id: currentUserId },
      { $pull: { followings: targetUserId } }
    );
    await User.updateOne(
      { _id: targetUserId },
      { $pull: { followers: currentUserId } }
    );
  } else {
    await User.updateOne(
      { _id: currentUserId },
      { $push: { followings: targetUserId } }
    );

    await User.updateOne(
      { _id: targetUserId },
      { $push: { followers: currentUserId } }
    );
  }

  res.json({ message: "success" });
});

router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.deleteOne({ _id });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;
