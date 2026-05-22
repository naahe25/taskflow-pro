const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const Stats = require("../services/statsService");

router.get("/", protect, async (req, res) => {
  try {
    const data = await Stats.getTeamProgress();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
