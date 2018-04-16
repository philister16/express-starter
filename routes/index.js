const express = require('express');
const router = express.Router();

const api = require('./api-v1');

router.use('/v1', api);

module.exports = router;