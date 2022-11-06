const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get, edit, remove } = require('../controllers/categories');

// MIDDLEWARES
const categoryNameExists = require('../middlewares/categoryNameExists')
const tokenIsValid = require('../middlewares/tokenIsValid');
const isAdmin = require('../middlewares/isAdmin');
const hasCategoryType = require('../middlewares/hasCategoryType');
const categoryTypeValid = require('../middlewares/categoryTypeValid');
const checkCategoryId = require('../middlewares/checkCategoryId');

router.get('/', [tokenIsValid], get);

router.post('/', [tokenIsValid, isAdmin, categoryNameExists, hasCategoryType, categoryTypeValid], create);

router.put('/:id', [tokenIsValid, isAdmin, checkCategoryId, categoryNameExists, hasCategoryType, categoryTypeValid], edit)

router.delete('/:id', [tokenIsValid, isAdmin, checkCategoryId], remove);

module.exports = router;