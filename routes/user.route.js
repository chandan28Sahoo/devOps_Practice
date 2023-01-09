const express = require("express");
const router = express.Router();

const controller = require('../controller/user');

router.get('/get/user', controller.getUser)

module.exports = router;