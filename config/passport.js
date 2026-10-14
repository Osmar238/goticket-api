const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

// GitHub OAuth -- Boluwatife Alewi
// GitHub checks the password and only tells us who the user is, so we never
// receive or store a password. We save the GitHub profile in the users
// collection so the user has a record in our database.

// Turn a GitHub profile into the fields our User schema needs.
// firstName, lastName and email are required, so fill them in even when
// the GitHub profile leaves them blank.
function buildUserFromProfile(profile) {
  const fullName = profile.displayName || profile.username;
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : profile.username;

  let email = profile.username + '@users.noreply.github.com';
  if (profile.emails && profile.emails.length > 0 && profile.emails[0].value) {
    email = profile.emails[0].value;
  }

  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    oauthProvider: 'github',
    oauthId: profile.id
  };
}

// Only set up GitHub login if the keys exist. The unit tests run without a
// .env, and without this check passport would crash the app on start.
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || process.env.CALLBACK_URL,
        scope: ['user:email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find them by their GitHub id, or create them the first time
          let user = await User.findOne({ oauthProvider: 'github', oauthId: profile.id });
          if (!user) {
            user = await User.create(buildUserFromProfile(profile));
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// Only the user's id goes into the session cookie
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// On each request, turn that id back into the full user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
module.exports.buildUserFromProfile = buildUserFromProfile;
