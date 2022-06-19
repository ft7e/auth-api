'use strict';

module.exports = (error, req, res, next) => {
  res.status(500).json({
    Code: 500,
    Route: req.path,
    Message: `Internal server error, ${error.message}`,
  });
};
