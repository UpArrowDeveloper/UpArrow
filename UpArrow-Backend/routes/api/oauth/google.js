const express = require('express');
const router = express.Router();
const passport = require('passport');
// google login 화면
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// google login 성공과 실패 리다이렉트
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

module.exports = router;
