const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", userController.getUsers);
router.post("/", roleMiddleware(['superadmin', 'admin']), userController.createUser);
router.put("/:id/approve", roleMiddleware(['superadmin']), userController.approveAdmin);
router.delete("/:id", roleMiddleware(['superadmin', 'admin']), userController.deleteUser);

module.exports = router;