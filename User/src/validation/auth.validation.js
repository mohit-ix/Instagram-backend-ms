const Joi = require("joi");
const { password } = require("./custom.validation");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().custom(password),
  fullname: Joi.string().min(2).max(20).required(),
  username: Joi.string().min(2).max(20).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(2).max(20).required(),
  password: Joi.string().required().custom(password),
});

module.exports = {
  signupSchema,
  loginSchema,
};
