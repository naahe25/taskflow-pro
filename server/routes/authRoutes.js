const express = require("express");
const passport = require("passport");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  verifyGoogleAdminEmail,
  setAdminSecretKey,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-admin-email", verifyGoogleAdminEmail);
router.post("/set-secret-key", protect, setAdminSecretKey);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/`);
    const token = generateToken({ id: user._id });

    const redirectUrl = new URL(`${process.env.CLIENT_URL}/dashboard`);
    redirectUrl.searchParams.append("token", token);
    redirectUrl.searchParams.append("isLinked", user.isLinked ? "true" : "false");

    return res.redirect(redirectUrl.toString());
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
      isLinked: req.user.isLinked || false,
      secretKeySet: req.user.secretKeySet || false,
    },
  });
});

module.exports = router;
