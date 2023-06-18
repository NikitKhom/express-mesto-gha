const Card = require('../models/card');
const {
  ServerError,
  BadRequest,
  Created,
  NotFoundError,
} = require('../utils/constants');

const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(ServerError).send({ message: 'Произошла ошибка' }));

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(Created).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка' });
  });

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка' });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка' });
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
