const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const Stats = require("../services/statsService");

// Dashboard counters
router.get("/", protect, async (req, res) => {
  try {
    const stats = await Stats.getDashboardStats();
    return res.status(200).json(stats);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
