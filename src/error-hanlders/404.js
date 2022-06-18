'use strict';

module.exports = (req, res, next) => {
  res.status(404).json({
    Message: 'Page not found',
    Route: req.path,
    Code: '404',
  });
};
