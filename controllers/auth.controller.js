const User = require('../models/User');
const emailService = require('../services/email.service');
const passport = require('passport');
const crypto = require('crypto');
const error = require('../services/error.service');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.setEmailConfirmationToken();
  user.save((err, user) => {
    if (err) return next(err);
    emailService.send('signup', user.language, {
      user: user,
      link: process.env.APP_URL + '/auth/confirm/' + user.emailConfirmationToken
    });
    res.status(201).json(user.getInfo());
  });
}

exports.confirm = (req, res, next) => {
  User.findOneAndUpdate({ emailConfirmationToken: req.body.token }, { emailConfirmationToken: '', emailConfirmed: true}, (err, user) => {
    if (err) return next(err);
    if (!user) return next(error.throw(404));
    emailService.send('confirmed', user.language, { user: user });
    res.status(204).end();
  });
}

exports.signin = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(error.throw(401));
    res.status(200).json(user.getInfo());
  })(req, res, next);
}

exports.forgot = (req, res, next) => {
  const token = crypto.randomBytes(36).toString('hex');
  const expiry = Date.now() + 600000;
  User.findOneAndUpdate({ email: req.body.email }, { resetToken: token, resetTokenExp: expiry}, { new: true}, (err, user) => {
    if (err) return next(err);
    if (!user) return next(error.throw(404));
    emailService.send('forgot', user.language, {
      user: user,
      link: process.env.APP_URL + '/auth/reset/' + token
    });
    res.status(204).end();
  });
}

exports.reset = (req, res, next) => {
  User.findOne({ resetToken: req.body.token, resetTokenExp: { $gt: Date.now() }}, (err, user) => {
    if (err) return next(err);
    if (!user) return next(error.throw(404));

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    user.save((err, updatedUser) => {
      if (err) return next(err);
      if (!updatedUser) return next(error.throw(404));
      emailService.send('reset', updatedUser.language, { user: updatedUser });
      res.status(204).end();
    });
  });
}