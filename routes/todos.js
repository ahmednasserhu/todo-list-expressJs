const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { TodosController } = require('../controllers');
const asyncWrapper = require('../util/asyncWrapper');
const CustomError = require('../util/customError');
const User = require('../models/users');
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

router.use(async (req, res, next) => {
  const token = req.get('authorization');

  try {
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verifiedUser) {
      throw new CustomError('Unauthorized User', 401);
    }
    const user = await User.findById(verifiedUser.id).exec();
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(new CustomError('Invalid token or unauthorized', 401));
  }
});

router.get('/', async (req, res, next) => {
  const [err, todos] = await asyncWrapper(TodosController.find(req.query, req.user));
  if (!err) {
    return res.json(todos);
  }
  return next(err);
});

router.post('/', async (req, res, next) => {
  req.body.userId = req.user;
  const [err, todo] = await asyncWrapper(TodosController.create(req.body));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

router.patch('/:id', async (req, res, next) => {
  // eslint-disable-next-line max-len
  const [err, todo] = await asyncWrapper(TodosController.updateTodo(req.params.id, req.body, req.user));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

router.delete('/:id', async (req, res, next) => {
  const [err, todo] = await asyncWrapper(TodosController.deleteTodo(req.params.id));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});

module.exports = router;
