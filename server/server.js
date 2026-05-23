const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");

const morgan = require("morgan");

const passport = require("passport");

const cookieSession = require("cookie-session");

const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const projectRoutes = require("./routes/projectRoutes");

const taskRoutes = require("./routes/taskRoutes");

const statsRoutes = require("./routes/statsRoutes");

const teamProgressRoutes = require("./routes/teamProgressRoutes");

const userRoutes = require("./routes/userRoutes");

const inviteRoutes = require("./routes/inviteRoutes");

dotenv.config();

connectDB();

require("./config/passport");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
  "/uploads",

  express.static(path.join(__dirname, "uploads")),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,

    credentials: true,
  }),
);

app.use(morgan("dev"));

app.use(
  cookieSession({
    name: "session",

    keys: ["taskflowpro"],

    maxAge: 24 * 60 * 60 * 1000,
  }),
);

app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/stats", statsRoutes);

app.use("/api/team-progress", teamProgressRoutes);

app.use("/api/users", userRoutes);

app.use("/api/invites", inviteRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
