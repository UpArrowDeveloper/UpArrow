const express = require('express');
const router = express.Router();
const axios = require('axios');

const config = require('../../../config/env');
const { addUser } = require('../../../services/user');
const { USER_ALREADY_EXIST } = require('../../../error/user');
const { generateToken } = require('../../../lib/token');
// google login 화면
router.get('/auth/google', (req, res) =>
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${config.googleOAuthRedirectUrl}&scope=email%20profile&client_id=${config.oauthClientId}`
  )
);

// google login 성공과 실패 리다이렉트
router.post('/auth', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('no code');
  }

  const accessTokenRequestUrl = `https://oauth2.googleapis.com/token`;
  try {
    const result = await axios({
      method: 'POST',
      url: accessTokenRequestUrl,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      params: {
        grant_type: 'authorization_code', //특정 스트링
        client_id: config.oauthClientId,
        client_secret: config.oauthClientSecret,
        redirect_uri: config.googleOAuthRedirectUrl,
        code: code,
      },
    });
    // get google id info
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';

    const profile = await axios.get(url, {
      params: {
        access_token: result.data.access_token,
      },
    });
    const { email, name, picture } = profile.data;

    try {
      await addUser(email, name, picture);
    } catch (error) {
      if (error.errorType === USER_ALREADY_EXIST) {
        console.info('already signup');
      } else {
        console.error('error : ', error);
        return res.status(500).json(error);
      }
    }
    const accessToken = generateToken(email);
    res.send({ accessToken });
  } catch (error) {
    console.log('error : ', error);
    res.status(410).send({ message: 'code expired' });
  }
});

module.exports = router;
