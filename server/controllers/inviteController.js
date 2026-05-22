const User = require("../models/User");

const createInvite = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists in the system." });
    }

    user = await User.create({
      email,
      name: email.split("@")[0],
      role: "member"
    });

    res.status(201).json({
      message: "Team member added successfully",
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
