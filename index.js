'use strict';
require('dotenv').config();
const server = require('./src/server');
const { sequelize } = require('./src/models/index.model');
const PORT = process.env.PORT || 3010;
sequelize.sync().then(() => {
  server.start(PORT);
});
