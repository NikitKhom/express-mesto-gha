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
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = adminRouter;
