'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const basic = require('../middleware/basic.auth');
const bearer = require('../middleware/bearer.auth');
const acl = require('../middleware/acl.ath');
// Routes
userRouter.get('/', (req, res) => {
  res.status(200).send('home Page');
});
userRouter.post('/signup', signup);
userRouter.post('/signin', basic, signin);
userRouter.get('/user', bearer, getUser);

// functions

async function signup(req, res) {
  try {
    let username = req.body.username;
    let password = await bcrypt.hash(req.body.password, 10);
    let role = req.body.role;
    const sentData = await User.create({
      username: username,
      password: password,
      role: role,
    });
    res.status(201).json(sentData);
  } catch (e) {
    console.log('signup Error, ', e);
  }
}

async function signin(req, res) {
  res.status(200).json(req.user);
}

async function getUser(req, res) {
  res.status(200).json({
    Message: "You are allowed to View this page cuz you're logged in",
  });
}

module.exports = userRouter;
