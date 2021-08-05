const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ConflictError = require('../errors/conflict-err');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailer: req.body.trailer,
    thumbnail: req.body.thumbnail,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    owner: req.user._id,
    movieId: req.body.movieId,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ConflictError('Этот фильм уже сохранён'));
      }
      return next(err);
    });
};

const removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (String(movie.owner) !== String(req.user._id)) {
        throw new ForbiddenError('Доступ запрещён');
      }
      movie.remove();
      res.send(movie);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  removeMovie,
};
