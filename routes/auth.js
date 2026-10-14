const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/auth');

// GitHub sends the user back to whatever callback url is registered on the
// OAuth app. Read the path from that same url so the two always match.
function getCallbackPath() {
  const url = process.env.GITHUB_CALLBACK_URL || process.env.CALLBACK_URL;
  if (!url) return '/github/callback';
  return new URL(url).pathname;
}

// Stops passport from crashing with "Unknown strategy" if the keys are missing
function requireGitHubConfig(req, res, next) {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(500).json({ message: 'GitHub login is not configured on this server.' });
  }
  next();
}

router.get(
  '/login',
  /* #swagger.tags = ['Authentication'] */
  /* #swagger.summary = 'Log in with GitHub' */
  /* #swagger.description = 'Open this in a new browser tab, not with Try it out. It redirects to GitHub, then back here logged in.' */
  requireGitHubConfig,
  passport.authenticate('github')
);

router.get(
  getCallbackPath(),
  /* #swagger.ignore = true */
  requireGitHubConfig,
  passport.authenticate('github', { failureRedirect: '/login-failed' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

router.get('/login-failed', (req, res) => {
  /* #swagger.ignore = true */
  res.status(401).json({ message: 'GitHub login failed. Please try again.' });
});

router.get('/profile', isAuthenticated, (req, res) => {
  /* #swagger.tags = ['Authentication'] */
  /* #swagger.summary = 'Show the logged in user' */
  /* #swagger.description = 'Returns 401 when nobody is logged in.' */
  res.status(200).json({
    message: 'You are logged in.',
    user: req.user
  });
});

router.get('/logout', (req, res, next) => {
  /* #swagger.tags = ['Authentication'] */
  /* #swagger.summary = 'Log out' */
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'You are logged out.' });
    });
  });
});

module.exports = router;
