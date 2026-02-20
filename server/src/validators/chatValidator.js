const Joi = require('joi');

const sendMessageSchema = Joi.object({
  to: Joi.string().uuid().required(),
  content: Joi.string().max(2000).required()
});

const conversationMessageSchema = Joi.object({
  content: Joi.string().max(2000).required()
});

module.exports = { sendMessageSchema, conversationMessageSchema };
