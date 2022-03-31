const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
const {
  validateUserById,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validators');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', validateUserById, getUserById);
userRouter.patch('/me', validateUpdateUser, updateUser);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = userRouter;