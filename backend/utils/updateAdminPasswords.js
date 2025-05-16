import bcrypt from 'bcrypt';
import pool from '..//config/db.js';

const saltRounds = 12;
const plainPassword = 'SSISA!';

async function updateAllAdminPasswords() {
  try {
    // Generate the new hash
    const newHash = await bcrypt.hash(plainPassword, saltRounds);
    console.log('New hash generated:', newHash);

    // Update all admin passwords
    const [result] = await pool.query(
      'UPDATE Admin SET password = ?',
      [newHash]
    );

    console.log(`Updated ${result.affectedRows} admin passwords`);
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    await pool.end(); // Close the connection pool
  }
}

updateAllAdminPasswords();