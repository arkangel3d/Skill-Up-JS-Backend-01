const express = require('express');

const router = express.Router();

// CONTROLLERS

const { create, get, getById, getByEmail, remove } = require('../controllers/users');

// MIDDLEWARES
const emailIsUnique = require('../middlewares/emalIsUnique');
const emailIsValid = require('../middlewares/emailIsValid');
const firstNameIsValid = require('../middlewares/firstNameIsValid');
const lastNameIsValid = require('../middlewares/lastNameIsValid');
const checkUserId = require('../middlewares/checkUserId');
const checkUserEmail = require('../middlewares/checkUserEmail');
const passwordIdValid = require('../middlewares/passwordIsValid');
const tokenIsValid = require('../middlewares/tokenIsValid');
const isAdmin = require('../middlewares/isAdmin');

// Example: http://localhost:3000/users - Need a valid token!
router.get('/', [tokenIsValid], get);

// Example: http://localhost:3000/users/1 - Need a valid token!
router.get('/:id', [tokenIsValid, checkUserId], getById);

// Example: http://localhost:3000/users/email/ext@usr.com - Need a valid token!
router.get('/email/:email', [tokenIsValid, checkUserEmail], getByEmail);

router.post('/', [firstNameIsValid, lastNameIsValid, passwordIdValid, emailIsValid, emailIsUnique], create);

// TODO: Put Route

// Example: http://localhost:3000/users/1 - Need a valid token! - Need a extUser or admin token!
router.delete('/:id', [tokenIsValid, isAdmin, checkUserId], remove);

module.exports = router;
