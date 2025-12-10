import { prisma } from "../db/prisma";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { ENV } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID!,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET!,
      callbackURL: ENV.GOOGLE_CALLBACK_URL!,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email?.endsWith("@gmail.com")) {
          return done(null, false, { message: "Gmail is required." });
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.name?.givenName || "",
              lastName: profile.name?.familyName || "",
              googleId: profile.id,
              roleId: 1, // SK official
              verified: false,
              createdAt: new Date(),
            },
          });
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

export default passport;
