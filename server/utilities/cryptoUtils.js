import crypto from 'crypto';

// --- AES-256 DATA ENCRYPTION (For Medical Records) ---
const ENCRYPTION_KEY = process.env.AES_SECRET_KEY; // Must be 32 bytes (256 bits)
const IV_LENGTH = 16; 

export const encryptText = (text) => {
    if (!text) return "";
    if (!ENCRYPTION_KEY) {
        console.warn("⚠️ AES_SECRET_KEY is missing in .env! Storing data as plain text for now.");
        return text;
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decryptText = (text) => {
    if (!text) return "";
    if (!ENCRYPTION_KEY || !text.includes(':')) {
        return text;
    }
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
