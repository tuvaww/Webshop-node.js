const express = require("express");
const router = express.Router();
const shopController = require("../controller/shop");

router.get("/", shopController.getHome);
router.get("/register", shopController.getRegister);
router.post("/register", shopController.postRegister);
router.get("/login", shopController.getLogin);

module.exports = router;
