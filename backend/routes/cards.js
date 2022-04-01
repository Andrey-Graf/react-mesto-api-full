const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validators');

cardRouter.get('/', getCards);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.delete('/:cardId', validateCardId, deleteCard);
cardRouter.put('/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRouter;