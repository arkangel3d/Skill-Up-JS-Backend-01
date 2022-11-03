const express = require('express');

const router = express.Router();

// CONTROLLERS
const { get, create } = require("../controllers/transaction");

// MIDDLEWARES
const tokenIsValid = require("../middlewares/tokenIsValid");

// ROUTES
router.get('/:id', [tokenIsValid], get);
router.post('/', [tokenIsValid], create)

module.exports = router;