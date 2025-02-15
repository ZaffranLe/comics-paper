const fs = require('fs');

/**
 * Check if the .env file is existed or not
 */
if (!fs.existsSync('.env')) {
  throw new Error('The .env file not found. Make sure you set it up first.');
}
