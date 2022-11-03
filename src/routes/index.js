const express = require('express')
const usersRouter = require('./users')
const roleRouter = require('./role')
const authRouter = require('./auth');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello world'));

// example of a route with index controller get function
router.use('/users', usersRouter)
router.use('/role', roleRouter)
router.use('/auth', authRouter);

module.exports = router;
