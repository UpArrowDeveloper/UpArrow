const User = require('../models/User');

const validUser = async (req, res, next) => {
  const userEmail = req.body.email;
  const user = await User.find({ email: userEmail });
  if (!user) return res.status(400).json({ success: false, data: 'no user' });
  req.user = user;
  next();
};

module.exports = { validUser };
