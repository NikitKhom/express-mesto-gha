const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request');
const Conflict = require('../errors/conflict');
const { CREATED } = require('../utils/constants');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

const getInfoById = (req, res, id, next) => User.findById(id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  })
  .catch(next);

const getUserById = (req, res, next) => getInfoById(req, res, req.params.id, next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequest('Не указан email или пароль');
  }
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь уже существует'));
        return;
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'the-most-secret-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => getInfoById(req, res, req.user._id, next);

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getUserInfo,
};
