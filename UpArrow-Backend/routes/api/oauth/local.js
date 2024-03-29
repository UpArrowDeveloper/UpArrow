const express = require("express");
const router = express.Router();
const { generateToken } = require("../../../lib/token");
const { getUserByEmail, addUser } = require("../../../services/user");

// google login 성공과 실패 리다이렉트
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  if (password !== process.env.SECRET_PASSWORD) {
    return res.status(400).send("wrong password");
  }

  if (!(await getUserByEmail(email))) {
    return res.status(400).send("no user");
  }

  const accessToken = generateToken(email);
  res.send({ accessToken });
});

router.post("/signup", async (req, res) => {
  const { email, name } = req.body;
  try {
    await addUser(email, name, "");
    return res.send({ success: true });
  } catch (e) {
    return res.status(400).send("already exist");
  }
});

module.exports = router;
