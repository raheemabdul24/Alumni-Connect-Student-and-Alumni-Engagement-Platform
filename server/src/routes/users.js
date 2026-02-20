const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { getMe, getProfile, updateProfile, searchUsers, setRole } = require('../controllers/userController');

router.get('/me', requireAuth, getMe);
router.get('/search', requireAuth, searchUsers);
router.get('/:id', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);
router.patch('/me/role', requireAuth, setRole);

module.exports = router;
