const Joi = require('joi');

const achievementSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().allow('', null),
  date: Joi.date().optional(),
  company: Joi.string().max(100).allow('', null).optional(),
  category: Joi.string().valid('career', 'academic', 'project', 'award', 'other').optional()
});

module.exports = { achievementSchema };
