const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUserInfo, updateUser } = require('../controllers/users');

users.get('/me', getUserInfo);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = { users };
