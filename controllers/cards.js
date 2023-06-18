const Card = require('../models/card');

const getCards = (req, res) => {
  return Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      return res.send({data: cards});
    })
    .catch((err) => {
      return res.status(500).send({message: 'Произошла ошибка'});
    });
};

const createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  return Card.create({name, link, owner})
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(201).send({data: card});
    })
    .catch((err) => {
      if (err.name == 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Произошла ошибка'});
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card )=> {
      if (!card) {
        return res.status(404).send({message: 'Карточка не найдена'});
      }
      return res.send({data: card})
    })
    .catch((err) => {
      return res.status(500).send({message: 'Произошла ошибка'});
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true})
    .populate(['owner', 'likes'])
    .then((card )=> {
      if (!card) {
        return res.status(404).send({message: 'Карточка не найдена'});
      }
      return res.send({data: card})
    })
    .catch((err) => {
      if (err.name == 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Произошла ошибка'});
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true})
    .populate(['owner', 'likes'])
    .then((card )=> {
      if (!card) {
        return res.status(404).send({message: 'Карточка не найдена'});
      }
      return res.send({data: card})
    })
    .catch((err) => {
      if (err.name == 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({message: 'Произошла ошибка'});
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}