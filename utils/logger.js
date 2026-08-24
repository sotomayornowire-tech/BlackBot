const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'console.log');

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function write(level, msg) {
  const line = `[${timestamp()}] [${level}] ${msg}\n`;
  process.stdout.write(line);
  fs.appendFileSync(logFile, line);
}

module.exports = {
  info: (msg) => write('INFO', msg),
  warn: (msg) => write('WARN', msg),
  error: (msg) => write('ERROR', msg),
  debug: (msg) => write('DEBUG', msg)
};
