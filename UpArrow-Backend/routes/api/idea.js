const express = require('express');
const router = express.Router();
const Idea = require('../../models/Idea');
const { validUser } = require('../../middlewares/auth');
var ObjectId = require('mongodb').ObjectId;

router.get('/', async (req, res) => {
  try {
    const { order, limit } = req.query;

    const posts = await Idea.find()
      .sort(order === 'desc' ? '-date' : '')
      .limit(limit);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ errorMessage: 'post get error, ', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const postObjectId = ObjectId(postId);
    const post = await Idea.findById(postObjectId);

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

router.get('/:ids/ids', async (req, res) => {
  try {
    const ids = req.params.ids?.split(',') || [];
    const ideas = await Promise.all(
      ids.map((id) => Idea.findById(ObjectId(id)))
    );
    return res.json(ideas);
  } catch (error) {
    return res.status(500).json({ message: 'id error', error });
  }
});

router.post('/', validUser, async (req, res) => {
  try {
    const user = req.user[0];
    const newPost = new Idea({
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
    const post = await Idea.findById(postObjectId);

    if (!post) {
      return res.status(404).json({ error: 'id에 해당하는 글이 없습니다.' });
    } else {
      const postQuery = { _id: postObjectId };
      const updatedPostValue = {
        ...req.body,
      };
      await Idea.findOneAndUpdate(postQuery, updatedPostValue);
      return res.status(200).send(updatedPostValue);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

router.get('/:userId/userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const postUserId = ObjectId(userId);
    const posts = await Idea.find({ userId: postUserId });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

module.exports = router;
