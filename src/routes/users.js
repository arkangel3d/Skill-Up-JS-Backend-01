const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get, getById, getOne } = require('../controllers/users');

// MIDDLEWARES
const emailIsUnique = require('../middlewares/emalIsUnique');
const emailIsValid = require('../middlewares/emailIsValid');
const firstNameIsValid = require('../middlewares/firstNameIsValid');
const lastNameIsValid = require('../middlewares/lastNameIsValid');
const checkUserId = require('../middlewares/checkUserId');
const checkUserEmail = require('../middlewares/checkUserEmail');
const passwordIdValid = require('../middlewares/passwordIsValid');

router.get('/', get);
router.get('/getById/:id', checkUserId, getById);
router.get('/getByEmail/', checkUserEmail, getOne);
router.post('/', [firstNameIsValid, lastNameIsValid, emailIsValid, emailIsUnique], create);

router.get('/', get);
router.post('/', [firstNameIsValid, lastNameIsValid, passwordIdValid, emailIsValid, emailIsUnique], create);


module.exports = router;
