const router = require('express').Router();
const { UsersController } = require('../controllers');
const asyncWrapper = require('../util/asyncWrapper');

router.post('/', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.create(req.body));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.post('/login', async (req, res, next) => {
  const { userName, password } = req.body;
  const [err, token] = await asyncWrapper(UsersController.login(userName, password));
  if (!token) {
    return next(err);
  }
  return res.json(token);
});

router.get('/:id', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.getTodo(req.params.id));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.get('/', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.getAllTodos());
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.delete('/:id', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.deleteUserbyId(req.params.id));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.patch('/:id', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.updateUser(req.params.id, req.body));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

router.get('/:id/todos', async (req, res, next) => {
  const [err, user] = await asyncWrapper(UsersController.getTodosForSpecificUser(req.params.id));
  if (!err) {
    return res.json(user);
  }
  return next(err);
});

module.exports = router;
