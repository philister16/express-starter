const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

const localLogin = new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);

    if (!user) {
      return done(null, false, 'Invalid credentials a');
    }

    if (!user.validPassword(password)) {
      return done(null, false, 'Invalid credentials b');
    }

    return done(null, user);
  });
});

passport.use(localLogin);