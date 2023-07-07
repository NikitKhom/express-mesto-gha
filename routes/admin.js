const adminRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser, login,
} = require('../controllers/users');

adminRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),

  }),
}), login);

adminRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+#?/),
  }),
}), createUser);

module.exports = adminRouter;
