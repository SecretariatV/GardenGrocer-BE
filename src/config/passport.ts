import User from "models/User";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

interface IProfile extends Profile {
  confirmToken?: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile: IProfile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;

          if (!email) {
            return done(
              new Error("No email associated with this Google account"),
              undefined
            );
          }

          const confirmationToken = crypto.randomBytes(32).toString("hex");

          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: email,
            confirmationToken,
          });

          profile.confirmToken = confirmationToken;
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new LocalStrategy({}, async (email, password, done) => {
    console.log("check passport", email, password);
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
