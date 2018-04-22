/**
 * Error Service to create errors
 */

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
  err.text = messages[code];
  return err;
}