const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get, getById, getOne } = require('../controllers/users');

// MIDDLEWARES
const emailIsValid = require('../middlewares/emailIsValid');
const emailIsUnique = require('../middlewares/emalIsUnique');
const firstNameIsValid = require('../middlewares/firstNameIsValid');
const lastNameIsValid = require('../middlewares/lastNameIsValid');
const checkUserId = require('../middlewares/checkUserId');
const checkUserEmail = require('../middlewares/checkUserEmail');

// ROUTES
router.get('/', get);
router.get('/getById/:id', checkUserId, getById);
router.get('/getByEmail/', checkUserEmail, getOne);
router.post('/', [firstNameIsValid, lastNameIsValid, emailIsValid, emailIsUnique], create);

module.exports = router;
