const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Stock = require('../../models/Stock');
const Post = require('../../models/Post');
const { validUser } = require('../../middlewares/auth');
var ObjectId = require('mongodb').ObjectId;

router.get('/', async (req, res) => {
  try {
    const { order, limit } = req.query;

    const posts = await Post.find()
      .sort(order === 'desc' ? '-date' : '')
      .limit(limit);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ errorMessage: 'post get error, ', error });
  }
});

router.post('/', validUser, async (req, res) => {
  try {
    const user = req.user[0];
    const newPost = new Post({
      ...req.body,
      userId: user._id,
      username: user.username,
      date: new Date(),
      comments: [],
      likes: [],
    });
    newPost.save().catch((err) => console.log(err));
    return res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

router.put('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const postObjectId = ObjectId(postId);
    const post = await Post.findById(postObjectId);

    if (!post) {
      return res.status(404).json({ error: 'id에 해당하는 글이 없습니다.' });
    } else {
      const postQuery = { _id: postObjectId };
      const updatedPostValue = {
        ...req.body,
      };
      await Post.findOneAndUpdate(postQuery, updatedPostValue);
      return res.status(200).send(updatedPostValue);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const postObjectId = ObjectId(postId);
    const post = await Post.findById(postObjectId);

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

router.get('/:userId/userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const postUserId = ObjectId(userId);
    const posts = await Post.find({ userId: postUserId });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// GET http://localhost:4000/api/v1/post/fetch/single/:postId
// A user clicked a post (investment idea) to view it

router.get('/fetch/all/user/:userId', async (req, res) => {
  try {
    const userStringId = req.params.userId;
    const userObjectId = ObjectId(userStringId);
    const userDocument = await User.findById(userObjectId);

    if (userDocument) {
      const allPosts = await Post.find({ userId: userStringId });
      return res.status(200).send(allPosts);
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// GET http://localhost:4000/api/v1/post/fetch/all/user/:userId
// Getting all the posts from one user (i.e. Warren Buffett)

router.get('/fetch/all/stock/:stockId', async (req, res) => {
  try {
    const stockStringId = req.params.stockId;
    const stockObjectId = ObjectId(stockStringId);
    const stockDocument = await Stock.findById(stockObjectId);

    if (stockDocument) {
      const allPosts = await Post.find({ stockId: stockStringId });
      return res.status(200).send(allPosts);
    } else {
      return res.status(404).send({});
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// GET http://localhost:4000/api/v1/post/fetch/all/stock/:stockId
// Getting all the post for about a stock

// PUT http://localhost:4000/api/v1/post/single/update/:postId
// A user is updating a Post

router.put('/update/likes/:postId/:userId', async (req, res) => {
  console.log('I am inside the post like api');
  try {
    const userId = req.params.userId;
    const userObjectId = ObjectId(userId);
    const postId = req.params.postId;
    const postObjectId = ObjectId(postId);
    const postDocument = await Post.findById(postObjectId);
    var postLikesList = postDocument.likes;
    var updatedPostLikesList = [];

    if (postLikesList.includes(userObjectId)) {
      postLikesList = postLikesList.filter((id) => !userObjectId.equals(id));

      const postQuery = { _id: postObjectId };
      const updatedPostDocument = {
        stockId: postDocument.stockId,
        userId: postDocument.userId,
        userName: postDocument.userName,
        title: postDocument.title,
        content: postDocument.content,
        date: postDocument.date,
        likes: postLikesList,
        numberLikes: postDocument.numberLikes,
        comments: postDocument.comments,
        video_url: postDocument.video_url,
        image_url: postDocument.image_url,
      };
      await Post.findOneAndUpdate(postQuery, updatedPostDocument);
      return res.status(200).send(updatedPostDocument);
    } else {
      console.log('post like clicked twice');
      updatedPostLikesList = postLikesList;
      updatedPostLikesList.push(userObjectId);

      const postQuery = { _id: postObjectId };
      const updatedPostDocument = {
        stockId: postDocument.stockId,
        userId: postDocument.userId,
        userName: postDocument.userName,
        title: postDocument.title,
        content: postDocument.content,
        date: postDocument.date,
        likes: updatedPostLikesList,
        numberLikes: updatedPost.numberLikes,
        comments: postDocument.comments,
        video_url: postDocument.video_url,
        image_url: postDocument.image_url,
      };
      await Post.findOneAndUpdate(postQuery, updatedPostDocument);
      return res.status(200).send(updatedPostDocument);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// PUT http://localhost:4000/api/v1/post/update/likes/:postId/:userId
// A user clicked a like button on a post

router.delete('/single/delete/:postId', async (req, res) => {
  console.log('we are inside the deleted post api');
  try {
    const postId = req.params.postId;
    const postObjectId = ObjectId(postId);
    const deletedPost = await Post.findOneAndDelete({ _id: postObjectId });
    console.log('this is the deletedPost', deletedPost);

    if (!deletedPost) {
      return res.status(404).send({});
    } else {
      var deletedPostId = deletedPost._id;
      console.log('this is the deletedPostId', deletedPostId);

      var stockId = deletedPost.stockId;
      var stockObjectId = ObjectId(stockId);
      var stockDocument = await Stock.findById(stockObjectId);
      var stockPostsList = stockDocument.posts;

      let updatedPostsList = stockPostsList.filter(
        (id) => !deletedPostId.equals(id)
      );

      var stockQuery = { _id: stockObjectId };
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
        invest: stockDocument.invest,
        notInvest: stockDocument.notInvest,
        stockString: stockDocument.stockString,
        posts: updatedPostsList,
      };
      await Stock.findOneAndUpdate(stockQuery, updatedStockValue);

      var userId = deletedPost.userId;
      var userObjectId = ObjectId(userId);
      console.log('this is the userId', userId);
      var userDocument = await User.findById(userObjectId);
      var userPostsList = userDocument.posts;
      console.log('this is the userPostsList before filter', userPostsList);

      var updatedUserPostsList = userPostsList.filter(
        (uid) => !deletedPostId.equals(uid)
      );
      console.log(
        'this is the updated UserPostsList after filter',
        updatedUserPostsList
      );

      var userQuery = { _id: userObjectId };
      var updatedUserValue = {
        name: userDocument.name,
        profile_image_url: userDocument.profile_image_url,
        username: userDocument.username,
        password: userDocument.password,
        email: userDocument.email,
        description: userDocument.description,
        comments: userDocument.comments,
        likes: userDocument.likes,
        isAdmin: userDocument.isAdmin,
        stockPreference: userDocument.stockPreference,
        investedCompanies: userDocument.investedCompanies,
        posts: updatedUserPostsList,
      };
      await User.findOneAndUpdate(userQuery, updatedUserValue);
      return res.status(200).send(deletedPost);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// DELETE http://localhost:4000/api/v1/post/single/delete/:postId
// A user deletes a post

router.get('/fetch/top/six', async (req, res) => {
  const sortedPosts = await Post.find().sort({ numberLikes: -1 });
  const topSixList = sortedPosts.slice(0, 6);
  console.log(topSixList);
  console.log(topSixList.length);
  return res.status(200).send(topSixList);
});

// GET http://localhost:4000/api/v1/post/fetch/top/six
// a user is getting top 6 posts (on index.js)

module.exports = router;
