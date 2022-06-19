'use strict';

const Article = (sequelize, Datatypes) => {
  return sequelize.define('articles', {
    name: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    catigory: {
      type: Datatypes.STRING,
      allowNull: false,
    },
  });
};
module.exports = Article;
