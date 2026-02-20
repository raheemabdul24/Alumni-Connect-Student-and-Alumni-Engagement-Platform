const express = require('express');
const router = express.Router();

router.use('/connections', require('./connections'));
router.use('/achievements', require('./achievements'));
router.use('/chats', require('./chats'));
router.use('/users', require('./users'));
router.use('/admin', require('./admin'));

module.exports = router;
