const otpStorage = new Map();

// Add periodic cleanup for expired OTPs
setInterval(() => {
  const now = Date.now();
  for (const [identifier, data] of otpStorage.entries()) {
    if (data.expiresAt < now) {
      otpStorage.delete(identifier);
    }
  }
}, 60 * 1000); // Run cleanup every minute

export function get(identifier) {
  const data = otpStorage.get(identifier);
  if (data && data.expiresAt < Date.now()) {
    otpStorage.delete(identifier);
    return null;
  }
  return data;
}

export function set(identifier, data) {
  otpStorage.set(identifier, data);
}

export function deleteOTP(identifier) {
  otpStorage.delete(identifier);
}

export default otpStorage;