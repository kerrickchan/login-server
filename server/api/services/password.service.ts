import crypto from 'crypto'
import logger from '../../common/logger'

const algorithm = 'aes-256-cbc'
const iv = crypto.randomBytes(16)

export async function encrypt(password) {
  let cipher = crypto.createCipheriv(algorithm, process.env.CRYPTO_KEY, iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  logger.debug('iv', iv.toString('hex'))
  return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
}

export async function decrypt(password) {
  let iv = Buffer.from(password.iv, 'hex');
  let encryptedPassword = Buffer.from(password.data, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, process.env.CRYPTO_KEY, iv);
  let decrypted = decipher.update(encryptedPassword);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export async function hash(password) {
  const hash = crypto.createHash('sha256')
  hash.update(password, 'utf8')
  
  return hash.digest('hex')
}