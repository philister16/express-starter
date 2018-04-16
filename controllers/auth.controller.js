const User = require('../models/User');
const emailService = require('../services/email.service');
const passport = require('passport');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.setEmailConfirmationToken();
  user.save((err, user) => {
    if (err) return next(err);
    emailService.send('signup', user.language, {
      user: user,
      link: user.emailConfirmationToken
    });
    res.status(201).json({
      status: 'ok',
      message: 'User created',
      data: user.getInfo()
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