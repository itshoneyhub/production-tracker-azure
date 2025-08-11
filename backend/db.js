const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER.split(',')[0],
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: true, // Use this if you're on Azure
    trustServerCertificate: true // Change to true for local dev / self-signed certs
  }
};

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

pool.on('error', err => {
  console.error('SQL Pool Error', err);
});

async function connectDB() {
  try {
    await poolConnect;
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database Connection Failed!', err);
    process.exit(1);
  }
}

module.exports = {
  pool,
  connectDB,
  query: (text, params) => {
    // mssql uses a different query format, so we need to adapt
    // This is a simplified version and might need adjustments based on how params are used
    const request = pool.request();
    if (params) {
      // This is a naive implementation. A more robust solution would be needed for named parameters.
      // For now, assuming params are passed in order for a prepared statement.
      // This part needs to be implemented based on the application's needs.
    }
    return request.query(text);
  }
};