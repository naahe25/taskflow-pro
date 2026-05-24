const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { normalizeEmail } = require("../utils/workspace");

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  workspaceAdminEmail: user.workspaceAdminEmail,
  isLinked: user.isLinked || false,
  secretKeySet: user.secretKeySet || false,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminEmail } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedAdminEmail = normalizeEmail(adminEmail);

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    let userRole = "member";
    let workspaceAdminEmail = normalizedEmail;
    let isLinked = false;

    if (role === "Admin") {
      userRole = "Admin";
      workspaceAdminEmail = normalizedEmail;
      isLinked = false;
    } else {
      if (normalizedAdminEmail) {
        const adminAccount = await User.findOne({
          email: normalizedAdminEmail,
          role: "Admin",
        });

        if (adminAccount) {
          workspaceAdminEmail = normalizedAdminEmail;
          isLinked = true;
        }
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
      workspaceAdminEmail,
      isLinked,
    });

    const token = generateToken({ id: user._id });

    return res.status(201).json({
      success: true,
      token,
      user: buildUserResponse(user),
      isLinked,
      needsSecretKeySetup: userRole === "Admin",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const setAdminSecretKey = async (req, res) => {
  try {
    const { secretKey } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!secretKey || secretKey.length < 6) {
      return res
        .status(400)
        .json({ message: "Secret key must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only admins can set secret keys" });
    }

    const hashedSecretKey = await bcrypt.hash(secretKey, 10);
    user.adminSecretKey = hashedSecretKey;
    user.secretKeySet = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Secret key set successfully",
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password +adminSecretKey"
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(401).json({
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role === "Admin") {
      if (!user.secretKeySet) {
        return res.status(403).json({
          message: "Secret key not set. Please set it first.",
          needsSecretKeySetup: true,
        });
      }

      if (!secretKey) {
        return res
          .status(400)
          .json({ message: "Secret key is required for admin login" });
      }

      const isSecretKeyMatch = await bcrypt.compare(secretKey, user.adminSecretKey);
      if (!isSecretKeyMatch) {
        return res.status(401).json({ message: "Invalid secret key" });
      }
    }

    const token = generateToken({ id: user._id });

    return res.status(200).json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const googleLoginSuccess = async (req, res) => {
  try {
    const user = req.user || req.authUser;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }
    const token = generateToken({ id: user._id });
    return res.status(200).json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyGoogleAdminEmail = async (req, res) => {
  try {
    const { adminEmail } = req.body;

    if (!adminEmail) {
      return res.status(400).json({
        message: "Admin email is required",
      });
    }

    const normalizedAdminEmail = normalizeEmail(adminEmail);
    const adminAccount = await User.findOne({
      email: normalizedAdminEmail,
      role: "Admin",
    });

    if (!adminAccount) {
      return res.status(400).json({
        valid: false,
        message: "Admin email not found or not authorized",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Admin email verified",
      adminEmail: normalizedAdminEmail,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLoginSuccess,
  verifyGoogleAdminEmail,
  setAdminSecretKey,
};
