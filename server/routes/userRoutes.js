const express = require("express");

const router = express.Router();

const {
  getUsers,
  promoteAdmin,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

router.get("/", protect, getUsers);

router.put("/admin/:id", protect, adminOnly, promoteAdmin);

module.exports = router;
