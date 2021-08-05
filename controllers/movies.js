const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image, trailer,
    thumbnail, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch(next);
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
