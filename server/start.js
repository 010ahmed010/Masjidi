const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_PATH = '/tmp/mongodb-data';
if (!fs.existsSync(DB_PATH)) fs.mkdirSync(DB_PATH, { recursive: true });

let mongoStarted = false;

function startMongo() {
  return new Promise((resolve) => {
    const mongo = spawn('mongod', [
      '--dbpath', DB_PATH,
      '--logpath', '/tmp/mongodb.log',
      '--bind_ip', '127.0.0.1'
    ], {
      stdio: 'ignore',
      detached: false
    });

    mongo.on('error', (err) => {
      console.log('Could not start MongoDB:', err.message);
      resolve();
    });

    mongo.on('exit', (code) => {
      console.log('MongoDB process exited with code', code);
    });

    setTimeout(() => {
      mongoStarted = true;
      resolve();
    }, 4000);
  });
}

async function main() {
  console.log('Starting MongoDB...');
  await startMongo();
  console.log('MongoDB started, launching API server...');

  require('./index.js');
}

main().catch(console.error);
