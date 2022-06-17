'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    try {
      // user can do action
      if (req.user.actions.includes(capability)) {
        next();
      } else {
        next('Access Denied');
      }
    } catch (e) {
      next('invalid login');
    }
  };
};
