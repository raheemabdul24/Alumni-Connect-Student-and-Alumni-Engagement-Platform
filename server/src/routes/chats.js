const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { sendMessageSchema, conversationMessageSchema } = require('../validators/chatValidator');
const { listConversations, sendMessage, getMessages, sendMessageToConversation, startConversation } = require('../controllers/chatController');

router.get('/conversations', requireAuth, listConversations);
router.post('/conversations/start', requireAuth, startConversation);
router.post('/', requireAuth, validate(sendMessageSchema), sendMessage);
router.get('/:conversationId/messages', requireAuth, getMessages);
router.post('/:conversationId/messages', requireAuth, validate(conversationMessageSchema), sendMessageToConversation);
router.get('/:conversationId', requireAuth, getMessages);

module.exports = router;
