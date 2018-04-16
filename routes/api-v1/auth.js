const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const authController = require('../../controllers/auth.controller');

router.post('/signup', authController.signup);

module.exports = router;