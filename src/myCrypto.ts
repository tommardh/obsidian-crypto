import { AES, enc } from "crypto-js";
import * as fs from "fs";

export class MyCrypto {
    private SECRET_KEY: string;

    constructor(path: string) {
        this.SECRET_KEY = this.getSecretKey(path);
    }

    public encrypt(s: string) {
        const ciphertext = AES.encrypt(s, this.SECRET_KEY).toString();
        return ciphertext;
    }

    public decrypt(s: string) {
        const bytes  = AES.decrypt(s, this.SECRET_KEY);
        try {
            const originalText = bytes.toString(enc.Utf8);
            return originalText;
        } catch (e) {
            return "Not possible to decode!"
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
