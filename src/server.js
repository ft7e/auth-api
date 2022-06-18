'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3010;
const User = require('./models/user.model');
const bcrypt = require('bcrypt');
const usersRoute = require('./routes/user.route');
const articlesRoute = require('./routes/article.route');
//middleware requirment
const logger = require('./middleware/logger');
// error handlers requirement
const notFoundError = require('./error-hanlders/404');
const internalError = require('./error-hanlders/500');

// Stuff used

app.use(express.json());
app.use(logger);
app.use(usersRoute);
app.use(articlesRoute);
app.use('*', notFoundError);
app.use(internalError);

//start Function

function start(PORT) {
  app.listen(PORT);
  console.log('Server is listening on port ', PORT);
}
module.exports = {
  app,
  start,
};
