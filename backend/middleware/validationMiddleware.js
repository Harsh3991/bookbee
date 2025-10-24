const { registerSchema, loginSchema, storySchema, chapterSchema } = require('../utils/validationSchemas');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateStory: validate(storySchema),
  validateChapter: validate(chapterSchema),
};
