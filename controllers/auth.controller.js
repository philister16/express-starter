const User = require('../models/User');
const emailService = require('../services/email.service');
const passport = require('passport');
const crypto = require('crypto');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.setEmailConfirmationToken();
  user.save((err, user) => {
    if (err) return next(err);
    emailService.send('signup', user.language, {
      user: user,
      link: process.env.APP_URL + '/auth/confirm/' + user.emailConfirmationToken
    });
    res.status(201).json({
      status: 'ok',
      message: 'User created'
    });
  });
}

exports.confirm = (req, res, next) => {
  User.findOneAndUpdate({ emailConfirmationToken: req.body.token }, { emailConfirmationToken: null, emailConfirmed: true}, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ status: 'err', message: 'Not found' });
    emailService.send('confirmed', user.language, { user: user });
    res.status(200).json({
      status: 'ok',
      message: 'Email confirmed'
    });
  });
}

exports.signin = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ status: 'err', message: 'Invalid credentials' });
    res.status(200).json({
      status: 'ok',
      message: 'Signed in',
      data: user.getInfo()
    });
  })(req, res, next);
}

exports.forgot = (req, res, next) => {
  const token = crypto.randomBytes(36).toString('hex');
  const expiry = Date.now() + 600000;
  User.findOneAndUpdate({ email: req.body.email }, { resetToken: token, resetTokenExp: expiry}, { new: true}, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ status: 'err', message: 'Not found' });
    emailService.send('forgot', user.language, {
      user: user,
      link: process.env.APP_URL + '/auth/reset/' + token
    });
    res.status(200).json({
      status: 'ok',
      message: 'Reset email sent'
    });
  });
}

exports.reset = (req, res, next) => {
  User.findOne({ resetToken: req.body.token, resetTokenExp: { $gt: Date.now() }}, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ status: 'err', message: 'Invalid credentials' });

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    user.save((err, updatedUser) => {
      if (err) return next(err);
      if (!updatedUser) return res.status(404).json({ status: 'err', message: 'Invalid credentials' });
      emailService.send('reset', updatedUser.language, { user: updatedUser });
      res.status(200).json({
        status: 'ok',
        message: 'Password reset'
      });
    });
  });
}