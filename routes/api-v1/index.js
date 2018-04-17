const express = require('express');
const router = express.Router();

const auth = require('./auth');
const protected = require('./protected');

router.use('/auth', auth);
router.use('/protected', protected);

module.exports = router;