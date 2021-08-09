const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const catchErrors = require('./errors/catchErrors');

const { PORT = 3000, DB, NODE_ENV } = process.env;
const { limeterConf, mongoDB } = require('./utils/constants');

const app = express();

const limiter = rateLimit(limeterConf);

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DB : mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(catchErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
