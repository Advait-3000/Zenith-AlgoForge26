import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = process.env.AES_SECRET_KEY; // Must be 32 characters
const IV_LENGTH = 16; // For AES, this is always 16

export const encryptText = (text) => {
    if (!text) return "";
    // Fail-safe for missing encryption key during development
    if (!ENCRYPTION_KEY) {
        console.warn("⚠️ [SECURITY] AES_SECRET_KEY missing. Returning plain text.");
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
