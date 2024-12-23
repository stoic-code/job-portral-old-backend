const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const getUser = require("../controller/user");
//get single User
router.get("/api/user", auth, getUser);

module.exports = router;
