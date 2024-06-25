const fs = require('fs');

class Logger {
    static appendLog(message) {
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - ${message}\n`;
      fs.appendFile('log.txt', logMessage, err => {
        if (err) {
          console.error('Failed to append to log:', err);
        }
      });
    }
  }

  module.exports = Logger;