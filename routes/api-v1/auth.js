const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const authController = require('../../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/confirm', authController.confirm);
router.post('/signin', authController.signin);
router.post('/forgot', authController.forgot);
router.post('/reset', authController.reset);

module.exports = router;