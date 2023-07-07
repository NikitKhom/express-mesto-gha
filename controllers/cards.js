const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden');
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
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else if (card.owner._id.valueOf() !== req.user._id) {
        throw new Forbidden('Недостаточно прав');
      }
      Card.findByIdAndRemove(card._id)
        .then((deletedCard) => res.send({ data: deletedCard }))
        .catch(next);
    })
    .catch(next);
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
    res.send({ data: card });
  })
  .catch(next);

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
    res.send({ data: card });
  })
  .catch(next);

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
