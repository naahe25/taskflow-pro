const express = require("express");
const passport = require("passport");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/`);
    const token = generateToken({ id: user._id });
    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard?token=${encodeURIComponent(token)}`,
    );
  })(req, res, next);
});

router.get("/login/success", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
    },
  });
});

module.exports = router;
