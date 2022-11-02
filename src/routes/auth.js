const express = require('express');

const router = express.Router();

// CONTROLLERS
const { login } = require('../controllers/auth');

// MIDDLEWARES
const loginFileds = require('../middlewares/loginFields');

router.post('/login', [loginFileds], login);

module.exports = router;
