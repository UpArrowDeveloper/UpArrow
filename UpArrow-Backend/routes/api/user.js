const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Stock = require('../../models/Stock');
const Advertisement = require('../../models/Advertisement');
const Comment = require('../../models/Comment');
const Analysis = require('../../models/Analysis');
const Order = require('../../models/Order');
const Average = require('../../models/Config');
var ObjectId = require('mongodb').ObjectId;
const axios = require('axios');
const Config = require('../../models/Config');
const {
  getTop3StocksByUserId,
  addUser,
  updateUserById,
} = require('../../services/user');
const { getIdeasByUserId } = require('../../services/idea');
const { USER_ALREADY_EXIST, UserAlreadyExist } = require('../../error/user');
const { validUser } = require('../../middlewares/auth');

// POST http://localhost:4000/api/v1/investor/register/user
// a user is registering for the first time on UpArrow

// REST API

// GET POST PUT DELETE  http method <- 하려는 동작. (동사)
// 회원
// 회원정보 가져오기
// 회원정보 추가하기 (회원가입)
// 회원정보 수정하기 (email 변경, nickname 변경)
// 회원정보 삭제하기 (회원탈퇴)

// ['a', 'b', 'c']
// POST ('/user') <- 회원가입 API
// GET ('/user') <- 회원정보 전체 가져오기
// GET ('/user/:id') <- 회원정보 하나 가져오기
// PUT ('/user/:id') <- 회원정보 하나 가져오기
// DELETE ('/user/:id') <- 회원정보 하나 가져오기

router.get('/', async (req, res) => {
  try {
    const userList = await User.find();
    return res.status(200).json(userList);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get('/:id/top3stocks', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await getTop3StocksByUserId(id);
    return res.status(200).json(result);
  } catch (err) {
    console.error('error : ', err);
    return res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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
    console.log('error : ', error);
    return res.status(500).json(error);
  }
});

// a user getting a user data using email
router.get('/me', validUser, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get('/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findOne({ _id });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get('/:id/rank', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.find();
    const sortedUser = user.sort((a, b) => b.totalAssets - a.totalAssets);
    const rank = sortedUser.findIndex((user) => {
      return user._id.toString() === _id;
    });

    return res.status(200).json({ userId: _id, rank: rank + 1 });
  } catch (error) {
    console.error('erro : ', error);
    return res.status(500).send({ error });
  }
});

router.get('/:email/email', async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(400).send({ message: 'no user' });
  }
});

// a logged user can see other investor’s profile and comments

router.get('/:userId/profile', async (req, res) => {
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

router.get('/:userId/profit-percentage', async (req, res) => {
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
    const finalPurchaseList = orderList.map((order, index) => {
      return {
        _id: order._id,
        userId: order.userId,
        stockId: order.stockId,
        quantity: order.quantity,
        price: order.price,
        stock: stockList[index],
      };
    });

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
    console.error('error: ', error);
    return res.status(500).send({ error: JSON.stringify(error) });
  }
});

// GET http://localhost:4000/api/v1/investor/search/user/:email
// a user can see other user's profile and comments using email address

router.get('/:email/search', async (req, res) => {
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

router.get('/:id/ideas', async (req, res) => {
  const id = req.params.id;
  const ideas = await getIdeasByUserId(id);
  res.json(ideas);
});

// TODO: follow
router.put('/:id/follow', validUser, async (req, res) => {
  const user = req.user;
  const currentUserId = user.id;
  const targetUserId = req.params.id;
});

// GET http://localhost:4000/api/v1/investor/fetch/userprofiles/
// a user can get all investors

module.exports = router;
