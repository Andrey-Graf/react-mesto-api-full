// eslint-disable-next-line linebreak-style
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validateSignIn, validateSingUp } = require('./middlewares/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHander = require('./middlewares/errorHander');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: [
    'https://domainname.andreylebedev.nomoredomains.xyz',
    'http://domainname.andreylebedev.nomoredomains.xyz',
    'http://localhost:3000',
  ],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSingUp, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запршиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHander);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);/* eslint-disable-line no-console */
});
