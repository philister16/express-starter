const expressJwt = require('express-jwt');
const guard = require('express-jwt-permissions');

// Helper to extract token from headers or query param
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
  req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  return req.headers.authorization.split(' ')[1];
} else if (req.query && req.query.token) {
  return req.query.token;
}

return null;
}

const errorHandler = (err, req, res, next) => {
  if (err) return next(err);
}

const access = {
  protect: expressJwt({
    secret: process.env.SECRET,
    getToken: extractToken
  }),
  guard: guard(),
  errors: errorHandler
}

module.exports = access;