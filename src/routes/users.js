const express = require('express')
const {
   get,
} = require('../controllers/users')

const router = express.Router()

router.get('/', get)


module.exports = router