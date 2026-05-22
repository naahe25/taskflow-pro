const express = require("express");

const passport = require("passport");

const generateToken = require("../utils/generateToken");

const router = express.Router();

// Starts Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// Handles Google OAuth callback and issues JWT immediately.
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/`);

    const token = generateToken({ id: user._id, avatar: user.avatar });

    // Redirect back to dashboard with token in query.
    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard?token=${encodeURIComponent(token)}`,
    );
  })(req, res, next);
});

module.exports = router;
