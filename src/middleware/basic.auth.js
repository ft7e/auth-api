'use strict';
// This one takes username and pass from the head
const User = require('../models/user.model');
const base64 = require('base-64');
module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    // basic doawjoda@#%$kopda
    let encodedValue = req.headers.authorization.split(' ')[1];
    let decodedValue = base64.decode(encodedValue);
    // username:passowrd
    let [username, password] = decodedValue.split(':');
    User.basicAuthentication(username, password)
      .then((validUser) => {
        req.user = validUser;
        next();
      })
      .catch((e) => {
        res.status(503).send('wrong username/password');
      });
  }
};
