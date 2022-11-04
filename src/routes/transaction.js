const express = require('express');

const router = express.Router();

// CONTROLLERS
const { get, getById, me, create, update } = require('../controllers/transaction');

// MIDDLEWARES
const isAdmin = require('../middlewares/isAdmin');
const tokenIsValid = require('../middlewares/tokenIsValid');
const transactionsFields = require('../middlewares/transactionFields');
const userHasAccessToUpdateTransaction = require('../middlewares/userHasAccessToUpdateTransaction');
const userHasAccessToViewTransaction = require('../middlewares/userHasAccessToViewTransaction');

// ROUTES

// Example: http://localhost:3000/transactions - Need a valid token! - ONLY ADMIN USERS
router.get('/', [tokenIsValid, isAdmin], get);

// Example: http://localhost:3000/transactions/id/1 - Need a valid token! ONLY ADMINs OR TRANSACTION OWNER
router.get('/id/:id', [tokenIsValid, userHasAccessToViewTransaction], getById);

// Example: http://localhost:3000/transactions/me - Need a valid token!
router.get('/me', [tokenIsValid], me);

router.post('/', [tokenIsValid, transactionsFields], create);

router.patch('/:id', [tokenIsValid, userHasAccessToUpdateTransaction], update);

module.exports = router;
