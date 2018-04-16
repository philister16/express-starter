const User = require('../models/User');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.setEmailConfirmationToken();
  user.save((err, user) => {
    if (err) return next(err);
    res.json(user.getInfo());
  });
}