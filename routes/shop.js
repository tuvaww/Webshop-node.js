const express = require("express");
const router = express.Router();
const shopController = require("../controller/shop");

router.get("/", shopController.getHome);
router.get("/register", shopController.getRegister);

module.exports = router;
