const express = require('express');

const router = express.Router();

// CONTROLLERS
const { get, create } = require("../controllers/role");

// MIDDLEWARES
const isAdmin = require("../middlewares/isAdmin");

// ROUTES
router.get('/', get);
router.post('/', isAdmin, create)

module.exports = router;