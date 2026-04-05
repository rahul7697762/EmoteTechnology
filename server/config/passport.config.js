import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import crypto from 'crypto';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;
                const picture = profile.photos?.[0]?.value;
                const googleId = profile.id;

                if (!email) {
                    return done(null, false, { message: 'No email returned from Google' });
                }

                // 1. Try to find user by googleId
                let user = await User.findOne({ googleId });

                if (user) {
                    if (user.accountStatus === 'DEACTIVATED') {
                        // If account was deleted, remove old record and let a new one be created below
                        await User.findByIdAndDelete(user._id);
                    } else {
                        // Already linked and active — just update last login
                        user.lastLoginAt = new Date();
                        await user.save();
                        return done(null, user);
                    }
                }

                // 2. Try to find existing user by email (account linking)
                user = await User.findOne({ email });

                if (user) {
                    if (user.accountStatus === 'DEACTIVATED') {
                        // If account was deleted, remove old record and let a new one be created below
                        await User.findByIdAndDelete(user._id);
                    } else {
                        // Link Google to existing email account
                        user.googleId = googleId;
                        user.authProvider = 'google';
                        if (!user.profile?.avatar && picture) {
                            user.profile.avatar = picture;
                        }
                        user.isVerified = true;
                        user.lastLoginAt = new Date();
                        await user.save();
                        return done(null, user);
                    }
                }

                // 3. Brand new user — create account
                // Generate a random password (they won't use it since they log in via Google)
                const randomPassword = crypto.randomBytes(32).toString('hex');

                const newUser = await User.create({
                    name,
                    email,
                    password: randomPassword, // placeholder, not used for OAuth users
                    role: 'STUDENT',
                    googleId,
                    authProvider: 'google',
                    isVerified: true,
                    profile: {
                        avatar: picture || null,
                    },
                    lastLoginAt: new Date(),
                });

                return done(null, newUser);
            } catch (error) {
                console.error('Passport Google strategy error:', error);
                return done(error, null);
            }
        }
    )
);

export default passport;
