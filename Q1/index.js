const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/mongo');
const urlRoutes = require('./route/urlRoutes');
const { loggerMiddleware, log } = require('./handler/logger');

const app = express();
const PORT = 3000;

const startServer = async () => {
  try {
    await connectDB();
    log('info', 'db', 'MongoDB connected');

    app.use(bodyParser.json());
    app.use(loggerMiddleware);
    app.use('/', urlRoutes);

    app.listen(PORT, () => {
      log('info', 'route', `Server is running on port ${PORT}`);
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    await log('fatal', 'db', 'Critical database connection failure.');
    console.error(error);
  }
};

startServer();
