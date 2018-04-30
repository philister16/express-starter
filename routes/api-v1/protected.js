const express = require('express');
const router = express.Router();
const access = require('../../controllers/access.controller');

router.use(access.protect, access.guard.check('user'));

router.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'ok',
    message: 'This is protected stuff.'
  });
});

router.get('/admin', access.guard.check('admin'), (req, res, next) => {
  res.status(200).json({
    status: 'ok',
    message: 'This is a protected admin route.'
  });
});

module.exports = router;