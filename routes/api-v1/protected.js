const express = require('express');
const router = express.Router();
const access = require('../../controllers/access.controller');

router.use(access.protect, access.guard.check('user'), access.errors);

router.get('/stuff', (req, res, next) => {
  res.status(200).json({
    status: 'ok',
    message: 'This is protected stuff.'
  });
});

module.exports = router;