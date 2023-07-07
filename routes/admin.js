const adminRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/not-found-error');

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

adminRouter.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = adminRouter;
