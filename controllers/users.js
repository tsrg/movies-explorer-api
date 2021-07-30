const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const NeedAuthError = require('../errors/need-auth-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const createNewUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже есть в базе'));
      }
      return next(err);
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => { res.send(user); })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => { res.send(user); })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  let id;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NeedAuthError('Неправильные почта или пароль');
      }
      id = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new NeedAuthError('Неправильные почта или пароль');
      }
      const token = jwt.sign({ id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).status(200).send({ JWT: token });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  res.clearCookie('jwt').status(200).send({ messge: 'loggedOut' })
    .catch(next);
};

module.exports = {
  createNewUser,
  updateUser,
  login,
  logout,
  getUserInfo,
};
