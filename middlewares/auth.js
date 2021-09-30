const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const NeedAuthError = require('../errors/need-auth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new NeedAuthError('Необходима авторизация');
  }

  let payload;

  jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', (err, decoded) => {
    if (err) {
      throw new NeedAuthError('Ошибка авторизация');
    }

    payload = decoded;
  });

  req.user = { _id: payload.id };
  next();
  return req.user;
};
