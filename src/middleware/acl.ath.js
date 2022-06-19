'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    try {
      // user can do action
      if (req.user.actions.includes(capability)) {
        next();
      } else {
        res.status(404).send('Access denied').end();
      }
    } catch (e) {
      next('invalid login');
    }
  };
};
