'use strict';
require('dotenv').config();
const articleDefine = require('./article.model');
const Collection = require('./lib/collection.model');
const POSTGRES_URI =
  process.env.NODE_ENV === 'test' ? 'sqlite:memory' : process.env.DATABASE_URL;

const { Sequelize, DataTypes } = require('sequelize');

let sequelizeOptions =
  process.env.NODE_ENV === 'production'
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

const sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);
const articleTable = articleDefine(sequelize, DataTypes);
const articleCollection = new Collection(articleTable);
module.exports = {
  sequelize,
  DataTypes,
  Article: articleCollection,
};
