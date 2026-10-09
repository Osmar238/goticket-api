const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require('./data/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
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
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server', err);
    process.exitCode = 1;
  });
}

module.exports = app;
