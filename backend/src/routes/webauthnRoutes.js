const express = require("express");
const router = express.Router();
const webauthnController = require("../controllers/webauthnController");

// Registration
router.get("/generate-registration-options/:userId", webauthnController.generateRegistration);
router.post("/verify-registration/:userId", webauthnController.verifyRegistration);

// Authentication (Attendance)
router.get("/generate-authentication-options/:userId", webauthnController.generateAuthentication);
router.post("/verify-authentication/:userId/:activityId", webauthnController.verifyAuthentication);

module.exports = router;
