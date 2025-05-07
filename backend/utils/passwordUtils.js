import bcrypt from 'bcrypt';
import logger from './logger.js'; // Fixed import with extension

const SALT_ROUNDS = 12;
const DEFAULT_ADMIN_PASSWORD = 'SSISA!';

async function hashAdminPassword(password) {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    logger.error(`Admin password hashing failed: ${error.message}`);
    throw new Error('Failed to hash admin password');
  }
}

async function verifyAdminPassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error(`Admin password verification failed: ${error.message}`);
    throw new Error('Failed to verify admin password');
  }
}

function getDefaultAdminPasswordHash() {
  return bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS);
}

export {
  hashAdminPassword,
  verifyAdminPassword,
  getDefaultAdminPasswordHash,
  DEFAULT_ADMIN_PASSWORD
};