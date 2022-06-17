'use strict';
require('dotenv').config();
const express = require('expres');
const app = express();
const PORT = process.env.PORT || 3010;

function start(PORT) {
  app.listen(PORT);
}
