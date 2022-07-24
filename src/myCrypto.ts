import { AES, enc } from "crypto-js";
import * as fs from "fs";

export class MyCrypto {
    private SECRET_KEY: string;
    private space: string;

    constructor(path: string) {
        this.SECRET_KEY = this.getSecretKey(path);
        this.space = this.encrypt('');
    }

    public encrypt(s: string) {
        const ciphertext = AES.encrypt(s, this.SECRET_KEY)
        const encryptedText = ciphertext.toString();
        return encryptedText;
    }

    public decrypt(s: string) {
        console.log('-----');
        console.log('s:',s);
        console.log('space:', this.space);
        if (s === this.space) {
            return 'Empty!';
        }
        const key = this.SECRET_KEY;
        if (key.length === 0) {
            return "No key available!";
        }
        try {
            const bytes = AES.decrypt(s, key);
            const originalText = bytes.toString(enc.Utf8);
            if ( originalText.length === 0 ) {
                return "Wrong key!";
            }
            console.log('Original Text: ', '<'+originalText+'>');
            return originalText;
        } catch (e) {
            return "Error: Not possible to decode!"
        }
    }

    public updateSecretPath(path: string) {
        this.SECRET_KEY = this.getSecretKey(path);
    }

    private getSecretKey(path: string) {
        try {
            const f = fs.readFileSync(path, "utf8");
            const secret = JSON.parse(f);
            return secret.key;
        } catch (e) {
            return "";
        }
    }
}
