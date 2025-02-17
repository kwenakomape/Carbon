
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: process.env.DB_SSL_CA,
  },
};

const pool = mysql.createPool(dbConfig);
// Function to test the database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database!');
    // Release the connection back to the pool
    connection.release();
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

// Call the function to test the connection
testConnection();

export default pool;