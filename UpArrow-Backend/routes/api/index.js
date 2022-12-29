const express = require('express');
const router = express.Router();

const investor = require('./investor');
const post = require('./post');
const admin = require('./admin');
const user = require('./user');
const comment = require('./comment');
const config = require('./config');
const purchase = require('./purchase');
const stock = require('./stock');
const vote = require('./vote');
const file = require('./fileRouter');

router.use('/post', post);
router.use('/investor', investor);
router.use('/admin', admin);
router.use('/user', user);
router.use('/comment', comment);
router.use('/config', config);
router.use('/purchase', purchase);
router.use('/stock', stock);
router.use('/vote', vote);
router.use('/file', file);

module.exports = router;
