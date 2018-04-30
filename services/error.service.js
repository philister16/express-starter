/**
 * Error Service to create and handle errors
 */

 exports.errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  // console.error(err);
  res.json({
    status: err.status,
    message: err.statusText || err.message || 'An error ocurred',
    error: err
  });
 }

exports.throw = (code) => {
  const messages = {
    401: 'Invalid credentials',
    403: 'Forbidden',
    404: 'Not found',
    422: 'Validation error',
    500: 'Server error'
  }

  const err = new Error(messages[code]);
  err.status = code;
  err.statusText = messages[code];
  return err;
}

exports.custom = (code, message, body) => {
  const err = new Error(code);
  err.status = code;
  err.message = message;
  err.body = body;
  return err;
}