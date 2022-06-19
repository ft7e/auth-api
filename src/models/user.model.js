'use strict';

const { sequelize, DataTypes } = require('./index.model');
const SECRET = process.env.SECRET || 'HeyThereAye';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = sequelize.define('users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.VIRTUAL,
  },
  role: {
    type: DataTypes.ENUM('admin', 'writer', 'editor', 'user'),
    defaultValue: 'user',
  },
  actions: {
    type: DataTypes.VIRTUAL,
    get() {
      const acl = {
        user: ['read'],
        editor: ['read', 'create'],
        writer: ['read', 'create', 'update'],
        admin: ['read', 'create', 'update', 'delete'],
      };
      return acl[this.role];
    },
  },
});
// search for matching username and pass in DB and generating jwt token
User.basicAuthentication = async function (username, password) {
  let user = await User.findOne({ where: { username: username } });
  let valid = await bcrypt.compare(password, user.password);
  if (valid) {
    let newToken = jwt.sign({ username: user.username }, SECRET, {
      expiresIn: '1h',
    });
    user.token = newToken;
    return user;
  } else {
    throw new Error('Invalid Credintials, userModel');
  }
};

User.bearerAuthentication = async function (token) {
  const parsedToken = jwt.verify(token, SECRET);
  const user = await User.findOne({
    where: { username: parsedToken.username },
  });
  if (user.username) {
    return user;
  } else {
    throw new Error('You need a token, userModel');
  }
};

module.exports = User;
