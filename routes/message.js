const express = require("express");

const router = express.Router();

const messageController = require("../controllers/message");

router.get("/accounts", messageController.getAccounts);

router.get("/:senderId", messageController.getMessages);

module.exports = router;
