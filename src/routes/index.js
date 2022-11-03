const express = require('express')
const usersRouter = require('./users')
const roleRouter = require('./role')
const authRouter = require('./auth');
const categoriesRouter = require('./categories');
const transactionRouter = require('./transaction');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello world'));

// example of a route with index controller get function
router.use('/users', usersRouter)
router.use('/role', roleRouter)
router.use('/auth', authRouter);
router.use('/categories', categoriesRouter);
router.use('/transaction', transactionRouter);

module.exports = router;
