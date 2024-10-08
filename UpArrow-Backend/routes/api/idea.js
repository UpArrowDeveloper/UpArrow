const express = require("express");
const router = express.Router();
const Idea = require("../../models/Idea");
const { validUser } = require("../../middlewares/auth");
const User = require("../../models/User");
const ObjectId = require("mongodb").ObjectId;

let ideaCache = {
  order: "desc",
  limit: 6,
  value: undefined,
};

setInterval(async () => {
  ideaCache.value = undefined;
}, 1000 * 60 * 5);
router.get("/", async (req, res) => {
  try {
    const { order, limit } = req.query;
    if (
      ideaCache.value &&
      ideaCache.order === order &&
      ideaCache.limit === limit
    ) {
      return res.status(200).json(ideaCache.value);
    }

    const ideas = await Idea.find()
      .sort(order === "desc" ? "-date" : "")
      .limit(limit);

    const userAddedIdeas = await Promise.all(
      ideas.map(async (idea) => {
        const username = (await User.findById(idea.userId)).username;
        return {
          ...idea._doc,
          username,
        };
      })
    );
    if (order === "desc" && limit === 6) {
      ideaCache = {
        order,
        limit,
        value: userAddedIdeas,
      };
    }
    return res.status(200).json(userAddedIdeas);
  } catch (error) {
    return res.status(500).json({ errorMessage: "post get error, ", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const postObjectId = ObjectId(postId);
    const post = await Idea.findById(postObjectId);

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(400).send({});
  }
});

router.get("/:ids/ids", async (req, res) => {
  try {
    const ids = req.params.ids?.split(",") || [];
    const ideas = await Promise.all(
      ids.map((id) => Idea.findById(ObjectId(id)))
    );
    return res.json(ideas);
  } catch (error) {
    return res.status(500).json({ message: "id error", error });
  }
});

router.post("/", validUser, async (req, res) => {
  try {
    const user = req.user;
    const newPost = new Idea({
      ...req.body,
      userId: user._id,
      username: user.username,
      date: new Date(),
      comments: [],
      likes: [],
    });
    newPost.save().catch((err) => console.error(err));
    return res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    console.error(error);
    return res.status(400).send({});
  }
});

router.put("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const postObjectId = ObjectId(postId);
    const post = await Idea.findById(postObjectId);

    if (!post) {
      return res.status(404).json({ error: "id에 해당하는 글이 없습니다." });
    } else {
      const postQuery = { _id: postObjectId };
      const updatedPostValue = {
        ...req.body,
      };
      await Idea.findOneAndUpdate(postQuery, updatedPostValue);
      return res.status(200).send(updatedPostValue);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ideaId = req.params.id;
    const ideaObjectId = ObjectId(ideaId);
    await Idea.deleteOne({ _id: ideaObjectId });
    return res.status(200).send("delete success");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
});

router.get("/:userId/userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const ideas = await Idea.find({ userId });

    return res.status(200).json(ideas);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: JSON.stringify(error) });
  }
});

module.exports = router;
