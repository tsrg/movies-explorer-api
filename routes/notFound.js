const notFound = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

notFound.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден.'));
});

module.exports = notFound;
