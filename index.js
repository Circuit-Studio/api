const db_connect = require('./utils/db');
const logger = require('./utils/logger');
const app = require('./app');
const PORT = process.env.PORT || 3000;

// Attempt to connect to database
db_connect.open().then(() => {
  // Start the app and listen on PORT
  app.listen(PORT, () => 
    logger.info(`Express server listening on port ${PORT} in mode ${app.settings.env}`)
  );
});