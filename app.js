const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());


mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
    useNewUrlParser: true,
}).then(()=> {
      console.log('connected to db');
});

app.use((req, res, next) => {
  req.user = {
    _id: '648dd5f5bb2590954dd556f3'
  };

  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT,);
});