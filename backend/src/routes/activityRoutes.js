const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", activityController.getActivities);
router.post("/", roleMiddleware(['superadmin', 'admin']), activityController.createActivity);
router.delete("/:id", roleMiddleware(['superadmin', 'admin']), activityController.deleteActivity);

module.exports = router;