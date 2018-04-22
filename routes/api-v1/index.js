const express = require('express');
const router = express.Router();
const error = require('../../services/error.service');

const auth = require('./auth');
const protected = require('./protected');

router.use('/auth', auth);
router.use('/protected', protected);

// Test routes
router.get('/test', (req, res, next) => {
  res.status(200).json({
    username: 'philister16',
    email: 'phil@rhinerock.com'
    });
});

router.post('/error', (req, res, next) => {
  next(error.throw(500));
});

module.exports = router;