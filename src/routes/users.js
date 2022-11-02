const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get } = require('../controllers/users');

// MIDDLEWARES
const emailIsUnique = require('../middlewares/emalIsUnique');
const emailIsValid = require('../middlewares/emailIsValid');
const firstNameIsValid = require('../middlewares/firstNameIsValid');
const lastNameIsValid = require('../middlewares/lastNameIsValid');
const passwordIdValid = require('../middlewares/passwordIsValid');

router.get('/', get);
router.post('/', [firstNameIsValid, lastNameIsValid, passwordIdValid, emailIsValid, emailIsUnique], create);

module.exports = router;
