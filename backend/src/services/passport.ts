import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import { CreatorProfile } from '../models/CreatorProfile';

export const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_secret',
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // 1. Check if user exists by Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // 2. Check if user exists by email
                    const email = profile.emails?.[0]?.value;
                    if (email) {
                        user = await User.findOne({ email });
                        if (user) {
                            // Link Google ID to existing user
                            user.googleId = profile.id;
                            await user.save();
                            return done(null, user);
                        }
                    }

                    // 3. Create new user
                    user = new User({
                        googleId: profile.id,
                        email: email,
                        name: profile.displayName,
                        passwordHash: 'GOOGLE_AUTH_NO_PASSWORD', // Set a random hash or flag
                        emailVerified: true,
                        role: 'creator', // Default role for social login
                        isVerified: false
                    });

                    await user.save();

                    // Create Profile
                    const creatorProfile = new CreatorProfile({
                        userId: user._id,
                        displayName: user.name,
                        username: (email?.split('@')[0] || 'user') + Math.floor(Math.random() * 1000),
                        bio: `Hi, I'm ${user.name}!`,
                        categories: [],
                        platforms: [],
                        socialLinks: {}
                    });
                    await creatorProfile.save();

                    return done(null, user);
                } catch (error) {
                    return done(error as Error, undefined);
                }
            }
        )
    );
};
