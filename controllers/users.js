const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.send({data: users});
    })
    .catch((err) => {
      return res.status(500).send({message: 'Произошла ошибка'});
    });
};

const getUserById = (req, res) => {
  return User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: 'Пользователь не найден'});
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Произошла ошибка'});
    });
}

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => {
      res.status(201).send({data:user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Произошла ошибка'});
    });
}

const updateUserInfo = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {name, about},
    {new: true, runValidators: true})
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: 'Пользователь не найден'});
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Произошла ошибка'});
    });
}

const updateUserAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id,
     {avatar},
     {new: true, runValidators: true})
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: 'Пользователь не найден'});
      }
      return res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Произошла ошибка'});
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar
}