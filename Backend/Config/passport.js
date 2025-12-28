import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.model.js';

//* Helper function to check if credentials are valid (not placeholders)
const isValidCredential = (value) => {
  return value && 
         value.trim() !== '' && 
         !value.includes('your_') && 
         !value.includes('_here');
};

//* Google OAuth Strategy - Only initialize if credentials are provided
if (isValidCredential(process.env.GOOGLE_CLIENT_ID) && 
    isValidCredential(process.env.GOOGLE_CLIENT_SECRET)) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://*localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
      try {
        //* Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        //* Check if user exists with the same email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value;
            await user.save();
            return done(null, user);
          }
        }

        //* Create new user
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: email || `google_${profile.id}@placeholder.com`,
          avatar: profile.photos?.[0]?.value,
          password: Math.random().toString(36).slice(-8),
          role: 'user',
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error, null);
      }
    })
  );
  console.log('✓ Google OAuth initialized');
} else {
  console.log('○ Google OAuth disabled (credentials not configured)');
}

//* Facebook OAuth Strategy - Only initialize if credentials are provided
if (isValidCredential(process.env.FACEBOOK_APP_ID) && 
    isValidCredential(process.env.FACEBOOK_APP_SECRET)) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://*localhost:5000/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails', 'photos'],
      },
      async (accessToken, refreshToken, profile, done) => {
      try {
        //* Check if user already exists with this Facebook ID
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        //* Check if user exists with the same email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.facebookId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value;
            await user.save();
            return done(null, user);
          }
        }

        //* Create new user
        const newUser = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: email || `facebook_${profile.id}@placeholder.com`,
          avatar: profile.photos?.[0]?.value,
          password: Math.random().toString(36).slice(-8),
          role: 'user',
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Error in Facebook Strategy:', error);
        return done(error, null);
      }
    })
  );
  console.log(' Facebook OAuth initialized');
} else {
  console.log(' Facebook OAuth disabled (credentials not configured)');
}

//* GitHub OAuth Strategy - Only initialize if credentials are provided
if (isValidCredential(process.env.GITHUB_CLIENT_ID) && 
    isValidCredential(process.env.GITHUB_CLIENT_SECRET)) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://*localhost:5000/api/auth/github/callback',
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
      try {
        //* Check if user already exists with this GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        //* Check if user exists with the same email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.githubId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value;
            await user.save();
            return done(null, user);
          }
        }

        //* Create new user
        const newUser = await User.create({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email: email || `github_${profile.id}@placeholder.com`,
          avatar: profile.photos?.[0]?.value || profile._json.avatar_url,
          password: Math.random().toString(36).slice(-8),
          role: 'user',
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Error in GitHub Strategy:', error);
        return done(error, null);
      }
    })
  );
  console.log('✓ GitHub OAuth initialized');
} else {
  console.log('○ GitHub OAuth disabled (credentials not configured)');
}

//* Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//* Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
