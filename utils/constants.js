const limeterConf = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const mongoDB = 'mongodb://localhost:27017/moviesdb';

module.exports = { limeterConf, mongoDB };
