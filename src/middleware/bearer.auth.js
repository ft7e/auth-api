'use strict';
const User = require('../models/user.model');
// This one to extract the bearer token from headers and then check
module.exports = (token) => {
  (req, res, next) => {
    if (req.headers.authorization) {
      // Bearer awodj%!@##O$joefpjwop!@#ajdAWDOWAJ
      const bearerToken = req.headers.authorization.split(' ')[1];
      User.bearerAuthentication(bearerToken)
        .then((userData) => {
          req.user = userData;
          next();
        })
        .catch((e) => {
          next('Invalid token middleware');
        });
    }
  };
};
