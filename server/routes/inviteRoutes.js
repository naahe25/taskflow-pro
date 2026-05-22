const express = require("express");

const router = express.Router();

const { createInvite } = require("../controllers/inviteController");

const { protect } = require("../middleware/authMiddleware");

router.post(
  "/",

  protect,

  createInvite,
);

module.exports = router;
