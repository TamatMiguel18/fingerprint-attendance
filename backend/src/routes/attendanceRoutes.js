const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", attendanceController.getAllAttendance);
router.get("/activity/:activityId", attendanceController.getAttendanceByActivity);
router.post("/", roleMiddleware(['superadmin', 'admin']), attendanceController.createAttendance); // Manual attendance

module.exports = router;