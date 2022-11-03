const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get } = require('../controllers/categories');

// MIDDLEWARES
const categoryNameExists = require('../middlewares/categoryNameExists')
// const emailIsValid = require('../middlewares/emailIsValid');
// const emailIsUnique = require('../middlewares/emalIsUnique');
// const firstNameIsValid = require('../middlewares/firstNameIsValid');
// const lastNameIsValid = require('../middlewares/lastNameIsValid');

router.get('/', get);
router.post('/', [categoryNameExists], create);

module.exports = router;