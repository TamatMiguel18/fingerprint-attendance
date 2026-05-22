const express = require("express");
const router = express.Router();

const {
    registerFingerprint,
    scanFingerprint
} = require("../controllers/fingerprintController");

router.post("/register", registerFingerprint);
router.post("/scan", scanFingerprint);

module.exports = router;