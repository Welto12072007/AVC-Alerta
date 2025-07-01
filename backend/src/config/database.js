const path = require('path');
require('dotenv').config();

const config = {
  development: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '..', 'database', 'avc_alerta.db')
    },
    migrations: {
      directory: path.resolve(__dirname, '..', 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, '..', 'database', 'seeds')
    },
    useNullAsDefault: true
  },
  
  production: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: {
      filename: process.env.DB_FILENAME || path.resolve(__dirname, '..', 'database', 'avc_alerta.db')
    },
    migrations: {
      directory: path.resolve(__dirname, '..', 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, '..', 'database', 'seeds')
    },
    useNullAsDefault: true
  }
};

module.exports = config;