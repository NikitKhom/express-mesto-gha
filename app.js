const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const router = require('./routes/index');
const adminRouter = require('./routes/admin');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

app.use(adminRouter);
app.use(auth);
app.use(router);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
