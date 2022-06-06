import { AES, enc } from "crypto-js";

const SECRET_KEY = 'secret key 123'

export function encrypt(s: string) {
    const ciphertext = AES.encrypt(s, SECRET_KEY).toString();
    return ciphertext;
}

export function decrypt(s: string) {
    const bytes  = AES.decrypt(s, SECRET_KEY);
    const originalText = bytes.toString(enc.Utf8);
    return originalText;
}
