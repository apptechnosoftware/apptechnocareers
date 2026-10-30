// cPanel Phusion Passenger entrypoint
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

if (fs.existsSync(path.join(__dirname, 'backend', 'dist', 'server.js'))) {
  require('./backend/dist/server.js');
} else if (fs.existsSync(path.join(__dirname, 'dist', 'server.js'))) {
  require('./dist/server.js');
} else if (fs.existsSync(path.join(__dirname, 'server.js'))) {
  require('./server.js');
}
