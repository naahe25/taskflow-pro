const generateToken = require("../utils/generateToken");

const googleLoginSuccess = async (req, res) => {
  try {
    // Supports both session-based and non-session usage.
    // If req.user is present (passport session), use it.
    // Otherwise, allow passing a user through req.authUser (set by routes).
    const user = req.user || req.authUser;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  googleLoginSuccess,
};
