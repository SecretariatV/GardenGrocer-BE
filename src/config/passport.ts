import User from "models/User";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: "/auth/google/callback",
//     },
//     async (_accessToken, _refreshToken, profile: Profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           const email =
//             profile.emails && profile.emails.length > 0
//               ? profile.emails[0].value
//               : null;

//           if (!email) {
//             return done(
//               new Error("No email associated with this Google account"),
//               undefined
//             );
//           }

//           user = await User.create({
//             googleId: profile.id,
//             username: profile.displayName,
//             email: email,
//           });
//         }
//         done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

passport.use(
  new LocalStrategy({}, async (email, password, done) => {
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
