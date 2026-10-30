import crypto from 'crypto';

// Fixed Initialization Vector (IV) standard in CCAvenue Node.js Integration Kit
const iv = Buffer.from('\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f', 'binary');

/**
 * Derives the 128-bit key from the 32-character Working Key by hashing it with MD5
 */
const getEncryptionKey = (workingKey: string): Buffer => {
  return crypto.createHash('md5').update(workingKey).digest();
};

/**
 * Encrypts standard query strings (parameter key-values) using AES-128-CBC
 */
export const encrypt = (plainText: string, workingKey: string): string => {
  const key = getEncryptionKey(workingKey);
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * Decrypts the response payload returned by CCAvenue callback POST requests
 */
export const decrypt = (encryptedText: string, workingKey: string): string => {
  const key = getEncryptionKey(workingKey);
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
