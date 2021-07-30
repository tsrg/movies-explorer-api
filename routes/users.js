const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUserInfo, updateUser } = require('../controllers/users');

users.get('/me', getUserInfo);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = { users };
