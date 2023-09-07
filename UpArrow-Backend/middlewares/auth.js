const { NoToken, InvalidToken } = require("../error/user");
const { verifyToken } = require("../lib/token");
const User = require("../models/User");

const validUser = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) return NoToken.responseError(res);
  try {
    const email = verifyToken(accessToken)?.email;
    if (!email) throw "";
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, data: "no user" });
    req.user = user;
    next();
    return;
  } catch (error) {
    return InvalidToken.responseError(res);
  }
};

module.exports = { validUser };
