const express = require('express');

const router = express.Router();

// CONTROLLERS
const { create, get, getById, getOne } = require('../controllers/users');

// MIDDLEWARES
const emailIsValid = require('../middlewares/emailIsValid');
const emailIsUnique = require('../middlewares/emalIsUnique');
const firstNameIsValid = require('../middlewares/firstNameIsValid');
const lastNameIsValid = require('../middlewares/lastNameIsValid');

router.get('/', get);
router.get('/getById/:id', getById);
router.get('/getByEmail/', getOne);
router.post('/', [firstNameIsValid, lastNameIsValid, emailIsValid, emailIsUnique], create);

module.exports = router;
