import bcrypt from 'bcrypt';
import logger from './logger.js';

const SALT_ROUNDS = 12;

export async function hashAdminPassword(password) {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    logger.error(`Admin password hashing failed: ${error.message}`);
    throw new Error('Failed to hash admin password');
  }
}

export async function verifyAdminPassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error(`Admin password verification failed: ${error.message}`);
    throw new Error('Failed to verify admin password');
  }
}