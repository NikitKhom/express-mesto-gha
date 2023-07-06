const BadRequest = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-error');
const { CREATED } = require('../utils/constants');
const Card = require('../models/card');

const getCards = (req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.send({ data: cards }))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  if (req.params.id !== req.user._id) {
    throw new BadRequest('Недостаточно прав');
  }
  Card.findByIdAndRemove(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    }
    next(err);
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    }
    next(err);
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
