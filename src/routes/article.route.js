'use strict';
const express = require('express');
const articleRouter = express.Router();
const bearer = require('../middleware/bearer.auth');
const acl = require('../middleware/acl.ath');
const { Article } = require('../models/index.model');
//Routes
articleRouter.get('/article', bearer, acl('read'), getArticle);
articleRouter.post('/article', bearer, acl('create'), addArticle);
articleRouter.get('/article/:id', bearer, acl('read'), getOneArticle);
articleRouter.put('/article/:id', bearer, acl('update'), updateArticle);
articleRouter.delete('/article/:id', bearer, acl('delete'), deleteArticle);

// functions
async function getArticle(req, res) {
  let record = await Article.read();
  if (record) {
    res.status(200).json(record);
  } else {
    res.status(404).json({ Error: 'Element not found' });
  }
}
async function getOneArticle(req, res) {
  let articleId = parseInt(req.params.id);
  let record = await Article.read(articleId);
  if (record) {
    res.status(200).json(record);
  } else {
    res.status(404).json({ Error: 'Element not found' });
  }
}
async function addArticle(req, res) {
  let record = await Article.create(req.body);
  res.status(201).json(record);
}
async function updateArticle(req, res) {
  let articleId = parseInt(req.params.id);
  let foundArticle = await Article.read(articleId);
  if (foundArticle) {
    let record = await foundArticle.update(req.body);
    res.status(201).json(record);
  } else {
    res.status(404).json({
      Message: 'Article not found',
    });
  }
}
async function deleteArticle(req, res) {
  let articleId = parseInt(req.params.id);
  let foundArticle = await Article.read(articleId);
  if (foundArticle) {
    let deletedArticle = await Article.delete(articleId);
    res.status(204).json(deletedArticle);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
}
module.exports = articleRouter;
