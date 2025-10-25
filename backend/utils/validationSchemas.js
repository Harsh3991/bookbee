const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Story validation schemas
const storySchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  genres: Joi.array().items(Joi.string()).min(1).required(),
  tags: Joi.array().items(Joi.string()),
  status: Joi.string().valid('ongoing', 'completed', 'hiatus').optional(),
});

// Chapter validation schemas
const chapterSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  content: Joi.string().min(20).required(),
  chapterNumber: Joi.number().integer().min(1).optional(),  // Changed to optional
  status: Joi.string().valid('draft', 'published').optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  storySchema,
  chapterSchema,
};
