// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const CustomError = require('../util/customError');
const Todo = require('../models/todos');
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const create = async (input) => {
  const user = await User.create(input)
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return user;
};

const deleteUserbyId = async (id) => {
  const userFound = await User.deleteOne({ _id: id })
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return userFound;
};

const updateUser = async (id, body) => {
  const user = await User.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true })
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return user;
};

const getTodo = async (query) => {
  const user = await User.findOne({ _id: query })
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return user;
};

const getAllTodos = async () => {
  const users = await User.find().select({ _id: 0, firstName: 1 })
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return users;
};

const getTodosForSpecificUser = async (todoQuery) => {
  const users = await Todo.find({ userId: todoQuery })
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
  return users;
};

const login = async (username, password) => {
  const user = await User.findOne({ userName: username }).exec();
  if (!user) {
    return new CustomError('UnAuthorized User', 401);
  }
  const valid = await user.verifyPassword(password);
  if (!valid) {
    return new CustomError('UnAuthorized User', 401);
  }
  const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
  return token;
};

module.exports = {
  create,
  deleteUserbyId,
  updateUser,
  getTodo,
  getAllTodos,
  getTodosForSpecificUser,
  login,
};
