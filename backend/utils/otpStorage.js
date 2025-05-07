// In production, replace with Redis implementation
const otpStorage = new Map();

export function getOTP(identifier) {
  return otpStorage.get(identifier);
}

export function setOTP(identifier, data) {
  otpStorage.set(identifier, data);
}

export function deleteOTP(identifier) {
  otpStorage.delete(identifier);
}

export default otpStorage;