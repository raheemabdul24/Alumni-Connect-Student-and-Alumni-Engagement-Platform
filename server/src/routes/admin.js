const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/rbac');
const {
  listUsers, deleteUser, changeRole, verifyAlumni,
  listAllAchievements, approveAchievement, rejectAchievement, deleteAchievement,
  listAllConversations, getConversationMessages, deleteConversation, deleteMessage,
  systemStats
} = require('../controllers/adminController');

router.use(requireAuth, permit('admin'));

// User management
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/role', changeRole);
router.patch('/users/:id/role', changeRole);
router.post('/users/:id/verify', verifyAlumni);

// Achievement moderation
router.get('/achievements', listAllAchievements);
router.patch('/achievements/:id/approve', approveAchievement);
router.patch('/achievements/:id/reject', rejectAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Chat moderation
router.get('/conversations', listAllConversations);
router.get('/conversations/:id/messages', getConversationMessages);
router.delete('/conversations/:id', deleteConversation);
router.delete('/messages/:id', deleteMessage);

// Analytics
router.get('/stats', systemStats);

module.exports = router;
