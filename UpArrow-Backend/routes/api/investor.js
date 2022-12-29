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

router.put('/update/stockString/:id', async (req, res) => {
  const stockId = req.params.id;
  const stockObjectId = ObjectId(stockId);
  const stock = await Stock.findById(stockObjectId);

  if (!stock) {
    return res.status(404).send({});
  } else {
    const stockQuery = { _id: stockObjectId };
    const updatedStockValue = {
      name: req.body.name,
      ticker: req.body.ticker,
      profile_image_url: req.body.profile_image_url,
      pros: req.body.pros,
      cons: req.body.cons,
      industryCategory: req.body.industryCategory,
      comments: req.body.comments,
      video_url: req.body.video_url,
      advertisementId: req.body.advertisementId,
      invest: req.body.invest,
      notInvest: req.body.notInvest,
      stockString: req.body.stockString,
      posts: req.body.posts,
    };
    await Stock.findOneAndUpdate(stockQuery, updatedStockValue);
    return res.status(200).send(updatedStockValue);
  }
});

// PUT http://localhost:4000/api/v1/investor/update/stockString/:id
// a user is updating a stock information

router.get('/fetch/analysis/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const analysisDocument = await Analysis.findOne({ ticker: ticker });

  if (!analysisDocument) {
    return res.status(404).send({});
  } else {
    return res.status(200).send(analysisDocument);
  }
});

// GET http://localhost:4000/api/v1/investor/fetch/analysis/:ticker
// a user is getting the analysis of a stock

router.put('/update/comment/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const commentObjectId = ObjectId(commentId);
    const commentDocument = await Comment.findById(commentObjectId);

    if (!commentDocument) {
      return res.status(404).send({});
    } else {
      const commentQuery = { _id: commentObjectId };
      const updatedCommentValue = {
        stockId: req.body.stockId,
        userId: req.body.userId,
        postId: req.body.postId,
        content: req.body.content,
        timeStamp: req.body.timeStamp,
        likes: req.body.likes,
      };
      await Comment.findOneAndUpdate(commentQuery, updatedCommentValue);
      return res.status(200).send(updatedCommentValue);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

// PUT http://localhost:4000/api/v1/investor/update/comment/:commentId
// a user is editing/updating a comment

router.delete('/delete/comment/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const commentObjectId = ObjectId(commentId);
    const deletedCommentDocument = await Comment.findOneAndDelete({
      _id: commentObjectId,
    });

    if (!deletedCommentDocument) {
      return res.status(404).send({});
    } else {
      var deletedCommentId = deletedCommentDocument._id;

      var stockId = deletedCommentDocument.stockId;
      var stockObjectId = ObjectId(stockId);
      var stockDocument = await Stock.findById(stockObjectId);
      var stockCommentsList = stockDocument.comments;

      let updatedStockCommentsList = stockCommentsList.filter(
        (id) => !deletedCommentId.equals(id)
      );

      var stockQuery = { _id: stockObjectId };
      var updatedStockValue = {
        name: stockDocument.name,
        ticker: stockDocument.ticker,
        profile_image_url: stockDocument.profile_image_url,
        pros: stockDocument.pros,
        cons: stockDocument.cons,
        industryCategory: stockDocument.industryCategory,
        comments: updatedStockCommentsList,
        video_url: stockDocument.video_url,
        advertisementId: stockDocument.advertisementId,
        invest: stockDocument.invest,
        notInvest: stockDocument.notInvest,
        stockString: stockDocument.stockString,
        posts: stockDocument.posts,
      };
      await Stock.findOneAndUpdate(stockQuery, updatedStockValue);

      var userId = deletedCommentDocument.userId;
      var userObjectId = ObjectId(userId);
      var userDocument = await User.findById(userObjectId);
      var userCommentsList = userDocument.comments;

      var updatedUserCommentsList = userCommentsList.filter(
        (uid) => !deletedCommentId.equals(uid)
      );

      var userQuery = { _id: userObjectId };
      var updatedUserValue = {
        name: userDocument.name,
        profile_image_url: userDocument.profile_image_url,
        username: userDocument.username,
        password: userDocument.password,
        email: userDocument.email,
        description: userDocument.description,
        websiteUrl: userDocument.websiteUrl,
        comments: updatedUserCommentsList,
        likes: userDocument.likes,
        isAdmin: userDocument.isAdmin,
        stockPreference: userDocument.stockPreference,
        investedCompanies: userDocument.investedCompanies,
        posts: userDocument.posts,
        purchases: userDocument.purchases,
        totalInvestment: userDocument.totalInvestment,
        totalProfits: userDocument.totalProfits,
        totalAssets: userDocument.totalAssets,
        followers: userDocument.followers,
        followings: userDocument.followings,
      };
      await User.findOneAndUpdate(userQuery, updatedUserValue);
      return res.status(200).send(deletedCommentDocument);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

// DELETE http://localhost:4000/api/v1/investor/delete/comment/:commentId
// a user is deleting a comment

router.put('/update/likes/comment/:commentId/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const commentId = req.params.commentId;
    const commentObjectId = ObjectId(commentId);
    const commentDocument = await Comment.findById(commentObjectId);
    const commentLikesList = commentDocument.likes;
    var updatedCommentLikesList = [];

    if (commentLikesList.includes(userObjectId)) {
      updatedCommentLikesList = commentLikesList.filter(
        (id) => !userObjectId.equals(id)
      );

      const commentQuery = { _id: commentObjectId };
      const updatedCommentDocument = {
        stockId: commentDocument.stockId,
        userId: commentDocument.userId,
        postId: commentDocument.postId,
        content: commentDocument.content,
        timeStamp: commentDocument.timeStamp,
        likes: updatedCommentLikesList,
      };
      await Comment.findOneAndUpdate(commentQuery, updatedCommentDocument);
      return res.status(200).send(updatedCommentDocument);
    } else {
      updatedCommentLikesList = commentLikesList;
      updatedCommentLikesList.push(userObjectId);

      const commentQuery = { _id: commentObjectId };
      const updatedCommentDocument = {
        stockId: commentDocument.stockId,
        userId: commentDocument.userId,
        postId: commentDocument.postId,
        content: commentDocument.content,
        timeStamp: commentDocument.timeStamp,
        likes: updatedCommentLikesList,
      };
      await Comment.findOneAndUpdate(commentQuery, updatedCommentDocument);
      return res.status(200).send(updatedCommentDocument);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

// PUT http://localhost:4000/api/v1/investor/update/likes/comment/:commentId/:userId
// a user clicked like button on a comment

router.get('/fetch/likes/comment/:commentId', async (req, res) => {
  const commentObjectId = ObjectId(req.params.commentId);
  const comment = await Comment.findById(commentObjectId);

  if (comment) {
    return res.status(200).send({ likes: comment.likes.length });
  } else {
    return res.status(404).send({});
  }
});

// GET http://localhost:4000/api/v1/investor/fetch/likes/comment/:commentId
// this API gets all number of likes of a comment

router.delete('/delete/userprofile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const deletedUserDocument = await User.findOneAndDelete({
      _id: userObjectId,
    });

    if (!deletedUserDocument) {
      return res.status(404).send({});
    } else {
      var deletedCommentsList = deletedUser.comments;
      for (var i = 0; i < deletedCommentsList.length; i++) {
        var commentId = deletedCommentsList[i];
        var commentObjectId = ObjectId(commentId);
        var deletedCommentDocument = await Comment.findOneAndDelete({
          _id: commentObjectId,
        });
        var deletedCommentId = deletedCommentDocument._id;

        var stockId = deletedCommentDocument.stockId;
        var stockObjectId = ObjectId(stockId);
        var stockDocument = await Stock.findById(stockObjectId);
        var stockCommentsList = stockDocument.comments;

        let updatedStockCommentsList = stockCommentsList.filter(
          (id) => !deletedCommentId.equals(id)
        );

        var stockQuery = { _id: stockObjectId };
        var updatedStockValue = {
          name: stockDocument.name,
          ticker: stockDocument.ticker,
          profile_image_url: stockDocument.profile_image_url,
          pros: stockDocument.pros,
          cons: stockDocument.cons,
          industryCategory: stockDocument.industryCategory,
          comments: updatedStockCommentsList,
          video_url: stockDocument.video_url,
          advertisementId: stockDocument.advertisementId,
          invest: stockDocument.invest,
          notInvest: stockDocument.notInvest,
          stockString: stockDocument.stockString,
          posts: stockDocument.posts,
        };
        await Stock.findOneAndUpdate(stockQuery, updatedStockValue);
      }
      return res.status(200).send(deletedUserDocument);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

// DELETE http://localhost:4000/api/v1/investor/delete/userprofile/:userId
// a user is deleting his/her user profile

router.put('/update/invest/company/:stockId/:userId', async (req, res) => {
  try {
    const stockId = req.params.stockId;
    const stockObjectId = ObjectId(stockId);
    const stockDocument = await Stock.findById(stockObjectId);
    const investList = stockDocument.invest;
    const notInvestList = stockDocument.notInvest;

    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const userDocument = await User.findById(userObjectId);
    const investedCompaniesList = userDocument.investedCompanies;
    if (investList.includes(userObjectId)) {
      return res.status(200).send(stockDocument);
    } else {
      var updatedNotInvestList = stockDocument.notInvest;
      if (notInvestList.includes(userObjectId)) {
        updatedNotInvestList = notInvestList.filter(
          (id) => !userObjectId.equals(id)
        );
      }

      var updatedInvestList = investList;
      updatedInvestList.push(userObjectId);

      var investQuery = { _id: stockObjectId };
      var updatedStockValue = {
        name: stockDocument.name,
        ticker: stockDocument.ticker,
        profile_image_url: stockDocument.profile_image_url,
        pros: stockDocument.pros,
        cons: stockDocument.cons,
        industryCategory: stockDocument.industryCategory,
        comments: stockDocument.comments,
        video_url: stockDocument.video_url,
        advertisementId: stockDocument.advertisementId,
        invest: updatedInvestList,
        notInvest: updatedNotInvestList,
        stockString: stockDocument.stockString,
        posts: stockDocument.posts,
      };
      await Stock.findOneAndUpdate(investQuery, updatedStockValue);

      if (!investedCompaniesList.includes(stockObjectId)) {
        investedCompaniesList.push(stockObjectId);

        var investedCompaniesQuery = { _id: userObjectId };
        var updatedUserValue = {
          name: userDocument.name,
          profile_image_url: userDocument.profile_image_url,
          username: userDocument.username,
          password: userDocument.password,
          email: userDocument.userDocument,
          description: userDocument.description,
          websiteUrl: userDocument.websiteUrl,
          comments: userDocument.Array,
          likes: userDocument.likes,
          isAdmin: userDocument.isAdmin,
          stockPreference: userDocument.stockPreference,
          investedCompanies: investedCompaniesList,
          posts: userDocument.posts,
          purchases: userDocument.purchases,
          totalInvestment: userDocument.totalInvestment,
          totalProfits: userDocument.totalProfits,
          totalAssets: userDocument.totalAssets,
          followers: userDocument.followers,
          followings: userDocument.followings,
        };
        await User.findOneAndUpdate(investedCompaniesQuery, updatedUserValue);
      }
      return res.status(200).send(updatedStockValue);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

// PUT http://localhost:4000/api/v1/investor/update/invest/company/:stockId/:userId
// a user clicked "Buy" button on a stock page
// we are not using this

router.put('/update/notInvest/company/:stockId/:userId', async (req, res) => {
  try {
    const stockId = req.params.stockId;
    const stockObjectId = ObjectId(stockId);
    const stockDocument = await Stock.findById(stockObjectId);
    const investList = stockDocument.invest;
    const notInvestList = stockDocument.notInvest;

    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const userDocument = await User.findById(userObjectId);
    const investedCompaniesList = userDocument.investedCompanies;

    var updatedInvestList = stockDocument.invest;
    if (investList.includes(userObjectId)) {
      updatedInvestList = investList.filter((id) => !userObjectId.equals(id));
    }

    var updatedNotInvestList = notInvestList;
    if (!updatedNotInvestList.includes(userObjectId)) {
      updatedNotInvestList.push(userObjectId);
    }

    var investQuery = { _id: stockObjectId };
    var updatedStockValue = {
      name: stockDocument.name,
      ticker: stockDocument.ticker,
      profile_image_url: stockDocument.profile_image_url,
      pros: stockDocument.pros,
      cons: stockDocument.cons,
      industryCategory: stockDocument.industryCategory,
      comments: stockDocument.comments,
      video_url: stockDocument.video_url,
      advertisementId: stockDocument.advertisementId,
      invest: updatedInvestList,
      notInvest: updatedNotInvestList,
      stockString: stockDocument.stockString,
      posts: stockDocument.posts,
    };
    await Stock.findOneAndUpdate(investQuery, updatedStockValue);

    if (investedCompaniesList.includes(stockObjectId)) {
      var updatedCompaniesList = investedCompaniesList;
      updatedCompaniesList = investedCompaniesList.filter(
        (id) => !stockObjectId.equals(id)
      );

      var investedCompaniesQuery = { _id: userObjectId };
      var updatedUserValue = {
        name: userDocument.name,
        profile_image_url: userDocument.profile_image_url,
        username: userDocument.username,
        password: userDocument.password,
        email: userDocument.userDocument,
        description: userDocument.description,
        websiteUrl: userDocument.websiteUrl,
        comments: userDocument.Array,
        likes: userDocument.likes,
        isAdmin: userDocument.isAdmin,
        stockPreference: userDocument.stockPreference,
        investedCompanies: updatedCompaniesList,
        posts: userDocument.posts,
        purchases: userDocument.purchases,
        totalInvestment: userDocument.totalInvestment,
        totalProfits: userDocument.totalProfits,
        totalAssets: userDocument.totalAssets,
        followers: userDocument.followers,
        followings: userDocument.followings,
      };
      await User.findOneAndUpdate(investedCompaniesQuery, updatedUserValue);
    }
    return res.status(200).send(updatedStockValue);
  } catch (error) {
    return res.status(400).send({});
  }
});

// PUT http://localhost:4000/api/v1/investor/update/notInvest/company/:stockId/:userId
// a user clicked "Sell" button on a stock page

router.post('/purchase', async (req, res) => {
  try {
    const userId = req.body.userId;
    const userObjectId = ObjectId(userId);
    const userDocument = await User.findById(userObjectId);

    if (userDocument) {
      // make change here
      if (userDocument.availableCash < req.body.price * req.body.quantity) {
        return res
          .status(400)
          .send('totalInvested is lower than availableCash');
      }
      const purchases = userDocument.purchases;
      let isDuplicate = false;
      console.log('purchases : ', purchases);
      for (let i = 0; i < purchases.length; i++) {
        const purchaseObjectId = purchases[i];
        const purchaseDocument = await Purchase.findById(purchaseObjectId);
        if (purchaseDocument.stockId == req.body.stockId) {
          isDuplicate = true;
        }
      }
      if (isDuplicate) {
        const purchaseQuery = { stockId: req.body.stockId };
        const purchaseDocument = await Purchase.findOne({
          stockId: req.body.stockId,
          userId: userId,
        });
        if (purchaseDocument) {
          const updatedQuantity = purchaseDocument.quantity + req.body.quantity;
          const originQuantity = purchaseDocument.quantity;
          const originAveragePrice = purchaseDocument.price;
          const newQuantity = req.body.quantity;
          const newPrice = req.body.price;
          const newAveragePrice =
            (originQuantity * originAveragePrice + newQuantity * newPrice) /
            (originQuantity + newQuantity);
          console.log('new quantity : ', newQuantity);
          console.log('new price: ', newPrice);

          const updatedPurchaseValue = {
            userId: purchaseDocument.userId,
            stockId: purchaseDocument.stockId,
            quantity: updatedQuantity, // if the stock that user purchase is the same stock he/she invested, we are updating the quantity
            averagePrice: newAveragePrice,
          };
          await Purchase.findOneAndUpdate(purchaseQuery, updatedPurchaseValue);

          const updatedAvailableCash =
            userDocument.availableCash - newQuantity * newPrice;

          const userQuery = { _id: userObjectId };
          const updatedUserValue = {
            name: userDocument.name,
            profile_image_url: userDocument.profile_image_url,
            username: userDocument.username,
            email: userDocument.email,
            investment_philosophy: userDocument.investment_philosophy,
            websiteUrl: userDocument.websiteUrl,
            comments: userDocument.comments,
            likes: userDocument.likes,
            isAdmin: userDocument.isAdmin,
            posts: userDocument.posts,
            purchases: userDocument.purchases,
            totalInvestment: userDocument.totalInvestment,
            totalProfits: userDocument.totalProfits,
            totalAssets: userDocument.totalAssets,
            followers: userDocument.followers,
            followings: userDocument.followings,
            availableCash: updatedAvailableCash,
          };
          await User.findOneAndUpdate(userQuery, updatedUserValue);
          return res.status(200).send(updatedPurchaseValue);
        } else {
          return res.status(404).send({});
        }
      } else {
        // if the stock that user purchase is a brand new stock
        const validStockDocument = await Stock.findById(
          ObjectId(req.body.stockId)
        );

        if (!validStockDocument) {
          return res.status(404).send('validStockDocument none');
        }

        const newPurchase = new Purchase({
          userId: req.body.userId,
          stockId: req.body.stockId,
          quantity: req.body.quantity,
          averagePrice: req.body.price,
        });
        const purchaseList = userDocument.purchases;
        purchaseList.push(newPurchase._id);

        let updatedAvailableCash =
          userDocument.availableCash - req.body.price * req.body.quantity;

        const userQuery = { _id: userObjectId };
        const updatedUserValue = {
          name: userDocument.name,
          profile_image_url: userDocument.profile_image_url,
          username: userDocument.username,
          email: userDocument.email,
          investment_philosophy: userDocument.investment_philosophy,
          websiteUrl: userDocument.websiteUrl,
          comments: userDocument.comments,
          likes: userDocument.likes,
          isAdmin: userDocument.isAdmin,
          posts: userDocument.posts,
          purchases: purchaseList,
          totalInvestment: userDocument.totalInvestment,
          totalProfits: userDocument.totalProfits,
          totalAssets: userDocument.totalAssets,
          followers: userDocument.followers,
          followings: userDocument.followings,
          availableCash: updatedAvailableCash,
        };
        await User.findOneAndUpdate(userQuery, updatedUserValue);
        await newPurchase.save();
        return res.status(200).send(newPurchase);
      }
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    console.log('error : ', error);
    return res.status(400).send('Something wrong...');
  }
});

router.put('/sell', async (req, res) => {
  console.log('sell is working');
  try {
    const userId = req.body.userId;
    const userObjectId = ObjectId(userId);
    const userDocument = await User.findById(userObjectId);

    if (!userDocument) {
      return res.status(400).send('Wrong stockId or userId');
    }

    let purchaseDocument = await Purchase.findOne({
      stockId: req.body.stockId,
      userId: userId,
    });

    if (purchaseDocument) {
      if (purchaseDocument.quantity < req.body.quantity) {
        return res.status(400).send("Can't sell more quantity");
      }

      const updatedQuantity = purchaseDocument.quantity - req.body.quantity;

      let newAveragePrice = (await Config.find())[0].prices;
      console.log(
        'newAveragePrice/////////////////////////////////////////////////////////////////////////////',
        newAveragePrice
      );
      const stockDocument = await Stock.findById(req.body.stockId);
      const ticker = stockDocument.ticker;
      const stockPrice = newAveragePrice[ticker];

      /////////////////////////////////////////////////////////////////////////////////////////////////////
      let purchaseQuery = { _id: purchaseDocument._id };
      let updatedPurchaseDocument = {
        userId: purchaseDocument.userId,
        stockId: purchaseDocument.stockId,
        quantity: updatedQuantity,
        price:
          (purchaseDocument.quantity * purchaseDocument.averagePrice +
            req.body.quantity * stockPrice) /
          (purchaseDocument.quantity + req.body.quantity),
      };
      console.log(
        'updatedPurchaseDocument ////////////////////////////////////////////////////////////////////',
        updatedPurchaseDocument
      );
      await Purchase.findOneAndUpdate(purchaseQuery, updatedPurchaseDocument);

      let updatedAvailableCash =
        userDocument.availableCash + req.body.quantity * req.body.price;
      const userQuery = { _id: userObjectId };
      let updatedUserDocument = {
        name: userDocument.name,
        profile_image_url: userDocument.profile_image_url,
        username: userDocument.username,
        email: userDocument.email,
        investment_philosophy: userDocument.investment_philosophy,
        websiteUrl: userDocument.websiteUrl,
        comments: userDocument.comments,
        likes: userDocument.likes,
        isAdmin: userDocument.isAdmin,
        posts: userDocument.posts,
        purchases: userDocument.purchases,
        totalInvestment: userDocument.totalInvestment, // Don't we need to update totalInvestment?
        totalProfits: userDocument.totalProfits,
        totalAssets: userDocument.totalAssets,
        followers: userDocument.followers,
        followings: userDocument.followings,
        availableCash: updatedAvailableCash,
      };
      await User.findOneAndUpdate(userQuery, updatedUserDocument);
      return res.status(200).send(updatedPurchaseDocument);
      //update the userDocument's available cash
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    console.error('error : ', error);
    return res.status(400).send({ error });
  }
});

// PUT http://localhost:4000/api/v1/investor/sell
// a user selling his stock

// the user gets cash
// the user has less stock (or sold stock)
// the user has less totalInvestment

// update userDocument.totalInvestment

router.get('/fetch/stocks/purchase/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const user = await User.findById(userObjectId);
    const purchases = user.purchases;
    var purchaseList = [];
    var tickerStr = '';

    if (user) {
      for (var i = 0; i < purchases.length; i++) {
        var purchaseObjectId = purchases[i];
        var purchaseDocument = await Purchase.findById(purchaseObjectId);
        var stockId = purchaseDocument.stockId;
        var stockObjectId = ObjectId(stockId);
        var stockDocument = await Stock.findById(stockObjectId);
        var purchaseJSON = {};
        purchaseJSON.userId = userId;
        purchaseJSON.ticker = stockDocument.ticker;
        purchaseJSON.logo = stockDocument.profile_image_url;
        purchaseJSON.quantity = purchaseDocument.quantity;
        purchaseJSON.totalInvested = purchaseDocument.totalInvested;
        if (i == purchases.length - 1) {
          tickerStr = tickerStr + stockDocument.ticker;
        } else {
          tickerStr = tickerStr + stockDocument.ticker + ',';
        }
        purchaseList.push(purchaseJSON);
      }

      var twelveDataRes = await axios.get(
        `https://api.twelvedata.com/time_series?symbol=${tickerStr}&interval=1min&apikey=4c745db6ae464c4983f6f656092e5d15`
      );

      var finalPurchaseList = [];
      var purchase = null;
      var purchaseTicker = '';
      var currentPrice = 0;
      if (purchaseList.length == 1) {
        purchase = purchaseList[0];
        currentPrice = twelveDataRes.data.values[0].high;
        purchase.currentPrice = parseFloat(currentPrice);
        purchase.profit =
          currentPrice * purchase.quantity - purchase.totalInvested;
        finalPurchaseList.push(purchase);
      } else {
        for (var i = 0; i < purchaseList.length; i++) {
          purchase = purchaseList[i];
          purchaseTicker = purchase.ticker;

          currentPrice = twelveDataRes.data[purchaseTicker].values[0].high;
          purchase.currentPrice = parseFloat(currentPrice);
          purchase.profit =
            currentPrice * purchase.quantity - purchase.totalInvested;
          finalPurchaseList.push(purchase);
        }
      }
      return res.status(200).send(finalPurchaseList);
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

// GET http://localhost:4000/api/v1/investor/fetch/stocks/purchase/:userId
// Getting all purchases of a user and see if he made/lost money

router.get('/purchases/:profileUserId', async (req, res) => {
  try {
    const profileUserId = req.params.profileUserId;
    const profileUserObjectId = ObjectId(profileUserId);
    const profileUserDoc = await User.findById(profileUserObjectId);

    if (!profileUserDoc) {
      return res.status(404).send({});
    }
    const purchaseList = profileUserDoc.purchases;
    var stockList = [];

    for (var i = 0; i < purchaseList.length; i++) {
      var purchase = await Purchase.findById(purchaseList[i]);
      var stockId = purchase.stockId;
      var stockObjectId = ObjectId(stockId);
      var stockDocument = await Stock.findById(stockObjectId);
      stockList.push(stockDocument);
    }
    return res.status(200).send(stockList);
  } catch (error) {
    return res.status(400).send({});
  }
});

//GET http://localhost:4000/api/v1/investor/purchases/:profileUserId
// a user is getting all the stock documents he/she invested

router.get('/fetch/stocks/allpurchases', async (req, res) => {
  const allPurchases = await Purchase.find();
  return res.status(200).send(allPurchases);
});

//GET http://localhost:4000/api/v1/investor/fetch/stocks/purchases
// a user is getting all purchases in upArrow of all users

router.get('/fetch/purchaes/portfolio/:userId', async (req, res) => {
  const allPortfolio = await Purchase.find({ userId: req.params.userId });
  return res.status(200).send(allPortfolio);
});

//GET http://localhost:4000/api/v1/investor/fetch/purchaes/portfolio/:userId

router.get('/fetch/profit/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userIdObjectId = ObjectId(userId);
    const userDocument = await User.findById(userIdObjectId); // purchsedoc.quantity * Average.current - purchase.totalInvested

    const purchaseObjectIdList = userDocument.purchases; // objectId of all purchases

    const averageDocument = (await Average.find())[0]; // the 0th index of Average document
    const averagePriceList = averageDocument.averages; // the actual list

    let profit = 0;
    const purchaseList = await Promise.all(
      // 이 부분도 이해가 잘 안가요
      purchaseObjectIdList.map((objectId) => {
        // iterating through purchaseObjectIdList to extract purchase objectId
        return Purchase.findById(objectId); // returns Purchase document
      })
    );

    var profitJSON = {};
    for await (const purchase of purchaseList) {
      // 이게 무슨 코드이죠?
      if (purchase === null) {
        continue;
      }
      const quantity = purchase.quantity;
      const totalInvested = purchase.totalInvested;
      const stockId = purchase.stockId;
      const stockObjectId = ObjectId(stockId);
      const stockDocument = await Stock.findById(stockObjectId);
      const ticker = stockDocument.ticker;
      const price = averagePriceList.find((averageJSON) => {
        // 이 부분 잘 이해 안가요
        return averageJSON[ticker];
      })[ticker];
      profit = quantity * price - totalInvested + profit;
    }
    profitJSON.profit = profit;
    return res.status(200).send(profitJSON);
  } catch (error) {
    return res.status(400).send({});
  }
});

router.get('/fetch/all/user/comments/:userId', async (req, res) => {
  const userStringId = req.params.userId;
  const allComments = await Comment.find({ userId: userStringId });

  return res.status(200).send(allComments);
});

router.put('/update/userprofile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const userDocument = await User.findById(userObjectId);

    if (!userDocument) {
      return res.status(404).send({});
    } else {
      const userQuery = { _id: userObjectId };
      const updatedUserValue = {
        name: req.body.name,
        profile_image_url: req.body.profile_image_url,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        comments: req.body.comments,
        likes: req.body.likes,
        isAdmin: req.body.isAdmin,
        stockPreference: req.body.stockPreference,
        investedCompanies: req.body.investedCompanies,
        posts: req.body.posts,
        purchases: req.body.purchases,
        totalInvestment: req.body.totalInvestment,
        totalProfits: req.body.totalProfits,
        totalAssets: req.body.totalAssets,
        followers: req.body.followers,
        followings: req.body.followings,
      };
      await User.findOneAndUpdate(userQuery, updatedUserValue);
      return res.status(200).send(updatedUserValue);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

router.put('/following/:loggedUserId/:profileUserId', async (req, res) => {
  try {
    const loggedUserId = req.params.loggedUserId;
    const loggedUserObjectId = ObjectId(loggedUserId);
    const loggedUserDoc = await User.findById(loggedUserObjectId);
    const profileUserId = req.params.profileUserId;
    const profileUserObjectId = ObjectId(profileUserId);
    const profileUserDoc = await User.findById(profileUserObjectId);

    var updatedProfileUserFollowersList = profileUserDoc.followers;
    var updatedLoggedUserFollowingsList = loggedUserDoc.followings;
    var response = [];

    if (loggedUserDoc && profileUserDoc) {
      if (profileUserDoc.followers.includes(loggedUserObjectId)) {
        updatedProfileUserFollowersList = profileUserDoc.followers.filter(
          (id) => !loggedUserObjectId.equals(id)
        );
        updatedLoggedUserFollowingsList = loggedUserDoc.followings.filter(
          (id) => !profileUserObjectId.equals(id)
        );

        const loggedUserQuery = { _id: loggedUserObjectId };
        const profileUserQuery = { _id: profileUserObjectId };

        const updatedLoggedUserValue = {
          name: loggedUserDoc.name,
          profile_image_url: loggedUserDoc.profile_image_url,
          username: loggedUserDoc.username,
          password: loggedUserDoc.password,
          email: loggedUserDoc.email,
          description: loggedUserDoc.description,
          websiteUrl: loggedUserDoc.websiteUrl,
          comments: loggedUserDoc.comments,
          likes: loggedUserDoc.likes,
          isAdmin: loggedUserDoc.isAdmin,
          stockPreference: loggedUserDoc.stockPreference,
          investedCompanies: loggedUserDoc.investedCompanies,
          posts: loggedUserDoc.posts,
          purchases: loggedUserDoc.purchases,
          totalInvestment: loggedUserDoc.totalInvestment,
          followers: loggedUserDoc.followers,
          followings: updatedLoggedUserFollowingsList,
        };
        await User.findOneAndUpdate(loggedUserQuery, updatedLoggedUserValue);

        const updatedProfileUserValue = {
          name: profileUserDoc.name,
          profile_image_url: profileUserDoc.profile_image_url,
          username: profileUserDoc.username,
          password: profileUserDoc.password,
          email: profileUserDoc.email,
          description: profileUserDoc.description,
          comments: profileUserDoc.comments,
          websiteUrl: profileUserDoc.websiteUrl,
          likes: profileUserDoc.likes,
          isAdmin: profileUserDoc.isAdmin,
          stockPreference: profileUserDoc.stockPreference,
          investedCompanies: profileUserDoc.investedCompanies,
          posts: profileUserDoc.posts,
          purchases: profileUserDoc.purchases,
          totalInvestment: profileUserDoc.totalInvestment,
          followers: updatedProfileUserFollowersList,
          followings: profileUserDoc.followings,
        };
        await User.findOneAndUpdate(profileUserQuery, updatedProfileUserValue);
        response.push(updatedLoggedUserValue);
        response.push(updatedProfileUserValue);
        return res.status(200).send(response);
      } else {
        updatedProfileUserFollowersList.push(loggedUserObjectId);
        updatedLoggedUserFollowingsList.push(profileUserObjectId);

        const loggedUserQuery = { _id: loggedUserObjectId };
        const profileUserQuery = { _id: profileUserObjectId };

        const updatedLoggedUserValue = {
          name: loggedUserDoc.name,
          profile_image_url: loggedUserDoc.profile_image_url,
          username: loggedUserDoc.username,
          password: loggedUserDoc.password,
          email: loggedUserDoc.email,
          description: loggedUserDoc.description,
          comments: loggedUserDoc.comments,
          websiteUrl: loggedUserDoc.websiteUrl,
          likes: loggedUserDoc.likes,
          isAdmin: loggedUserDoc.isAdmin,
          stockPreference: loggedUserDoc.stockPreference,
          investedCompanies: loggedUserDoc.investedCompanies,
          posts: loggedUserDoc.posts,
          purchases: loggedUserDoc.purchases,
          totalInvestment: loggedUserDoc.totalInvestment,
          followers: loggedUserDoc.followers,
          followings: updatedLoggedUserFollowingsList,
        };
        await User.findOneAndUpdate(loggedUserQuery, updatedLoggedUserValue);

        const updatedProfileUserValue = {
          name: profileUserDoc.name,
          profile_image_url: profileUserDoc.profile_image_url,
          username: profileUserDoc.username,
          password: profileUserDoc.password,
          email: profileUserDoc.email,
          description: profileUserDoc.description,
          comments: profileUserDoc.comments,
          websiteUrl: profileUserDoc.comments,
          likes: profileUserDoc.likes,
          isAdmin: profileUserDoc.isAdmin,
          stockPreference: profileUserDoc.stockPreference,
          investedCompanies: profileUserDoc.investedCompanies,
          posts: profileUserDoc.posts,
          purchases: profileUserDoc.purchases,
          totalInvestment: profileUserDoc.totalInvestment,
          followers: updatedProfileUserFollowersList,
          followings: profileUserDoc.followings,
        };
        await User.findOneAndUpdate(profileUserQuery, updatedProfileUserValue);
        response.push(updatedLoggedUserValue);
        response.push(updatedProfileUserValue);
        return res.status(200).send(response);
      }
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

//http://localhost:4000/api/v1/investor/following/:loggedUserId/:profileUserId
// a logged user is following an investor he/she wants to follow, if he/she follows this investor he/she unfollowing him

router.get('/followers/:profileUserId', async (req, res) => {
  try {
    const profileUserId = req.params.profileUserId;
    const profileUserObjectId = ObjectId(profileUserId);
    const profileUserDoc = await User.findById(profileUserObjectId);

    const followerDocList = [];

    if (profileUserDoc) {
      var followers = profileUserDoc.followers;
      for (var i = 0; i < followers.length; i++) {
        var followerDoc = await User.findById(followers[i]);
        followerDocList.push(followerDoc);
      }
      return res.status(200).send(followerDocList);
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

//http://localhost:4000/api/v1/investor/followers/:profileUserId
// a user wants to see the followers of another user (ex. a hot shot investor like Warren Buffet)

router.get('/followings/:profileUserId', async (req, res) => {
  try {
    const profileUserId = req.params.profileUserId;
    const profileUserObjectId = ObjectId(profileUserId);
    const profileUserDoc = await User.findById(profileUserObjectId);

    const followingDocList = [];

    if (profileUserDoc) {
      var followings = profileUserDoc.followings;
      for (var i = 0; i < followings.length; i++) {
        var followingDoc = await User.findById(followings[i]);
        followingDocList.push(followingDoc);
      }
      return res.status(200).send(followingDocList);
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

//http://localhost:4000/api/v1/investor/followings/:profileUserId
// a user wants to see what other users a hot shot user (ex. Warren Buffett) is following

module.exports = router;
