'use strict';

module.exports = (req, res, next) => {
  console.log(`Route : ${req.path}  Method : ${req.method}`);
  next();
};
