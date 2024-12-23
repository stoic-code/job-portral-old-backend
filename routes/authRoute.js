const express = require("express");
const signup = require("../controller/signup");
const login = require("../controller/login");
const router = express.Router();
const multer = require("multer");

const upload = require("../multer/multer");

router.post("/api/signup", upload.single("image"), signup);
router.post("/api/login", login);

module.exports = router;
