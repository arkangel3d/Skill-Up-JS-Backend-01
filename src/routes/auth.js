const express = require('express');

const router = express.Router();

// CONTROLLERS
const { login, me } = require('../controllers/auth');

// MIDDLEWARES
const loginFileds = require('../middlewares/loginFields');
const tokenIsValid = require('../middlewares/tokenIsValid');

router.get('/me', [tokenIsValid], me);

router.post('/login', [loginFileds], login);

module.exports = router;
