const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+#?/),
  }),
}), updateUserAvatar);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserById);

module.exports = userRouter;
