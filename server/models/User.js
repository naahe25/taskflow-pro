const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["Admin", "member"],
      default: "member",
    },
    workspaceAdminEmail: {
      type: String,
      required: true,
      index: true,
    },
    isLinked: {
      type: Boolean,
      default: false,
      index: true,
    },
    adminSecretKey: {
      type: String,
      select: false,
    },
    secretKeySet: {
      type: Boolean,
      default: false,
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
