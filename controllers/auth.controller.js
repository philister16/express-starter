const User = require('../models/User');
const emailService = require('../services/email.service');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.setEmailConfirmationToken();
  user.save((err, user) => {
    if (err) return next(err);
    emailService.send('signup', user.language, {
      user: user,
      link: user.emailConfirmationToken
    });
    res.json(user.getInfo());
  });
}