const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");
const { normalizeEmail } = require("../utils/workspace");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = normalizeEmail(profile.emails?.[0]?.value);

        let user = await User.findOne({ googleId: profile.id });

        if (!user && googleEmail) {
          user = await User.findOne({ email: googleEmail });
        }

        if (user) {
          let shouldSave = false;

          if (!user.googleId) {
            user.googleId = profile.id;
            shouldSave = true;
          }

          if (!user.name) {
            user.name = profile.displayName;
            shouldSave = true;
          }

          if (!user.avatar) {
            user.avatar = profile.photos?.[0]?.value;
            shouldSave = true;
          }

          if (shouldSave) {
            await user.save();
          }
        }

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: googleEmail,
            avatar: profile.photos?.[0]?.value,
            workspaceAdminEmail: googleEmail,
            isLinked: false,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
