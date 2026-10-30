// cPanel Phusion Passenger entrypoint
// This boots the AppTeknow production-ready express server compiled assets
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(__dirname, 'backend', 'dist', 'server.js'))) {
  require('./backend/dist/server.js');
} else if (fs.existsSync(path.join(__dirname, 'dist', 'server.js'))) {
  require('./dist/server.js');
} else if (fs.existsSync(path.join(__dirname, 'server.js'))) {
  require('./server.js');
}
