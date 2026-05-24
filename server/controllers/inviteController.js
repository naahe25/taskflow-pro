const Invite = require("../models/Invite");
const User = require("../models/User");
const { normalizeEmail } = require("../utils/workspace");

const createInvite = async (req, res) => {
  try {
    const { email } = req.body;
    const invitedBy = req.user?._id;

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists in the system." });
    }

    const existingInvite = await Invite.findOne({
      email: normalizedEmail,
      status: "pending",
    });

    if (existingInvite) {
      return res.status(400).json({ message: "An invite already exists for this email." });
    }

    await Invite.create({
      email: normalizedEmail,
      invitedBy,
      token: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: "pending",
    });

    res.status(201).json({
      message: "Invite created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createInvite,
};
