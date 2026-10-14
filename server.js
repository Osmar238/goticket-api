const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const connectDatabase = require('./data/database');

dotenv.config({ silent: true });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Render sits behind a proxy. Without this the secure login cookie never gets set.
app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'local-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Passport has to come after the session, because it keeps the user there
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
  } else if (err.code === 11000) {
    statusCode = 409;
  }

  const message = statusCode === 500 ? 'Internal server error' : err.message;
  return res.status(statusCode).json({ message });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'test') {
    await connectDatabase();
  }
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module && process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Failed to start server', err);
    process.exitCode = 1;
  });
}

module.exports = app;
