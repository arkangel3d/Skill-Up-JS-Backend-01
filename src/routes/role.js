const express = require('express');

const router = express.Router();

// CONTROLLERS
const { get, create } = require("../controllers/role");

// MIDDLEWARES


// ROUTES
router.get('/', get);
router.post('/', create)

module.exports = router;