const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const promoteAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.user && req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        message: "You cannot change your own role",
      });
    }

    user.role = user.role === "Admin" ? "member" : "Admin";

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,

  promoteAdmin,
};
