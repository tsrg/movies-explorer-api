const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createNewUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { users } = require('./users');
const { movies } = require('./movies');
const notFound = require('./notFound');

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createNewUser);

routes.use(auth);

routes.post('/signout', logout);

routes.use('/users', users);
routes.use('/movies', movies);
routes.use('*', notFound);

module.exports = routes;
