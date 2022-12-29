const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Stock = require('../../models/Stock');
const Advertisement = require('../../models/Advertisement');
const Comment = require('../../models/Comment');
const Analysis = require('../../models/Analysis');
const Purchase = require('../../models/Purchase');
const Average = require('../../models/Config');
var ObjectId = require('mongodb').ObjectId;
const axios = require('axios');
const Config = require('../../models/Config');

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

router.post('/', async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(400).send({});
  } else {
    const newUser = new User({ ...req.body, availableCash: 100000 });
    newUser.save().catch((err) => console.log(err));
    return res.status(200).send(newUser);
  }
});

// a user getting a user data using email

router.get('/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findOne({ _id });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(200).send({ error });
  }
});

router.get('/:id/rank', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.find();
    const sortedUser = user.sort((a, b) => b.totalAssets - a.totalAssets);
    console.log('id: ', _id);
    const rank = sortedUser.findIndex((user) => {
      console.log('user.id : ', user._id);
      return user._id.toString() === _id;
    });
    console.log('rank : ', rank);

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
    return res.status(200).send({});
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
    const userObjectId = ObjectId(userId);
    const userDocument = await User.findById(userObjectId);

    const purchaseList = await Promise.all(
      userDocument.purchases.map((purchaseId) => {
        return Purchase.findById(purchaseId);
      })
    );
    const purchase2List = await Promise.all(
      purchaseList.map((purchase) => Stock.findById(purchase.stockId))
    );
    const finalPurchaseList = purchaseList.map((purchase, index) => {
      return {
        _id: purchase._id,
        userId: purchase.userId,
        stockId: purchase.stockId,
        quantity: purchase.quantity,
        averagePrice: purchase.averagePrice,
        stock: purchase2List[index],
      };
    });

    const currentPrices = (await Config.find())[0].prices;

    const profitPercentageList = finalPurchaseList.map((purchase) => {
      const quantity = purchase.quantity;
      const currentAmount = currentPrices[purchase.stock.ticker] * quantity;
      const boughtAmount = purchase.averagePrice * quantity;
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
    console.log('error: ', error);
    return res.status(400).send({ error: JSON.stringify(error) });
  }
});

// GET http://localhost:4000/api/v1/investor/fetch/all/users
// we are getting all users in UpArrow

router.get('/', async (req, res) => {
  try {
    const userList = await User.find();
    return res.status(200).send(userList);
  } catch (err) {
    return res.status(500).json({ error: err });
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

// GET http://localhost:4000/api/v1/investor/fetch/userprofiles/
// a user can get all investors

module.exports = router;
