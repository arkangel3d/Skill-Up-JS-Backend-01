const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get } = require('../controllers/categories');

// MIDDLEWARES
const categoryNameExists = require('../middlewares/categoryNameExists')
const tokenIsValid = require('../middlewares/tokenIsValid');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', [tokenIsValid], get);
router.post('/', [tokenIsValid, isAdmin, categoryNameExists,], create);

module.exports = router;