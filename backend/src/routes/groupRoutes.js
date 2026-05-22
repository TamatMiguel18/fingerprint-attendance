const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", groupController.getGroups);
router.post("/", roleMiddleware(['superadmin', 'admin']), groupController.createGroup);
router.delete("/:id", roleMiddleware(['superadmin', 'admin']), groupController.deleteGroup);

module.exports = router;