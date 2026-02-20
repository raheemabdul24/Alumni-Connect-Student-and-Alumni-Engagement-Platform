const Joi = require('joi');

const sendConnectionSchema = Joi.object({
  receiverId: Joi.string().uuid().required()
});

const respondSchema = Joi.object({
  action: Joi.string().valid('accept','reject').required()
});

module.exports = { sendConnectionSchema, respondSchema };
